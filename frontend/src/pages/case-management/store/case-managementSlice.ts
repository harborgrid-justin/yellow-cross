/**
 * WF-SLI-001 | case-managementSlice.ts - CaseManagement Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface CaseManagementItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CaseManagementState {
  items: CaseManagementItem[];
  selectedItem: CaseManagementItem | null;
  filters: {
    searchTerm?: string;
    status?: string;
  };
  loading: { 
    items: boolean; 
    operations: boolean; 
    details: boolean;
  };
  error: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CaseManagementState = {
  items: [],
  selectedItem: null,
  filters: {},
  loading: { 
    items: false, 
    operations: false, 
    details: false 
  },
  error: null,
  notifications: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

// Mock API functions (replace with actual API calls)
const mockCaseManagementApi = {
  getItems: async (_params?: any): Promise<{ data: CaseManagementItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'CaseManagement User 1',
          description: 'System case-managementistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'CaseManagement User 2',
          description: 'Department case-management',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<CaseManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `CaseManagement User ${id}`,
      description: 'Sample case-management user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<CaseManagementItem>): Promise<CaseManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New CaseManagement',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<CaseManagementItem>): Promise<CaseManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated CaseManagement',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  deleteItem: async (_id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In real implementation, would use _id to delete item
  }
};

// Async Thunks
export const fetchCaseManagementItems = createAsyncThunk(
  'case-management/fetchItems', 
  async (params?: any) => mockCaseManagementApi.getItems(params)
);

export const fetchCaseManagementItem = createAsyncThunk(
  'case-management/fetchItem', 
  async (id: string) => mockCaseManagementApi.getItem(id)
);

export const createCaseManagementItem = createAsyncThunk(
  'case-management/createItem', 
  async (data: Partial<CaseManagementItem>) => mockCaseManagementApi.createItem(data)
);

export const updateCaseManagementItem = createAsyncThunk(
  'case-management/updateItem', 
  async ({ id, data }: { id: string; data: Partial<CaseManagementItem> }) => mockCaseManagementApi.updateItem(id, data)
);

export const deleteCaseManagementItem = createAsyncThunk(
  'case-management/deleteItem', 
  async (id: string) => {
    await mockCaseManagementApi.deleteItem(id);
    return id;
  }
);

const caseManagementSlice = createSlice({
  name: 'caseManagement',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<CaseManagementItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CaseManagementState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<CaseManagementState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `case-management_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<CaseManagementState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchCaseManagementItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchCaseManagementItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchCaseManagementItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch case-management items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchCaseManagementItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchCaseManagementItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchCaseManagementItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch case-management item';
      });

    // Create Item
    builder
      .addCase(createCaseManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createCaseManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `case-management_create_${Date.now()}`,
          type: 'success',
          message: 'CaseManagement item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createCaseManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create case-management item';
      });

    // Update Item
    builder
      .addCase(updateCaseManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateCaseManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        if (state.selectedItem?.id === updatedItem.id) {
          state.selectedItem = updatedItem;
        }
        state.notifications.push({
          id: `case-management_update_${Date.now()}`,
          type: 'success',
          message: 'CaseManagement item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateCaseManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update case-management item';
      });

    // Delete Item
    builder
      .addCase(deleteCaseManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteCaseManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `case-management_delete_${Date.now()}`,
          type: 'success',
          message: 'CaseManagement item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteCaseManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete case-management item';
      });
  }
});

// Export actions
export const {
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState
} = caseManagementSlice.actions;

// Selectors
export const selectCaseManagementItems = (state: RootState) => state.caseManagementPage?.items || [];
export const selectCaseManagementItem = (state: RootState) => state.caseManagementPage?.selectedItem;
export const selectCaseManagementLoading = (state: RootState) => state.caseManagementPage?.loading;
export const selectCaseManagementError = (state: RootState) => state.caseManagementPage?.error;
export const selectCaseManagementFilters = (state: RootState) => state.caseManagementPage?.filters || {};
export const selectCaseManagementNotifications = (state: RootState) => state.caseManagementPage?.notifications || [];
export const selectCaseManagementPagination = (state: RootState) => state.caseManagementPage?.pagination;

export default caseManagementSlice.reducer;
