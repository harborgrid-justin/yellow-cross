/**
 * WF-COMP-XXX | apiConfig.ts - API configuration and Axios setup
 * Purpose: Central API configuration with authentication and interceptors
 * Dependencies: axios, API constants, security modules
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../../config/constants';
import {
  API_ENDPOINTS,
  HTTP_STATUS,
  CONTENT_TYPES,
} from '../../constants/api';
import { secureTokenManager } from '../security/SecureTokenManager';
import { setupCsrfProtection } from '../security/CsrfProtection';
import { apiMetrics } from '../monitoring/ApiMetrics';

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    _retry?: boolean;
  }
}

// ==========================================
// API INSTANCE CREATION
// ==========================================

export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': CONTENT_TYPES.JSON,
    'Accept': CONTENT_TYPES.JSON,
  },
  withCredentials: true,
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

apiInstance.interceptors.request.use(
  (config) => {
    // Start performance tracking
    config.metadata = { startTime: performance.now() };
    
    // Add authentication token
    const token = secureTokenManager.getToken();
    if (token && secureTokenManager.isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      // Token expired, clear it
      console.warn('[apiConfig] Token expired, clearing tokens');
      secureTokenManager.clearTokens();
    }
    
    // Add CSRF protection if enabled
    const csrfToken = secureTokenManager.getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Add request ID for tracing
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return config;
  },
  (error: AxiosError) => {
    apiMetrics.recordError(error);
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Record performance metrics
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = performance.now() - startTime;
      apiMetrics.recordRequest(response.config.url || '', response.status, duration);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Record error metrics
    apiMetrics.recordError(error);
    
    // Handle token refresh for 401 errors
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = secureTokenManager.getRefreshToken();
        if (refreshToken && secureTokenManager.isRefreshTokenValid()) {
          const response = await axios.post(`${API_CONFIG.baseUrl}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken, expiresIn } = response.data;
          
          // Update tokens
          secureTokenManager.setTokens(token, newRefreshToken, expiresIn);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        secureTokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('[apiConfig] Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ==========================================
// SETUP SECURITY FEATURES
// ==========================================

// Initialize CSRF protection
setupCsrfProtection(apiInstance);

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export const tokenUtils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return secureTokenManager.hasValidToken();
  },
  
  /**
   * Get current user token
   */
  getToken(): string | null {
    return secureTokenManager.getToken();
  },
  
  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    secureTokenManager.clearTokens();
  },
  
  /**
   * Set authentication tokens
   */
  setTokens(token: string, refreshToken: string, expiresIn: number): void {
    secureTokenManager.setTokens(token, refreshToken, expiresIn);
  }
};

// ==========================================
// EXPORTS
// ==========================================

export { API_CONFIG, API_ENDPOINTS };
export default apiInstance;
