/**
 * WF-SLI-001 | mergers-acquisitionsSlice.ts - MergersAcquisitions Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface MergersAcquisitionsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface MergersAcquisitionsState {
  items: MergersAcquisitionsItem[];
  selectedItem: MergersAcquisitionsItem | null;
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

const initialState: MergersAcquisitionsState = {
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
const mockMergersAcquisitionsApi = {
  getItems: async (_params?: any): Promise<{ data: MergersAcquisitionsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'MergersAcquisitions User 1',
          description: 'System mergers-acquisitionsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'MergersAcquisitions User 2',
          description: 'Department mergers-acquisitions',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<MergersAcquisitionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `MergersAcquisitions User ${id}`,
      description: 'Sample mergers-acquisitions user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<MergersAcquisitionsItem>): Promise<MergersAcquisitionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New MergersAcquisitions',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<MergersAcquisitionsItem>): Promise<MergersAcquisitionsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated MergersAcquisitions',
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
export const fetchMergersAcquisitionsItems = createAsyncThunk(
  'mergers-acquisitions/fetchItems', 
  async (params?: any) => mockMergersAcquisitionsApi.getItems(params)
);

export const fetchMergersAcquisitionsItem = createAsyncThunk(
  'mergers-acquisitions/fetchItem', 
  async (id: string) => mockMergersAcquisitionsApi.getItem(id)
);

export const createMergersAcquisitionsItem = createAsyncThunk(
  'mergers-acquisitions/createItem', 
  async (data: Partial<MergersAcquisitionsItem>) => mockMergersAcquisitionsApi.createItem(data)
);

export const updateMergersAcquisitionsItem = createAsyncThunk(
  'mergers-acquisitions/updateItem', 
  async ({ id, data }: { id: string; data: Partial<MergersAcquisitionsItem> }) => mockMergersAcquisitionsApi.updateItem(id, data)
);

export const deleteMergersAcquisitionsItem = createAsyncThunk(
  'mergers-acquisitions/deleteItem', 
  async (id: string) => {
    await mockMergersAcquisitionsApi.deleteItem(id);
    return id;
  }
);

const mergersAcquisitionsSlice = createSlice({
  name: 'mergersAcquisitions',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<MergersAcquisitionsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MergersAcquisitionsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<MergersAcquisitionsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `mergers-acquisitions_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<MergersAcquisitionsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchMergersAcquisitionsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchMergersAcquisitionsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchMergersAcquisitionsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch mergers-acquisitions items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchMergersAcquisitionsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchMergersAcquisitionsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchMergersAcquisitionsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch mergers-acquisitions item';
      });

    // Create Item
    builder
      .addCase(createMergersAcquisitionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createMergersAcquisitionsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `mergers-acquisitions_create_${Date.now()}`,
          type: 'success',
          message: 'MergersAcquisitions item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createMergersAcquisitionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create mergers-acquisitions item';
      });

    // Update Item
    builder
      .addCase(updateMergersAcquisitionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateMergersAcquisitionsItem.fulfilled, (state, action) => {
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
          id: `mergers-acquisitions_update_${Date.now()}`,
          type: 'success',
          message: 'MergersAcquisitions item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateMergersAcquisitionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update mergers-acquisitions item';
      });

    // Delete Item
    builder
      .addCase(deleteMergersAcquisitionsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteMergersAcquisitionsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `mergers-acquisitions_delete_${Date.now()}`,
          type: 'success',
          message: 'MergersAcquisitions item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteMergersAcquisitionsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete mergers-acquisitions item';
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
} = mergersAcquisitionsSlice.actions;

// Selectors
export const selectMergersAcquisitionsItems = (state: RootState) => state.mergersAcquisitions?.items || [];
export const selectMergersAcquisitionsItem = (state: RootState) => state.mergersAcquisitions?.selectedItem;
export const selectMergersAcquisitionsLoading = (state: RootState) => state.mergersAcquisitions?.loading;
export const selectMergersAcquisitionsError = (state: RootState) => state.mergersAcquisitions?.error;
export const selectMergersAcquisitionsFilters = (state: RootState) => state.mergersAcquisitions?.filters || {};
export const selectMergersAcquisitionsNotifications = (state: RootState) => state.mergersAcquisitions?.notifications || [];
export const selectMergersAcquisitionsPagination = (state: RootState) => state.mergersAcquisitions?.pagination;

export default mergersAcquisitionsSlice.reducer;
