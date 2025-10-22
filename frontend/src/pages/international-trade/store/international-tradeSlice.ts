/**
 * WF-SLI-001 | international-tradeSlice.ts - InternationalTrade Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface InternationalTradeItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface InternationalTradeState {
  items: InternationalTradeItem[];
  selectedItem: InternationalTradeItem | null;
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

const initialState: InternationalTradeState = {
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
const mockInternationalTradeApi = {
  getItems: async (_params?: any): Promise<{ data: InternationalTradeItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'InternationalTrade User 1',
          description: 'System international-tradeistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'InternationalTrade User 2',
          description: 'Department international-trade',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<InternationalTradeItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `InternationalTrade User ${id}`,
      description: 'Sample international-trade user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<InternationalTradeItem>): Promise<InternationalTradeItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New InternationalTrade',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<InternationalTradeItem>): Promise<InternationalTradeItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated InternationalTrade',
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
export const fetchInternationalTradeItems = createAsyncThunk(
  'international-trade/fetchItems', 
  async (params?: any) => mockInternationalTradeApi.getItems(params)
);

export const fetchInternationalTradeItem = createAsyncThunk(
  'international-trade/fetchItem', 
  async (id: string) => mockInternationalTradeApi.getItem(id)
);

export const createInternationalTradeItem = createAsyncThunk(
  'international-trade/createItem', 
  async (data: Partial<InternationalTradeItem>) => mockInternationalTradeApi.createItem(data)
);

export const updateInternationalTradeItem = createAsyncThunk(
  'international-trade/updateItem', 
  async ({ id, data }: { id: string; data: Partial<InternationalTradeItem> }) => mockInternationalTradeApi.updateItem(id, data)
);

export const deleteInternationalTradeItem = createAsyncThunk(
  'international-trade/deleteItem', 
  async (id: string) => {
    await mockInternationalTradeApi.deleteItem(id);
    return id;
  }
);

const internationalTradeSlice = createSlice({
  name: 'internationalTrade',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<InternationalTradeItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<InternationalTradeState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<InternationalTradeState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `international-trade_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<InternationalTradeState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchInternationalTradeItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchInternationalTradeItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchInternationalTradeItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch international-trade items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchInternationalTradeItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchInternationalTradeItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchInternationalTradeItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch international-trade item';
      });

    // Create Item
    builder
      .addCase(createInternationalTradeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createInternationalTradeItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `international-trade_create_${Date.now()}`,
          type: 'success',
          message: 'InternationalTrade item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createInternationalTradeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create international-trade item';
      });

    // Update Item
    builder
      .addCase(updateInternationalTradeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateInternationalTradeItem.fulfilled, (state, action) => {
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
          id: `international-trade_update_${Date.now()}`,
          type: 'success',
          message: 'InternationalTrade item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateInternationalTradeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update international-trade item';
      });

    // Delete Item
    builder
      .addCase(deleteInternationalTradeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteInternationalTradeItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `international-trade_delete_${Date.now()}`,
          type: 'success',
          message: 'InternationalTrade item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteInternationalTradeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete international-trade item';
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
} = internationalTradeSlice.actions;

// Selectors
export const selectInternationalTradeItems = (state: RootState) => state.internationalTrade?.items || [];
export const selectInternationalTradeItem = (state: RootState) => state.internationalTrade?.selectedItem;
export const selectInternationalTradeLoading = (state: RootState) => state.internationalTrade?.loading;
export const selectInternationalTradeError = (state: RootState) => state.internationalTrade?.error;
export const selectInternationalTradeFilters = (state: RootState) => state.internationalTrade?.filters || {};
export const selectInternationalTradeNotifications = (state: RootState) => state.internationalTrade?.notifications || [];
export const selectInternationalTradePagination = (state: RootState) => state.internationalTrade?.pagination;

export default internationalTradeSlice.reducer;
