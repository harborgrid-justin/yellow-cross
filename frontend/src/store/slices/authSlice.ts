/**
 * Auth Slice
 * Manages authentication state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  error: null,
};

// Token storage keys
const ACCESS_TOKEN_KEY = 'yellow_cross_access_token';
const REFRESH_TOKEN_KEY = 'yellow_cross_refresh_token';
const USER_KEY = 'yellow_cross_user';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string | null }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
      state.error = null;

      // Store in localStorage
      localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },

    // Refresh token
    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem(ACCESS_TOKEN_KEY, action.payload);
    },

    // Update user data
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      }
    },

    // Restore session from localStorage
    restoreSession: (state) => {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedAccessToken && storedUser) {
        state.accessToken = storedAccessToken;
        state.refreshToken = storedRefreshToken;
        state.user = JSON.parse(storedUser);
      }
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  logout,
  refreshTokenSuccess,
  updateUser,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;
