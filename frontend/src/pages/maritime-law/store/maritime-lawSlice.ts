/**
 * WF-SLI-001 | maritime-lawSlice.ts - MaritimeLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface MaritimeLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface MaritimeLawState {
  items: MaritimeLawItem[];
  selectedItem: MaritimeLawItem | null;
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

const initialState: MaritimeLawState = {
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
const mockMaritimeLawApi = {
  getItems: async (_params?: any): Promise<{ data: MaritimeLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'MaritimeLaw User 1',
          description: 'System maritime-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'MaritimeLaw User 2',
          description: 'Department maritime-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<MaritimeLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `MaritimeLaw User ${id}`,
      description: 'Sample maritime-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<MaritimeLawItem>): Promise<MaritimeLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New MaritimeLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<MaritimeLawItem>): Promise<MaritimeLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated MaritimeLaw',
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
export const fetchMaritimeLawItems = createAsyncThunk(
  'maritime-law/fetchItems', 
  async (params?: any) => mockMaritimeLawApi.getItems(params)
);

export const fetchMaritimeLawItem = createAsyncThunk(
  'maritime-law/fetchItem', 
  async (id: string) => mockMaritimeLawApi.getItem(id)
);

export const createMaritimeLawItem = createAsyncThunk(
  'maritime-law/createItem', 
  async (data: Partial<MaritimeLawItem>) => mockMaritimeLawApi.createItem(data)
);

export const updateMaritimeLawItem = createAsyncThunk(
  'maritime-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<MaritimeLawItem> }) => mockMaritimeLawApi.updateItem(id, data)
);

export const deleteMaritimeLawItem = createAsyncThunk(
  'maritime-law/deleteItem', 
  async (id: string) => {
    await mockMaritimeLawApi.deleteItem(id);
    return id;
  }
);

const maritimeLawSlice = createSlice({
  name: 'maritimeLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<MaritimeLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MaritimeLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<MaritimeLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `maritime-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<MaritimeLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchMaritimeLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchMaritimeLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchMaritimeLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch maritime-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchMaritimeLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchMaritimeLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchMaritimeLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch maritime-law item';
      });

    // Create Item
    builder
      .addCase(createMaritimeLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createMaritimeLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `maritime-law_create_${Date.now()}`,
          type: 'success',
          message: 'MaritimeLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createMaritimeLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create maritime-law item';
      });

    // Update Item
    builder
      .addCase(updateMaritimeLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateMaritimeLawItem.fulfilled, (state, action) => {
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
          id: `maritime-law_update_${Date.now()}`,
          type: 'success',
          message: 'MaritimeLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateMaritimeLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update maritime-law item';
      });

    // Delete Item
    builder
      .addCase(deleteMaritimeLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteMaritimeLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `maritime-law_delete_${Date.now()}`,
          type: 'success',
          message: 'MaritimeLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteMaritimeLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete maritime-law item';
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
} = maritimeLawSlice.actions;

// Selectors
export const selectMaritimeLawItems = (state: RootState) => state.maritimeLaw?.items || [];
export const selectMaritimeLawItem = (state: RootState) => state.maritimeLaw?.selectedItem;
export const selectMaritimeLawLoading = (state: RootState) => state.maritimeLaw?.loading;
export const selectMaritimeLawError = (state: RootState) => state.maritimeLaw?.error;
export const selectMaritimeLawFilters = (state: RootState) => state.maritimeLaw?.filters || {};
export const selectMaritimeLawNotifications = (state: RootState) => state.maritimeLaw?.notifications || [];
export const selectMaritimeLawPagination = (state: RootState) => state.maritimeLaw?.pagination;

export default maritimeLawSlice.reducer;
