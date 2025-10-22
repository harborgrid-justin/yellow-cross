/**
 * WF-SLI-001 | government-contractsSlice.ts - GovernmentContracts Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface GovernmentContractsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface GovernmentContractsState {
  items: GovernmentContractsItem[];
  selectedItem: GovernmentContractsItem | null;
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

const initialState: GovernmentContractsState = {
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
const mockGovernmentContractsApi = {
  getItems: async (_params?: any): Promise<{ data: GovernmentContractsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'GovernmentContracts User 1',
          description: 'System government-contractsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'GovernmentContracts User 2',
          description: 'Department government-contracts',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<GovernmentContractsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `GovernmentContracts User ${id}`,
      description: 'Sample government-contracts user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<GovernmentContractsItem>): Promise<GovernmentContractsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New GovernmentContracts',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<GovernmentContractsItem>): Promise<GovernmentContractsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated GovernmentContracts',
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
export const fetchGovernmentContractsItems = createAsyncThunk(
  'government-contracts/fetchItems', 
  async (params?: any) => mockGovernmentContractsApi.getItems(params)
);

export const fetchGovernmentContractsItem = createAsyncThunk(
  'government-contracts/fetchItem', 
  async (id: string) => mockGovernmentContractsApi.getItem(id)
);

export const createGovernmentContractsItem = createAsyncThunk(
  'government-contracts/createItem', 
  async (data: Partial<GovernmentContractsItem>) => mockGovernmentContractsApi.createItem(data)
);

export const updateGovernmentContractsItem = createAsyncThunk(
  'government-contracts/updateItem', 
  async ({ id, data }: { id: string; data: Partial<GovernmentContractsItem> }) => mockGovernmentContractsApi.updateItem(id, data)
);

export const deleteGovernmentContractsItem = createAsyncThunk(
  'government-contracts/deleteItem', 
  async (id: string) => {
    await mockGovernmentContractsApi.deleteItem(id);
    return id;
  }
);

const governmentContractsSlice = createSlice({
  name: 'governmentContracts',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<GovernmentContractsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<GovernmentContractsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<GovernmentContractsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `government-contracts_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<GovernmentContractsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchGovernmentContractsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchGovernmentContractsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchGovernmentContractsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch government-contracts items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchGovernmentContractsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchGovernmentContractsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchGovernmentContractsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch government-contracts item';
      });

    // Create Item
    builder
      .addCase(createGovernmentContractsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createGovernmentContractsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `government-contracts_create_${Date.now()}`,
          type: 'success',
          message: 'GovernmentContracts item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createGovernmentContractsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create government-contracts item';
      });

    // Update Item
    builder
      .addCase(updateGovernmentContractsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateGovernmentContractsItem.fulfilled, (state, action) => {
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
          id: `government-contracts_update_${Date.now()}`,
          type: 'success',
          message: 'GovernmentContracts item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateGovernmentContractsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update government-contracts item';
      });

    // Delete Item
    builder
      .addCase(deleteGovernmentContractsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteGovernmentContractsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `government-contracts_delete_${Date.now()}`,
          type: 'success',
          message: 'GovernmentContracts item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteGovernmentContractsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete government-contracts item';
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
} = governmentContractsSlice.actions;

// Selectors
export const selectGovernmentContractsItems = (state: RootState) => state.governmentContracts?.items || [];
export const selectGovernmentContractsItem = (state: RootState) => state.governmentContracts?.selectedItem;
export const selectGovernmentContractsLoading = (state: RootState) => state.governmentContracts?.loading;
export const selectGovernmentContractsError = (state: RootState) => state.governmentContracts?.error;
export const selectGovernmentContractsFilters = (state: RootState) => state.governmentContracts?.filters || {};
export const selectGovernmentContractsNotifications = (state: RootState) => state.governmentContracts?.notifications || [];
export const selectGovernmentContractsPagination = (state: RootState) => state.governmentContracts?.pagination;

export default governmentContractsSlice.reducer;
