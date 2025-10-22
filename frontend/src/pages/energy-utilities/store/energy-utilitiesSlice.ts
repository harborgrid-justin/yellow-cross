/**
 * WF-SLI-001 | energy-utilitiesSlice.ts - EnergyUtilities Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface EnergyUtilitiesItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface EnergyUtilitiesState {
  items: EnergyUtilitiesItem[];
  selectedItem: EnergyUtilitiesItem | null;
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

const initialState: EnergyUtilitiesState = {
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
const mockEnergyUtilitiesApi = {
  getItems: async (_params?: any): Promise<{ data: EnergyUtilitiesItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'EnergyUtilities User 1',
          description: 'System energy-utilitiesistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'EnergyUtilities User 2',
          description: 'Department energy-utilities',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<EnergyUtilitiesItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `EnergyUtilities User ${id}`,
      description: 'Sample energy-utilities user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<EnergyUtilitiesItem>): Promise<EnergyUtilitiesItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New EnergyUtilities',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<EnergyUtilitiesItem>): Promise<EnergyUtilitiesItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated EnergyUtilities',
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
export const fetchEnergyUtilitiesItems = createAsyncThunk(
  'energy-utilities/fetchItems', 
  async (params?: any) => mockEnergyUtilitiesApi.getItems(params)
);

export const fetchEnergyUtilitiesItem = createAsyncThunk(
  'energy-utilities/fetchItem', 
  async (id: string) => mockEnergyUtilitiesApi.getItem(id)
);

export const createEnergyUtilitiesItem = createAsyncThunk(
  'energy-utilities/createItem', 
  async (data: Partial<EnergyUtilitiesItem>) => mockEnergyUtilitiesApi.createItem(data)
);

export const updateEnergyUtilitiesItem = createAsyncThunk(
  'energy-utilities/updateItem', 
  async ({ id, data }: { id: string; data: Partial<EnergyUtilitiesItem> }) => mockEnergyUtilitiesApi.updateItem(id, data)
);

export const deleteEnergyUtilitiesItem = createAsyncThunk(
  'energy-utilities/deleteItem', 
  async (id: string) => {
    await mockEnergyUtilitiesApi.deleteItem(id);
    return id;
  }
);

const energyUtilitiesSlice = createSlice({
  name: 'energyUtilities',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<EnergyUtilitiesItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EnergyUtilitiesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<EnergyUtilitiesState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `energy-utilities_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<EnergyUtilitiesState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchEnergyUtilitiesItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchEnergyUtilitiesItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchEnergyUtilitiesItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch energy-utilities items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchEnergyUtilitiesItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchEnergyUtilitiesItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchEnergyUtilitiesItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch energy-utilities item';
      });

    // Create Item
    builder
      .addCase(createEnergyUtilitiesItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createEnergyUtilitiesItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `energy-utilities_create_${Date.now()}`,
          type: 'success',
          message: 'EnergyUtilities item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createEnergyUtilitiesItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create energy-utilities item';
      });

    // Update Item
    builder
      .addCase(updateEnergyUtilitiesItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateEnergyUtilitiesItem.fulfilled, (state, action) => {
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
          id: `energy-utilities_update_${Date.now()}`,
          type: 'success',
          message: 'EnergyUtilities item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateEnergyUtilitiesItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update energy-utilities item';
      });

    // Delete Item
    builder
      .addCase(deleteEnergyUtilitiesItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteEnergyUtilitiesItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `energy-utilities_delete_${Date.now()}`,
          type: 'success',
          message: 'EnergyUtilities item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteEnergyUtilitiesItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete energy-utilities item';
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
} = energyUtilitiesSlice.actions;

// Selectors
export const selectEnergyUtilitiesItems = (state: RootState) => state.energyUtilities?.items || [];
export const selectEnergyUtilitiesItem = (state: RootState) => state.energyUtilities?.selectedItem;
export const selectEnergyUtilitiesLoading = (state: RootState) => state.energyUtilities?.loading;
export const selectEnergyUtilitiesError = (state: RootState) => state.energyUtilities?.error;
export const selectEnergyUtilitiesFilters = (state: RootState) => state.energyUtilities?.filters || {};
export const selectEnergyUtilitiesNotifications = (state: RootState) => state.energyUtilities?.notifications || [];
export const selectEnergyUtilitiesPagination = (state: RootState) => state.energyUtilities?.pagination;

export default energyUtilitiesSlice.reducer;
