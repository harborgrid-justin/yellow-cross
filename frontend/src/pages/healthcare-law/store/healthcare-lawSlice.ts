/**
 * WF-SLI-001 | healthcare-lawSlice.ts - HealthcareLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface HealthcareLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface HealthcareLawState {
  items: HealthcareLawItem[];
  selectedItem: HealthcareLawItem | null;
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

const initialState: HealthcareLawState = {
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
const mockHealthcareLawApi = {
  getItems: async (_params?: any): Promise<{ data: HealthcareLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'HealthcareLaw User 1',
          description: 'System healthcare-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'HealthcareLaw User 2',
          description: 'Department healthcare-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<HealthcareLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `HealthcareLaw User ${id}`,
      description: 'Sample healthcare-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<HealthcareLawItem>): Promise<HealthcareLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New HealthcareLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<HealthcareLawItem>): Promise<HealthcareLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated HealthcareLaw',
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
export const fetchHealthcareLawItems = createAsyncThunk(
  'healthcare-law/fetchItems', 
  async (params?: any) => mockHealthcareLawApi.getItems(params)
);

export const fetchHealthcareLawItem = createAsyncThunk(
  'healthcare-law/fetchItem', 
  async (id: string) => mockHealthcareLawApi.getItem(id)
);

export const createHealthcareLawItem = createAsyncThunk(
  'healthcare-law/createItem', 
  async (data: Partial<HealthcareLawItem>) => mockHealthcareLawApi.createItem(data)
);

export const updateHealthcareLawItem = createAsyncThunk(
  'healthcare-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<HealthcareLawItem> }) => mockHealthcareLawApi.updateItem(id, data)
);

export const deleteHealthcareLawItem = createAsyncThunk(
  'healthcare-law/deleteItem', 
  async (id: string) => {
    await mockHealthcareLawApi.deleteItem(id);
    return id;
  }
);

const healthcareLawSlice = createSlice({
  name: 'healthcareLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<HealthcareLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<HealthcareLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<HealthcareLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `healthcare-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<HealthcareLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchHealthcareLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchHealthcareLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchHealthcareLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch healthcare-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchHealthcareLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchHealthcareLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchHealthcareLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch healthcare-law item';
      });

    // Create Item
    builder
      .addCase(createHealthcareLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createHealthcareLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `healthcare-law_create_${Date.now()}`,
          type: 'success',
          message: 'HealthcareLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createHealthcareLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create healthcare-law item';
      });

    // Update Item
    builder
      .addCase(updateHealthcareLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateHealthcareLawItem.fulfilled, (state, action) => {
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
          id: `healthcare-law_update_${Date.now()}`,
          type: 'success',
          message: 'HealthcareLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateHealthcareLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update healthcare-law item';
      });

    // Delete Item
    builder
      .addCase(deleteHealthcareLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteHealthcareLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `healthcare-law_delete_${Date.now()}`,
          type: 'success',
          message: 'HealthcareLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteHealthcareLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete healthcare-law item';
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
} = healthcareLawSlice.actions;

// Selectors
export const selectHealthcareLawItems = (state: RootState) => state.healthcareLaw?.items || [];
export const selectHealthcareLawItem = (state: RootState) => state.healthcareLaw?.selectedItem;
export const selectHealthcareLawLoading = (state: RootState) => state.healthcareLaw?.loading;
export const selectHealthcareLawError = (state: RootState) => state.healthcareLaw?.error;
export const selectHealthcareLawFilters = (state: RootState) => state.healthcareLaw?.filters || {};
export const selectHealthcareLawNotifications = (state: RootState) => state.healthcareLaw?.notifications || [];
export const selectHealthcareLawPagination = (state: RootState) => state.healthcareLaw?.pagination;

export default healthcareLawSlice.reducer;
