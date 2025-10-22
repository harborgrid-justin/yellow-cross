/**
 * WF-SLI-001 | adminSlice.ts - Admin Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface AdminItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface AdminState {
  items: AdminItem[];
  selectedItem: AdminItem | null;
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

const initialState: AdminState = {
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
const mockAdminApi = {
  getItems: async (_params?: any): Promise<{ data: AdminItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'Admin User 1',
          description: 'System administrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Admin User 2',
          description: 'Department admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (_id: string): Promise<AdminItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: _id,
      name: `Admin User ${id}`,
      description: 'Sample admin user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<AdminItem>): Promise<AdminItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New Admin',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<AdminItem>): Promise<AdminItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated Admin',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  deleteItem: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};

// Async Thunks
export const fetchAdminItems = createAsyncThunk(
  'admin/fetchItems', 
  async (params?: any) => mockAdminApi.getItems(params)
);

export const fetchAdminItem = createAsyncThunk(
  'admin/fetchItem', 
  async (id: string) => mockAdminApi.getItem(id)
);

export const createAdminItem = createAsyncThunk(
  'admin/createItem', 
  async (data: Partial<AdminItem>) => mockAdminApi.createItem(data)
);

export const updateAdminItem = createAsyncThunk(
  'admin/updateItem', 
  async ({ id, data }: { id: string; data: Partial<AdminItem> }) => mockAdminApi.updateItem(id, data)
);

export const deleteAdminItem = createAsyncThunk(
  'admin/deleteItem', 
  async (id: string) => {
    await mockAdminApi.deleteItem(id);
    return id;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<AdminItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AdminState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<AdminState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `admin_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<AdminState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchAdminItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchAdminItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchAdminItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch admin items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchAdminItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchAdminItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchAdminItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch admin item';
      });

    // Create Item
    builder
      .addCase(createAdminItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createAdminItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `admin_create_${Date.now()}`,
          type: 'success',
          message: 'Admin item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createAdminItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create admin item';
      });

    // Update Item
    builder
      .addCase(updateAdminItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateAdminItem.fulfilled, (state, action) => {
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
          id: `admin_update_${Date.now()}`,
          type: 'success',
          message: 'Admin item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateAdminItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update admin item';
      });

    // Delete Item
    builder
      .addCase(deleteAdminItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteAdminItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `admin_delete_${Date.now()}`,
          type: 'success',
          message: 'Admin item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteAdminItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete admin item';
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
} = adminSlice.actions;

// Selectors
export const selectAdminItems = (state: RootState) => state.admin?.items || [];
export const selectAdminItem = (state: RootState) => state.admin?.selectedItem;
export const selectAdminLoading = (state: RootState) => state.admin?.loading;
export const selectAdminError = (state: RootState) => state.admin?.error;
export const selectAdminFilters = (state: RootState) => state.admin?.filters || {};
export const selectAdminNotifications = (state: RootState) => state.admin?.notifications || [];
export const selectAdminPagination = (state: RootState) => state.admin?.pagination;

export default adminSlice.reducer;
