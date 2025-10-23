/**
 * WF-COMP-XXX | apiUtils.ts - API utility functions
 * Purpose: Common utility functions for API operations
 * Dependencies: axios, moment
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AxiosResponse, AxiosError } from 'axios';
import moment from 'moment';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface RetryConfig {
  maxRetries?: number;
  backoffMs?: number;
}

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * handleApiError - Standardizes API error handling across the application
 * 
 * Converts various error types (Axios errors, generic errors, unknown errors)
 * into a consistent ApiError format for uniform error handling throughout
 * the application.
 * 
 * @function
 * @param {unknown} error - The error object to handle (can be any type)
 * 
 * @returns {never} This function always throws, never returns
 * 
 * @throws {ApiError} Standardized error with message, code, status, and validation errors
 * 
 * @example
 * // In an API call
 * try {
 *   const data = await apiClient.get('/users');
 * } catch (error) {
 *   handleApiError(error); // Throws standardized ApiError
 * }
 * 
 * @example
 * // Error handling with specific status
 * try {
 *   await fetchData();
 * } catch (error) {
 *   handleApiError(error);
 * } catch (apiError: ApiError) {
 *   if (apiError.status === 404) {
 *     showNotFound();
 *   }
 * }
 * 
 * @see {@link ApiError} for error structure
 */
export function handleApiError(error: unknown): never {
  if (error instanceof Error && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    
    const apiError: ApiError = {
      message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
      code: axiosError.code,
      status: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    };
    
    throw apiError;
  }
  
  if (error instanceof Error) {
    throw {
      message: error.message,
    } as ApiError;
  }
  
  throw {
    message: 'An unknown error occurred',
  } as ApiError;
}

// ==========================================
// DATA EXTRACTION
// ==========================================

/**
 * extractApiData - Extracts the data payload from an API response
 * 
 * Handles different API response formats and extracts the actual data
 * payload, throwing an error if no data is present. Works with both
 * wrapped responses (with 'data' property) and direct data responses.
 * 
 * @function
 * @template T - The expected type of the extracted data
 * @param {AxiosResponse<ApiResponse<T>>} response - Axios response object
 * 
 * @returns {T} The extracted data payload
 * 
 * @throws {Error} When response contains no data
 * 
 * @example
 * // Extract from wrapped response
 * const response = await axios.get('/api/users');
 * const users = extractApiData<User[]>(response);
 * // users is now User[]
 * 
 * @example
 * // Use in async function
 * async function fetchUser(id: string): Promise<User> {
 *   const response = await axios.get(`/api/users/${id}`);
 *   return extractApiData<User>(response);
 * }
 * 
 * @see {@link extractApiDataOptional} for nullable version
 */
export function extractApiData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  if (!response.data) {
    throw new Error('No data in response');
  }
  
  // Handle direct data responses
  if ('data' in response.data) {
    return response.data.data;
  }
  
  // Handle responses where the entire response.data is the payload
  return response.data as unknown as T;
}

/**
 * extractApiDataOptional - Safely extracts data from API response
 * 
 * Similar to extractApiData but returns null instead of throwing when
 * data is missing. Useful for optional API calls or when missing data
 * is an acceptable state.
 * 
 * @function
 * @template T - The expected type of the extracted data
 * @param {AxiosResponse<ApiResponse<T>>} response - Axios response object
 * 
 * @returns {T|null} The extracted data payload or null if not present
 * 
 * @example
 * // Handle optional data
 * const response = await axios.get('/api/user/preferences');
 * const preferences = extractApiDataOptional<Preferences>(response);
 * 
 * if (preferences) {
 *   applyPreferences(preferences);
 * } else {
 *   useDefaultPreferences();
 * }
 * 
 * @see {@link extractApiData} for throwing version
 */
export function extractApiDataOptional<T>(
  response: AxiosResponse<ApiResponse<T>>
): T | null {
  try {
    return extractApiData(response);
  } catch {
    return null;
  }
}

// ==========================================
// URL BUILDING
// ==========================================

