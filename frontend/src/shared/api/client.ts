/**
 * API Client
 * 
 * Centralized API client following Google best practices:
 * - Single source of truth for API configuration
 * - Consistent error handling
 * - Type-safe requests
 * - Request/response interceptors
 * - Automatic authentication token injection
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Token storage keys - must match AuthContext
const ACCESS_TOKEN_KEY = 'yellow_cross_access_token';
const REFRESH_TOKEN_KEY = 'yellow_cross_refresh_token';
const USER_KEY = 'yellow_cross_user';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get the auth token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Clear auth data on unauthorized
 */
function clearAuthData(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Trigger auth error event for AuthContext to handle
 */
function triggerAuthError(): void {
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
}

/**
 * request - Core HTTP request function with authentication and error handling
 * 
 * Internal function that handles all HTTP requests to the API. Automatically
 * injects authentication tokens, manages headers, handles errors, and triggers
 * auth-related events for the application.
 * 
 * This function is not exported directly; use the api object methods instead.
 * 
 * @async
 * @function
 * @template T - Expected response data type
 * @param {string} endpoint - API endpoint path (e.g., '/cases', '/users/123')
 * @param {RequestInit} [options={}] - Fetch API options (headers, method, body, etc.)
 * 
 * @returns {Promise<T>} Parsed JSON response data
 * 
 * @throws {ApiError} When API returns non-2xx status code
 * @throws {ApiError} When network request fails
 * 
 * @example
 * // Internal usage by api methods
 * const data = await request<User>('/users/123', { method: 'GET' });
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token and add to headers if available
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle 401 - notify AuthContext to handle logout and navigation
      if (response.status === 401) {
        clearAuthData();
        triggerAuthError();
      }
      
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

/**
 * api - Main API client object with HTTP methods
 * 
 * Provides type-safe HTTP methods for communicating with the backend API.
 * All methods automatically handle authentication, JSON serialization,
 * error handling, and response parsing.
 * 
 * Features:
 * - Automatic authentication token injection
 * - JSON request/response handling
 * - Centralized error handling
 * - Type-safe with TypeScript generics
 * - Consistent interface across all endpoints
 * 
 * @constant
 * @type {Object}
 * 
 * @example
 * // GET request
 * const users = await api.get<User[]>('/users');
 * 
 * @example
 * // POST request with data
 * const newCase = await api.post<Case>('/cases', {
 *   title: 'New Case',
 *   clientId: '123'
 * });
 * 
 * @example
 * // PUT request to update
 * const updated = await api.put<User>('/users/123', {
 *   name: 'Updated Name'
 * });
 * 
 * @example
 * // PATCH request for partial update
 * await api.patch<Case>('/cases/456', {
 *   status: 'closed'
 * });
 * 
 * @example
 * // DELETE request
 * await api.delete('/documents/789');
 */
export const api = {
  /**
   * get - Performs a GET request
   * 
   * Fetches data from the specified endpoint. Used for retrieving resources.
   * 
   * @async
   * @function
   * @template T - Expected response data type
   * @param {string} endpoint - API endpoint path
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Response data
   * @throws {ApiError} On request failure
   */
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * post - Performs a POST request
   * 
   * Creates a new resource at the specified endpoint. Automatically
   * serializes the data object to JSON.
   * 
   * @async
   * @function
   * @template T - Expected response data type
   * @param {string} endpoint - API endpoint path
   * @param {unknown} [data] - Request body data
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Response data
   * @throws {ApiError} On request failure
   */
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * put - Performs a PUT request
   * 
   * Replaces a resource at the specified endpoint. Typically used for
   * full updates. Automatically serializes the data object to JSON.
   * 
   * @async
   * @function
   * @template T - Expected response data type
   * @param {string} endpoint - API endpoint path
   * @param {unknown} [data] - Request body data
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Response data
   * @throws {ApiError} On request failure
   */
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * patch - Performs a PATCH request
   * 
   * Partially updates a resource at the specified endpoint. Only the
   * provided fields are updated. Automatically serializes data to JSON.
   * 
   * @async
   * @function
   * @template T - Expected response data type
   * @param {string} endpoint - API endpoint path
   * @param {unknown} [data] - Request body data (partial update)
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Response data
   * @throws {ApiError} On request failure
   */
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * delete - Performs a DELETE request
   * 
   * Deletes a resource at the specified endpoint.
   * 
   * @async
   * @function
   * @template T - Expected response data type
   * @param {string} endpoint - API endpoint path
   * @param {RequestInit} [options] - Additional fetch options
   * @returns {Promise<T>} Response data
   * @throws {ApiError} On request failure
   */
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
