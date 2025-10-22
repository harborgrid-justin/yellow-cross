/**
 * WF-SLI-001 | pro-bonoSlice.ts - ProBono Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ProBonoItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ProBonoState {
  items: ProBonoItem[];
  selectedItem: ProBonoItem | null;
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

const initialState: ProBonoState = {
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
const mockProBonoApi = {
  getItems: async (_params?: any): Promise<{ data: ProBonoItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'ProBono User 1',
          description: 'System pro-bonoistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'ProBono User 2',
          description: 'Department pro-bono',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ProBonoItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `ProBono User ${id}`,
      description: 'Sample pro-bono user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ProBonoItem>): Promise<ProBonoItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New ProBono',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ProBonoItem>): Promise<ProBonoItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated ProBono',
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
export const fetchProBonoItems = createAsyncThunk(
  'pro-bono/fetchItems', 
  async (params?: any) => mockProBonoApi.getItems(params)
);

export const fetchProBonoItem = createAsyncThunk(
  'pro-bono/fetchItem', 
  async (id: string) => mockProBonoApi.getItem(id)
);

export const createProBonoItem = createAsyncThunk(
  'pro-bono/createItem', 
  async (data: Partial<ProBonoItem>) => mockProBonoApi.createItem(data)
);

export const updateProBonoItem = createAsyncThunk(
  'pro-bono/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ProBonoItem> }) => mockProBonoApi.updateItem(id, data)
);

export const deleteProBonoItem = createAsyncThunk(
  'pro-bono/deleteItem', 
  async (id: string) => {
    await mockProBonoApi.deleteItem(id);
    return id;
  }
);

const proBonoSlice = createSlice({
  name: 'proBono',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ProBonoItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProBonoState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ProBonoState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `pro-bono_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ProBonoState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchProBonoItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchProBonoItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchProBonoItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch pro-bono items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchProBonoItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchProBonoItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchProBonoItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch pro-bono item';
      });

    // Create Item
    builder
      .addCase(createProBonoItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createProBonoItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `pro-bono_create_${Date.now()}`,
          type: 'success',
          message: 'ProBono item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createProBonoItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create pro-bono item';
      });

    // Update Item
    builder
      .addCase(updateProBonoItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateProBonoItem.fulfilled, (state, action) => {
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
          id: `pro-bono_update_${Date.now()}`,
          type: 'success',
          message: 'ProBono item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateProBonoItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update pro-bono item';
      });

    // Delete Item
    builder
      .addCase(deleteProBonoItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteProBonoItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `pro-bono_delete_${Date.now()}`,
          type: 'success',
          message: 'ProBono item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteProBonoItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete pro-bono item';
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
} = proBonoSlice.actions;

// Selectors
export const selectProBonoItems = (state: RootState) => state.proBono?.items || [];
export const selectProBonoItem = (state: RootState) => state.proBono?.selectedItem;
export const selectProBonoLoading = (state: RootState) => state.proBono?.loading;
export const selectProBonoError = (state: RootState) => state.proBono?.error;
export const selectProBonoFilters = (state: RootState) => state.proBono?.filters || {};
export const selectProBonoNotifications = (state: RootState) => state.proBono?.notifications || [];
export const selectProBonoPagination = (state: RootState) => state.proBono?.pagination;

export default proBonoSlice.reducer;
