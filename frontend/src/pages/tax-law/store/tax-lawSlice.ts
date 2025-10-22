/**
 * WF-SLI-001 | tax-lawSlice.ts - TaxLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface TaxLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface TaxLawState {
  items: TaxLawItem[];
  selectedItem: TaxLawItem | null;
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

const initialState: TaxLawState = {
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
const mockTaxLawApi = {
  getItems: async (_params?: any): Promise<{ data: TaxLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'TaxLaw User 1',
          description: 'System tax-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'TaxLaw User 2',
          description: 'Department tax-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<TaxLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `TaxLaw User ${id}`,
      description: 'Sample tax-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<TaxLawItem>): Promise<TaxLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New TaxLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<TaxLawItem>): Promise<TaxLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated TaxLaw',
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
export const fetchTaxLawItems = createAsyncThunk(
  'tax-law/fetchItems', 
  async (params?: any) => mockTaxLawApi.getItems(params)
);

export const fetchTaxLawItem = createAsyncThunk(
  'tax-law/fetchItem', 
  async (id: string) => mockTaxLawApi.getItem(id)
);

export const createTaxLawItem = createAsyncThunk(
  'tax-law/createItem', 
  async (data: Partial<TaxLawItem>) => mockTaxLawApi.createItem(data)
);

export const updateTaxLawItem = createAsyncThunk(
  'tax-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<TaxLawItem> }) => mockTaxLawApi.updateItem(id, data)
);

export const deleteTaxLawItem = createAsyncThunk(
  'tax-law/deleteItem', 
  async (id: string) => {
    await mockTaxLawApi.deleteItem(id);
    return id;
  }
);

const taxLawSlice = createSlice({
  name: 'taxLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<TaxLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TaxLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<TaxLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `tax-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<TaxLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchTaxLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchTaxLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchTaxLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch tax-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchTaxLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchTaxLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchTaxLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch tax-law item';
      });

    // Create Item
    builder
      .addCase(createTaxLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createTaxLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `tax-law_create_${Date.now()}`,
          type: 'success',
          message: 'TaxLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createTaxLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create tax-law item';
      });

    // Update Item
    builder
      .addCase(updateTaxLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateTaxLawItem.fulfilled, (state, action) => {
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
          id: `tax-law_update_${Date.now()}`,
          type: 'success',
          message: 'TaxLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateTaxLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update tax-law item';
      });

    // Delete Item
    builder
      .addCase(deleteTaxLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteTaxLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `tax-law_delete_${Date.now()}`,
          type: 'success',
          message: 'TaxLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteTaxLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete tax-law item';
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
} = taxLawSlice.actions;

// Selectors
export const selectTaxLawItems = (state: RootState) => state.taxLaw?.items || [];
export const selectTaxLawItem = (state: RootState) => state.taxLaw?.selectedItem;
export const selectTaxLawLoading = (state: RootState) => state.taxLaw?.loading;
export const selectTaxLawError = (state: RootState) => state.taxLaw?.error;
export const selectTaxLawFilters = (state: RootState) => state.taxLaw?.filters || {};
export const selectTaxLawNotifications = (state: RootState) => state.taxLaw?.notifications || [];
export const selectTaxLawPagination = (state: RootState) => state.taxLaw?.pagination;

export default taxLawSlice.reducer;
