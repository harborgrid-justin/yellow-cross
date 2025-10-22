/**
 * WF-SLI-001 | litigation-managementSlice.ts - LitigationManagement Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface LitigationManagementItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface LitigationManagementState {
  items: LitigationManagementItem[];
  selectedItem: LitigationManagementItem | null;
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

const initialState: LitigationManagementState = {
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
const mockLitigationManagementApi = {
  getItems: async (_params?: any): Promise<{ data: LitigationManagementItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'LitigationManagement User 1',
          description: 'System litigation-managementistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'LitigationManagement User 2',
          description: 'Department litigation-management',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<LitigationManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `LitigationManagement User ${id}`,
      description: 'Sample litigation-management user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<LitigationManagementItem>): Promise<LitigationManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New LitigationManagement',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<LitigationManagementItem>): Promise<LitigationManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated LitigationManagement',
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
export const fetchLitigationManagementItems = createAsyncThunk(
  'litigation-management/fetchItems', 
  async (params?: any) => mockLitigationManagementApi.getItems(params)
);

export const fetchLitigationManagementItem = createAsyncThunk(
  'litigation-management/fetchItem', 
  async (id: string) => mockLitigationManagementApi.getItem(id)
);

export const createLitigationManagementItem = createAsyncThunk(
  'litigation-management/createItem', 
  async (data: Partial<LitigationManagementItem>) => mockLitigationManagementApi.createItem(data)
);

export const updateLitigationManagementItem = createAsyncThunk(
  'litigation-management/updateItem', 
  async ({ id, data }: { id: string; data: Partial<LitigationManagementItem> }) => mockLitigationManagementApi.updateItem(id, data)
);

export const deleteLitigationManagementItem = createAsyncThunk(
  'litigation-management/deleteItem', 
  async (id: string) => {
    await mockLitigationManagementApi.deleteItem(id);
    return id;
  }
);

const litigationManagementSlice = createSlice({
  name: 'litigationManagement',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<LitigationManagementItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LitigationManagementState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<LitigationManagementState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `litigation-management_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<LitigationManagementState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchLitigationManagementItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchLitigationManagementItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchLitigationManagementItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch litigation-management items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchLitigationManagementItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchLitigationManagementItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchLitigationManagementItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch litigation-management item';
      });

    // Create Item
    builder
      .addCase(createLitigationManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createLitigationManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `litigation-management_create_${Date.now()}`,
          type: 'success',
          message: 'LitigationManagement item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createLitigationManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create litigation-management item';
      });

    // Update Item
    builder
      .addCase(updateLitigationManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateLitigationManagementItem.fulfilled, (state, action) => {
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
          id: `litigation-management_update_${Date.now()}`,
          type: 'success',
          message: 'LitigationManagement item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateLitigationManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update litigation-management item';
      });

    // Delete Item
    builder
      .addCase(deleteLitigationManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteLitigationManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `litigation-management_delete_${Date.now()}`,
          type: 'success',
          message: 'LitigationManagement item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteLitigationManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete litigation-management item';
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
} = litigationManagementSlice.actions;

// Selectors
export const selectLitigationManagementItems = (state: RootState) => state.litigationManagement?.items || [];
export const selectLitigationManagementItem = (state: RootState) => state.litigationManagement?.selectedItem;
export const selectLitigationManagementLoading = (state: RootState) => state.litigationManagement?.loading;
export const selectLitigationManagementError = (state: RootState) => state.litigationManagement?.error;
export const selectLitigationManagementFilters = (state: RootState) => state.litigationManagement?.filters || {};
export const selectLitigationManagementNotifications = (state: RootState) => state.litigationManagement?.notifications || [];
export const selectLitigationManagementPagination = (state: RootState) => state.litigationManagement?.pagination;

export default litigationManagementSlice.reducer;
