/**
 * WF-SLI-001 | securitySlice.ts - Security Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface SecurityItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface SecurityState {
  items: SecurityItem[];
  selectedItem: SecurityItem | null;
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

const initialState: SecurityState = {
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
const mockSecurityApi = {
  getItems: async (_params?: any): Promise<{ data: SecurityItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'Security User 1',
          description: 'System securityistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Security User 2',
          description: 'Department security',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<SecurityItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `Security User ${id}`,
      description: 'Sample security user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<SecurityItem>): Promise<SecurityItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New Security',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<SecurityItem>): Promise<SecurityItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated Security',
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
export const fetchSecurityItems = createAsyncThunk(
  'security/fetchItems', 
  async (params?: any) => mockSecurityApi.getItems(params)
);

export const fetchSecurityItem = createAsyncThunk(
  'security/fetchItem', 
  async (id: string) => mockSecurityApi.getItem(id)
);

export const createSecurityItem = createAsyncThunk(
  'security/createItem', 
  async (data: Partial<SecurityItem>) => mockSecurityApi.createItem(data)
);

export const updateSecurityItem = createAsyncThunk(
  'security/updateItem', 
  async ({ id, data }: { id: string; data: Partial<SecurityItem> }) => mockSecurityApi.updateItem(id, data)
);

export const deleteSecurityItem = createAsyncThunk(
  'security/deleteItem', 
  async (id: string) => {
    await mockSecurityApi.deleteItem(id);
    return id;
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<SecurityItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SecurityState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<SecurityState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `security_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<SecurityState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchSecurityItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchSecurityItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchSecurityItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch security items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchSecurityItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchSecurityItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchSecurityItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch security item';
      });

    // Create Item
    builder
      .addCase(createSecurityItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createSecurityItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `security_create_${Date.now()}`,
          type: 'success',
          message: 'Security item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createSecurityItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create security item';
      });

    // Update Item
    builder
      .addCase(updateSecurityItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateSecurityItem.fulfilled, (state, action) => {
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
          id: `security_update_${Date.now()}`,
          type: 'success',
          message: 'Security item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateSecurityItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update security item';
      });

    // Delete Item
    builder
      .addCase(deleteSecurityItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteSecurityItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `security_delete_${Date.now()}`,
          type: 'success',
          message: 'Security item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteSecurityItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete security item';
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
} = securitySlice.actions;

// Selectors
export const selectSecurityItems = (state: RootState) => state.security?.items || [];
export const selectSecurityItem = (state: RootState) => state.security?.selectedItem;
export const selectSecurityLoading = (state: RootState) => state.security?.loading;
export const selectSecurityError = (state: RootState) => state.security?.error;
export const selectSecurityFilters = (state: RootState) => state.security?.filters || {};
export const selectSecurityNotifications = (state: RootState) => state.security?.notifications || [];
export const selectSecurityPagination = (state: RootState) => state.security?.pagination;

export default securitySlice.reducer;
