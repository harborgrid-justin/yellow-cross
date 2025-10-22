/**
 * WF-SLI-001 | mediation-adrSlice.ts - MediationAdr Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface MediationAdrItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface MediationAdrState {
  items: MediationAdrItem[];
  selectedItem: MediationAdrItem | null;
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

const initialState: MediationAdrState = {
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
const mockMediationAdrApi = {
  getItems: async (_params?: any): Promise<{ data: MediationAdrItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'MediationAdr User 1',
          description: 'System mediation-adristrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'MediationAdr User 2',
          description: 'Department mediation-adr',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<MediationAdrItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `MediationAdr User ${id}`,
      description: 'Sample mediation-adr user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<MediationAdrItem>): Promise<MediationAdrItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New MediationAdr',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<MediationAdrItem>): Promise<MediationAdrItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated MediationAdr',
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
export const fetchMediationAdrItems = createAsyncThunk(
  'mediation-adr/fetchItems', 
  async (params?: any) => mockMediationAdrApi.getItems(params)
);

export const fetchMediationAdrItem = createAsyncThunk(
  'mediation-adr/fetchItem', 
  async (id: string) => mockMediationAdrApi.getItem(id)
);

export const createMediationAdrItem = createAsyncThunk(
  'mediation-adr/createItem', 
  async (data: Partial<MediationAdrItem>) => mockMediationAdrApi.createItem(data)
);

export const updateMediationAdrItem = createAsyncThunk(
  'mediation-adr/updateItem', 
  async ({ id, data }: { id: string; data: Partial<MediationAdrItem> }) => mockMediationAdrApi.updateItem(id, data)
);

export const deleteMediationAdrItem = createAsyncThunk(
  'mediation-adr/deleteItem', 
  async (id: string) => {
    await mockMediationAdrApi.deleteItem(id);
    return id;
  }
);

const mediationAdrSlice = createSlice({
  name: 'mediationAdr',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<MediationAdrItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MediationAdrState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<MediationAdrState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `mediation-adr_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<MediationAdrState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchMediationAdrItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchMediationAdrItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchMediationAdrItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch mediation-adr items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchMediationAdrItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchMediationAdrItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchMediationAdrItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch mediation-adr item';
      });

    // Create Item
    builder
      .addCase(createMediationAdrItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createMediationAdrItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `mediation-adr_create_${Date.now()}`,
          type: 'success',
          message: 'MediationAdr item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createMediationAdrItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create mediation-adr item';
      });

    // Update Item
    builder
      .addCase(updateMediationAdrItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateMediationAdrItem.fulfilled, (state, action) => {
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
          id: `mediation-adr_update_${Date.now()}`,
          type: 'success',
          message: 'MediationAdr item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateMediationAdrItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update mediation-adr item';
      });

    // Delete Item
    builder
      .addCase(deleteMediationAdrItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteMediationAdrItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `mediation-adr_delete_${Date.now()}`,
          type: 'success',
          message: 'MediationAdr item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteMediationAdrItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete mediation-adr item';
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
} = mediationAdrSlice.actions;

// Selectors
export const selectMediationAdrItems = (state: RootState) => state.mediationAdr?.items || [];
export const selectMediationAdrItem = (state: RootState) => state.mediationAdr?.selectedItem;
export const selectMediationAdrLoading = (state: RootState) => state.mediationAdr?.loading;
export const selectMediationAdrError = (state: RootState) => state.mediationAdr?.error;
export const selectMediationAdrFilters = (state: RootState) => state.mediationAdr?.filters || {};
export const selectMediationAdrNotifications = (state: RootState) => state.mediationAdr?.notifications || [];
export const selectMediationAdrPagination = (state: RootState) => state.mediationAdr?.pagination;

export default mediationAdrSlice.reducer;
