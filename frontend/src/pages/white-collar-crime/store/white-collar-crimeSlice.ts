/**
 * WF-SLI-001 | white-collar-crimeSlice.ts - WhiteCollarCrime Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface WhiteCollarCrimeItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface WhiteCollarCrimeState {
  items: WhiteCollarCrimeItem[];
  selectedItem: WhiteCollarCrimeItem | null;
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

const initialState: WhiteCollarCrimeState = {
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
const mockWhiteCollarCrimeApi = {
  getItems: async (_params?: any): Promise<{ data: WhiteCollarCrimeItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'WhiteCollarCrime User 1',
          description: 'System white-collar-crimeistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'WhiteCollarCrime User 2',
          description: 'Department white-collar-crime',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<WhiteCollarCrimeItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `WhiteCollarCrime User ${id}`,
      description: 'Sample white-collar-crime user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<WhiteCollarCrimeItem>): Promise<WhiteCollarCrimeItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New WhiteCollarCrime',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<WhiteCollarCrimeItem>): Promise<WhiteCollarCrimeItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated WhiteCollarCrime',
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
export const fetchWhiteCollarCrimeItems = createAsyncThunk(
  'white-collar-crime/fetchItems', 
  async (params?: any) => mockWhiteCollarCrimeApi.getItems(params)
);

export const fetchWhiteCollarCrimeItem = createAsyncThunk(
  'white-collar-crime/fetchItem', 
  async (id: string) => mockWhiteCollarCrimeApi.getItem(id)
);

export const createWhiteCollarCrimeItem = createAsyncThunk(
  'white-collar-crime/createItem', 
  async (data: Partial<WhiteCollarCrimeItem>) => mockWhiteCollarCrimeApi.createItem(data)
);

export const updateWhiteCollarCrimeItem = createAsyncThunk(
  'white-collar-crime/updateItem', 
  async ({ id, data }: { id: string; data: Partial<WhiteCollarCrimeItem> }) => mockWhiteCollarCrimeApi.updateItem(id, data)
);

export const deleteWhiteCollarCrimeItem = createAsyncThunk(
  'white-collar-crime/deleteItem', 
  async (id: string) => {
    await mockWhiteCollarCrimeApi.deleteItem(id);
    return id;
  }
);

const whiteCollarCrimeSlice = createSlice({
  name: 'whiteCollarCrime',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<WhiteCollarCrimeItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<WhiteCollarCrimeState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<WhiteCollarCrimeState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `white-collar-crime_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<WhiteCollarCrimeState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchWhiteCollarCrimeItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchWhiteCollarCrimeItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchWhiteCollarCrimeItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch white-collar-crime items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchWhiteCollarCrimeItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchWhiteCollarCrimeItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchWhiteCollarCrimeItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch white-collar-crime item';
      });

    // Create Item
    builder
      .addCase(createWhiteCollarCrimeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createWhiteCollarCrimeItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `white-collar-crime_create_${Date.now()}`,
          type: 'success',
          message: 'WhiteCollarCrime item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createWhiteCollarCrimeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create white-collar-crime item';
      });

    // Update Item
    builder
      .addCase(updateWhiteCollarCrimeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateWhiteCollarCrimeItem.fulfilled, (state, action) => {
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
          id: `white-collar-crime_update_${Date.now()}`,
          type: 'success',
          message: 'WhiteCollarCrime item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateWhiteCollarCrimeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update white-collar-crime item';
      });

    // Delete Item
    builder
      .addCase(deleteWhiteCollarCrimeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteWhiteCollarCrimeItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `white-collar-crime_delete_${Date.now()}`,
          type: 'success',
          message: 'WhiteCollarCrime item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteWhiteCollarCrimeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete white-collar-crime item';
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
} = whiteCollarCrimeSlice.actions;

// Selectors
export const selectWhiteCollarCrimeItems = (state: RootState) => state.whiteCollarCrime?.items || [];
export const selectWhiteCollarCrimeItem = (state: RootState) => state.whiteCollarCrime?.selectedItem;
export const selectWhiteCollarCrimeLoading = (state: RootState) => state.whiteCollarCrime?.loading;
export const selectWhiteCollarCrimeError = (state: RootState) => state.whiteCollarCrime?.error;
export const selectWhiteCollarCrimeFilters = (state: RootState) => state.whiteCollarCrime?.filters || {};
export const selectWhiteCollarCrimeNotifications = (state: RootState) => state.whiteCollarCrime?.notifications || [];
export const selectWhiteCollarCrimePagination = (state: RootState) => state.whiteCollarCrime?.pagination;

export default whiteCollarCrimeSlice.reducer;
