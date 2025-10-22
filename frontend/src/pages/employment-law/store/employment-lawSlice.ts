/**
 * WF-SLI-001 | employment-lawSlice.ts - EmploymentLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface EmploymentLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface EmploymentLawState {
  items: EmploymentLawItem[];
  selectedItem: EmploymentLawItem | null;
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

const initialState: EmploymentLawState = {
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
const mockEmploymentLawApi = {
  getItems: async (_params?: any): Promise<{ data: EmploymentLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'EmploymentLaw User 1',
          description: 'System employment-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'EmploymentLaw User 2',
          description: 'Department employment-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<EmploymentLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `EmploymentLaw User ${id}`,
      description: 'Sample employment-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<EmploymentLawItem>): Promise<EmploymentLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New EmploymentLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<EmploymentLawItem>): Promise<EmploymentLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated EmploymentLaw',
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
export const fetchEmploymentLawItems = createAsyncThunk(
  'employment-law/fetchItems', 
  async (params?: any) => mockEmploymentLawApi.getItems(params)
);

export const fetchEmploymentLawItem = createAsyncThunk(
  'employment-law/fetchItem', 
  async (id: string) => mockEmploymentLawApi.getItem(id)
);

export const createEmploymentLawItem = createAsyncThunk(
  'employment-law/createItem', 
  async (data: Partial<EmploymentLawItem>) => mockEmploymentLawApi.createItem(data)
);

export const updateEmploymentLawItem = createAsyncThunk(
  'employment-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<EmploymentLawItem> }) => mockEmploymentLawApi.updateItem(id, data)
);

export const deleteEmploymentLawItem = createAsyncThunk(
  'employment-law/deleteItem', 
  async (id: string) => {
    await mockEmploymentLawApi.deleteItem(id);
    return id;
  }
);

const employmentLawSlice = createSlice({
  name: 'employmentLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<EmploymentLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EmploymentLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<EmploymentLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `employment-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<EmploymentLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchEmploymentLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchEmploymentLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchEmploymentLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch employment-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchEmploymentLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchEmploymentLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchEmploymentLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch employment-law item';
      });

    // Create Item
    builder
      .addCase(createEmploymentLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createEmploymentLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `employment-law_create_${Date.now()}`,
          type: 'success',
          message: 'EmploymentLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createEmploymentLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create employment-law item';
      });

    // Update Item
    builder
      .addCase(updateEmploymentLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateEmploymentLawItem.fulfilled, (state, action) => {
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
          id: `employment-law_update_${Date.now()}`,
          type: 'success',
          message: 'EmploymentLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateEmploymentLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update employment-law item';
      });

    // Delete Item
    builder
      .addCase(deleteEmploymentLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteEmploymentLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `employment-law_delete_${Date.now()}`,
          type: 'success',
          message: 'EmploymentLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteEmploymentLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete employment-law item';
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
} = employmentLawSlice.actions;

// Selectors
export const selectEmploymentLawItems = (state: RootState) => state.employmentLaw?.items || [];
export const selectEmploymentLawItem = (state: RootState) => state.employmentLaw?.selectedItem;
export const selectEmploymentLawLoading = (state: RootState) => state.employmentLaw?.loading;
export const selectEmploymentLawError = (state: RootState) => state.employmentLaw?.error;
export const selectEmploymentLawFilters = (state: RootState) => state.employmentLaw?.filters || {};
export const selectEmploymentLawNotifications = (state: RootState) => state.employmentLaw?.notifications || [];
export const selectEmploymentLawPagination = (state: RootState) => state.employmentLaw?.pagination;

export default employmentLawSlice.reducer;
