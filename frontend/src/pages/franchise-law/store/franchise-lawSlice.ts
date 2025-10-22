/**
 * WF-SLI-001 | franchise-lawSlice.ts - FranchiseLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface FranchiseLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface FranchiseLawState {
  items: FranchiseLawItem[];
  selectedItem: FranchiseLawItem | null;
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

const initialState: FranchiseLawState = {
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
const mockFranchiseLawApi = {
  getItems: async (_params?: any): Promise<{ data: FranchiseLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'FranchiseLaw User 1',
          description: 'System franchise-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'FranchiseLaw User 2',
          description: 'Department franchise-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<FranchiseLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `FranchiseLaw User ${id}`,
      description: 'Sample franchise-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<FranchiseLawItem>): Promise<FranchiseLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New FranchiseLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<FranchiseLawItem>): Promise<FranchiseLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated FranchiseLaw',
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
export const fetchFranchiseLawItems = createAsyncThunk(
  'franchise-law/fetchItems', 
  async (params?: any) => mockFranchiseLawApi.getItems(params)
);

export const fetchFranchiseLawItem = createAsyncThunk(
  'franchise-law/fetchItem', 
  async (id: string) => mockFranchiseLawApi.getItem(id)
);

export const createFranchiseLawItem = createAsyncThunk(
  'franchise-law/createItem', 
  async (data: Partial<FranchiseLawItem>) => mockFranchiseLawApi.createItem(data)
);

export const updateFranchiseLawItem = createAsyncThunk(
  'franchise-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<FranchiseLawItem> }) => mockFranchiseLawApi.updateItem(id, data)
);

export const deleteFranchiseLawItem = createAsyncThunk(
  'franchise-law/deleteItem', 
  async (id: string) => {
    await mockFranchiseLawApi.deleteItem(id);
    return id;
  }
);

const franchiseLawSlice = createSlice({
  name: 'franchiseLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<FranchiseLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FranchiseLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<FranchiseLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `franchise-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<FranchiseLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchFranchiseLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchFranchiseLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchFranchiseLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch franchise-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchFranchiseLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchFranchiseLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchFranchiseLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch franchise-law item';
      });

    // Create Item
    builder
      .addCase(createFranchiseLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createFranchiseLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `franchise-law_create_${Date.now()}`,
          type: 'success',
          message: 'FranchiseLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createFranchiseLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create franchise-law item';
      });

    // Update Item
    builder
      .addCase(updateFranchiseLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateFranchiseLawItem.fulfilled, (state, action) => {
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
          id: `franchise-law_update_${Date.now()}`,
          type: 'success',
          message: 'FranchiseLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateFranchiseLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update franchise-law item';
      });

    // Delete Item
    builder
      .addCase(deleteFranchiseLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteFranchiseLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `franchise-law_delete_${Date.now()}`,
          type: 'success',
          message: 'FranchiseLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteFranchiseLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete franchise-law item';
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
} = franchiseLawSlice.actions;

// Selectors
export const selectFranchiseLawItems = (state: RootState) => state.franchiseLaw?.items || [];
export const selectFranchiseLawItem = (state: RootState) => state.franchiseLaw?.selectedItem;
export const selectFranchiseLawLoading = (state: RootState) => state.franchiseLaw?.loading;
export const selectFranchiseLawError = (state: RootState) => state.franchiseLaw?.error;
export const selectFranchiseLawFilters = (state: RootState) => state.franchiseLaw?.filters || {};
export const selectFranchiseLawNotifications = (state: RootState) => state.franchiseLaw?.notifications || [];
export const selectFranchiseLawPagination = (state: RootState) => state.franchiseLaw?.pagination;

export default franchiseLawSlice.reducer;
