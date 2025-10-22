/**
 * WF-SLI-001 | criminal-defenseSlice.ts - CriminalDefense Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface CriminalDefenseItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CriminalDefenseState {
  items: CriminalDefenseItem[];
  selectedItem: CriminalDefenseItem | null;
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

const initialState: CriminalDefenseState = {
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
const mockCriminalDefenseApi = {
  getItems: async (_params?: any): Promise<{ data: CriminalDefenseItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'CriminalDefense User 1',
          description: 'System criminal-defenseistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'CriminalDefense User 2',
          description: 'Department criminal-defense',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<CriminalDefenseItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `CriminalDefense User ${id}`,
      description: 'Sample criminal-defense user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<CriminalDefenseItem>): Promise<CriminalDefenseItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New CriminalDefense',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<CriminalDefenseItem>): Promise<CriminalDefenseItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated CriminalDefense',
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
export const fetchCriminalDefenseItems = createAsyncThunk(
  'criminal-defense/fetchItems', 
  async (params?: any) => mockCriminalDefenseApi.getItems(params)
);

export const fetchCriminalDefenseItem = createAsyncThunk(
  'criminal-defense/fetchItem', 
  async (id: string) => mockCriminalDefenseApi.getItem(id)
);

export const createCriminalDefenseItem = createAsyncThunk(
  'criminal-defense/createItem', 
  async (data: Partial<CriminalDefenseItem>) => mockCriminalDefenseApi.createItem(data)
);

export const updateCriminalDefenseItem = createAsyncThunk(
  'criminal-defense/updateItem', 
  async ({ id, data }: { id: string; data: Partial<CriminalDefenseItem> }) => mockCriminalDefenseApi.updateItem(id, data)
);

export const deleteCriminalDefenseItem = createAsyncThunk(
  'criminal-defense/deleteItem', 
  async (id: string) => {
    await mockCriminalDefenseApi.deleteItem(id);
    return id;
  }
);

const criminalDefenseSlice = createSlice({
  name: 'criminalDefense',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<CriminalDefenseItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CriminalDefenseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<CriminalDefenseState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `criminal-defense_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<CriminalDefenseState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchCriminalDefenseItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchCriminalDefenseItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchCriminalDefenseItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch criminal-defense items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchCriminalDefenseItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchCriminalDefenseItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchCriminalDefenseItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch criminal-defense item';
      });

    // Create Item
    builder
      .addCase(createCriminalDefenseItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createCriminalDefenseItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `criminal-defense_create_${Date.now()}`,
          type: 'success',
          message: 'CriminalDefense item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createCriminalDefenseItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create criminal-defense item';
      });

    // Update Item
    builder
      .addCase(updateCriminalDefenseItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateCriminalDefenseItem.fulfilled, (state, action) => {
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
          id: `criminal-defense_update_${Date.now()}`,
          type: 'success',
          message: 'CriminalDefense item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateCriminalDefenseItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update criminal-defense item';
      });

    // Delete Item
    builder
      .addCase(deleteCriminalDefenseItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteCriminalDefenseItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `criminal-defense_delete_${Date.now()}`,
          type: 'success',
          message: 'CriminalDefense item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteCriminalDefenseItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete criminal-defense item';
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
} = criminalDefenseSlice.actions;

// Selectors
export const selectCriminalDefenseItems = (state: RootState) => state.criminalDefense?.items || [];
export const selectCriminalDefenseItem = (state: RootState) => state.criminalDefense?.selectedItem;
export const selectCriminalDefenseLoading = (state: RootState) => state.criminalDefense?.loading;
export const selectCriminalDefenseError = (state: RootState) => state.criminalDefense?.error;
export const selectCriminalDefenseFilters = (state: RootState) => state.criminalDefense?.filters || {};
export const selectCriminalDefenseNotifications = (state: RootState) => state.criminalDefense?.notifications || [];
export const selectCriminalDefensePagination = (state: RootState) => state.criminalDefense?.pagination;

export default criminalDefenseSlice.reducer;
