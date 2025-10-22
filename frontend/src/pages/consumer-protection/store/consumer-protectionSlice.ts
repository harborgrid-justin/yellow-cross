/**
 * WF-SLI-001 | consumer-protectionSlice.ts - ConsumerProtection Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ConsumerProtectionItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ConsumerProtectionState {
  items: ConsumerProtectionItem[];
  selectedItem: ConsumerProtectionItem | null;
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

const initialState: ConsumerProtectionState = {
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
const mockConsumerProtectionApi = {
  getItems: async (_params?: any): Promise<{ data: ConsumerProtectionItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'ConsumerProtection User 1',
          description: 'System consumer-protectionistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'ConsumerProtection User 2',
          description: 'Department consumer-protection',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ConsumerProtectionItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `ConsumerProtection User ${id}`,
      description: 'Sample consumer-protection user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ConsumerProtectionItem>): Promise<ConsumerProtectionItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New ConsumerProtection',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ConsumerProtectionItem>): Promise<ConsumerProtectionItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated ConsumerProtection',
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
export const fetchConsumerProtectionItems = createAsyncThunk(
  'consumer-protection/fetchItems', 
  async (params?: any) => mockConsumerProtectionApi.getItems(params)
);

export const fetchConsumerProtectionItem = createAsyncThunk(
  'consumer-protection/fetchItem', 
  async (id: string) => mockConsumerProtectionApi.getItem(id)
);

export const createConsumerProtectionItem = createAsyncThunk(
  'consumer-protection/createItem', 
  async (data: Partial<ConsumerProtectionItem>) => mockConsumerProtectionApi.createItem(data)
);

export const updateConsumerProtectionItem = createAsyncThunk(
  'consumer-protection/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ConsumerProtectionItem> }) => mockConsumerProtectionApi.updateItem(id, data)
);

export const deleteConsumerProtectionItem = createAsyncThunk(
  'consumer-protection/deleteItem', 
  async (id: string) => {
    await mockConsumerProtectionApi.deleteItem(id);
    return id;
  }
);

const consumerProtectionSlice = createSlice({
  name: 'consumerProtection',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ConsumerProtectionItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ConsumerProtectionState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ConsumerProtectionState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `consumer-protection_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ConsumerProtectionState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchConsumerProtectionItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchConsumerProtectionItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchConsumerProtectionItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch consumer-protection items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchConsumerProtectionItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchConsumerProtectionItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchConsumerProtectionItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch consumer-protection item';
      });

    // Create Item
    builder
      .addCase(createConsumerProtectionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createConsumerProtectionItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `consumer-protection_create_${Date.now()}`,
          type: 'success',
          message: 'ConsumerProtection item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createConsumerProtectionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create consumer-protection item';
      });

    // Update Item
    builder
      .addCase(updateConsumerProtectionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateConsumerProtectionItem.fulfilled, (state, action) => {
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
          id: `consumer-protection_update_${Date.now()}`,
          type: 'success',
          message: 'ConsumerProtection item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateConsumerProtectionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update consumer-protection item';
      });

    // Delete Item
    builder
      .addCase(deleteConsumerProtectionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteConsumerProtectionItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `consumer-protection_delete_${Date.now()}`,
          type: 'success',
          message: 'ConsumerProtection item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteConsumerProtectionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete consumer-protection item';
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
} = consumerProtectionSlice.actions;

// Selectors
export const selectConsumerProtectionItems = (state: RootState) => state.consumerProtection?.items || [];
export const selectConsumerProtectionItem = (state: RootState) => state.consumerProtection?.selectedItem;
export const selectConsumerProtectionLoading = (state: RootState) => state.consumerProtection?.loading;
export const selectConsumerProtectionError = (state: RootState) => state.consumerProtection?.error;
export const selectConsumerProtectionFilters = (state: RootState) => state.consumerProtection?.filters || {};
export const selectConsumerProtectionNotifications = (state: RootState) => state.consumerProtection?.notifications || [];
export const selectConsumerProtectionPagination = (state: RootState) => state.consumerProtection?.pagination;

export default consumerProtectionSlice.reducer;
