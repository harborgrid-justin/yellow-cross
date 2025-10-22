/**
 * WF-SLI-001 | time-billingSlice.ts - TimeBilling Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface TimeBillingItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface TimeBillingState {
  items: TimeBillingItem[];
  selectedItem: TimeBillingItem | null;
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

const initialState: TimeBillingState = {
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
const mockTimeBillingApi = {
  getItems: async (_params?: any): Promise<{ data: TimeBillingItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'TimeBilling User 1',
          description: 'System time-billingistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'TimeBilling User 2',
          description: 'Department time-billing',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<TimeBillingItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `TimeBilling User ${id}`,
      description: 'Sample time-billing user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<TimeBillingItem>): Promise<TimeBillingItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New TimeBilling',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<TimeBillingItem>): Promise<TimeBillingItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated TimeBilling',
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
export const fetchTimeBillingItems = createAsyncThunk(
  'time-billing/fetchItems', 
  async (params?: any) => mockTimeBillingApi.getItems(params)
);

export const fetchTimeBillingItem = createAsyncThunk(
  'time-billing/fetchItem', 
  async (id: string) => mockTimeBillingApi.getItem(id)
);

export const createTimeBillingItem = createAsyncThunk(
  'time-billing/createItem', 
  async (data: Partial<TimeBillingItem>) => mockTimeBillingApi.createItem(data)
);

export const updateTimeBillingItem = createAsyncThunk(
  'time-billing/updateItem', 
  async ({ id, data }: { id: string; data: Partial<TimeBillingItem> }) => mockTimeBillingApi.updateItem(id, data)
);

export const deleteTimeBillingItem = createAsyncThunk(
  'time-billing/deleteItem', 
  async (id: string) => {
    await mockTimeBillingApi.deleteItem(id);
    return id;
  }
);

const timeBillingSlice = createSlice({
  name: 'timeBilling',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<TimeBillingItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TimeBillingState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<TimeBillingState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `time-billing_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<TimeBillingState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchTimeBillingItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchTimeBillingItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchTimeBillingItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch time-billing items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchTimeBillingItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchTimeBillingItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchTimeBillingItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch time-billing item';
      });

    // Create Item
    builder
      .addCase(createTimeBillingItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createTimeBillingItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `time-billing_create_${Date.now()}`,
          type: 'success',
          message: 'TimeBilling item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createTimeBillingItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create time-billing item';
      });

    // Update Item
    builder
      .addCase(updateTimeBillingItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateTimeBillingItem.fulfilled, (state, action) => {
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
          id: `time-billing_update_${Date.now()}`,
          type: 'success',
          message: 'TimeBilling item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateTimeBillingItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update time-billing item';
      });

    // Delete Item
    builder
      .addCase(deleteTimeBillingItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteTimeBillingItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `time-billing_delete_${Date.now()}`,
          type: 'success',
          message: 'TimeBilling item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteTimeBillingItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete time-billing item';
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
} = timeBillingSlice.actions;

// Selectors
export const selectTimeBillingItems = (state: RootState) => state.timeBilling?.items || [];
export const selectTimeBillingItem = (state: RootState) => state.timeBilling?.selectedItem;
export const selectTimeBillingLoading = (state: RootState) => state.timeBilling?.loading;
export const selectTimeBillingError = (state: RootState) => state.timeBilling?.error;
export const selectTimeBillingFilters = (state: RootState) => state.timeBilling?.filters || {};
export const selectTimeBillingNotifications = (state: RootState) => state.timeBilling?.notifications || [];
export const selectTimeBillingPagination = (state: RootState) => state.timeBilling?.pagination;

export default timeBillingSlice.reducer;
