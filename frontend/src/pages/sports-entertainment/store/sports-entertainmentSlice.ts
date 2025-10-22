/**
 * WF-SLI-001 | sports-entertainmentSlice.ts - SportsEntertainment Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface SportsEntertainmentItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface SportsEntertainmentState {
  items: SportsEntertainmentItem[];
  selectedItem: SportsEntertainmentItem | null;
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

const initialState: SportsEntertainmentState = {
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
const mockSportsEntertainmentApi = {
  getItems: async (_params?: any): Promise<{ data: SportsEntertainmentItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'SportsEntertainment User 1',
          description: 'System sports-entertainmentistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'SportsEntertainment User 2',
          description: 'Department sports-entertainment',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<SportsEntertainmentItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `SportsEntertainment User ${id}`,
      description: 'Sample sports-entertainment user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<SportsEntertainmentItem>): Promise<SportsEntertainmentItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New SportsEntertainment',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<SportsEntertainmentItem>): Promise<SportsEntertainmentItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated SportsEntertainment',
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
export const fetchSportsEntertainmentItems = createAsyncThunk(
  'sports-entertainment/fetchItems', 
  async (params?: any) => mockSportsEntertainmentApi.getItems(params)
);

export const fetchSportsEntertainmentItem = createAsyncThunk(
  'sports-entertainment/fetchItem', 
  async (id: string) => mockSportsEntertainmentApi.getItem(id)
);

export const createSportsEntertainmentItem = createAsyncThunk(
  'sports-entertainment/createItem', 
  async (data: Partial<SportsEntertainmentItem>) => mockSportsEntertainmentApi.createItem(data)
);

export const updateSportsEntertainmentItem = createAsyncThunk(
  'sports-entertainment/updateItem', 
  async ({ id, data }: { id: string; data: Partial<SportsEntertainmentItem> }) => mockSportsEntertainmentApi.updateItem(id, data)
);

export const deleteSportsEntertainmentItem = createAsyncThunk(
  'sports-entertainment/deleteItem', 
  async (id: string) => {
    await mockSportsEntertainmentApi.deleteItem(id);
    return id;
  }
);

const sportsEntertainmentSlice = createSlice({
  name: 'sportsEntertainment',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<SportsEntertainmentItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SportsEntertainmentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<SportsEntertainmentState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `sports-entertainment_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<SportsEntertainmentState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchSportsEntertainmentItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchSportsEntertainmentItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchSportsEntertainmentItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch sports-entertainment items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchSportsEntertainmentItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchSportsEntertainmentItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchSportsEntertainmentItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch sports-entertainment item';
      });

    // Create Item
    builder
      .addCase(createSportsEntertainmentItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createSportsEntertainmentItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `sports-entertainment_create_${Date.now()}`,
          type: 'success',
          message: 'SportsEntertainment item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createSportsEntertainmentItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create sports-entertainment item';
      });

    // Update Item
    builder
      .addCase(updateSportsEntertainmentItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateSportsEntertainmentItem.fulfilled, (state, action) => {
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
          id: `sports-entertainment_update_${Date.now()}`,
          type: 'success',
          message: 'SportsEntertainment item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateSportsEntertainmentItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update sports-entertainment item';
      });

    // Delete Item
    builder
      .addCase(deleteSportsEntertainmentItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteSportsEntertainmentItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `sports-entertainment_delete_${Date.now()}`,
          type: 'success',
          message: 'SportsEntertainment item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteSportsEntertainmentItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete sports-entertainment item';
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
} = sportsEntertainmentSlice.actions;

// Selectors
export const selectSportsEntertainmentItems = (state: RootState) => state.sportsEntertainment?.items || [];
export const selectSportsEntertainmentItem = (state: RootState) => state.sportsEntertainment?.selectedItem;
export const selectSportsEntertainmentLoading = (state: RootState) => state.sportsEntertainment?.loading;
export const selectSportsEntertainmentError = (state: RootState) => state.sportsEntertainment?.error;
export const selectSportsEntertainmentFilters = (state: RootState) => state.sportsEntertainment?.filters || {};
export const selectSportsEntertainmentNotifications = (state: RootState) => state.sportsEntertainment?.notifications || [];
export const selectSportsEntertainmentPagination = (state: RootState) => state.sportsEntertainment?.pagination;

export default sportsEntertainmentSlice.reducer;
