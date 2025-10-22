/**
 * WF-SLI-001 | aviation-lawSlice.ts - AviationLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface AviationLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface AviationLawState {
  items: AviationLawItem[];
  selectedItem: AviationLawItem | null;
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

const initialState: AviationLawState = {
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
const mockAviationLawApi = {
  getItems: async (_params?: any): Promise<{ data: AviationLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'AviationLaw User 1',
          description: 'System aviation-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'AviationLaw User 2',
          description: 'Department aviation-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<AviationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `AviationLaw User ${id}`,
      description: 'Sample aviation-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<AviationLawItem>): Promise<AviationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New AviationLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<AviationLawItem>): Promise<AviationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated AviationLaw',
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
export const fetchAviationLawItems = createAsyncThunk(
  'aviation-law/fetchItems', 
  async (params?: any) => mockAviationLawApi.getItems(params)
);

export const fetchAviationLawItem = createAsyncThunk(
  'aviation-law/fetchItem', 
  async (id: string) => mockAviationLawApi.getItem(id)
);

export const createAviationLawItem = createAsyncThunk(
  'aviation-law/createItem', 
  async (data: Partial<AviationLawItem>) => mockAviationLawApi.createItem(data)
);

export const updateAviationLawItem = createAsyncThunk(
  'aviation-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<AviationLawItem> }) => mockAviationLawApi.updateItem(id, data)
);

export const deleteAviationLawItem = createAsyncThunk(
  'aviation-law/deleteItem', 
  async (id: string) => {
    await mockAviationLawApi.deleteItem(id);
    return id;
  }
);

const aviationLawSlice = createSlice({
  name: 'aviationLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<AviationLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AviationLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<AviationLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `aviation-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<AviationLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchAviationLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchAviationLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchAviationLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch aviation-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchAviationLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchAviationLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchAviationLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch aviation-law item';
      });

    // Create Item
    builder
      .addCase(createAviationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createAviationLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `aviation-law_create_${Date.now()}`,
          type: 'success',
          message: 'AviationLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createAviationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create aviation-law item';
      });

    // Update Item
    builder
      .addCase(updateAviationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateAviationLawItem.fulfilled, (state, action) => {
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
          id: `aviation-law_update_${Date.now()}`,
          type: 'success',
          message: 'AviationLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateAviationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update aviation-law item';
      });

    // Delete Item
    builder
      .addCase(deleteAviationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteAviationLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `aviation-law_delete_${Date.now()}`,
          type: 'success',
          message: 'AviationLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteAviationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete aviation-law item';
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
} = aviationLawSlice.actions;

// Selectors
export const selectAviationLawItems = (state: RootState) => state.aviationLaw?.items || [];
export const selectAviationLawItem = (state: RootState) => state.aviationLaw?.selectedItem;
export const selectAviationLawLoading = (state: RootState) => state.aviationLaw?.loading;
export const selectAviationLawError = (state: RootState) => state.aviationLaw?.error;
export const selectAviationLawFilters = (state: RootState) => state.aviationLaw?.filters || {};
export const selectAviationLawNotifications = (state: RootState) => state.aviationLaw?.notifications || [];
export const selectAviationLawPagination = (state: RootState) => state.aviationLaw?.pagination;

export default aviationLawSlice.reducer;
