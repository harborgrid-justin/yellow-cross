/**
 * WF-IDX-XXX | core/index.ts - Core service exports
 * Purpose: Export core service infrastructure
 * Last Updated: 2025-10-22 | File Type: .ts
 */

export { ApiClient } from './ApiClient';
export type { ApiResponse, PaginatedResponse } from './ApiClient';

export { BaseApiService } from './BaseApiService';
export type {
  BaseEntity,
  PaginationParams,
  FilterParams,
  CrudOperations,
} from './BaseApiService';
