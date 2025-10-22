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
 * Handle API errors in a consistent way
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
 * Extract data from API response
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
 * Extract data from API response, returning null if not found
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
 * Build URL parameters from an object
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
 * Build pagination parameters
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
 * Format date for API (ISO 8601)
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
