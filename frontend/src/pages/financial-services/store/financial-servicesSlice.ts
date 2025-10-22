/**
 * WF-SLI-001 | financial-servicesSlice.ts - FinancialServices Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface FinancialServicesItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface FinancialServicesState {
  items: FinancialServicesItem[];
  selectedItem: FinancialServicesItem | null;
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

const initialState: FinancialServicesState = {
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
const mockFinancialServicesApi = {
  getItems: async (_params?: any): Promise<{ data: FinancialServicesItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'FinancialServices User 1',
          description: 'System financial-servicesistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'FinancialServices User 2',
          description: 'Department financial-services',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<FinancialServicesItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `FinancialServices User ${id}`,
      description: 'Sample financial-services user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<FinancialServicesItem>): Promise<FinancialServicesItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New FinancialServices',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<FinancialServicesItem>): Promise<FinancialServicesItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated FinancialServices',
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
export const fetchFinancialServicesItems = createAsyncThunk(
  'financial-services/fetchItems', 
  async (params?: any) => mockFinancialServicesApi.getItems(params)
);

export const fetchFinancialServicesItem = createAsyncThunk(
  'financial-services/fetchItem', 
  async (id: string) => mockFinancialServicesApi.getItem(id)
);

export const createFinancialServicesItem = createAsyncThunk(
  'financial-services/createItem', 
  async (data: Partial<FinancialServicesItem>) => mockFinancialServicesApi.createItem(data)
);

export const updateFinancialServicesItem = createAsyncThunk(
  'financial-services/updateItem', 
  async ({ id, data }: { id: string; data: Partial<FinancialServicesItem> }) => mockFinancialServicesApi.updateItem(id, data)
);

export const deleteFinancialServicesItem = createAsyncThunk(
  'financial-services/deleteItem', 
  async (id: string) => {
    await mockFinancialServicesApi.deleteItem(id);
    return id;
  }
);

const financialServicesSlice = createSlice({
  name: 'financialServices',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<FinancialServicesItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FinancialServicesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<FinancialServicesState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `financial-services_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<FinancialServicesState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchFinancialServicesItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchFinancialServicesItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchFinancialServicesItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch financial-services items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchFinancialServicesItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchFinancialServicesItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchFinancialServicesItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch financial-services item';
      });

    // Create Item
    builder
      .addCase(createFinancialServicesItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createFinancialServicesItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `financial-services_create_${Date.now()}`,
          type: 'success',
          message: 'FinancialServices item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createFinancialServicesItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create financial-services item';
      });

    // Update Item
    builder
      .addCase(updateFinancialServicesItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateFinancialServicesItem.fulfilled, (state, action) => {
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
          id: `financial-services_update_${Date.now()}`,
          type: 'success',
          message: 'FinancialServices item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateFinancialServicesItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update financial-services item';
      });

    // Delete Item
    builder
      .addCase(deleteFinancialServicesItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteFinancialServicesItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `financial-services_delete_${Date.now()}`,
          type: 'success',
          message: 'FinancialServices item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteFinancialServicesItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete financial-services item';
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
} = financialServicesSlice.actions;

// Selectors
export const selectFinancialServicesItems = (state: RootState) => state.financialServices?.items || [];
export const selectFinancialServicesItem = (state: RootState) => state.financialServices?.selectedItem;
export const selectFinancialServicesLoading = (state: RootState) => state.financialServices?.loading;
export const selectFinancialServicesError = (state: RootState) => state.financialServices?.error;
export const selectFinancialServicesFilters = (state: RootState) => state.financialServices?.filters || {};
export const selectFinancialServicesNotifications = (state: RootState) => state.financialServices?.notifications || [];
export const selectFinancialServicesPagination = (state: RootState) => state.financialServices?.pagination;

export default financialServicesSlice.reducer;
