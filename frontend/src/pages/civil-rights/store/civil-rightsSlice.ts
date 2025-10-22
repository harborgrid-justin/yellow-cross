/**
 * WF-SLI-001 | civil-rightsSlice.ts - CivilRights Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface CivilRightsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CivilRightsState {
  items: CivilRightsItem[];
  selectedItem: CivilRightsItem | null;
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

const initialState: CivilRightsState = {
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
const mockCivilRightsApi = {
  getItems: async (_params?: any): Promise<{ data: CivilRightsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'CivilRights User 1',
          description: 'System civil-rightsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'CivilRights User 2',
          description: 'Department civil-rights',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<CivilRightsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `CivilRights User ${id}`,
      description: 'Sample civil-rights user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<CivilRightsItem>): Promise<CivilRightsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New CivilRights',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<CivilRightsItem>): Promise<CivilRightsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated CivilRights',
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
export const fetchCivilRightsItems = createAsyncThunk(
  'civil-rights/fetchItems', 
  async (params?: any) => mockCivilRightsApi.getItems(params)
);

export const fetchCivilRightsItem = createAsyncThunk(
  'civil-rights/fetchItem', 
  async (id: string) => mockCivilRightsApi.getItem(id)
);

export const createCivilRightsItem = createAsyncThunk(
  'civil-rights/createItem', 
  async (data: Partial<CivilRightsItem>) => mockCivilRightsApi.createItem(data)
);

export const updateCivilRightsItem = createAsyncThunk(
  'civil-rights/updateItem', 
  async ({ id, data }: { id: string; data: Partial<CivilRightsItem> }) => mockCivilRightsApi.updateItem(id, data)
);

export const deleteCivilRightsItem = createAsyncThunk(
  'civil-rights/deleteItem', 
  async (id: string) => {
    await mockCivilRightsApi.deleteItem(id);
    return id;
  }
);

const civilRightsSlice = createSlice({
  name: 'civilRights',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<CivilRightsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CivilRightsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<CivilRightsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `civil-rights_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<CivilRightsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchCivilRightsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchCivilRightsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchCivilRightsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch civil-rights items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchCivilRightsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchCivilRightsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchCivilRightsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch civil-rights item';
      });

    // Create Item
    builder
      .addCase(createCivilRightsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createCivilRightsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `civil-rights_create_${Date.now()}`,
          type: 'success',
          message: 'CivilRights item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createCivilRightsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create civil-rights item';
      });

    // Update Item
    builder
      .addCase(updateCivilRightsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateCivilRightsItem.fulfilled, (state, action) => {
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
          id: `civil-rights_update_${Date.now()}`,
          type: 'success',
          message: 'CivilRights item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateCivilRightsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update civil-rights item';
      });

    // Delete Item
    builder
      .addCase(deleteCivilRightsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteCivilRightsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `civil-rights_delete_${Date.now()}`,
          type: 'success',
          message: 'CivilRights item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteCivilRightsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete civil-rights item';
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
} = civilRightsSlice.actions;

// Selectors
export const selectCivilRightsItems = (state: RootState) => state.civilRights?.items || [];
export const selectCivilRightsItem = (state: RootState) => state.civilRights?.selectedItem;
export const selectCivilRightsLoading = (state: RootState) => state.civilRights?.loading;
export const selectCivilRightsError = (state: RootState) => state.civilRights?.error;
export const selectCivilRightsFilters = (state: RootState) => state.civilRights?.filters || {};
export const selectCivilRightsNotifications = (state: RootState) => state.civilRights?.notifications || [];
export const selectCivilRightsPagination = (state: RootState) => state.civilRights?.pagination;

export default civilRightsSlice.reducer;
