/**
 * WF-COMP-XXX | mergersAcquisitionsApi.ts - Mergers Acquisitions API service module
 * Purpose: Mergers Acquisitions domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../../shared/types | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Mergers Acquisitions components and stores
 * Related: MandA types, mergersAcquisitions Redux slice
 * Exports: mergersAcquisitionsApi instance, types | Key Features: CRUD operations, validation, error handling
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

export interface MandA {
  id: string;
  title: string;
  description?: string;
  status: MandAStatus;
  priority: MandAPriority;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export type MandAStatus = 'Open' | 'In Progress' | 'Closed' | 'On Hold' | 'Pending Review' | 'Archived';
export type MandAPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CreateMandAData {
  title: string;
  description?: string;
  status: MandAStatus;
  priority: MandAPriority;
  assignedTo?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateMandAData extends Partial<CreateMandAData> {}

export interface MandAFilters {
  status?: string;
  priority?: string;
  search?: string;
  assignedTo?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface MandAStatistics {
  total: number;
  byStatus: Record<MandAStatus, number>;
  byPriority: Record<MandAPriority, number>;
}

export interface MergersAcquisitionsApi {
  // Basic CRUD operations
  getAll(filters?: MandAFilters): Promise<PaginatedResponse<MandA>>;
  getById(id: string): Promise<MandA>;
  create(data: CreateMandAData): Promise<MandA>;
  update(id: string, data: UpdateMandAData): Promise<MandA>;
  delete(id: string): Promise<void>;
  
  // Advanced operations
  getStatistics(filters?: MandAFilters): Promise<MandAStatistics>;
  search(query: string, filters?: MandAFilters): Promise<MandA[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;

/**
 * Create MandA validation schema
 */
const createMandASchema = z.object({
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
 * Update MandA validation schema (partial of create)
 */
const updateMandASchema = createMandASchema.partial();

/**
 * Filter validation schema
 */
const mergersAcquisitionsFiltersSchema = z.object({
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

class MergersAcquisitionsApiImpl implements MergersAcquisitionsApi {
  private readonly baseEndpoint = '/api/mergers-acquisitions';
  private readonly auditResource = 'MANDA' as const;

  /**
   * Get all MandA items with filtering and pagination
   */
  async getAll(filters?: MandAFilters): Promise<PaginatedResponse<MandA>> {
    try {
      // Validate filters
      const validatedFilters = filters ? mergersAcquisitionsFiltersSchema.parse(filters) : {};
      
      // Build query parameters
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Make request with retry logic
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      // Extract and validate response
      const data = extractApiData<PaginatedResponse<MandA>>(response);
      
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
   * Get a specific MandA by ID
   */
  async getById(id: string): Promise<MandA> {
    try {
      // Validate ID format
      if (!id || !ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      const response = await withRetry(() => apiInstance.get(`${this.baseEndpoint}/${id}`), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<MandA>(response);
      
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
   * Create a new MandA
   */
  async create(data: CreateMandAData): Promise<MandA> {
    try {
      // Validate input data
      const validatedData = createMandASchema.parse(data);
      
      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const created = extractApiData<MandA>(response);
      
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
   * Update an existing MandA
   */
  async update(id: string, data: UpdateMandAData): Promise<MandA> {
    try {
      // Validate ID format
      if (!id || !ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }

      // Validate update data
      const validatedData = updateMandASchema.parse(data);
      
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updated = extractApiData<MandA>(response);
      
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
   * Delete a MandA
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
   * Get statistics for MandA items
   */
  async getStatistics(filters?: MandAFilters): Promise<MandAStatistics> {
    try {
      const validatedFilters = filters ? mergersAcquisitionsFiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<MandAStatistics>(response);
      
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
   * Search MandA items
   */
  async search(query: string, filters?: MandAFilters): Promise<MandA[]> {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error('Search query is required');
      }

      const validatedFilters = filters ? mergersAcquisitionsFiltersSchema.parse(filters) : {};
      const params = buildUrlParams({ ...validatedFilters, q: query });
      const url = `${this.baseEndpoint}/search${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      const data = extractApiData<MandA[]>(response);
      
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
 * Singleton instance of the Mergers Acquisitions API
 * @example
 * import { mergersAcquisitionsApi } from '@/services';
 * 
 * // Get all items
 * const items = await mergersAcquisitionsApi.getAll({ status: 'Open' });
 * 
 * // Create new item
 * const newItem = await mergersAcquisitionsApi.create({
 *   title: 'New Item',
 *   status: 'Open',
 *   priority: 'High'
 * });
 */
export const mergersAcquisitionsApi: MergersAcquisitionsApi = new MergersAcquisitionsApiImpl();
