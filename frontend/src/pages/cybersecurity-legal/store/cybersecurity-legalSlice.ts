/**
 * WF-SLI-001 | cybersecurity-legalSlice.ts - CybersecurityLegal Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface CybersecurityLegalItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CybersecurityLegalState {
  items: CybersecurityLegalItem[];
  selectedItem: CybersecurityLegalItem | null;
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

const initialState: CybersecurityLegalState = {
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
const mockCybersecurityLegalApi = {
  getItems: async (_params?: any): Promise<{ data: CybersecurityLegalItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'CybersecurityLegal User 1',
          description: 'System cybersecurity-legalistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'CybersecurityLegal User 2',
          description: 'Department cybersecurity-legal',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<CybersecurityLegalItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `CybersecurityLegal User ${id}`,
      description: 'Sample cybersecurity-legal user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<CybersecurityLegalItem>): Promise<CybersecurityLegalItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New CybersecurityLegal',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<CybersecurityLegalItem>): Promise<CybersecurityLegalItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated CybersecurityLegal',
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
export const fetchCybersecurityLegalItems = createAsyncThunk(
  'cybersecurity-legal/fetchItems', 
  async (params?: any) => mockCybersecurityLegalApi.getItems(params)
);

export const fetchCybersecurityLegalItem = createAsyncThunk(
  'cybersecurity-legal/fetchItem', 
  async (id: string) => mockCybersecurityLegalApi.getItem(id)
);

export const createCybersecurityLegalItem = createAsyncThunk(
  'cybersecurity-legal/createItem', 
  async (data: Partial<CybersecurityLegalItem>) => mockCybersecurityLegalApi.createItem(data)
);

export const updateCybersecurityLegalItem = createAsyncThunk(
  'cybersecurity-legal/updateItem', 
  async ({ id, data }: { id: string; data: Partial<CybersecurityLegalItem> }) => mockCybersecurityLegalApi.updateItem(id, data)
);

export const deleteCybersecurityLegalItem = createAsyncThunk(
  'cybersecurity-legal/deleteItem', 
  async (id: string) => {
    await mockCybersecurityLegalApi.deleteItem(id);
    return id;
  }
);

const cybersecurityLegalSlice = createSlice({
  name: 'cybersecurityLegal',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<CybersecurityLegalItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CybersecurityLegalState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<CybersecurityLegalState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `cybersecurity-legal_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<CybersecurityLegalState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchCybersecurityLegalItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchCybersecurityLegalItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchCybersecurityLegalItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch cybersecurity-legal items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchCybersecurityLegalItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchCybersecurityLegalItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchCybersecurityLegalItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch cybersecurity-legal item';
      });

    // Create Item
    builder
      .addCase(createCybersecurityLegalItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createCybersecurityLegalItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `cybersecurity-legal_create_${Date.now()}`,
          type: 'success',
          message: 'CybersecurityLegal item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createCybersecurityLegalItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create cybersecurity-legal item';
      });

    // Update Item
    builder
      .addCase(updateCybersecurityLegalItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateCybersecurityLegalItem.fulfilled, (state, action) => {
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
          id: `cybersecurity-legal_update_${Date.now()}`,
          type: 'success',
          message: 'CybersecurityLegal item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateCybersecurityLegalItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update cybersecurity-legal item';
      });

    // Delete Item
    builder
      .addCase(deleteCybersecurityLegalItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteCybersecurityLegalItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `cybersecurity-legal_delete_${Date.now()}`,
          type: 'success',
          message: 'CybersecurityLegal item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteCybersecurityLegalItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete cybersecurity-legal item';
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
} = cybersecurityLegalSlice.actions;

// Selectors
export const selectCybersecurityLegalItems = (state: RootState) => state.cybersecurityLegal?.items || [];
export const selectCybersecurityLegalItem = (state: RootState) => state.cybersecurityLegal?.selectedItem;
export const selectCybersecurityLegalLoading = (state: RootState) => state.cybersecurityLegal?.loading;
export const selectCybersecurityLegalError = (state: RootState) => state.cybersecurityLegal?.error;
export const selectCybersecurityLegalFilters = (state: RootState) => state.cybersecurityLegal?.filters || {};
export const selectCybersecurityLegalNotifications = (state: RootState) => state.cybersecurityLegal?.notifications || [];
export const selectCybersecurityLegalPagination = (state: RootState) => state.cybersecurityLegal?.pagination;

export default cybersecurityLegalSlice.reducer;
