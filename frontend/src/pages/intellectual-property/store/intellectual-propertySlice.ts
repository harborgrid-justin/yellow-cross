/**
 * WF-SLI-001 | intellectual-propertySlice.ts - IntellectualProperty Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface IntellectualPropertyItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface IntellectualPropertyState {
  items: IntellectualPropertyItem[];
  selectedItem: IntellectualPropertyItem | null;
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

const initialState: IntellectualPropertyState = {
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
const mockIntellectualPropertyApi = {
  getItems: async (_params?: any): Promise<{ data: IntellectualPropertyItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'IntellectualProperty User 1',
          description: 'System intellectual-propertyistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'IntellectualProperty User 2',
          description: 'Department intellectual-property',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<IntellectualPropertyItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `IntellectualProperty User ${id}`,
      description: 'Sample intellectual-property user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<IntellectualPropertyItem>): Promise<IntellectualPropertyItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New IntellectualProperty',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<IntellectualPropertyItem>): Promise<IntellectualPropertyItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated IntellectualProperty',
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
export const fetchIntellectualPropertyItems = createAsyncThunk(
  'intellectual-property/fetchItems', 
  async (params?: any) => mockIntellectualPropertyApi.getItems(params)
);

export const fetchIntellectualPropertyItem = createAsyncThunk(
  'intellectual-property/fetchItem', 
  async (id: string) => mockIntellectualPropertyApi.getItem(id)
);

export const createIntellectualPropertyItem = createAsyncThunk(
  'intellectual-property/createItem', 
  async (data: Partial<IntellectualPropertyItem>) => mockIntellectualPropertyApi.createItem(data)
);

export const updateIntellectualPropertyItem = createAsyncThunk(
  'intellectual-property/updateItem', 
  async ({ id, data }: { id: string; data: Partial<IntellectualPropertyItem> }) => mockIntellectualPropertyApi.updateItem(id, data)
);

export const deleteIntellectualPropertyItem = createAsyncThunk(
  'intellectual-property/deleteItem', 
  async (id: string) => {
    await mockIntellectualPropertyApi.deleteItem(id);
    return id;
  }
);

const intellectualPropertySlice = createSlice({
  name: 'intellectualProperty',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<IntellectualPropertyItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<IntellectualPropertyState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<IntellectualPropertyState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `intellectual-property_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<IntellectualPropertyState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchIntellectualPropertyItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchIntellectualPropertyItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchIntellectualPropertyItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch intellectual-property items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchIntellectualPropertyItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchIntellectualPropertyItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchIntellectualPropertyItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch intellectual-property item';
      });

    // Create Item
    builder
      .addCase(createIntellectualPropertyItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createIntellectualPropertyItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `intellectual-property_create_${Date.now()}`,
          type: 'success',
          message: 'IntellectualProperty item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createIntellectualPropertyItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create intellectual-property item';
      });

    // Update Item
    builder
      .addCase(updateIntellectualPropertyItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateIntellectualPropertyItem.fulfilled, (state, action) => {
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
          id: `intellectual-property_update_${Date.now()}`,
          type: 'success',
          message: 'IntellectualProperty item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateIntellectualPropertyItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update intellectual-property item';
      });

    // Delete Item
    builder
      .addCase(deleteIntellectualPropertyItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteIntellectualPropertyItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `intellectual-property_delete_${Date.now()}`,
          type: 'success',
          message: 'IntellectualProperty item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteIntellectualPropertyItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete intellectual-property item';
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
} = intellectualPropertySlice.actions;

// Selectors
export const selectIntellectualPropertyItems = (state: RootState) => state.intellectualProperty?.items || [];
export const selectIntellectualPropertyItem = (state: RootState) => state.intellectualProperty?.selectedItem;
export const selectIntellectualPropertyLoading = (state: RootState) => state.intellectualProperty?.loading;
export const selectIntellectualPropertyError = (state: RootState) => state.intellectualProperty?.error;
export const selectIntellectualPropertyFilters = (state: RootState) => state.intellectualProperty?.filters || {};
export const selectIntellectualPropertyNotifications = (state: RootState) => state.intellectualProperty?.notifications || [];
export const selectIntellectualPropertyPagination = (state: RootState) => state.intellectualProperty?.pagination;

export default intellectualPropertySlice.reducer;
