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

// Authentication API
export { authApi } from './modules/authApi';
export type {
  AuthApi,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  AuthResponse,
  User,
} from './modules/authApi';

// Domain-specific API exports
export { caseManagementApi } from './modules/caseManagementApi';
export type {
  CaseManagementApi,
  CreateCaseData,
  UpdateCaseData,
  PaginatedCaseResponse,
  CaseStatistics,
} from './modules/caseManagementApi';

export { clientCrmApi } from './modules/clientCrmApi';
export type {
  ClientCrmApi,
  Client,
  CreateClientData,
  UpdateClientData,
  ClientCommunication,
} from './modules/clientCrmApi';

export { documentManagementApi } from './modules/documentManagementApi';
export type {
  DocumentManagementApi,
  Document,
  CreateDocumentData,
  UpdateDocumentData,
  DocumentVersion,
} from './modules/documentManagementApi';

export { calendarSchedulingApi } from './modules/calendarSchedulingApi';
export type {
  CalendarSchedulingApi,
  CalendarEvent,
  CreateEventData,
  UpdateEventData,
} from './modules/calendarSchedulingApi';

export { timeBillingApi } from './modules/timeBillingApi';
export type {
  TimeBillingApi,
  TimeEntry,
  CreateTimeEntryData,
  Invoice,
  CreateInvoiceData,
} from './modules/timeBillingApi';

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
