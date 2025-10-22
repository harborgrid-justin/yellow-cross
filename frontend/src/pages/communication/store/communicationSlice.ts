/**
 * WF-SLI-001 | communicationSlice.ts - Communication Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface CommunicationItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CommunicationState {
  items: CommunicationItem[];
  selectedItem: CommunicationItem | null;
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

const initialState: CommunicationState = {
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
const mockCommunicationApi = {
  getItems: async (_params?: any): Promise<{ data: CommunicationItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'Communication User 1',
          description: 'System communicationistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Communication User 2',
          description: 'Department communication',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<CommunicationItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `Communication User ${id}`,
      description: 'Sample communication user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<CommunicationItem>): Promise<CommunicationItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New Communication',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<CommunicationItem>): Promise<CommunicationItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated Communication',
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
export const fetchCommunicationItems = createAsyncThunk(
  'communication/fetchItems', 
  async (params?: any) => mockCommunicationApi.getItems(params)
);

export const fetchCommunicationItem = createAsyncThunk(
  'communication/fetchItem', 
  async (id: string) => mockCommunicationApi.getItem(id)
);

export const createCommunicationItem = createAsyncThunk(
  'communication/createItem', 
  async (data: Partial<CommunicationItem>) => mockCommunicationApi.createItem(data)
);

export const updateCommunicationItem = createAsyncThunk(
  'communication/updateItem', 
  async ({ id, data }: { id: string; data: Partial<CommunicationItem> }) => mockCommunicationApi.updateItem(id, data)
);

export const deleteCommunicationItem = createAsyncThunk(
  'communication/deleteItem', 
  async (id: string) => {
    await mockCommunicationApi.deleteItem(id);
    return id;
  }
);

const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<CommunicationItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CommunicationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<CommunicationState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `communication_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<CommunicationState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchCommunicationItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchCommunicationItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchCommunicationItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch communication items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchCommunicationItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchCommunicationItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchCommunicationItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch communication item';
      });

    // Create Item
    builder
      .addCase(createCommunicationItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createCommunicationItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `communication_create_${Date.now()}`,
          type: 'success',
          message: 'Communication item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createCommunicationItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create communication item';
      });

    // Update Item
    builder
      .addCase(updateCommunicationItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateCommunicationItem.fulfilled, (state, action) => {
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
          id: `communication_update_${Date.now()}`,
          type: 'success',
          message: 'Communication item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateCommunicationItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update communication item';
      });

    // Delete Item
    builder
      .addCase(deleteCommunicationItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteCommunicationItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `communication_delete_${Date.now()}`,
          type: 'success',
          message: 'Communication item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteCommunicationItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete communication item';
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
} = communicationSlice.actions;

// Selectors
export const selectCommunicationItems = (state: RootState) => state.communication?.items || [];
export const selectCommunicationItem = (state: RootState) => state.communication?.selectedItem;
export const selectCommunicationLoading = (state: RootState) => state.communication?.loading;
export const selectCommunicationError = (state: RootState) => state.communication?.error;
export const selectCommunicationFilters = (state: RootState) => state.communication?.filters || {};
export const selectCommunicationNotifications = (state: RootState) => state.communication?.notifications || [];
export const selectCommunicationPagination = (state: RootState) => state.communication?.pagination;

export default communicationSlice.reducer;
