/**
 * Redux Store Configuration
 * Configures the Redux store with Redux Toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import caseManagementReducer from './slices/caseManagementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    caseManagement: caseManagementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/restoreSession'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
