/**
 * WF-COMP-XXX | clientCrmApi.ts - Client CRM API service module
 * Purpose: Client relationship management API operations
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Client CRM components
 * Exports: clientCrmApi instance, types | Key Features: Client CRUD, communication tracking
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { apiInstance } from '../config/apiConfig';
import {
  buildUrlParams,
  handleApiError,
  extractApiData,
  withRetry,
  PaginatedResponse,
} from '../utils/apiUtils';
import { z } from 'zod';
import { auditService, AuditAction, AuditStatus } from '../audit';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface Client {
  id: string;
  clientNumber: string;
  type: 'Individual' | 'Business';
  fullName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  status: 'Active' | 'Inactive' | 'Prospective' | 'Former';
  industry?: string;
  referralSource?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface CreateClientData {
  type: 'Individual' | 'Business';
  fullName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  industry?: string;
  referralSource?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export interface ClientFilters {
  status?: string;
  type?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface ClientCommunication {
  id: string;
  clientId: string;
  type: 'Email' | 'Phone' | 'Meeting' | 'Letter' | 'Other';
  subject: string;
  content?: string;
  date: string;
  direction: 'Inbound' | 'Outbound';
  createdBy: string;
}

export interface CreateCommunicationData {
  clientId: string;
  type: 'Email' | 'Phone' | 'Meeting' | 'Letter' | 'Other';
  subject: string;
  content?: string;
  date: string;
  direction: 'Inbound' | 'Outbound';
}

export interface ClientCrmApi {
  // Client operations
  getAll(filters?: ClientFilters): Promise<PaginatedResponse<Client>>;
  getById(id: string): Promise<Client>;
  create(data: CreateClientData): Promise<Client>;
  update(id: string, data: UpdateClientData): Promise<Client>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Client[]>;
  
  // Communication operations
  getCommunications(clientId: string): Promise<ClientCommunication[]>;
  addCommunication(data: CreateCommunicationData): Promise<ClientCommunication>;
  
  // Conflict checking
  checkConflicts(clientData: { name: string; relatedParties?: string[] }): Promise<{ hasConflict: boolean; conflicts: unknown[] }>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const createClientSchema = z.object({
  type: z.enum(['Individual', 'Business']),
  fullName: z.string().min(1).max(100).optional(),
  companyName: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  industry: z.string().max(100).optional(),
  referralSource: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.unknown()).optional(),
}).refine(data => data.type === 'Individual' ? data.fullName : data.companyName, {
  message: 'Either fullName (for Individual) or companyName (for Business) is required',
});

const updateClientSchema = createClientSchema.partial();

const createCommunicationSchema = z.object({
  clientId: z.string().min(1),
  type: z.enum(['Email', 'Phone', 'Meeting', 'Letter', 'Other']),
  subject: z.string().min(1).max(200),
  content: z.string().max(5000).optional(),
  date: z.string().datetime(),
  direction: z.enum(['Inbound', 'Outbound']),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class ClientCrmApiImpl implements ClientCrmApi {
  private readonly baseEndpoint = '/api/clients';
  private readonly auditResource = 'CLIENT';

  async getAll(filters?: ClientFilters): Promise<PaginatedResponse<Client>> {
    try {
      const params = buildUrlParams((filters || {}) as Record<string, unknown>);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<PaginatedResponse<Client>>(response);
      
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.SUCCESS,
        details: { filters, count: data.data?.length || 0 }
      });
      
      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  async getById(id: string): Promise<Client> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<Client>(response);
      
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
      
      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  async create(data: CreateClientData): Promise<Client> {
    try {
      const validatedData = createClientSchema.parse(data);
      
      const response = await apiInstance.post(`${this.baseEndpoint}/create`, validatedData);
      const createdClient = extractApiData<Client>(response);
      
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdClient.clientNumber,
        status: AuditStatus.SUCCESS,
        details: { created: validatedData }
      });
      
      return createdClient;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: 'new',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  async update(id: string, data: UpdateClientData): Promise<Client> {
    try {
      const validatedData = updateClientSchema.parse(data);
      
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedClient = extractApiData<Client>(response);
      
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData }
      });
      
      return updatedClient;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiInstance.delete(`${this.baseEndpoint}/${id}`);
      
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  async search(query: string): Promise<Client[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/search?q=${encodeURIComponent(query)}`);
      return extractApiData<Client[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCommunications(clientId: string): Promise<ClientCommunication[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/${clientId}/communications`);
      return extractApiData<ClientCommunication[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async addCommunication(data: CreateCommunicationData): Promise<ClientCommunication> {
    try {
      const validatedData = createCommunicationSchema.parse(data);
      
      const response = await apiInstance.post(
        `${this.baseEndpoint}/${data.clientId}/communications`,
        validatedData
      );
      
      return extractApiData<ClientCommunication>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async checkConflicts(clientData: { name: string; relatedParties?: string[] }): Promise<{ hasConflict: boolean; conflicts: unknown[] }> {
    try {
      const response = await apiInstance.post(`${this.baseEndpoint}/conflict-check`, clientData);
      return extractApiData<{ hasConflict: boolean; conflicts: unknown[] }>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const clientCrmApi: ClientCrmApi = new ClientCrmApiImpl();
