/**
 * WF-SLI-001 | environmental-lawSlice.ts - EnvironmentalLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface EnvironmentalLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface EnvironmentalLawState {
  items: EnvironmentalLawItem[];
  selectedItem: EnvironmentalLawItem | null;
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

const initialState: EnvironmentalLawState = {
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
const mockEnvironmentalLawApi = {
  getItems: async (_params?: any): Promise<{ data: EnvironmentalLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'EnvironmentalLaw User 1',
          description: 'System environmental-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'EnvironmentalLaw User 2',
          description: 'Department environmental-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<EnvironmentalLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `EnvironmentalLaw User ${id}`,
      description: 'Sample environmental-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<EnvironmentalLawItem>): Promise<EnvironmentalLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New EnvironmentalLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<EnvironmentalLawItem>): Promise<EnvironmentalLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated EnvironmentalLaw',
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
export const fetchEnvironmentalLawItems = createAsyncThunk(
  'environmental-law/fetchItems', 
  async (params?: any) => mockEnvironmentalLawApi.getItems(params)
);

export const fetchEnvironmentalLawItem = createAsyncThunk(
  'environmental-law/fetchItem', 
  async (id: string) => mockEnvironmentalLawApi.getItem(id)
);

export const createEnvironmentalLawItem = createAsyncThunk(
  'environmental-law/createItem', 
  async (data: Partial<EnvironmentalLawItem>) => mockEnvironmentalLawApi.createItem(data)
);

export const updateEnvironmentalLawItem = createAsyncThunk(
  'environmental-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<EnvironmentalLawItem> }) => mockEnvironmentalLawApi.updateItem(id, data)
);

export const deleteEnvironmentalLawItem = createAsyncThunk(
  'environmental-law/deleteItem', 
  async (id: string) => {
    await mockEnvironmentalLawApi.deleteItem(id);
    return id;
  }
);

const environmentalLawSlice = createSlice({
  name: 'environmentalLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<EnvironmentalLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EnvironmentalLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<EnvironmentalLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `environmental-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<EnvironmentalLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchEnvironmentalLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchEnvironmentalLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchEnvironmentalLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch environmental-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchEnvironmentalLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchEnvironmentalLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchEnvironmentalLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch environmental-law item';
      });

    // Create Item
    builder
      .addCase(createEnvironmentalLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createEnvironmentalLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `environmental-law_create_${Date.now()}`,
          type: 'success',
          message: 'EnvironmentalLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createEnvironmentalLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create environmental-law item';
      });

    // Update Item
    builder
      .addCase(updateEnvironmentalLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateEnvironmentalLawItem.fulfilled, (state, action) => {
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
          id: `environmental-law_update_${Date.now()}`,
          type: 'success',
          message: 'EnvironmentalLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateEnvironmentalLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update environmental-law item';
      });

    // Delete Item
    builder
      .addCase(deleteEnvironmentalLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteEnvironmentalLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `environmental-law_delete_${Date.now()}`,
          type: 'success',
          message: 'EnvironmentalLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteEnvironmentalLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete environmental-law item';
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
} = environmentalLawSlice.actions;

// Selectors
export const selectEnvironmentalLawItems = (state: RootState) => state.environmentalLaw?.items || [];
export const selectEnvironmentalLawItem = (state: RootState) => state.environmentalLaw?.selectedItem;
export const selectEnvironmentalLawLoading = (state: RootState) => state.environmentalLaw?.loading;
export const selectEnvironmentalLawError = (state: RootState) => state.environmentalLaw?.error;
export const selectEnvironmentalLawFilters = (state: RootState) => state.environmentalLaw?.filters || {};
export const selectEnvironmentalLawNotifications = (state: RootState) => state.environmentalLaw?.notifications || [];
export const selectEnvironmentalLawPagination = (state: RootState) => state.environmentalLaw?.pagination;

export default environmentalLawSlice.reducer;
