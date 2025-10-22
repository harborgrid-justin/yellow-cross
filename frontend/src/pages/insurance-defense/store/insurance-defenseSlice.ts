/**
 * WF-SLI-001 | insurance-defenseSlice.ts - InsuranceDefense Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface InsuranceDefenseItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface InsuranceDefenseState {
  items: InsuranceDefenseItem[];
  selectedItem: InsuranceDefenseItem | null;
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

const initialState: InsuranceDefenseState = {
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
const mockInsuranceDefenseApi = {
  getItems: async (_params?: any): Promise<{ data: InsuranceDefenseItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'InsuranceDefense User 1',
          description: 'System insurance-defenseistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'InsuranceDefense User 2',
          description: 'Department insurance-defense',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<InsuranceDefenseItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `InsuranceDefense User ${id}`,
      description: 'Sample insurance-defense user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<InsuranceDefenseItem>): Promise<InsuranceDefenseItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New InsuranceDefense',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<InsuranceDefenseItem>): Promise<InsuranceDefenseItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated InsuranceDefense',
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
export const fetchInsuranceDefenseItems = createAsyncThunk(
  'insurance-defense/fetchItems', 
  async (params?: any) => mockInsuranceDefenseApi.getItems(params)
);

export const fetchInsuranceDefenseItem = createAsyncThunk(
  'insurance-defense/fetchItem', 
  async (id: string) => mockInsuranceDefenseApi.getItem(id)
);

export const createInsuranceDefenseItem = createAsyncThunk(
  'insurance-defense/createItem', 
  async (data: Partial<InsuranceDefenseItem>) => mockInsuranceDefenseApi.createItem(data)
);

export const updateInsuranceDefenseItem = createAsyncThunk(
  'insurance-defense/updateItem', 
  async ({ id, data }: { id: string; data: Partial<InsuranceDefenseItem> }) => mockInsuranceDefenseApi.updateItem(id, data)
);

export const deleteInsuranceDefenseItem = createAsyncThunk(
  'insurance-defense/deleteItem', 
  async (id: string) => {
    await mockInsuranceDefenseApi.deleteItem(id);
    return id;
  }
);

const insuranceDefenseSlice = createSlice({
  name: 'insuranceDefense',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<InsuranceDefenseItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<InsuranceDefenseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<InsuranceDefenseState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `insurance-defense_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<InsuranceDefenseState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchInsuranceDefenseItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchInsuranceDefenseItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchInsuranceDefenseItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch insurance-defense items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchInsuranceDefenseItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchInsuranceDefenseItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchInsuranceDefenseItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch insurance-defense item';
      });

    // Create Item
    builder
      .addCase(createInsuranceDefenseItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createInsuranceDefenseItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `insurance-defense_create_${Date.now()}`,
          type: 'success',
          message: 'InsuranceDefense item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createInsuranceDefenseItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create insurance-defense item';
      });

    // Update Item
    builder
      .addCase(updateInsuranceDefenseItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateInsuranceDefenseItem.fulfilled, (state, action) => {
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
          id: `insurance-defense_update_${Date.now()}`,
          type: 'success',
          message: 'InsuranceDefense item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateInsuranceDefenseItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update insurance-defense item';
      });

    // Delete Item
    builder
      .addCase(deleteInsuranceDefenseItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteInsuranceDefenseItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `insurance-defense_delete_${Date.now()}`,
          type: 'success',
          message: 'InsuranceDefense item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteInsuranceDefenseItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete insurance-defense item';
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
} = insuranceDefenseSlice.actions;

// Selectors
export const selectInsuranceDefenseItems = (state: RootState) => state.insuranceDefense?.items || [];
export const selectInsuranceDefenseItem = (state: RootState) => state.insuranceDefense?.selectedItem;
export const selectInsuranceDefenseLoading = (state: RootState) => state.insuranceDefense?.loading;
export const selectInsuranceDefenseError = (state: RootState) => state.insuranceDefense?.error;
export const selectInsuranceDefenseFilters = (state: RootState) => state.insuranceDefense?.filters || {};
export const selectInsuranceDefenseNotifications = (state: RootState) => state.insuranceDefense?.notifications || [];
export const selectInsuranceDefensePagination = (state: RootState) => state.insuranceDefense?.pagination;

export default insuranceDefenseSlice.reducer;
