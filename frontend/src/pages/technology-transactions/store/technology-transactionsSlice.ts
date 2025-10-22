/**
 * WF-SLI-001 | technology-transactionsSlice.ts - TechnologyTransactions Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface TechnologyTransactionsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface TechnologyTransactionsState {
  items: TechnologyTransactionsItem[];
  selectedItem: TechnologyTransactionsItem | null;
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

const initialState: TechnologyTransactionsState = {
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
const mockTechnologyTransactionsApi = {
  getItems: async (_params?: any): Promise<{ data: TechnologyTransactionsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'TechnologyTransactions User 1',
          description: 'System technology-transactionsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'TechnologyTransactions User 2',
          description: 'Department technology-transactions',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<TechnologyTransactionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `TechnologyTransactions User ${id}`,
      description: 'Sample technology-transactions user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<TechnologyTransactionsItem>): Promise<TechnologyTransactionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New TechnologyTransactions',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<TechnologyTransactionsItem>): Promise<TechnologyTransactionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated TechnologyTransactions',
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
export const fetchTechnologyTransactionsItems = createAsyncThunk(
  'technology-transactions/fetchItems', 
  async (params?: any) => mockTechnologyTransactionsApi.getItems(params)
);

export const fetchTechnologyTransactionsItem = createAsyncThunk(
  'technology-transactions/fetchItem', 
  async (id: string) => mockTechnologyTransactionsApi.getItem(id)
);

export const createTechnologyTransactionsItem = createAsyncThunk(
  'technology-transactions/createItem', 
  async (data: Partial<TechnologyTransactionsItem>) => mockTechnologyTransactionsApi.createItem(data)
);

export const updateTechnologyTransactionsItem = createAsyncThunk(
  'technology-transactions/updateItem', 
  async ({ id, data }: { id: string; data: Partial<TechnologyTransactionsItem> }) => mockTechnologyTransactionsApi.updateItem(id, data)
);

export const deleteTechnologyTransactionsItem = createAsyncThunk(
  'technology-transactions/deleteItem', 
  async (id: string) => {
    await mockTechnologyTransactionsApi.deleteItem(id);
    return id;
  }
);

const technologyTransactionsSlice = createSlice({
  name: 'technologyTransactions',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<TechnologyTransactionsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TechnologyTransactionsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<TechnologyTransactionsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `technology-transactions_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<TechnologyTransactionsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchTechnologyTransactionsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchTechnologyTransactionsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchTechnologyTransactionsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch technology-transactions items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchTechnologyTransactionsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchTechnologyTransactionsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchTechnologyTransactionsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch technology-transactions item';
      });

    // Create Item
    builder
      .addCase(createTechnologyTransactionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createTechnologyTransactionsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `technology-transactions_create_${Date.now()}`,
          type: 'success',
          message: 'TechnologyTransactions item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createTechnologyTransactionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create technology-transactions item';
      });

    // Update Item
    builder
      .addCase(updateTechnologyTransactionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateTechnologyTransactionsItem.fulfilled, (state, action) => {
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
          id: `technology-transactions_update_${Date.now()}`,
          type: 'success',
          message: 'TechnologyTransactions item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateTechnologyTransactionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update technology-transactions item';
      });

    // Delete Item
    builder
      .addCase(deleteTechnologyTransactionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteTechnologyTransactionsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `technology-transactions_delete_${Date.now()}`,
          type: 'success',
          message: 'TechnologyTransactions item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteTechnologyTransactionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete technology-transactions item';
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
} = technologyTransactionsSlice.actions;

// Selectors
export const selectTechnologyTransactionsItems = (state: RootState) => state.technologyTransactions?.items || [];
export const selectTechnologyTransactionsItem = (state: RootState) => state.technologyTransactions?.selectedItem;
export const selectTechnologyTransactionsLoading = (state: RootState) => state.technologyTransactions?.loading;
export const selectTechnologyTransactionsError = (state: RootState) => state.technologyTransactions?.error;
export const selectTechnologyTransactionsFilters = (state: RootState) => state.technologyTransactions?.filters || {};
export const selectTechnologyTransactionsNotifications = (state: RootState) => state.technologyTransactions?.notifications || [];
export const selectTechnologyTransactionsPagination = (state: RootState) => state.technologyTransactions?.pagination;

export default technologyTransactionsSlice.reducer;
