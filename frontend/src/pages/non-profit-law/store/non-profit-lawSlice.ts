/**
 * WF-SLI-001 | non-profit-lawSlice.ts - NonProfitLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface NonProfitLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface NonProfitLawState {
  items: NonProfitLawItem[];
  selectedItem: NonProfitLawItem | null;
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

const initialState: NonProfitLawState = {
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
const mockNonProfitLawApi = {
  getItems: async (_params?: any): Promise<{ data: NonProfitLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'NonProfitLaw User 1',
          description: 'System non-profit-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'NonProfitLaw User 2',
          description: 'Department non-profit-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<NonProfitLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `NonProfitLaw User ${id}`,
      description: 'Sample non-profit-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<NonProfitLawItem>): Promise<NonProfitLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New NonProfitLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<NonProfitLawItem>): Promise<NonProfitLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated NonProfitLaw',
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
export const fetchNonProfitLawItems = createAsyncThunk(
  'non-profit-law/fetchItems', 
  async (params?: any) => mockNonProfitLawApi.getItems(params)
);

export const fetchNonProfitLawItem = createAsyncThunk(
  'non-profit-law/fetchItem', 
  async (id: string) => mockNonProfitLawApi.getItem(id)
);

export const createNonProfitLawItem = createAsyncThunk(
  'non-profit-law/createItem', 
  async (data: Partial<NonProfitLawItem>) => mockNonProfitLawApi.createItem(data)
);

export const updateNonProfitLawItem = createAsyncThunk(
  'non-profit-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<NonProfitLawItem> }) => mockNonProfitLawApi.updateItem(id, data)
);

export const deleteNonProfitLawItem = createAsyncThunk(
  'non-profit-law/deleteItem', 
  async (id: string) => {
    await mockNonProfitLawApi.deleteItem(id);
    return id;
  }
);

const nonProfitLawSlice = createSlice({
  name: 'nonProfitLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<NonProfitLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<NonProfitLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<NonProfitLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `non-profit-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<NonProfitLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchNonProfitLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchNonProfitLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchNonProfitLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch non-profit-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchNonProfitLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchNonProfitLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchNonProfitLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch non-profit-law item';
      });

    // Create Item
    builder
      .addCase(createNonProfitLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createNonProfitLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `non-profit-law_create_${Date.now()}`,
          type: 'success',
          message: 'NonProfitLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createNonProfitLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create non-profit-law item';
      });

    // Update Item
    builder
      .addCase(updateNonProfitLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateNonProfitLawItem.fulfilled, (state, action) => {
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
          id: `non-profit-law_update_${Date.now()}`,
          type: 'success',
          message: 'NonProfitLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateNonProfitLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update non-profit-law item';
      });

    // Delete Item
    builder
      .addCase(deleteNonProfitLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteNonProfitLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `non-profit-law_delete_${Date.now()}`,
          type: 'success',
          message: 'NonProfitLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteNonProfitLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete non-profit-law item';
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
} = nonProfitLawSlice.actions;

// Selectors
export const selectNonProfitLawItems = (state: RootState) => state.nonProfitLaw?.items || [];
export const selectNonProfitLawItem = (state: RootState) => state.nonProfitLaw?.selectedItem;
export const selectNonProfitLawLoading = (state: RootState) => state.nonProfitLaw?.loading;
export const selectNonProfitLawError = (state: RootState) => state.nonProfitLaw?.error;
export const selectNonProfitLawFilters = (state: RootState) => state.nonProfitLaw?.filters || {};
export const selectNonProfitLawNotifications = (state: RootState) => state.nonProfitLaw?.notifications || [];
export const selectNonProfitLawPagination = (state: RootState) => state.nonProfitLaw?.pagination;

export default nonProfitLawSlice.reducer;
