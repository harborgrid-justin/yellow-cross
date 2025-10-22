/**
 * WF-IDX-XXX | index.ts - Services module exports
 * Purpose: Centralized exports for all service modules
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Core infrastructure exports
export {
  apiInstance,
  tokenUtils,
  API_ENDPOINTS,
} from './config/apiConfig';

// Utility exports
export {
  handleApiError,
  extractApiData,
  extractApiDataOptional,
  buildUrlParams,
  buildPaginationParams,
  formatDateForApi,
  parseDateFromApi,
  withRetry,
  createFormData,
  isApiResponse,
  isPaginatedResponse,
  apiCache,
  withCache,
  debounce,
} from './utils/apiUtils';

// Type exports
export type { ApiError, PaginatedResponse } from './utils/apiUtils';
export * from './types';

// Core service exports
export * from './core';

// Domain-specific API exports
export { caseManagementApi } from './modules/caseManagementApi';
export type {
  CaseManagementApi,
  CreateCaseData,
  UpdateCaseData,
  PaginatedCaseResponse,
  CaseStatistics,
} from './modules/caseManagementApi';

// Security exports
export { secureTokenManager } from './security/SecureTokenManager';

// Monitoring exports
export { apiMetrics } from './monitoring/ApiMetrics';

// Audit exports
export { auditService } from './audit';
export type { AuditLogEntry } from './audit';
export { AuditAction, AuditStatus } from './audit';

// Cache exports
export { apiCache as cacheService } from './cache/ApiCache';
