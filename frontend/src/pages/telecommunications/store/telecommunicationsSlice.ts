/**
 * WF-SLI-001 | telecommunicationsSlice.ts - Telecommunications Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface TelecommunicationsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface TelecommunicationsState {
  items: TelecommunicationsItem[];
  selectedItem: TelecommunicationsItem | null;
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

const initialState: TelecommunicationsState = {
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
const mockTelecommunicationsApi = {
  getItems: async (_params?: any): Promise<{ data: TelecommunicationsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'Telecommunications User 1',
          description: 'System telecommunicationsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Telecommunications User 2',
          description: 'Department telecommunications',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<TelecommunicationsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `Telecommunications User ${id}`,
      description: 'Sample telecommunications user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<TelecommunicationsItem>): Promise<TelecommunicationsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New Telecommunications',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<TelecommunicationsItem>): Promise<TelecommunicationsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated Telecommunications',
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
export const fetchTelecommunicationsItems = createAsyncThunk(
  'telecommunications/fetchItems', 
  async (params?: any) => mockTelecommunicationsApi.getItems(params)
);

export const fetchTelecommunicationsItem = createAsyncThunk(
  'telecommunications/fetchItem', 
  async (id: string) => mockTelecommunicationsApi.getItem(id)
);

export const createTelecommunicationsItem = createAsyncThunk(
  'telecommunications/createItem', 
  async (data: Partial<TelecommunicationsItem>) => mockTelecommunicationsApi.createItem(data)
);

export const updateTelecommunicationsItem = createAsyncThunk(
  'telecommunications/updateItem', 
  async ({ id, data }: { id: string; data: Partial<TelecommunicationsItem> }) => mockTelecommunicationsApi.updateItem(id, data)
);

export const deleteTelecommunicationsItem = createAsyncThunk(
  'telecommunications/deleteItem', 
  async (id: string) => {
    await mockTelecommunicationsApi.deleteItem(id);
    return id;
  }
);

const telecommunicationsSlice = createSlice({
  name: 'telecommunications',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<TelecommunicationsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TelecommunicationsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<TelecommunicationsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `telecommunications_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<TelecommunicationsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchTelecommunicationsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchTelecommunicationsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchTelecommunicationsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch telecommunications items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchTelecommunicationsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchTelecommunicationsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchTelecommunicationsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch telecommunications item';
      });

    // Create Item
    builder
      .addCase(createTelecommunicationsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createTelecommunicationsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `telecommunications_create_${Date.now()}`,
          type: 'success',
          message: 'Telecommunications item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createTelecommunicationsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create telecommunications item';
      });

    // Update Item
    builder
      .addCase(updateTelecommunicationsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateTelecommunicationsItem.fulfilled, (state, action) => {
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
          id: `telecommunications_update_${Date.now()}`,
          type: 'success',
          message: 'Telecommunications item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateTelecommunicationsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update telecommunications item';
      });

    // Delete Item
    builder
      .addCase(deleteTelecommunicationsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteTelecommunicationsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `telecommunications_delete_${Date.now()}`,
          type: 'success',
          message: 'Telecommunications item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteTelecommunicationsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete telecommunications item';
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
} = telecommunicationsSlice.actions;

// Selectors
export const selectTelecommunicationsItems = (state: RootState) => state.telecommunications?.items || [];
export const selectTelecommunicationsItem = (state: RootState) => state.telecommunications?.selectedItem;
export const selectTelecommunicationsLoading = (state: RootState) => state.telecommunications?.loading;
export const selectTelecommunicationsError = (state: RootState) => state.telecommunications?.error;
export const selectTelecommunicationsFilters = (state: RootState) => state.telecommunications?.filters || {};
export const selectTelecommunicationsNotifications = (state: RootState) => state.telecommunications?.notifications || [];
export const selectTelecommunicationsPagination = (state: RootState) => state.telecommunications?.pagination;

export default telecommunicationsSlice.reducer;
