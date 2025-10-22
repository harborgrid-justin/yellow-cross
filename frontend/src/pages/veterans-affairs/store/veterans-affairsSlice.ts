/**
 * WF-SLI-001 | veterans-affairsSlice.ts - VeteransAffairs Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface VeteransAffairsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface VeteransAffairsState {
  items: VeteransAffairsItem[];
  selectedItem: VeteransAffairsItem | null;
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

const initialState: VeteransAffairsState = {
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
const mockVeteransAffairsApi = {
  getItems: async (_params?: any): Promise<{ data: VeteransAffairsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'VeteransAffairs User 1',
          description: 'System veterans-affairsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'VeteransAffairs User 2',
          description: 'Department veterans-affairs',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<VeteransAffairsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `VeteransAffairs User ${id}`,
      description: 'Sample veterans-affairs user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<VeteransAffairsItem>): Promise<VeteransAffairsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New VeteransAffairs',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<VeteransAffairsItem>): Promise<VeteransAffairsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated VeteransAffairs',
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
export const fetchVeteransAffairsItems = createAsyncThunk(
  'veterans-affairs/fetchItems', 
  async (params?: any) => mockVeteransAffairsApi.getItems(params)
);

export const fetchVeteransAffairsItem = createAsyncThunk(
  'veterans-affairs/fetchItem', 
  async (id: string) => mockVeteransAffairsApi.getItem(id)
);

export const createVeteransAffairsItem = createAsyncThunk(
  'veterans-affairs/createItem', 
  async (data: Partial<VeteransAffairsItem>) => mockVeteransAffairsApi.createItem(data)
);

export const updateVeteransAffairsItem = createAsyncThunk(
  'veterans-affairs/updateItem', 
  async ({ id, data }: { id: string; data: Partial<VeteransAffairsItem> }) => mockVeteransAffairsApi.updateItem(id, data)
);

export const deleteVeteransAffairsItem = createAsyncThunk(
  'veterans-affairs/deleteItem', 
  async (id: string) => {
    await mockVeteransAffairsApi.deleteItem(id);
    return id;
  }
);

const veteransAffairsSlice = createSlice({
  name: 'veteransAffairs',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<VeteransAffairsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<VeteransAffairsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<VeteransAffairsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `veterans-affairs_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<VeteransAffairsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchVeteransAffairsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchVeteransAffairsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchVeteransAffairsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch veterans-affairs items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchVeteransAffairsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchVeteransAffairsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchVeteransAffairsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch veterans-affairs item';
      });

    // Create Item
    builder
      .addCase(createVeteransAffairsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createVeteransAffairsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `veterans-affairs_create_${Date.now()}`,
          type: 'success',
          message: 'VeteransAffairs item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createVeteransAffairsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create veterans-affairs item';
      });

    // Update Item
    builder
      .addCase(updateVeteransAffairsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateVeteransAffairsItem.fulfilled, (state, action) => {
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
          id: `veterans-affairs_update_${Date.now()}`,
          type: 'success',
          message: 'VeteransAffairs item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateVeteransAffairsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update veterans-affairs item';
      });

    // Delete Item
    builder
      .addCase(deleteVeteransAffairsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteVeteransAffairsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `veterans-affairs_delete_${Date.now()}`,
          type: 'success',
          message: 'VeteransAffairs item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteVeteransAffairsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete veterans-affairs item';
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
} = veteransAffairsSlice.actions;

// Selectors
export const selectVeteransAffairsItems = (state: RootState) => state.veteransAffairs?.items || [];
export const selectVeteransAffairsItem = (state: RootState) => state.veteransAffairs?.selectedItem;
export const selectVeteransAffairsLoading = (state: RootState) => state.veteransAffairs?.loading;
export const selectVeteransAffairsError = (state: RootState) => state.veteransAffairs?.error;
export const selectVeteransAffairsFilters = (state: RootState) => state.veteransAffairs?.filters || {};
export const selectVeteransAffairsNotifications = (state: RootState) => state.veteransAffairs?.notifications || [];
export const selectVeteransAffairsPagination = (state: RootState) => state.veteransAffairs?.pagination;

export default veteransAffairsSlice.reducer;
