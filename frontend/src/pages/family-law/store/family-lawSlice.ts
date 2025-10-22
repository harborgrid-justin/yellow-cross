/**
 * WF-SLI-001 | family-lawSlice.ts - FamilyLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface FamilyLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface FamilyLawState {
  items: FamilyLawItem[];
  selectedItem: FamilyLawItem | null;
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

const initialState: FamilyLawState = {
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
const mockFamilyLawApi = {
  getItems: async (_params?: any): Promise<{ data: FamilyLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'FamilyLaw User 1',
          description: 'System family-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'FamilyLaw User 2',
          description: 'Department family-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<FamilyLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `FamilyLaw User ${id}`,
      description: 'Sample family-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<FamilyLawItem>): Promise<FamilyLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New FamilyLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<FamilyLawItem>): Promise<FamilyLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated FamilyLaw',
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
export const fetchFamilyLawItems = createAsyncThunk(
  'family-law/fetchItems', 
  async (params?: any) => mockFamilyLawApi.getItems(params)
);

export const fetchFamilyLawItem = createAsyncThunk(
  'family-law/fetchItem', 
  async (id: string) => mockFamilyLawApi.getItem(id)
);

export const createFamilyLawItem = createAsyncThunk(
  'family-law/createItem', 
  async (data: Partial<FamilyLawItem>) => mockFamilyLawApi.createItem(data)
);

export const updateFamilyLawItem = createAsyncThunk(
  'family-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<FamilyLawItem> }) => mockFamilyLawApi.updateItem(id, data)
);

export const deleteFamilyLawItem = createAsyncThunk(
  'family-law/deleteItem', 
  async (id: string) => {
    await mockFamilyLawApi.deleteItem(id);
    return id;
  }
);

const familyLawSlice = createSlice({
  name: 'familyLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<FamilyLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FamilyLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<FamilyLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `family-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<FamilyLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchFamilyLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchFamilyLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchFamilyLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch family-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchFamilyLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchFamilyLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchFamilyLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch family-law item';
      });

    // Create Item
    builder
      .addCase(createFamilyLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createFamilyLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `family-law_create_${Date.now()}`,
          type: 'success',
          message: 'FamilyLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createFamilyLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create family-law item';
      });

    // Update Item
    builder
      .addCase(updateFamilyLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateFamilyLawItem.fulfilled, (state, action) => {
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
          id: `family-law_update_${Date.now()}`,
          type: 'success',
          message: 'FamilyLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateFamilyLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update family-law item';
      });

    // Delete Item
    builder
      .addCase(deleteFamilyLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteFamilyLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `family-law_delete_${Date.now()}`,
          type: 'success',
          message: 'FamilyLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteFamilyLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete family-law item';
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
} = familyLawSlice.actions;

// Selectors
export const selectFamilyLawItems = (state: RootState) => state.familyLaw?.items || [];
export const selectFamilyLawItem = (state: RootState) => state.familyLaw?.selectedItem;
export const selectFamilyLawLoading = (state: RootState) => state.familyLaw?.loading;
export const selectFamilyLawError = (state: RootState) => state.familyLaw?.error;
export const selectFamilyLawFilters = (state: RootState) => state.familyLaw?.filters || {};
export const selectFamilyLawNotifications = (state: RootState) => state.familyLaw?.notifications || [];
export const selectFamilyLawPagination = (state: RootState) => state.familyLaw?.pagination;

export default familyLawSlice.reducer;
