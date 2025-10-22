/**
 * WF-SLI-001 | client-crmSlice.ts - ClientCrm Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ClientCrmItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ClientCrmState {
  items: ClientCrmItem[];
  selectedItem: ClientCrmItem | null;
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

const initialState: ClientCrmState = {
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
const mockClientCrmApi = {
  getItems: async (_params?: any): Promise<{ data: ClientCrmItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'ClientCrm User 1',
          description: 'System client-crmistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'ClientCrm User 2',
          description: 'Department client-crm',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ClientCrmItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `ClientCrm User ${id}`,
      description: 'Sample client-crm user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ClientCrmItem>): Promise<ClientCrmItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New ClientCrm',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ClientCrmItem>): Promise<ClientCrmItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated ClientCrm',
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
export const fetchClientCrmItems = createAsyncThunk(
  'client-crm/fetchItems', 
  async (params?: any) => mockClientCrmApi.getItems(params)
);

export const fetchClientCrmItem = createAsyncThunk(
  'client-crm/fetchItem', 
  async (id: string) => mockClientCrmApi.getItem(id)
);

export const createClientCrmItem = createAsyncThunk(
  'client-crm/createItem', 
  async (data: Partial<ClientCrmItem>) => mockClientCrmApi.createItem(data)
);

export const updateClientCrmItem = createAsyncThunk(
  'client-crm/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ClientCrmItem> }) => mockClientCrmApi.updateItem(id, data)
);

export const deleteClientCrmItem = createAsyncThunk(
  'client-crm/deleteItem', 
  async (id: string) => {
    await mockClientCrmApi.deleteItem(id);
    return id;
  }
);

const clientCrmSlice = createSlice({
  name: 'clientCrm',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ClientCrmItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ClientCrmState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ClientCrmState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `client-crm_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ClientCrmState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchClientCrmItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchClientCrmItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchClientCrmItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch client-crm items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchClientCrmItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchClientCrmItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchClientCrmItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch client-crm item';
      });

    // Create Item
    builder
      .addCase(createClientCrmItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createClientCrmItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `client-crm_create_${Date.now()}`,
          type: 'success',
          message: 'ClientCrm item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createClientCrmItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create client-crm item';
      });

    // Update Item
    builder
      .addCase(updateClientCrmItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateClientCrmItem.fulfilled, (state, action) => {
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
          id: `client-crm_update_${Date.now()}`,
          type: 'success',
          message: 'ClientCrm item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateClientCrmItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update client-crm item';
      });

    // Delete Item
    builder
      .addCase(deleteClientCrmItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteClientCrmItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `client-crm_delete_${Date.now()}`,
          type: 'success',
          message: 'ClientCrm item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteClientCrmItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete client-crm item';
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
} = clientCrmSlice.actions;

// Selectors
export const selectClientCrmItems = (state: RootState) => state.clientCrm?.items || [];
export const selectClientCrmItem = (state: RootState) => state.clientCrm?.selectedItem;
export const selectClientCrmLoading = (state: RootState) => state.clientCrm?.loading;
export const selectClientCrmError = (state: RootState) => state.clientCrm?.error;
export const selectClientCrmFilters = (state: RootState) => state.clientCrm?.filters || {};
export const selectClientCrmNotifications = (state: RootState) => state.clientCrm?.notifications || [];
export const selectClientCrmPagination = (state: RootState) => state.clientCrm?.pagination;

export default clientCrmSlice.reducer;
