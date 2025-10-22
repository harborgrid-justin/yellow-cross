/**
 * WF-COMP-XXX | caseManagementApi.ts - Case Management API service module
 * Purpose: Case Management domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../../shared/types | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Case management components and stores
 * Related: Case types, case-management Redux slice
 * Exports: caseManagementApi instance, types | Key Features: CRUD operations, validation, error handling
 * Last Updated: 2025-10-22 | File Type: .ts
 * Critical Path: Component request → API call → Backend → Response transformation → Component update
 * LLM Context: Domain-specific API service with comprehensive type safety and validation
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
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';
import type {
  Case,
  CaseFilters,
  CaseStatus,
  CasePriority,
  MatterType,
} from '../../shared/types';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface CreateCaseData {
  caseNumber: string;
  title: string;
  clientName: string;
  matterType: MatterType;
  priority: CasePriority;
  status: CaseStatus;
  assignedTo: string;
  practiceArea: string;
  description: string;
  tags?: string[];
}

export interface UpdateCaseData extends Partial<CreateCaseData> {}

export interface PaginatedCaseResponse extends PaginatedResponse<Case> {}

export interface CaseStatistics {
  total: number;
  byStatus: Record<CaseStatus, number>;
  byPriority: Record<CasePriority, number>;
}

export interface CaseManagementApi {
  // Basic CRUD operations
  getAll(filters?: CaseFilters): Promise<PaginatedCaseResponse>;
  getById(id: string): Promise<Case>;
  create(data: CreateCaseData): Promise<Case>;
  update(id: string, data: UpdateCaseData): Promise<Case>;
  delete(id: string): Promise<void>;
  
  // Advanced operations
  getStatistics(filters?: CaseFilters): Promise<CaseStatistics>;
  search(query: string, filters?: CaseFilters): Promise<Case[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;

/**
 * Create case validation schema
 */
const createCaseSchema = z.object({
  caseNumber: z
    .string()
    .min(1, 'Case number is required')
    .max(50, 'Case number cannot exceed 50 characters')
    .trim(),
    
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
    
  clientName: z
    .string()
    .min(1, 'Client name is required')
    .max(100, 'Client name cannot exceed 100 characters')
    .trim(),
    
  matterType: z.enum(['Civil', 'Criminal', 'Corporate', 'Family', 'Immigration', 'Real Estate'], {
    message: 'Invalid matter type'
  }),
  
  priority: z.enum(['Low', 'Medium', 'High', 'Critical'], {
    message: 'Invalid priority'
  }),
  
  status: z.enum(['Open', 'In Progress', 'Closed', 'On Hold', 'Pending Review', 'Archived'], {
    message: 'Invalid status'
  }),
  
  assignedTo: z
    .string()
    .min(1, 'Assigned to is required')
    .max(100, 'Assigned to cannot exceed 100 characters')
    .trim(),
    
  practiceArea: z
    .string()
    .min(1, 'Practice area is required')
    .max(100, 'Practice area cannot exceed 100 characters')
    .trim(),
    
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim(),
    
  tags: z.array(z.string().max(50)).optional(),
}).strict();

/**
 * Update case validation schema (partial of create)
 */
const updateCaseSchema = createCaseSchema.partial();

/**
 * Filter validation schema
 */
const caseFiltersSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  matterType: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
}).strict();

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class CaseManagementApiImpl implements CaseManagementApi {
  private readonly baseEndpoint = '/api/case-management';
  private readonly auditResource: AuditResourceType = 'CASE';

  /**
   * Get all case items with filtering and pagination
   */
  async getAll(filters?: CaseFilters): Promise<PaginatedCaseResponse> {
    try {
      // Validate filters
      const validatedFilters = filters ? caseFiltersSchema.parse(filters) : {};
      
      // Build query parameters
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Make request with retry logic
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      // Extract and validate response
      const data = extractApiData<PaginatedCaseResponse>(response);
      
      // Audit the operation
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.SUCCESS,
        details: { filters: validatedFilters, count: data.data?.length || 0 }
      });
      
      return data;
    } catch (error) {
      // Audit the failure
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

  /**
   * Get a single case item by ID
   */
  async getById(id: string): Promise<Case> {
    try {
      // Validate ID format
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }
      
      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<Case>(response);
      
      // Audit successful read
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
      
      return data;
    } catch (error) {
      // Audit failed read
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

  /**
   * Create a new case item
   */
  async create(data: CreateCaseData): Promise<Case> {
    try {
      // Validate input data
      const validatedData = createCaseSchema.parse(data);
      
      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const createdItem = extractApiData<Case>(response);
      
      // Audit successful creation
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdItem.caseNumber,
        status: AuditStatus.SUCCESS,
        details: { created: validatedData }
      });
      
      return createdItem;
    } catch (error) {
      // Audit failed creation
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: 'new',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { attempted: data }
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Update an existing case item
   */
  async update(id: string, data: UpdateCaseData): Promise<Case> {
    try {
      // Validate ID and input data
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }
      
      const validatedData = updateCaseSchema.parse(data);
      
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedItem = extractApiData<Case>(response);
      
      // Audit successful update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData }
      });
      
      return updatedItem;
    } catch (error) {
      // Audit failed update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { attempted: data }
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Delete a case item
   */
  async delete(id: string): Promise<void> {
    try {
      // Validate ID format
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }
      
      await apiInstance.delete(`${this.baseEndpoint}/${id}`);
      
      // Audit successful deletion
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
    } catch (error) {
      // Audit failed deletion
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

  /**
   * Get statistics for case items
   */
  async getStatistics(filters?: CaseFilters): Promise<CaseStatistics> {
    try {
      const validatedFilters = filters ? caseFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiInstance.get(url);
      return extractApiData<CaseStatistics>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Search case items
   */
  async search(query: string, filters?: CaseFilters): Promise<Case[]> {
    try {
      const validatedFilters = filters ? caseFiltersSchema.parse(filters) : {};
      const searchParams = { ...validatedFilters, q: query };
      const params = buildUrlParams(searchParams);
      
      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<Case[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

/**
 * Singleton instance of CaseManagementApi
 * Use this throughout the application
 */
export const caseManagementApi: CaseManagementApi = new CaseManagementApiImpl();
