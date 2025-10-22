/**
 * WF-SLI-001 | construction-lawSlice.ts - ConstructionLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ConstructionLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ConstructionLawState {
  items: ConstructionLawItem[];
  selectedItem: ConstructionLawItem | null;
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

const initialState: ConstructionLawState = {
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
const mockConstructionLawApi = {
  getItems: async (_params?: any): Promise<{ data: ConstructionLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'ConstructionLaw User 1',
          description: 'System construction-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'ConstructionLaw User 2',
          description: 'Department construction-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ConstructionLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `ConstructionLaw User ${id}`,
      description: 'Sample construction-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ConstructionLawItem>): Promise<ConstructionLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New ConstructionLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ConstructionLawItem>): Promise<ConstructionLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated ConstructionLaw',
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
export const fetchConstructionLawItems = createAsyncThunk(
  'construction-law/fetchItems', 
  async (params?: any) => mockConstructionLawApi.getItems(params)
);

export const fetchConstructionLawItem = createAsyncThunk(
  'construction-law/fetchItem', 
  async (id: string) => mockConstructionLawApi.getItem(id)
);

export const createConstructionLawItem = createAsyncThunk(
  'construction-law/createItem', 
  async (data: Partial<ConstructionLawItem>) => mockConstructionLawApi.createItem(data)
);

export const updateConstructionLawItem = createAsyncThunk(
  'construction-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ConstructionLawItem> }) => mockConstructionLawApi.updateItem(id, data)
);

export const deleteConstructionLawItem = createAsyncThunk(
  'construction-law/deleteItem', 
  async (id: string) => {
    await mockConstructionLawApi.deleteItem(id);
    return id;
  }
);

const constructionLawSlice = createSlice({
  name: 'constructionLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ConstructionLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ConstructionLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ConstructionLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `construction-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ConstructionLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchConstructionLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchConstructionLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchConstructionLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch construction-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchConstructionLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchConstructionLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchConstructionLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch construction-law item';
      });

    // Create Item
    builder
      .addCase(createConstructionLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createConstructionLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `construction-law_create_${Date.now()}`,
          type: 'success',
          message: 'ConstructionLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createConstructionLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create construction-law item';
      });

    // Update Item
    builder
      .addCase(updateConstructionLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateConstructionLawItem.fulfilled, (state, action) => {
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
          id: `construction-law_update_${Date.now()}`,
          type: 'success',
          message: 'ConstructionLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateConstructionLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update construction-law item';
      });

    // Delete Item
    builder
      .addCase(deleteConstructionLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteConstructionLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `construction-law_delete_${Date.now()}`,
          type: 'success',
          message: 'ConstructionLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteConstructionLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete construction-law item';
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
} = constructionLawSlice.actions;

// Selectors
export const selectConstructionLawItems = (state: RootState) => state.constructionLaw?.items || [];
export const selectConstructionLawItem = (state: RootState) => state.constructionLaw?.selectedItem;
export const selectConstructionLawLoading = (state: RootState) => state.constructionLaw?.loading;
export const selectConstructionLawError = (state: RootState) => state.constructionLaw?.error;
export const selectConstructionLawFilters = (state: RootState) => state.constructionLaw?.filters || {};
export const selectConstructionLawNotifications = (state: RootState) => state.constructionLaw?.notifications || [];
export const selectConstructionLawPagination = (state: RootState) => state.constructionLaw?.pagination;

export default constructionLawSlice.reducer;
