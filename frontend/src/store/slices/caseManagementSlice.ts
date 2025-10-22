/**
 * Case Management Slice
 * Example slice showing how to manage feature-specific state with Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Case {
  id: string;
  title: string;
  description?: string;
  status: string;
  clientId: string;
  assignedTo?: string[];
  createdAt: string;
  updatedAt: string;
}

interface CaseManagementState {
  cases: Case[];
  selectedCaseId: string | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    assignedTo?: string;
    search?: string;
  };
}

const initialState: CaseManagementState = {
  cases: [],
  selectedCaseId: null,
  loading: false,
  error: null,
  filters: {},
};

const caseManagementSlice = createSlice({
  name: 'caseManagement',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set cases
    setCases: (state, action: PayloadAction<Case[]>) => {
      state.cases = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add a new case
    addCase: (state, action: PayloadAction<Case>) => {
      state.cases.push(action.payload);
    },

    // Update a case
    updateCase: (state, action: PayloadAction<Case>) => {
      const index = state.cases.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cases[index] = action.payload;
      }
    },

    // Delete a case
    deleteCase: (state, action: PayloadAction<string>) => {
      state.cases = state.cases.filter(c => c.id !== action.payload);
      if (state.selectedCaseId === action.payload) {
        state.selectedCaseId = null;
      }
    },

    // Select a case
    selectCase: (state, action: PayloadAction<string | null>) => {
      state.selectedCaseId = action.payload;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<Partial<CaseManagementState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
    },

    // Reset state
    resetCaseManagement: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setCases,
  addCase,
  updateCase,
  deleteCase,
  selectCase,
  setFilters,
  clearFilters,
  resetCaseManagement,
} = caseManagementSlice.actions;

export default caseManagementSlice.reducer;
