/**
 * WF-SLI-001 | data-privacySlice.ts - DataPrivacy Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface DataPrivacyItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface DataPrivacyState {
  items: DataPrivacyItem[];
  selectedItem: DataPrivacyItem | null;
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

const initialState: DataPrivacyState = {
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
const mockDataPrivacyApi = {
  getItems: async (_params?: any): Promise<{ data: DataPrivacyItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'DataPrivacy User 1',
          description: 'System data-privacyistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'DataPrivacy User 2',
          description: 'Department data-privacy',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<DataPrivacyItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `DataPrivacy User ${id}`,
      description: 'Sample data-privacy user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<DataPrivacyItem>): Promise<DataPrivacyItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New DataPrivacy',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<DataPrivacyItem>): Promise<DataPrivacyItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated DataPrivacy',
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
export const fetchDataPrivacyItems = createAsyncThunk(
  'data-privacy/fetchItems', 
  async (params?: any) => mockDataPrivacyApi.getItems(params)
);

export const fetchDataPrivacyItem = createAsyncThunk(
  'data-privacy/fetchItem', 
  async (id: string) => mockDataPrivacyApi.getItem(id)
);

export const createDataPrivacyItem = createAsyncThunk(
  'data-privacy/createItem', 
  async (data: Partial<DataPrivacyItem>) => mockDataPrivacyApi.createItem(data)
);

export const updateDataPrivacyItem = createAsyncThunk(
  'data-privacy/updateItem', 
  async ({ id, data }: { id: string; data: Partial<DataPrivacyItem> }) => mockDataPrivacyApi.updateItem(id, data)
);

export const deleteDataPrivacyItem = createAsyncThunk(
  'data-privacy/deleteItem', 
  async (id: string) => {
    await mockDataPrivacyApi.deleteItem(id);
    return id;
  }
);

const dataPrivacySlice = createSlice({
  name: 'dataPrivacy',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<DataPrivacyItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<DataPrivacyState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<DataPrivacyState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `data-privacy_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<DataPrivacyState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchDataPrivacyItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchDataPrivacyItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchDataPrivacyItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch data-privacy items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchDataPrivacyItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchDataPrivacyItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchDataPrivacyItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch data-privacy item';
      });

    // Create Item
    builder
      .addCase(createDataPrivacyItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createDataPrivacyItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `data-privacy_create_${Date.now()}`,
          type: 'success',
          message: 'DataPrivacy item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createDataPrivacyItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create data-privacy item';
      });

    // Update Item
    builder
      .addCase(updateDataPrivacyItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateDataPrivacyItem.fulfilled, (state, action) => {
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
          id: `data-privacy_update_${Date.now()}`,
          type: 'success',
          message: 'DataPrivacy item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateDataPrivacyItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update data-privacy item';
      });

    // Delete Item
    builder
      .addCase(deleteDataPrivacyItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteDataPrivacyItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `data-privacy_delete_${Date.now()}`,
          type: 'success',
          message: 'DataPrivacy item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteDataPrivacyItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete data-privacy item';
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
} = dataPrivacySlice.actions;

// Selectors
export const selectDataPrivacyItems = (state: RootState) => state.dataPrivacy?.items || [];
export const selectDataPrivacyItem = (state: RootState) => state.dataPrivacy?.selectedItem;
export const selectDataPrivacyLoading = (state: RootState) => state.dataPrivacy?.loading;
export const selectDataPrivacyError = (state: RootState) => state.dataPrivacy?.error;
export const selectDataPrivacyFilters = (state: RootState) => state.dataPrivacy?.filters || {};
export const selectDataPrivacyNotifications = (state: RootState) => state.dataPrivacy?.notifications || [];
export const selectDataPrivacyPagination = (state: RootState) => state.dataPrivacy?.pagination;

export default dataPrivacySlice.reducer;
