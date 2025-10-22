/**
 * WF-SLI-001 | ediscoverySlice.ts - Ediscovery Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface EdiscoveryItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface EdiscoveryState {
  items: EdiscoveryItem[];
  selectedItem: EdiscoveryItem | null;
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

const initialState: EdiscoveryState = {
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
const mockEdiscoveryApi = {
  getItems: async (_params?: any): Promise<{ data: EdiscoveryItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'Ediscovery User 1',
          description: 'System ediscoveryistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Ediscovery User 2',
          description: 'Department ediscovery',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<EdiscoveryItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `Ediscovery User ${id}`,
      description: 'Sample ediscovery user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<EdiscoveryItem>): Promise<EdiscoveryItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New Ediscovery',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<EdiscoveryItem>): Promise<EdiscoveryItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated Ediscovery',
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
export const fetchEdiscoveryItems = createAsyncThunk(
  'ediscovery/fetchItems', 
  async (params?: any) => mockEdiscoveryApi.getItems(params)
);

export const fetchEdiscoveryItem = createAsyncThunk(
  'ediscovery/fetchItem', 
  async (id: string) => mockEdiscoveryApi.getItem(id)
);

export const createEdiscoveryItem = createAsyncThunk(
  'ediscovery/createItem', 
  async (data: Partial<EdiscoveryItem>) => mockEdiscoveryApi.createItem(data)
);

export const updateEdiscoveryItem = createAsyncThunk(
  'ediscovery/updateItem', 
  async ({ id, data }: { id: string; data: Partial<EdiscoveryItem> }) => mockEdiscoveryApi.updateItem(id, data)
);

export const deleteEdiscoveryItem = createAsyncThunk(
  'ediscovery/deleteItem', 
  async (id: string) => {
    await mockEdiscoveryApi.deleteItem(id);
    return id;
  }
);

const ediscoverySlice = createSlice({
  name: 'ediscovery',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<EdiscoveryItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EdiscoveryState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<EdiscoveryState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `ediscovery_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<EdiscoveryState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchEdiscoveryItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchEdiscoveryItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchEdiscoveryItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch ediscovery items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchEdiscoveryItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchEdiscoveryItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchEdiscoveryItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch ediscovery item';
      });

    // Create Item
    builder
      .addCase(createEdiscoveryItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createEdiscoveryItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `ediscovery_create_${Date.now()}`,
          type: 'success',
          message: 'Ediscovery item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createEdiscoveryItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create ediscovery item';
      });

    // Update Item
    builder
      .addCase(updateEdiscoveryItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateEdiscoveryItem.fulfilled, (state, action) => {
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
          id: `ediscovery_update_${Date.now()}`,
          type: 'success',
          message: 'Ediscovery item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateEdiscoveryItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update ediscovery item';
      });

    // Delete Item
    builder
      .addCase(deleteEdiscoveryItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteEdiscoveryItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `ediscovery_delete_${Date.now()}`,
          type: 'success',
          message: 'Ediscovery item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteEdiscoveryItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete ediscovery item';
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
} = ediscoverySlice.actions;

// Selectors
export const selectEdiscoveryItems = (state: RootState) => state.ediscovery?.items || [];
export const selectEdiscoveryItem = (state: RootState) => state.ediscovery?.selectedItem;
export const selectEdiscoveryLoading = (state: RootState) => state.ediscovery?.loading;
export const selectEdiscoveryError = (state: RootState) => state.ediscovery?.error;
export const selectEdiscoveryFilters = (state: RootState) => state.ediscovery?.filters || {};
export const selectEdiscoveryNotifications = (state: RootState) => state.ediscovery?.notifications || [];
export const selectEdiscoveryPagination = (state: RootState) => state.ediscovery?.pagination;

export default ediscoverySlice.reducer;
