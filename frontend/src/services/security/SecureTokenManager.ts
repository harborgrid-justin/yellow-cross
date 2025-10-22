/**
 * WF-COMP-XXX | SecureTokenManager.ts - Secure token management
 * Purpose: Manage authentication tokens securely
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Token storage keys - must match existing AuthContext
const ACCESS_TOKEN_KEY = 'yellow_cross_access_token';
const REFRESH_TOKEN_KEY = 'yellow_cross_refresh_token';
const TOKEN_EXPIRY_KEY = 'yellow_cross_token_expiry';
const CSRF_TOKEN_KEY = 'yellow_cross_csrf_token';

class SecureTokenManager {
  /**
   * Set authentication tokens
   */
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      
      // Calculate expiry time (current time + expiresIn seconds)
      const expiryTime = Date.now() + expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error('[SecureTokenManager] Failed to set tokens:', error);
    }
  }

  /**
   * Get access token
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to get token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Check if access token is valid (not expired)
   */
  isTokenValid(): boolean {
    try {
      const token = this.getToken();
      if (!token) return false;
      
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiryTime) return true; // Assume valid if no expiry set
      
      return Date.now() < parseInt(expiryTime, 10);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to check token validity:', error);
      return false;
    }
  }

  /**
   * Check if refresh token is valid
   * Note: This is a simple check. In production, you'd validate with the server.
   */
  isRefreshTokenValid(): boolean {
    return !!this.getRefreshToken();
  }

  /**
   * Check if user has a valid token
   */
  hasValidToken(): boolean {
    return this.isTokenValid();
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      localStorage.removeItem(CSRF_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to clear tokens:', error);
    }
  }

  /**
   * Set CSRF token
   */
  setCsrfToken(token: string): void {
    try {
      localStorage.setItem(CSRF_TOKEN_KEY, token);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to set CSRF token:', error);
    }
  }

  /**
   * Get CSRF token
   */
  getCsrfToken(): string | null {
    try {
      return localStorage.getItem(CSRF_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Failed to get CSRF token:', error);
      return null;
    }
  }
}

// Export singleton instance
export const secureTokenManager = new SecureTokenManager();
