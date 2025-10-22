/**
 * WF-COMP-XXX | civilRightsApi.ts - Civil Rights API service module
 * Purpose: Civil Rights domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../../shared/types | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Civil Rights components and stores
 * Related: CivilRightsCase types, civilRights Redux slice
 * Exports: civilRightsApi instance, types | Key Features: CRUD operations, validation, error handling
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

export interface CivilRightsCase {
  id: string;
  title: string;
  description?: string;
  status: CivilRightsCaseStatus;
  priority: CivilRightsCasePriority;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export type CivilRightsCaseStatus = 'Open' | 'In Progress' | 'Closed' | 'On Hold' | 'Pending Review' | 'Archived';
export type CivilRightsCasePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CreateCivilRightsCaseData {
  title: string;
  description?: string;
  status: CivilRightsCaseStatus;
  priority: CivilRightsCasePriority;
  assignedTo?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateCivilRightsCaseData extends Partial<CreateCivilRightsCaseData> {}

export interface CivilRightsCaseFilters {
  status?: string;
  priority?: string;
  search?: string;
  assignedTo?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface CivilRightsCaseStatistics {
  total: number;
  byStatus: Record<CivilRightsCaseStatus, number>;
  byPriority: Record<CivilRightsCasePriority, number>;
}

export interface CivilRightsApi {
  // Basic CRUD operations
  getAll(filters?: CivilRightsCaseFilters): Promise<PaginatedResponse<CivilRightsCase>>;
  getById(id: string): Promise<CivilRightsCase>;
  create(data: CreateCivilRightsCaseData): Promise<CivilRightsCase>;
  update(id: string, data: UpdateCivilRightsCaseData): Promise<CivilRightsCase>;
  delete(id: string): Promise<void>;
  
  // Advanced operations
  getStatistics(filters?: CivilRightsCaseFilters): Promise<CivilRightsCaseStatistics>;
  search(query: string, filters?: CivilRightsCaseFilters): Promise<CivilRightsCase[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;

/**
 * Create CivilRightsCase validation schema
 */
const createCivilRightsCaseSchema = z.object({
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
 * Update CivilRightsCase validation schema (partial of create)
 */
const updateCivilRightsCaseSchema = createCivilRightsCaseSchema.partial();

/**
 * Filter validation schema
 */
const civilRightsFiltersSchema = z.object({
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

class CivilRightsApiImpl implements CivilRightsApi {
  private readonly baseEndpoint = '/api/civil-rights';
  private readonly auditResource = 'CIVILRIGHTSCASE' as const;

  /**
   * Get all CivilRightsCase items with filtering and pagination
   */
  async getAll(filters?: CivilRightsCaseFilters): Promise<PaginatedResponse<CivilRightsCase>> {
    try {
      // Validate filters
      const validatedFilters = filters ? civilRightsFiltersSchema.parse(filters) : {};
      
      // Build query parameters
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Make request with retry logic
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      // Extract and validate response
      const data = extractApiData<PaginatedResponse<CivilRightsCase>>(response);
      
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
   * Get a specific CivilRightsCase by ID
   */
  async getById(id: string): Promise<CivilRightsCase> {
    try {
      // Validate ID format
      if (!id || !ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await withRetry(() => apiInstance.get(`${this.baseEndpoint}/${id}`), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<CivilRightsCase>(response);
      
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
   * Create a new CivilRightsCase
   */
  async create(data: CreateCivilRightsCaseData): Promise<CivilRightsCase> {
    try {
      // Validate input data
      const validatedData = createCivilRightsCaseSchema.parse(data);
      
      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const created = extractApiData<CivilRightsCase>(response);
      
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
   * Update an existing CivilRightsCase
   */
  async update(id: string, data: UpdateCivilRightsCaseData): Promise<CivilRightsCase> {
    try {
      // Validate ID format
      if (!id || !ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      // Validate update data
      const validatedData = updateCivilRightsCaseSchema.parse(data);
      
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updated = extractApiData<CivilRightsCase>(response);
      
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
   * Delete a CivilRightsCase
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
   * Get statistics for CivilRightsCase items
   */
  async getStatistics(filters?: CivilRightsCaseFilters): Promise<CivilRightsCaseStatistics> {
    try {
      const validatedFilters = filters ? civilRightsFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<CivilRightsCaseStatistics>(response);
      
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
   * Search CivilRightsCase items
   */
  async search(query: string, filters?: CivilRightsCaseFilters): Promise<CivilRightsCase[]> {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error('Search query is required');
      }

      const validatedFilters = filters ? civilRightsFiltersSchema.parse(filters) : {};
      const params = buildUrlParams({ ...validatedFilters, q: query });
      const url = `${this.baseEndpoint}/search${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<CivilRightsCase[]>(response);
      
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
 * Singleton instance of the Civil Rights API
 * @example
 * import { civilRightsApi } from '@/services';
 * 
 * // Get all items
 * const items = await civilRightsApi.getAll({ status: 'Open' });
 * 
 * // Create new item
 * const newItem = await civilRightsApi.create({
 *   title: 'New Item',
 *   status: 'Open',
 *   priority: 'High'
 * });
 */
export const civilRightsApi: CivilRightsApi = new CivilRightsApiImpl();
