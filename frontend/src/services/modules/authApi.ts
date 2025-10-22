/**
 * WF-COMP-XXX | authApi.ts - Authentication API service module
 * Purpose: Authentication and authorization API operations
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Auth components and stores
 * Related: User types, auth Redux slice
 * Exports: authApi instance, types | Key Features: Login, register, logout, token management
 * Last Updated: 2025-10-22 | File Type: .ts
 * Critical Path: Login request → API call → Backend → Token storage → Redirect
 * LLM Context: Authentication API service with token management and user operations
 */

import { apiInstance } from '../config/apiConfig';
import {
  handleApiError,
  extractApiData,
} from '../utils/apiUtils';
import { z } from 'zod';
import { secureTokenManager } from '../security/SecureTokenManager';
import { auditService, AuditAction, AuditStatus } from '../audit';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RequestPasswordResetData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  roles: string[];
  permissions?: string[];
  status: string;
  isVerified: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthApi {
  // Authentication operations
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
  
  // Password operations
  changePassword(data: ChangePasswordData): Promise<void>;
  requestPasswordReset(data: RequestPasswordResetData): Promise<void>;
  resetPassword(data: ResetPasswordData): Promise<void>;
  
  // User profile operations
  getProfile(): Promise<User>;
  updateProfile(data: Partial<User>): Promise<User>;
  
  // Session operations
  validateSession(): Promise<boolean>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(data => data.username || data.email, {
  message: 'Either username or email is required',
});

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, 
      'Password must contain uppercase, lowercase, number, and special character'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, 
      'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string().min(1),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, 
      'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string().min(1),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class AuthApiImpl implements AuthApi {
  private readonly baseEndpoint = '/api/auth';

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validate credentials
      const validatedData = loginSchema.parse(credentials);
      
      const response = await apiInstance.post(`${this.baseEndpoint}/login`, validatedData);
      const data = extractApiData<{ user: User; accessToken: string; refreshToken: string }>(response);
      
      // Store tokens
      const expiresIn = 3600; // 1 hour default
      secureTokenManager.setTokens(data.accessToken, data.refreshToken, expiresIn);
      
      // Audit successful login
      await auditService.logAction({
        action: AuditAction.LOGIN,
        resourceType: 'USER',
        resourceId: data.user.userId,
        status: AuditStatus.SUCCESS,
        details: { username: data.user.username }
      });
      
      return {
        ...data,
        expiresIn
      };
    } catch (error) {
      // Audit failed login
      await auditService.logAction({
        action: AuditAction.LOGIN,
        resourceType: 'USER',
        resourceId: 'unknown',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Validate data
      const validatedData = registerSchema.parse(data);
      
      const response = await apiInstance.post(`${this.baseEndpoint}/register`, validatedData);
      const responseData = extractApiData<{ user: User; accessToken: string; refreshToken: string }>(response);
      
      // Store tokens
      const expiresIn = 3600; // 1 hour default
      secureTokenManager.setTokens(responseData.accessToken, responseData.refreshToken, expiresIn);
      
      // Audit successful registration
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: 'USER',
        resourceId: responseData.user.userId,
        status: AuditStatus.SUCCESS,
        details: { username: responseData.user.username }
      });
      
      return {
        ...responseData,
        expiresIn
      };
    } catch (error) {
      // Audit failed registration
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: 'USER',
        resourceId: 'new',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiInstance.post(`${this.baseEndpoint}/logout`);
      
      // Clear tokens
      secureTokenManager.clearTokens();
      
      // Audit successful logout
      await auditService.logAction({
        action: AuditAction.LOGOUT,
        resourceType: 'USER',
        resourceId: 'current',
        status: AuditStatus.SUCCESS
      });
    } catch (error) {
      // Clear tokens even if request fails
      secureTokenManager.clearTokens();
      
      throw handleApiError(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiInstance.post(`${this.baseEndpoint}/refresh`, {
        refreshToken
      });
      
      const data = extractApiData<RefreshTokenResponse>(response);
      
      // Update tokens
      secureTokenManager.setTokens(data.token, data.refreshToken, data.expiresIn);
      
      return data;
    } catch (error) {
      // Clear tokens if refresh fails
      secureTokenManager.clearTokens();
      throw handleApiError(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      // Validate data
      const validatedData = changePasswordSchema.parse(data);
      
      await apiInstance.post(`${this.baseEndpoint}/change-password`, validatedData);
      
      // Audit successful password change
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: 'USER',
        resourceId: 'current',
        status: AuditStatus.SUCCESS,
        details: { action: 'password_change' }
      });
    } catch (error) {
      // Audit failed password change
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: 'USER',
        resourceId: 'current',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(data: RequestPasswordResetData): Promise<void> {
    try {
      // Validate data
      const validatedData = requestPasswordResetSchema.parse(data);
      
      await apiInstance.post(`${this.baseEndpoint}/request-password-reset`, validatedData);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      // Validate data
      const validatedData = resetPasswordSchema.parse(data);
      
      await apiInstance.post(`${this.baseEndpoint}/reset-password`, validatedData);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/profile`);
      return extractApiData<User>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiInstance.put(`${this.baseEndpoint}/profile`, data);
      const updatedUser = extractApiData<User>(response);
      
      // Audit successful profile update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: 'USER',
        resourceId: updatedUser.userId,
        status: AuditStatus.SUCCESS,
        details: { updated: Object.keys(data) }
      });
      
      return updatedUser;
    } catch (error) {
      // Audit failed profile update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: 'USER',
        resourceId: 'current',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<boolean> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/validate`);
      const data = extractApiData<{ valid: boolean }>(response);
      return data.valid;
    } catch (error) {
      return false;
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

/**
 * Singleton instance of AuthApi
 * Use this throughout the application
 */
export const authApi: AuthApi = new AuthApiImpl();
