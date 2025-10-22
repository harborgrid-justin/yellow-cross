/**
 * WF-SLI-001 | immigration-lawSlice.ts - ImmigrationLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ImmigrationLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ImmigrationLawState {
  items: ImmigrationLawItem[];
  selectedItem: ImmigrationLawItem | null;
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

const initialState: ImmigrationLawState = {
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
const mockImmigrationLawApi = {
  getItems: async (_params?: any): Promise<{ data: ImmigrationLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'ImmigrationLaw User 1',
          description: 'System immigration-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'ImmigrationLaw User 2',
          description: 'Department immigration-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ImmigrationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `ImmigrationLaw User ${id}`,
      description: 'Sample immigration-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ImmigrationLawItem>): Promise<ImmigrationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New ImmigrationLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ImmigrationLawItem>): Promise<ImmigrationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated ImmigrationLaw',
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
export const fetchImmigrationLawItems = createAsyncThunk(
  'immigration-law/fetchItems', 
  async (params?: any) => mockImmigrationLawApi.getItems(params)
);

export const fetchImmigrationLawItem = createAsyncThunk(
  'immigration-law/fetchItem', 
  async (id: string) => mockImmigrationLawApi.getItem(id)
);

export const createImmigrationLawItem = createAsyncThunk(
  'immigration-law/createItem', 
  async (data: Partial<ImmigrationLawItem>) => mockImmigrationLawApi.createItem(data)
);

export const updateImmigrationLawItem = createAsyncThunk(
  'immigration-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ImmigrationLawItem> }) => mockImmigrationLawApi.updateItem(id, data)
);

export const deleteImmigrationLawItem = createAsyncThunk(
  'immigration-law/deleteItem', 
  async (id: string) => {
    await mockImmigrationLawApi.deleteItem(id);
    return id;
  }
);

const immigrationLawSlice = createSlice({
  name: 'immigrationLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ImmigrationLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ImmigrationLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ImmigrationLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `immigration-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ImmigrationLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchImmigrationLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchImmigrationLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchImmigrationLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch immigration-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchImmigrationLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchImmigrationLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchImmigrationLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch immigration-law item';
      });

    // Create Item
    builder
      .addCase(createImmigrationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createImmigrationLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `immigration-law_create_${Date.now()}`,
          type: 'success',
          message: 'ImmigrationLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createImmigrationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create immigration-law item';
      });

    // Update Item
    builder
      .addCase(updateImmigrationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateImmigrationLawItem.fulfilled, (state, action) => {
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
          id: `immigration-law_update_${Date.now()}`,
          type: 'success',
          message: 'ImmigrationLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateImmigrationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update immigration-law item';
      });

    // Delete Item
    builder
      .addCase(deleteImmigrationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteImmigrationLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `immigration-law_delete_${Date.now()}`,
          type: 'success',
          message: 'ImmigrationLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteImmigrationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete immigration-law item';
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
} = immigrationLawSlice.actions;

// Selectors
export const selectImmigrationLawItems = (state: RootState) => state.immigrationLaw?.items || [];
export const selectImmigrationLawItem = (state: RootState) => state.immigrationLaw?.selectedItem;
export const selectImmigrationLawLoading = (state: RootState) => state.immigrationLaw?.loading;
export const selectImmigrationLawError = (state: RootState) => state.immigrationLaw?.error;
export const selectImmigrationLawFilters = (state: RootState) => state.immigrationLaw?.filters || {};
export const selectImmigrationLawNotifications = (state: RootState) => state.immigrationLaw?.notifications || [];
export const selectImmigrationLawPagination = (state: RootState) => state.immigrationLaw?.pagination;

export default immigrationLawSlice.reducer;
