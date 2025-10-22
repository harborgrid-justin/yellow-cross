/**
 * WF-SLI-001 | estate-planningSlice.ts - EstatePlanning Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface EstatePlanningItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface EstatePlanningState {
  items: EstatePlanningItem[];
  selectedItem: EstatePlanningItem | null;
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

const initialState: EstatePlanningState = {
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
const mockEstatePlanningApi = {
  getItems: async (_params?: any): Promise<{ data: EstatePlanningItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'EstatePlanning User 1',
          description: 'System estate-planningistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'EstatePlanning User 2',
          description: 'Department estate-planning',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<EstatePlanningItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `EstatePlanning User ${id}`,
      description: 'Sample estate-planning user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<EstatePlanningItem>): Promise<EstatePlanningItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New EstatePlanning',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<EstatePlanningItem>): Promise<EstatePlanningItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated EstatePlanning',
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
export const fetchEstatePlanningItems = createAsyncThunk(
  'estate-planning/fetchItems', 
  async (params?: any) => mockEstatePlanningApi.getItems(params)
);

export const fetchEstatePlanningItem = createAsyncThunk(
  'estate-planning/fetchItem', 
  async (id: string) => mockEstatePlanningApi.getItem(id)
);

export const createEstatePlanningItem = createAsyncThunk(
  'estate-planning/createItem', 
  async (data: Partial<EstatePlanningItem>) => mockEstatePlanningApi.createItem(data)
);

export const updateEstatePlanningItem = createAsyncThunk(
  'estate-planning/updateItem', 
  async ({ id, data }: { id: string; data: Partial<EstatePlanningItem> }) => mockEstatePlanningApi.updateItem(id, data)
);

export const deleteEstatePlanningItem = createAsyncThunk(
  'estate-planning/deleteItem', 
  async (id: string) => {
    await mockEstatePlanningApi.deleteItem(id);
    return id;
  }
);

const estatePlanningSlice = createSlice({
  name: 'estatePlanning',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<EstatePlanningItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EstatePlanningState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<EstatePlanningState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `estate-planning_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<EstatePlanningState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchEstatePlanningItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchEstatePlanningItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchEstatePlanningItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch estate-planning items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchEstatePlanningItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchEstatePlanningItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchEstatePlanningItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch estate-planning item';
      });

    // Create Item
    builder
      .addCase(createEstatePlanningItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createEstatePlanningItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `estate-planning_create_${Date.now()}`,
          type: 'success',
          message: 'EstatePlanning item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createEstatePlanningItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create estate-planning item';
      });

    // Update Item
    builder
      .addCase(updateEstatePlanningItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateEstatePlanningItem.fulfilled, (state, action) => {
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
          id: `estate-planning_update_${Date.now()}`,
          type: 'success',
          message: 'EstatePlanning item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateEstatePlanningItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update estate-planning item';
      });

    // Delete Item
    builder
      .addCase(deleteEstatePlanningItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteEstatePlanningItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `estate-planning_delete_${Date.now()}`,
          type: 'success',
          message: 'EstatePlanning item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteEstatePlanningItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete estate-planning item';
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
} = estatePlanningSlice.actions;

// Selectors
export const selectEstatePlanningItems = (state: RootState) => state.estatePlanning?.items || [];
export const selectEstatePlanningItem = (state: RootState) => state.estatePlanning?.selectedItem;
export const selectEstatePlanningLoading = (state: RootState) => state.estatePlanning?.loading;
export const selectEstatePlanningError = (state: RootState) => state.estatePlanning?.error;
export const selectEstatePlanningFilters = (state: RootState) => state.estatePlanning?.filters || {};
export const selectEstatePlanningNotifications = (state: RootState) => state.estatePlanning?.notifications || [];
export const selectEstatePlanningPagination = (state: RootState) => state.estatePlanning?.pagination;

export default estatePlanningSlice.reducer;
