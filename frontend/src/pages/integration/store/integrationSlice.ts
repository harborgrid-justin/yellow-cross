/**
 * WF-SLI-001 | integrationSlice.ts - Integration Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface IntegrationItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface IntegrationState {
  items: IntegrationItem[];
  selectedItem: IntegrationItem | null;
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

const initialState: IntegrationState = {
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
const mockIntegrationApi = {
  getItems: async (_params?: any): Promise<{ data: IntegrationItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'Integration User 1',
          description: 'System integrationistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Integration User 2',
          description: 'Department integration',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<IntegrationItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `Integration User ${id}`,
      description: 'Sample integration user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<IntegrationItem>): Promise<IntegrationItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New Integration',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<IntegrationItem>): Promise<IntegrationItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated Integration',
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
export const fetchIntegrationItems = createAsyncThunk(
  'integration/fetchItems', 
  async (params?: any) => mockIntegrationApi.getItems(params)
);

export const fetchIntegrationItem = createAsyncThunk(
  'integration/fetchItem', 
  async (id: string) => mockIntegrationApi.getItem(id)
);

export const createIntegrationItem = createAsyncThunk(
  'integration/createItem', 
  async (data: Partial<IntegrationItem>) => mockIntegrationApi.createItem(data)
);

export const updateIntegrationItem = createAsyncThunk(
  'integration/updateItem', 
  async ({ id, data }: { id: string; data: Partial<IntegrationItem> }) => mockIntegrationApi.updateItem(id, data)
);

export const deleteIntegrationItem = createAsyncThunk(
  'integration/deleteItem', 
  async (id: string) => {
    await mockIntegrationApi.deleteItem(id);
    return id;
  }
);

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<IntegrationItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<IntegrationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<IntegrationState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `integration_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<IntegrationState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchIntegrationItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchIntegrationItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchIntegrationItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch integration items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchIntegrationItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchIntegrationItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchIntegrationItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch integration item';
      });

    // Create Item
    builder
      .addCase(createIntegrationItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createIntegrationItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `integration_create_${Date.now()}`,
          type: 'success',
          message: 'Integration item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createIntegrationItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create integration item';
      });

    // Update Item
    builder
      .addCase(updateIntegrationItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateIntegrationItem.fulfilled, (state, action) => {
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
          id: `integration_update_${Date.now()}`,
          type: 'success',
          message: 'Integration item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateIntegrationItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update integration item';
      });

    // Delete Item
    builder
      .addCase(deleteIntegrationItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteIntegrationItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `integration_delete_${Date.now()}`,
          type: 'success',
          message: 'Integration item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteIntegrationItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete integration item';
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
} = integrationSlice.actions;

// Selectors
export const selectIntegrationItems = (state: RootState) => state.integration?.items || [];
export const selectIntegrationItem = (state: RootState) => state.integration?.selectedItem;
export const selectIntegrationLoading = (state: RootState) => state.integration?.loading;
export const selectIntegrationError = (state: RootState) => state.integration?.error;
export const selectIntegrationFilters = (state: RootState) => state.integration?.filters || {};
export const selectIntegrationNotifications = (state: RootState) => state.integration?.notifications || [];
export const selectIntegrationPagination = (state: RootState) => state.integration?.pagination;

export default integrationSlice.reducer;
