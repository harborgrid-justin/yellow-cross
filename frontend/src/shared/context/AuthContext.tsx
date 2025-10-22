import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loginSuccess,
  logout as logoutAction,
  refreshTokenSuccess,
  updateUser as updateUserAction,
  restoreSession,
  setError as setAuthError,
} from '../../store/slices/authSlice';

interface User {
  id: string;
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  firmName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, accessToken, refreshToken, isLoading } = useAppSelector((state) => state.auth);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Listen for unauthorized events from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear state - this will trigger PrivateRoute to redirect to login
      dispatch(logoutAction());
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!accessToken) return;

    // JWT tokens typically expire in 1 hour, refresh at 55 minutes
    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 55 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens and user data via Redux
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = data;
      
      dispatch(loginSuccess({
        user: userData,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }));
    } catch (error) {
      console.error('Login error:', error);
      dispatch(setAuthError(error instanceof Error ? error.message : 'Login failed'));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Parse name into first and last name
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.email.split('@')[0], // Use email prefix as username
          email: data.email,
          password: data.password,
          firstName,
          lastName,
          firmName: data.firmName
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      // After successful registration, automatically log in
      await login(data.email, data.password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Call logout endpoint
    if (accessToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }).catch(err => console.error('Logout API error:', err));
    }

    // Clear state via Redux (also clears localStorage)
    dispatch(logoutAction());
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const { accessToken: newAccessToken } = data;

      dispatch(refreshTokenSuccess(newAccessToken));
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      dispatch(updateUserAction(userData));
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    register,
    logout,
    refreshAccessToken,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
