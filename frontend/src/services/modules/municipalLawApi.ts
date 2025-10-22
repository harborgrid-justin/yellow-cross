/**
 * WF-COMP-XXX | municipalLawApi.ts - Municipal Law API service module
 * Purpose: Municipal Law domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../../shared/types | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Municipal Law components and stores
 * Related: MunicipalCase types, municipalLaw Redux slice
 * Exports: municipalLawApi instance, types | Key Features: CRUD operations, validation, error handling
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
import { auditService, AuditAction, AuditStatus } from '../audit';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface MunicipalCase {
  id: string;
  title: string;
  description?: string;
  status: MunicipalCaseStatus;
  priority: MunicipalCasePriority;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export type MunicipalCaseStatus = 'Open' | 'In Progress' | 'Closed' | 'On Hold' | 'Pending Review' | 'Archived';
export type MunicipalCasePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CreateMunicipalCaseData {
  title: string;
  description?: string;
  status: MunicipalCaseStatus;
  priority: MunicipalCasePriority;
  assignedTo?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateMunicipalCaseData extends Partial<CreateMunicipalCaseData> {}

export interface MunicipalCaseFilters {
  status?: string;
  priority?: string;
  search?: string;
  assignedTo?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface MunicipalCaseStatistics {
  total: number;
  byStatus: Record<MunicipalCaseStatus, number>;
  byPriority: Record<MunicipalCasePriority, number>;
}

export interface MunicipalLawApi {
  // Basic CRUD operations
  getAll(filters?: MunicipalCaseFilters): Promise<PaginatedResponse<MunicipalCase>>;
  getById(id: string): Promise<MunicipalCase>;
  create(data: CreateMunicipalCaseData): Promise<MunicipalCase>;
  update(id: string, data: UpdateMunicipalCaseData): Promise<MunicipalCase>;
  delete(id: string): Promise<void>;
  
  // Advanced operations
  getStatistics(filters?: MunicipalCaseFilters): Promise<MunicipalCaseStatistics>;
  search(query: string, filters?: MunicipalCaseFilters): Promise<MunicipalCase[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;

/**
 * Create MunicipalCase validation schema
 */
const createMunicipalCaseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
    
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .trim()
    .optional(),
    
  status: z.enum(['Open', 'In Progress', 'Closed', 'On Hold', 'Pending Review', 'Archived'], {
    message: 'Invalid status'
  }),
  
  priority: z.enum(['Low', 'Medium', 'High', 'Critical'], {
    message: 'Invalid priority'
  }),
  
  assignedTo: z
    .string()
    .max(100, 'Assigned to cannot exceed 100 characters')
    .trim()
    .optional(),
    
  tags: z.array(z.string().max(50)).optional(),
  
  metadata: z.record(z.string(), z.unknown()).optional(),
}).strict();

/**
 * Update MunicipalCase validation schema (partial of create)
 */
const updateMunicipalCaseSchema = createMunicipalCaseSchema.partial();

/**
 * Filter validation schema
 */
const municipalLawFiltersSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  search: z.string().max(100).optional(),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
}).strict();

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class MunicipalLawApiImpl implements MunicipalLawApi {
  private readonly baseEndpoint = '/api/municipal-law';
  private readonly auditResource = 'MUNICIPALCASE' as const;

  /**
   * Get all MunicipalCase items with filtering and pagination
   */
  async getAll(filters?: MunicipalCaseFilters): Promise<PaginatedResponse<MunicipalCase>> {
    try {
      // Validate filters
      const validatedFilters = filters ? municipalLawFiltersSchema.parse(filters) : {};
      
      // Build query parameters
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Make request with retry logic
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      // Extract and validate response
      const data = extractApiData<PaginatedResponse<MunicipalCase>>(response);
      
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
   * Get a specific MunicipalCase by ID
   */
  async getById(id: string): Promise<MunicipalCase> {
    try {
      // Validate ID format
      if (!id || !ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await withRetry(() => apiInstance.get(`${this.baseEndpoint}/${id}`), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<MunicipalCase>(response);
      
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

  /**
   * Create a new MunicipalCase
   */
  async create(data: CreateMunicipalCaseData): Promise<MunicipalCase> {
    try {
      // Validate input data
      const validatedData = createMunicipalCaseSchema.parse(data);
      
      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const created = extractApiData<MunicipalCase>(response);
      
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: created.id,
        status: AuditStatus.SUCCESS,
        details: { title: validatedData.title }
      });
      
      return created;
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

  /**
   * Update an existing MunicipalCase
   */
  async update(id: string, data: UpdateMunicipalCaseData): Promise<MunicipalCase> {
    try {
      // Validate ID format
      if (!id || !ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      // Validate update data
      const validatedData = updateMunicipalCaseSchema.parse(data);
      
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updated = extractApiData<MunicipalCase>(response);
      
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updates: Object.keys(validatedData) }
      });
      
      return updated;
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

  /**
   * Delete a MunicipalCase
   */
  async delete(id: string): Promise<void> {
    try {
      // Validate ID format
      if (!id || !ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

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

  /**
   * Get statistics for MunicipalCase items
   */
  async getStatistics(filters?: MunicipalCaseFilters): Promise<MunicipalCaseStatistics> {
    try {
      const validatedFilters = filters ? municipalLawFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<MunicipalCaseStatistics>(response);
      
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'statistics',
        status: AuditStatus.SUCCESS
      });
      
      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'statistics',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Search MunicipalCase items
   */
  async search(query: string, filters?: MunicipalCaseFilters): Promise<MunicipalCase[]> {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error('Search query is required');
      }

      const validatedFilters = filters ? municipalLawFiltersSchema.parse(filters) : {};
      const params = buildUrlParams({ ...validatedFilters, q: query });
      const url = `${this.baseEndpoint}/search${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<MunicipalCase[]>(response);
      
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'search',
        status: AuditStatus.SUCCESS,
        details: { query, count: data.length }
      });
      
      return data;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'search',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON INSTANCE EXPORT
// ==========================================

/**
 * Singleton instance of the Municipal Law API
 * @example
 * import { municipalLawApi } from '@/services';
 * 
 * // Get all items
 * const items = await municipalLawApi.getAll({ status: 'Open' });
 * 
 * // Create new item
 * const newItem = await municipalLawApi.create({
 *   title: 'New Item',
 *   status: 'Open',
 *   priority: 'High'
 * });
 */
export const municipalLawApi: MunicipalLawApi = new MunicipalLawApiImpl();
