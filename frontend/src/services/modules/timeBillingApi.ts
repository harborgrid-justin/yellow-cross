/**
 * WF-COMP-XXX | timeBillingApi.ts - Time & Billing API service module
 * Purpose: Time tracking and billing API operations
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Exports: timeBillingApi instance, types | Key Features: Time entries, invoicing, billing rates
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { apiInstance } from '../config/apiConfig';
import {
  buildUrlParams,
  handleApiError,
  extractApiData,
  PaginatedResponse,
} from '../utils/apiUtils';
import { z } from 'zod';
import { auditService, AuditAction, AuditStatus } from '../audit';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface TimeEntry {
  id: string;
  entryNumber: string;
  caseId?: string;
  clientId?: string;
  attorney: string;
  date: string;
  hours: number;
  minutes: number;
  totalHours: number;
  description: string;
  billableRate: number;
  billableAmount: number;
  isBillable: boolean;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Billed';
  invoiceId?: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateTimeEntryData {
  caseId?: string;
  clientId?: string;
  attorney: string;
  date: string;
  hours: number;
  minutes: number;
  description: string;
  billableRate: number;
  isBillable: boolean;
}

export interface UpdateTimeEntryData extends Partial<CreateTimeEntryData> {
  status?: 'Draft' | 'Submitted' | 'Approved' | 'Billed';
}

export interface TimeEntryFilters {
  caseId?: string;
  clientId?: string;
  attorney?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  isBillable?: boolean;
  page?: number;
  limit?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  caseId?: string;
  invoiceDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  timeEntries: string[];
  expenses: string[];
  notes?: string;
}

export interface CreateInvoiceData {
  clientId: string;
  caseId?: string;
  dueDate: string;
  timeEntryIds: string[];
  expenseIds?: string[];
  notes?: string;
}

export interface BillingRate {
  id: string;
  attorney: string;
  rateType: 'Hourly' | 'Flat' | 'Contingency';
  hourlyRate?: number;
  flatAmount?: number;
  contingencyPercentage?: number;
  effectiveDate: string;
  isActive: boolean;
}

export interface TimeBillingApi {
  // Time entry operations
  getAllTimeEntries(filters?: TimeEntryFilters): Promise<PaginatedResponse<TimeEntry>>;
  getTimeEntryById(id: string): Promise<TimeEntry>;
  createTimeEntry(data: CreateTimeEntryData): Promise<TimeEntry>;
  updateTimeEntry(id: string, data: UpdateTimeEntryData): Promise<TimeEntry>;
  deleteTimeEntry(id: string): Promise<void>;
  submitTimeEntries(ids: string[]): Promise<void>;
  
  // Invoice operations
  getAllInvoices(filters?: { clientId?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Invoice>>;
  getInvoiceById(id: string): Promise<Invoice>;
  createInvoice(data: CreateInvoiceData): Promise<Invoice>;
  sendInvoice(id: string): Promise<void>;
  recordPayment(id: string, amount: number, paymentDate: string): Promise<Invoice>;
  downloadInvoice(id: string): Promise<Blob>;
  
  // Billing rates
  getBillingRates(attorney?: string): Promise<BillingRate[]>;
  setBillingRate(data: Omit<BillingRate, 'id'>): Promise<BillingRate>;
  
  // Reports
  getTimeReport(filters: { startDate: string; endDate: string; attorney?: string; clientId?: string }): Promise<{ totalHours: number; billableHours: number; revenue: number; entries: TimeEntry[] }>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const createTimeEntrySchema = z.object({
  caseId: z.string().optional(),
  clientId: z.string().optional(),
  attorney: z.string().min(1),
  date: z.string(),
  hours: z.number().int().min(0).max(23),
  minutes: z.number().int().min(0).max(59),
  description: z.string().min(1).max(500),
  billableRate: z.number().min(0),
  isBillable: z.boolean(),
}).refine(data => data.caseId || data.clientId, {
  message: 'Either caseId or clientId must be provided',
});

const updateTimeEntrySchema = createTimeEntrySchema.partial().extend({
  status: z.enum(['Draft', 'Submitted', 'Approved', 'Billed']).optional(),
});

const createInvoiceSchema = z.object({
  clientId: z.string().min(1),
  caseId: z.string().optional(),
  dueDate: z.string(),
  timeEntryIds: z.array(z.string()).min(1),
  expenseIds: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class TimeBillingApiImpl implements TimeBillingApi {
  private readonly timeEndpoint = '/api/time-billing/time-entries';
  private readonly invoiceEndpoint = '/api/time-billing/invoices';
  private readonly ratesEndpoint = '/api/time-billing/rates';
  private readonly auditResource = 'TIME_BILLING';

  async getAllTimeEntries(filters?: TimeEntryFilters): Promise<PaginatedResponse<TimeEntry>> {
    try {
      const params = buildUrlParams((filters || {}) as Record<string, unknown>);
      const url = `${this.timeEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiInstance.get(url);
      return extractApiData<PaginatedResponse<TimeEntry>>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTimeEntryById(id: string): Promise<TimeEntry> {
    try {
      const response = await apiInstance.get(`${this.timeEndpoint}/${id}`);
      return extractApiData<TimeEntry>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createTimeEntry(data: CreateTimeEntryData): Promise<TimeEntry> {
    try {
      const validatedData = createTimeEntrySchema.parse(data);
      
      const response = await apiInstance.post(`${this.timeEndpoint}/create`, validatedData);
      const createdEntry = extractApiData<TimeEntry>(response);
      
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdEntry.entryNumber,
        status: AuditStatus.SUCCESS,
        details: { hours: createdEntry.totalHours, amount: createdEntry.billableAmount }
      });
      
      return createdEntry;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateTimeEntry(id: string, data: UpdateTimeEntryData): Promise<TimeEntry> {
    try {
      const validatedData = updateTimeEntrySchema.parse(data);
      
      const response = await apiInstance.put(`${this.timeEndpoint}/${id}`, validatedData);
      const updatedEntry = extractApiData<TimeEntry>(response);
      
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData }
      });
      
      return updatedEntry;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteTimeEntry(id: string): Promise<void> {
    try {
      await apiInstance.delete(`${this.timeEndpoint}/${id}`);
      
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async submitTimeEntries(ids: string[]): Promise<void> {
    try {
      await apiInstance.post(`${this.timeEndpoint}/submit`, { ids });
      
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: `bulk-${ids.length}`,
        status: AuditStatus.SUCCESS,
        details: { action: 'submit', count: ids.length }
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAllInvoices(filters?: { clientId?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Invoice>> {
    try {
      const params = buildUrlParams(filters || {});
      const url = `${this.invoiceEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiInstance.get(url);
      return extractApiData<PaginatedResponse<Invoice>>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    try {
      const response = await apiInstance.get(`${this.invoiceEndpoint}/${id}`);
      return extractApiData<Invoice>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    try {
      const validatedData = createInvoiceSchema.parse(data);
      
      const response = await apiInstance.post(`${this.invoiceEndpoint}/create`, validatedData);
      const createdInvoice = extractApiData<Invoice>(response);
      
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: 'INVOICE',
        resourceId: createdInvoice.invoiceNumber,
        status: AuditStatus.SUCCESS,
        details: { amount: createdInvoice.totalAmount }
      });
      
      return createdInvoice;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async sendInvoice(id: string): Promise<void> {
    try {
      await apiInstance.post(`${this.invoiceEndpoint}/${id}/send`);
      
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: 'INVOICE',
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { action: 'send' }
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async recordPayment(id: string, amount: number, paymentDate: string): Promise<Invoice> {
    try {
      const response = await apiInstance.post(`${this.invoiceEndpoint}/${id}/payment`, {
        amount,
        paymentDate,
      });
      
      const updatedInvoice = extractApiData<Invoice>(response);
      
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: 'INVOICE',
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { action: 'payment', amount }
      });
      
      return updatedInvoice;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async downloadInvoice(id: string): Promise<Blob> {
    try {
      const response = await apiInstance.get(`${this.invoiceEndpoint}/${id}/download`, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getBillingRates(attorney?: string): Promise<BillingRate[]> {
    try {
      const url = attorney 
        ? `${this.ratesEndpoint}?attorney=${encodeURIComponent(attorney)}` 
        : this.ratesEndpoint;
      
      const response = await apiInstance.get(url);
      return extractApiData<BillingRate[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async setBillingRate(data: Omit<BillingRate, 'id'>): Promise<BillingRate> {
    try {
      const response = await apiInstance.post(this.ratesEndpoint, data);
      return extractApiData<BillingRate>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTimeReport(
    filters: { startDate: string; endDate: string; attorney?: string; clientId?: string }
  ): Promise<{ totalHours: number; billableHours: number; revenue: number; entries: TimeEntry[] }> {
    try {
      const params = buildUrlParams(filters);
      const response = await apiInstance.get(`${this.timeEndpoint}/report?${params.toString()}`);
      return extractApiData<{ totalHours: number; billableHours: number; revenue: number; entries: TimeEntry[] }>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const timeBillingApi: TimeBillingApi = new TimeBillingApiImpl();
