/**
 * WF-SLI-001 | real-estate-transactionsSlice.ts - RealEstateTransactions Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface RealEstateTransactionsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface RealEstateTransactionsState {
  items: RealEstateTransactionsItem[];
  selectedItem: RealEstateTransactionsItem | null;
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

const initialState: RealEstateTransactionsState = {
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
const mockRealEstateTransactionsApi = {
  getItems: async (_params?: any): Promise<{ data: RealEstateTransactionsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'RealEstateTransactions User 1',
          description: 'System real-estate-transactionsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'RealEstateTransactions User 2',
          description: 'Department real-estate-transactions',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<RealEstateTransactionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `RealEstateTransactions User ${id}`,
      description: 'Sample real-estate-transactions user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<RealEstateTransactionsItem>): Promise<RealEstateTransactionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New RealEstateTransactions',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<RealEstateTransactionsItem>): Promise<RealEstateTransactionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated RealEstateTransactions',
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
export const fetchRealEstateTransactionsItems = createAsyncThunk(
  'real-estate-transactions/fetchItems', 
  async (params?: any) => mockRealEstateTransactionsApi.getItems(params)
);

export const fetchRealEstateTransactionsItem = createAsyncThunk(
  'real-estate-transactions/fetchItem', 
  async (id: string) => mockRealEstateTransactionsApi.getItem(id)
);

export const createRealEstateTransactionsItem = createAsyncThunk(
  'real-estate-transactions/createItem', 
  async (data: Partial<RealEstateTransactionsItem>) => mockRealEstateTransactionsApi.createItem(data)
);

export const updateRealEstateTransactionsItem = createAsyncThunk(
  'real-estate-transactions/updateItem', 
  async ({ id, data }: { id: string; data: Partial<RealEstateTransactionsItem> }) => mockRealEstateTransactionsApi.updateItem(id, data)
);

export const deleteRealEstateTransactionsItem = createAsyncThunk(
  'real-estate-transactions/deleteItem', 
  async (id: string) => {
    await mockRealEstateTransactionsApi.deleteItem(id);
    return id;
  }
);

const realEstateTransactionsSlice = createSlice({
  name: 'realEstateTransactions',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<RealEstateTransactionsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<RealEstateTransactionsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<RealEstateTransactionsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `real-estate-transactions_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<RealEstateTransactionsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchRealEstateTransactionsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchRealEstateTransactionsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchRealEstateTransactionsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch real-estate-transactions items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchRealEstateTransactionsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchRealEstateTransactionsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchRealEstateTransactionsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch real-estate-transactions item';
      });

    // Create Item
    builder
      .addCase(createRealEstateTransactionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createRealEstateTransactionsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `real-estate-transactions_create_${Date.now()}`,
          type: 'success',
          message: 'RealEstateTransactions item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createRealEstateTransactionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create real-estate-transactions item';
      });

    // Update Item
    builder
      .addCase(updateRealEstateTransactionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateRealEstateTransactionsItem.fulfilled, (state, action) => {
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
          id: `real-estate-transactions_update_${Date.now()}`,
          type: 'success',
          message: 'RealEstateTransactions item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateRealEstateTransactionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update real-estate-transactions item';
      });

    // Delete Item
    builder
      .addCase(deleteRealEstateTransactionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteRealEstateTransactionsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `real-estate-transactions_delete_${Date.now()}`,
          type: 'success',
          message: 'RealEstateTransactions item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteRealEstateTransactionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete real-estate-transactions item';
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
} = realEstateTransactionsSlice.actions;

// Selectors
export const selectRealEstateTransactionsItems = (state: RootState) => state.realEstateTransactions?.items || [];
export const selectRealEstateTransactionsItem = (state: RootState) => state.realEstateTransactions?.selectedItem;
export const selectRealEstateTransactionsLoading = (state: RootState) => state.realEstateTransactions?.loading;
export const selectRealEstateTransactionsError = (state: RootState) => state.realEstateTransactions?.error;
export const selectRealEstateTransactionsFilters = (state: RootState) => state.realEstateTransactions?.filters || {};
export const selectRealEstateTransactionsNotifications = (state: RootState) => state.realEstateTransactions?.notifications || [];
export const selectRealEstateTransactionsPagination = (state: RootState) => state.realEstateTransactions?.pagination;

export default realEstateTransactionsSlice.reducer;
