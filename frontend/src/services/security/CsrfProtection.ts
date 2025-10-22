/**
 * WF-COMP-XXX | CsrfProtection.ts - CSRF protection setup
 * Purpose: Configure CSRF protection for API requests
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AxiosInstance } from 'axios';
import { secureTokenManager } from './SecureTokenManager';

/**
 * Setup CSRF protection for Axios instance
 */
export function setupCsrfProtection(axiosInstance: AxiosInstance): void {
  // Intercept responses to capture CSRF token from headers
  axiosInstance.interceptors.response.use(
    (response) => {
      const csrfToken = response.headers['x-csrf-token'];
      if (csrfToken) {
        secureTokenManager.setCsrfToken(csrfToken);
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
