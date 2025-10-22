/**
 * WF-SLI-001 | appellate-practiceSlice.ts - AppellatePractice Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface AppellatePracticeItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface AppellatePracticeState {
  items: AppellatePracticeItem[];
  selectedItem: AppellatePracticeItem | null;
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

const initialState: AppellatePracticeState = {
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
const mockAppellatePracticeApi = {
  getItems: async (_params?: any): Promise<{ data: AppellatePracticeItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'AppellatePractice User 1',
          description: 'System appellate-practiceistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'AppellatePractice User 2',
          description: 'Department appellate-practice',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<AppellatePracticeItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `AppellatePractice User ${id}`,
      description: 'Sample appellate-practice user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<AppellatePracticeItem>): Promise<AppellatePracticeItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New AppellatePractice',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<AppellatePracticeItem>): Promise<AppellatePracticeItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated AppellatePractice',
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
export const fetchAppellatePracticeItems = createAsyncThunk(
  'appellate-practice/fetchItems', 
  async (params?: any) => mockAppellatePracticeApi.getItems(params)
);

export const fetchAppellatePracticeItem = createAsyncThunk(
  'appellate-practice/fetchItem', 
  async (id: string) => mockAppellatePracticeApi.getItem(id)
);

export const createAppellatePracticeItem = createAsyncThunk(
  'appellate-practice/createItem', 
  async (data: Partial<AppellatePracticeItem>) => mockAppellatePracticeApi.createItem(data)
);

export const updateAppellatePracticeItem = createAsyncThunk(
  'appellate-practice/updateItem', 
  async ({ id, data }: { id: string; data: Partial<AppellatePracticeItem> }) => mockAppellatePracticeApi.updateItem(id, data)
);

export const deleteAppellatePracticeItem = createAsyncThunk(
  'appellate-practice/deleteItem', 
  async (id: string) => {
    await mockAppellatePracticeApi.deleteItem(id);
    return id;
  }
);

const appellatePracticeSlice = createSlice({
  name: 'appellatePractice',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<AppellatePracticeItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AppellatePracticeState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<AppellatePracticeState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `appellate-practice_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<AppellatePracticeState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchAppellatePracticeItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchAppellatePracticeItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchAppellatePracticeItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch appellate-practice items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchAppellatePracticeItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchAppellatePracticeItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchAppellatePracticeItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch appellate-practice item';
      });

    // Create Item
    builder
      .addCase(createAppellatePracticeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createAppellatePracticeItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `appellate-practice_create_${Date.now()}`,
          type: 'success',
          message: 'AppellatePractice item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createAppellatePracticeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create appellate-practice item';
      });

    // Update Item
    builder
      .addCase(updateAppellatePracticeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateAppellatePracticeItem.fulfilled, (state, action) => {
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
          id: `appellate-practice_update_${Date.now()}`,
          type: 'success',
          message: 'AppellatePractice item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateAppellatePracticeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update appellate-practice item';
      });

    // Delete Item
    builder
      .addCase(deleteAppellatePracticeItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteAppellatePracticeItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `appellate-practice_delete_${Date.now()}`,
          type: 'success',
          message: 'AppellatePractice item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteAppellatePracticeItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete appellate-practice item';
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
} = appellatePracticeSlice.actions;

// Selectors
export const selectAppellatePracticeItems = (state: RootState) => state.appellatePractice?.items || [];
export const selectAppellatePracticeItem = (state: RootState) => state.appellatePractice?.selectedItem;
export const selectAppellatePracticeLoading = (state: RootState) => state.appellatePractice?.loading;
export const selectAppellatePracticeError = (state: RootState) => state.appellatePractice?.error;
export const selectAppellatePracticeFilters = (state: RootState) => state.appellatePractice?.filters || {};
export const selectAppellatePracticeNotifications = (state: RootState) => state.appellatePractice?.notifications || [];
export const selectAppellatePracticePagination = (state: RootState) => state.appellatePractice?.pagination;

export default appellatePracticeSlice.reducer;
