/**
 * WF-SLI-001 | municipal-lawSlice.ts - MunicipalLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface MunicipalLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface MunicipalLawState {
  items: MunicipalLawItem[];
  selectedItem: MunicipalLawItem | null;
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

const initialState: MunicipalLawState = {
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
const mockMunicipalLawApi = {
  getItems: async (_params?: any): Promise<{ data: MunicipalLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'MunicipalLaw User 1',
          description: 'System municipal-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'MunicipalLaw User 2',
          description: 'Department municipal-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<MunicipalLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `MunicipalLaw User ${id}`,
      description: 'Sample municipal-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<MunicipalLawItem>): Promise<MunicipalLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New MunicipalLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<MunicipalLawItem>): Promise<MunicipalLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated MunicipalLaw',
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
export const fetchMunicipalLawItems = createAsyncThunk(
  'municipal-law/fetchItems', 
  async (params?: any) => mockMunicipalLawApi.getItems(params)
);

export const fetchMunicipalLawItem = createAsyncThunk(
  'municipal-law/fetchItem', 
  async (id: string) => mockMunicipalLawApi.getItem(id)
);

export const createMunicipalLawItem = createAsyncThunk(
  'municipal-law/createItem', 
  async (data: Partial<MunicipalLawItem>) => mockMunicipalLawApi.createItem(data)
);

export const updateMunicipalLawItem = createAsyncThunk(
  'municipal-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<MunicipalLawItem> }) => mockMunicipalLawApi.updateItem(id, data)
);

export const deleteMunicipalLawItem = createAsyncThunk(
  'municipal-law/deleteItem', 
  async (id: string) => {
    await mockMunicipalLawApi.deleteItem(id);
    return id;
  }
);

const municipalLawSlice = createSlice({
  name: 'municipalLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<MunicipalLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MunicipalLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<MunicipalLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `municipal-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<MunicipalLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchMunicipalLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchMunicipalLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchMunicipalLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch municipal-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchMunicipalLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchMunicipalLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchMunicipalLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch municipal-law item';
      });

    // Create Item
    builder
      .addCase(createMunicipalLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createMunicipalLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `municipal-law_create_${Date.now()}`,
          type: 'success',
          message: 'MunicipalLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createMunicipalLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create municipal-law item';
      });

    // Update Item
    builder
      .addCase(updateMunicipalLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateMunicipalLawItem.fulfilled, (state, action) => {
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
          id: `municipal-law_update_${Date.now()}`,
          type: 'success',
          message: 'MunicipalLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateMunicipalLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update municipal-law item';
      });

    // Delete Item
    builder
      .addCase(deleteMunicipalLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteMunicipalLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `municipal-law_delete_${Date.now()}`,
          type: 'success',
          message: 'MunicipalLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteMunicipalLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete municipal-law item';
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
} = municipalLawSlice.actions;

// Selectors
export const selectMunicipalLawItems = (state: RootState) => state.municipalLaw?.items || [];
export const selectMunicipalLawItem = (state: RootState) => state.municipalLaw?.selectedItem;
export const selectMunicipalLawLoading = (state: RootState) => state.municipalLaw?.loading;
export const selectMunicipalLawError = (state: RootState) => state.municipalLaw?.error;
export const selectMunicipalLawFilters = (state: RootState) => state.municipalLaw?.filters || {};
export const selectMunicipalLawNotifications = (state: RootState) => state.municipalLaw?.notifications || [];
export const selectMunicipalLawPagination = (state: RootState) => state.municipalLaw?.pagination;

export default municipalLawSlice.reducer;
