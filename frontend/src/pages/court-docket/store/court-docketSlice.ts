/**
 * WF-SLI-001 | court-docketSlice.ts - CourtDocket Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface CourtDocketItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CourtDocketState {
  items: CourtDocketItem[];
  selectedItem: CourtDocketItem | null;
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

const initialState: CourtDocketState = {
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
const mockCourtDocketApi = {
  getItems: async (_params?: any): Promise<{ data: CourtDocketItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'CourtDocket User 1',
          description: 'System court-docketistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'CourtDocket User 2',
          description: 'Department court-docket',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<CourtDocketItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `CourtDocket User ${id}`,
      description: 'Sample court-docket user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<CourtDocketItem>): Promise<CourtDocketItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New CourtDocket',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<CourtDocketItem>): Promise<CourtDocketItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated CourtDocket',
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
export const fetchCourtDocketItems = createAsyncThunk(
  'court-docket/fetchItems', 
  async (params?: any) => mockCourtDocketApi.getItems(params)
);

export const fetchCourtDocketItem = createAsyncThunk(
  'court-docket/fetchItem', 
  async (id: string) => mockCourtDocketApi.getItem(id)
);

export const createCourtDocketItem = createAsyncThunk(
  'court-docket/createItem', 
  async (data: Partial<CourtDocketItem>) => mockCourtDocketApi.createItem(data)
);

export const updateCourtDocketItem = createAsyncThunk(
  'court-docket/updateItem', 
  async ({ id, data }: { id: string; data: Partial<CourtDocketItem> }) => mockCourtDocketApi.updateItem(id, data)
);

export const deleteCourtDocketItem = createAsyncThunk(
  'court-docket/deleteItem', 
  async (id: string) => {
    await mockCourtDocketApi.deleteItem(id);
    return id;
  }
);

const courtDocketSlice = createSlice({
  name: 'courtDocket',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<CourtDocketItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CourtDocketState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<CourtDocketState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `court-docket_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<CourtDocketState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchCourtDocketItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchCourtDocketItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchCourtDocketItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch court-docket items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchCourtDocketItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchCourtDocketItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchCourtDocketItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch court-docket item';
      });

    // Create Item
    builder
      .addCase(createCourtDocketItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createCourtDocketItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `court-docket_create_${Date.now()}`,
          type: 'success',
          message: 'CourtDocket item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createCourtDocketItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create court-docket item';
      });

    // Update Item
    builder
      .addCase(updateCourtDocketItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateCourtDocketItem.fulfilled, (state, action) => {
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
          id: `court-docket_update_${Date.now()}`,
          type: 'success',
          message: 'CourtDocket item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateCourtDocketItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update court-docket item';
      });

    // Delete Item
    builder
      .addCase(deleteCourtDocketItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteCourtDocketItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `court-docket_delete_${Date.now()}`,
          type: 'success',
          message: 'CourtDocket item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteCourtDocketItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete court-docket item';
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
} = courtDocketSlice.actions;

// Selectors
export const selectCourtDocketItems = (state: RootState) => state.courtDocket?.items || [];
export const selectCourtDocketItem = (state: RootState) => state.courtDocket?.selectedItem;
export const selectCourtDocketLoading = (state: RootState) => state.courtDocket?.loading;
export const selectCourtDocketError = (state: RootState) => state.courtDocket?.error;
export const selectCourtDocketFilters = (state: RootState) => state.courtDocket?.filters || {};
export const selectCourtDocketNotifications = (state: RootState) => state.courtDocket?.notifications || [];
export const selectCourtDocketPagination = (state: RootState) => state.courtDocket?.pagination;

export default courtDocketSlice.reducer;
