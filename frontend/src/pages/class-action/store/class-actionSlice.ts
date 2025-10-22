/**
 * WF-SLI-001 | class-actionSlice.ts - ClassAction Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ClassActionItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ClassActionState {
  items: ClassActionItem[];
  selectedItem: ClassActionItem | null;
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

const initialState: ClassActionState = {
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
const mockClassActionApi = {
  getItems: async (_params?: any): Promise<{ data: ClassActionItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'ClassAction User 1',
          description: 'System class-actionistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'ClassAction User 2',
          description: 'Department class-action',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ClassActionItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `ClassAction User ${id}`,
      description: 'Sample class-action user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ClassActionItem>): Promise<ClassActionItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New ClassAction',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ClassActionItem>): Promise<ClassActionItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated ClassAction',
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
export const fetchClassActionItems = createAsyncThunk(
  'class-action/fetchItems', 
  async (params?: any) => mockClassActionApi.getItems(params)
);

export const fetchClassActionItem = createAsyncThunk(
  'class-action/fetchItem', 
  async (id: string) => mockClassActionApi.getItem(id)
);

export const createClassActionItem = createAsyncThunk(
  'class-action/createItem', 
  async (data: Partial<ClassActionItem>) => mockClassActionApi.createItem(data)
);

export const updateClassActionItem = createAsyncThunk(
  'class-action/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ClassActionItem> }) => mockClassActionApi.updateItem(id, data)
);

export const deleteClassActionItem = createAsyncThunk(
  'class-action/deleteItem', 
  async (id: string) => {
    await mockClassActionApi.deleteItem(id);
    return id;
  }
);

const classActionSlice = createSlice({
  name: 'classAction',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ClassActionItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ClassActionState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ClassActionState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `class-action_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ClassActionState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchClassActionItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchClassActionItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchClassActionItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch class-action items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchClassActionItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchClassActionItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchClassActionItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch class-action item';
      });

    // Create Item
    builder
      .addCase(createClassActionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createClassActionItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `class-action_create_${Date.now()}`,
          type: 'success',
          message: 'ClassAction item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createClassActionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create class-action item';
      });

    // Update Item
    builder
      .addCase(updateClassActionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateClassActionItem.fulfilled, (state, action) => {
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
          id: `class-action_update_${Date.now()}`,
          type: 'success',
          message: 'ClassAction item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateClassActionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update class-action item';
      });

    // Delete Item
    builder
      .addCase(deleteClassActionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteClassActionItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `class-action_delete_${Date.now()}`,
          type: 'success',
          message: 'ClassAction item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteClassActionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete class-action item';
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
} = classActionSlice.actions;

// Selectors
export const selectClassActionItems = (state: RootState) => state.classAction?.items || [];
export const selectClassActionItem = (state: RootState) => state.classAction?.selectedItem;
export const selectClassActionLoading = (state: RootState) => state.classAction?.loading;
export const selectClassActionError = (state: RootState) => state.classAction?.error;
export const selectClassActionFilters = (state: RootState) => state.classAction?.filters || {};
export const selectClassActionNotifications = (state: RootState) => state.classAction?.notifications || [];
export const selectClassActionPagination = (state: RootState) => state.classAction?.pagination;

export default classActionSlice.reducer;
