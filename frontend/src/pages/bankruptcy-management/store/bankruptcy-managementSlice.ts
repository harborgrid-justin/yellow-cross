/**
 * WF-SLI-001 | bankruptcy-managementSlice.ts - BankruptcyManagement Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface BankruptcyManagementItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface BankruptcyManagementState {
  items: BankruptcyManagementItem[];
  selectedItem: BankruptcyManagementItem | null;
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

const initialState: BankruptcyManagementState = {
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
const mockBankruptcyManagementApi = {
  getItems: async (_params?: any): Promise<{ data: BankruptcyManagementItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'BankruptcyManagement User 1',
          description: 'System bankruptcy-managementistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'BankruptcyManagement User 2',
          description: 'Department bankruptcy-management',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<BankruptcyManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `BankruptcyManagement User ${id}`,
      description: 'Sample bankruptcy-management user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<BankruptcyManagementItem>): Promise<BankruptcyManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New BankruptcyManagement',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<BankruptcyManagementItem>): Promise<BankruptcyManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated BankruptcyManagement',
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
export const fetchBankruptcyManagementItems = createAsyncThunk(
  'bankruptcy-management/fetchItems', 
  async (params?: any) => mockBankruptcyManagementApi.getItems(params)
);

export const fetchBankruptcyManagementItem = createAsyncThunk(
  'bankruptcy-management/fetchItem', 
  async (id: string) => mockBankruptcyManagementApi.getItem(id)
);

export const createBankruptcyManagementItem = createAsyncThunk(
  'bankruptcy-management/createItem', 
  async (data: Partial<BankruptcyManagementItem>) => mockBankruptcyManagementApi.createItem(data)
);

export const updateBankruptcyManagementItem = createAsyncThunk(
  'bankruptcy-management/updateItem', 
  async ({ id, data }: { id: string; data: Partial<BankruptcyManagementItem> }) => mockBankruptcyManagementApi.updateItem(id, data)
);

export const deleteBankruptcyManagementItem = createAsyncThunk(
  'bankruptcy-management/deleteItem', 
  async (id: string) => {
    await mockBankruptcyManagementApi.deleteItem(id);
    return id;
  }
);

const bankruptcyManagementSlice = createSlice({
  name: 'bankruptcyManagement',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<BankruptcyManagementItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<BankruptcyManagementState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<BankruptcyManagementState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `bankruptcy-management_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<BankruptcyManagementState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchBankruptcyManagementItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchBankruptcyManagementItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchBankruptcyManagementItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch bankruptcy-management items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchBankruptcyManagementItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchBankruptcyManagementItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchBankruptcyManagementItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch bankruptcy-management item';
      });

    // Create Item
    builder
      .addCase(createBankruptcyManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createBankruptcyManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `bankruptcy-management_create_${Date.now()}`,
          type: 'success',
          message: 'BankruptcyManagement item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createBankruptcyManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create bankruptcy-management item';
      });

    // Update Item
    builder
      .addCase(updateBankruptcyManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateBankruptcyManagementItem.fulfilled, (state, action) => {
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
          id: `bankruptcy-management_update_${Date.now()}`,
          type: 'success',
          message: 'BankruptcyManagement item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateBankruptcyManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update bankruptcy-management item';
      });

    // Delete Item
    builder
      .addCase(deleteBankruptcyManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteBankruptcyManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `bankruptcy-management_delete_${Date.now()}`,
          type: 'success',
          message: 'BankruptcyManagement item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteBankruptcyManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete bankruptcy-management item';
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
} = bankruptcyManagementSlice.actions;

// Selectors
export const selectBankruptcyManagementItems = (state: RootState) => state.bankruptcyManagement?.items || [];
export const selectBankruptcyManagementItem = (state: RootState) => state.bankruptcyManagement?.selectedItem;
export const selectBankruptcyManagementLoading = (state: RootState) => state.bankruptcyManagement?.loading;
export const selectBankruptcyManagementError = (state: RootState) => state.bankruptcyManagement?.error;
export const selectBankruptcyManagementFilters = (state: RootState) => state.bankruptcyManagement?.filters || {};
export const selectBankruptcyManagementNotifications = (state: RootState) => state.bankruptcyManagement?.notifications || [];
export const selectBankruptcyManagementPagination = (state: RootState) => state.bankruptcyManagement?.pagination;

export default bankruptcyManagementSlice.reducer;