/**
 * buildUrlParams - Constructs URL search parameters from an object
 * 
 * Converts a key-value object into URLSearchParams, handling arrays,
 * null/undefined values, and empty strings. Skips null, undefined,
 * and empty string values automatically.
 * 
 * @function
 * @param {Record<string, unknown>} params - Object with query parameters
 * 
 * @returns {URLSearchParams} URLSearchParams object ready for URL construction
 * 
 * @example
 * // Build query string
 * const params = buildUrlParams({
 *   search: 'case',
 *   status: 'open',
 *   page: 1
 * });
 * // Result: search=case&status=open&page=1
 * 
 * @example
 * // With array values
 * const params = buildUrlParams({
 *   tags: ['urgent', 'pending'],
 *   limit: 20
 * });
 * // Result: tags=urgent&tags=pending&limit=20
 * 
 * @example
 * // Null values are skipped
 * const params = buildUrlParams({
 *   name: 'John',
 *   email: null,
 *   age: undefined
 * });
 * // Result: name=John
 * 
 * @see {@link buildPaginationParams} for pagination-specific params
 */
export function buildUrlParams(params: Record<string, unknown>): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams;
}

/**
 * buildPaginationParams - Creates standardized pagination parameters
 * 
 * Constructs a consistent pagination parameter object for API requests,
 * including page number, limit, sort field, and sort order.
 * 
 * @function
 * @param {number} [page=1] - Page number (1-indexed)
 * @param {number} [limit=10] - Items per page
 * @param {string} [sort] - Field name to sort by
 * @param {('asc'|'desc')} [order='desc'] - Sort direction
 * 
 * @returns {Record<string, unknown>} Parameters object for API request
 * 
 * @example
 * // Basic pagination
 * const params = buildPaginationParams(2, 25);
 * // { page: 2, limit: 25, order: 'desc' }
 * 
 * @example
 * // With sorting
 * const params = buildPaginationParams(1, 50, 'createdAt', 'asc');
 * // { page: 1, limit: 50, sort: 'createdAt', order: 'asc' }
 * 
 * @example
 * // Use with API call
 * const params = buildPaginationParams(page, 20, 'name', 'asc');
 * const response = await api.get('/users', { params });
 * 
 * @see {@link buildUrlParams} for converting to URL params
 */
export function buildPaginationParams(
  page: number = 1,
  limit: number = 10,
  sort?: string,
  order: 'asc' | 'desc' = 'desc'
): Record<string, unknown> {
  return {
    page,
    limit,
    ...(sort && { sort }),
    order,
  };
}

// ==========================================
// DATE FORMATTING
// ==========================================

/**
 * formatDateForApi - Converts date to ISO 8601 format for API requests
 * 
 * Standardizes date formatting for API communication using ISO 8601
 * format, which is universally accepted and timezone-aware.
 * 
 * @function
 * @param {Date|string} date - Date object or date string to format
 * 
 * @returns {string} ISO 8601 formatted date string
 * 
 * @example
 * // Format Date object
 * const formatted = formatDateForApi(new Date());
 * // "2025-10-23T03:25:04.274Z"
 * 
 * @example
 * // Format date string
 * const formatted = formatDateForApi('2025-10-23');
 * // "2025-10-23T00:00:00.000Z"
 * 
 * @example
 * // Use in API request
 * const params = {
 *   startDate: formatDateForApi(startDate),
 *   endDate: formatDateForApi(endDate)
 * };
 * await api.get('/reports', { params });
 */
export function formatDateForApi(date: Date | string): string {
  return moment(date).toISOString();
}

/**
 * Parse date from API response
 */
export function parseDateFromApi(dateString: string): Date {
  return moment(dateString).toDate();
}

// ==========================================
// RETRY LOGIC
// ==========================================

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries = 3, backoffMs = 1000 } = config;
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = backoffMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// ==========================================
// FORM DATA
// ==========================================

/**
 * Create FormData from an object
 */
export function createFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (item instanceof File) {
            formData.append(key, item);
          } else {
            formData.append(key, String(item));
          }
        });
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
}

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Check if response is an API response
 */
export function isApiResponse<T>(data: unknown): data is ApiResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    typeof (data as ApiResponse<T>).success === 'boolean'
  );
}

/**
 * Check if response is paginated
 */
export function isPaginatedResponse<T>(data: unknown): data is PaginatedResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    'pagination' in data &&
    Array.isArray((data as PaginatedResponse<T>).data)
  );
}

// ==========================================
// CACHING
// ==========================================

class SimpleCache {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes default

  set(key: string, data: unknown, ttl: number = this.ttl): void {
    this.cache.set(key, { data, timestamp: Date.now() + ttl });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new SimpleCache();

/**
 * Wrap a function with caching
 */
export function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = apiCache.get<T>(key);
  if (cached) {
    return Promise.resolve(cached);
  }
  
  return fn().then(result => {
    apiCache.set(key, result, ttl);
    return result;
  });
}

// ==========================================
// DEBOUNCE
// ==========================================

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
