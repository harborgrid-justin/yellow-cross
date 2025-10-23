/**
 * Standardized API Response Utilities
 * Provides consistent response format across all API endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp?: string;
    requestId?: string;
  };
}

/**
 * Create a success response
 */
export function successResponse<T>(
  message: string,
  data?: T,
  metadata?: ApiResponse['metadata']
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  errorCode: string,
  details?: any,
  requestId?: string
): ApiResponse {
  return {
    success: false,
    message,
    error: {
      code: errorCode,
      details
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId
    }
  };
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  message: string,
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return successResponse(message, data, {
    page,
    limit,
    total
  });
}
