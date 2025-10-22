/**
 * WF-SLI-001 | contract-managementSlice.ts - ContractManagement Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ContractManagementItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ContractManagementState {
  items: ContractManagementItem[];
  selectedItem: ContractManagementItem | null;
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

const initialState: ContractManagementState = {
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
const mockContractManagementApi = {
  getItems: async (_params?: any): Promise<{ data: ContractManagementItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'ContractManagement User 1',
          description: 'System contract-managementistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'ContractManagement User 2',
          description: 'Department contract-management',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ContractManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `ContractManagement User ${id}`,
      description: 'Sample contract-management user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ContractManagementItem>): Promise<ContractManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New ContractManagement',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ContractManagementItem>): Promise<ContractManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated ContractManagement',
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
export const fetchContractManagementItems = createAsyncThunk(
  'contract-management/fetchItems', 
  async (params?: any) => mockContractManagementApi.getItems(params)
);

export const fetchContractManagementItem = createAsyncThunk(
  'contract-management/fetchItem', 
  async (id: string) => mockContractManagementApi.getItem(id)
);

export const createContractManagementItem = createAsyncThunk(
  'contract-management/createItem', 
  async (data: Partial<ContractManagementItem>) => mockContractManagementApi.createItem(data)
);

export const updateContractManagementItem = createAsyncThunk(
  'contract-management/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ContractManagementItem> }) => mockContractManagementApi.updateItem(id, data)
);

export const deleteContractManagementItem = createAsyncThunk(
  'contract-management/deleteItem', 
  async (id: string) => {
    await mockContractManagementApi.deleteItem(id);
    return id;
  }
);

const contractManagementSlice = createSlice({
  name: 'contractManagement',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ContractManagementItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ContractManagementState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ContractManagementState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `contract-management_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ContractManagementState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchContractManagementItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchContractManagementItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchContractManagementItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch contract-management items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchContractManagementItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchContractManagementItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchContractManagementItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch contract-management item';
      });

    // Create Item
    builder
      .addCase(createContractManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createContractManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `contract-management_create_${Date.now()}`,
          type: 'success',
          message: 'ContractManagement item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createContractManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create contract-management item';
      });

    // Update Item
    builder
      .addCase(updateContractManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateContractManagementItem.fulfilled, (state, action) => {
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
          id: `contract-management_update_${Date.now()}`,
          type: 'success',
          message: 'ContractManagement item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateContractManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update contract-management item';
      });

    // Delete Item
    builder
      .addCase(deleteContractManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteContractManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `contract-management_delete_${Date.now()}`,
          type: 'success',
          message: 'ContractManagement item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteContractManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete contract-management item';
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
} = contractManagementSlice.actions;

// Selectors
export const selectContractManagementItems = (state: RootState) => state.contractManagement?.items || [];
export const selectContractManagementItem = (state: RootState) => state.contractManagement?.selectedItem;
export const selectContractManagementLoading = (state: RootState) => state.contractManagement?.loading;
export const selectContractManagementError = (state: RootState) => state.contractManagement?.error;
export const selectContractManagementFilters = (state: RootState) => state.contractManagement?.filters || {};
export const selectContractManagementNotifications = (state: RootState) => state.contractManagement?.notifications || [];
export const selectContractManagementPagination = (state: RootState) => state.contractManagement?.pagination;

export default contractManagementSlice.reducer;
