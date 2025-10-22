/**
 * WF-SLI-001 | labor-relationsSlice.ts - LaborRelations Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface LaborRelationsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface LaborRelationsState {
  items: LaborRelationsItem[];
  selectedItem: LaborRelationsItem | null;
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

const initialState: LaborRelationsState = {
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
const mockLaborRelationsApi = {
  getItems: async (_params?: any): Promise<{ data: LaborRelationsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'LaborRelations User 1',
          description: 'System labor-relationsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'LaborRelations User 2',
          description: 'Department labor-relations',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<LaborRelationsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `LaborRelations User ${id}`,
      description: 'Sample labor-relations user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<LaborRelationsItem>): Promise<LaborRelationsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New LaborRelations',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<LaborRelationsItem>): Promise<LaborRelationsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated LaborRelations',
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
export const fetchLaborRelationsItems = createAsyncThunk(
  'labor-relations/fetchItems', 
  async (params?: any) => mockLaborRelationsApi.getItems(params)
);

export const fetchLaborRelationsItem = createAsyncThunk(
  'labor-relations/fetchItem', 
  async (id: string) => mockLaborRelationsApi.getItem(id)
);

export const createLaborRelationsItem = createAsyncThunk(
  'labor-relations/createItem', 
  async (data: Partial<LaborRelationsItem>) => mockLaborRelationsApi.createItem(data)
);

export const updateLaborRelationsItem = createAsyncThunk(
  'labor-relations/updateItem', 
  async ({ id, data }: { id: string; data: Partial<LaborRelationsItem> }) => mockLaborRelationsApi.updateItem(id, data)
);

export const deleteLaborRelationsItem = createAsyncThunk(
  'labor-relations/deleteItem', 
  async (id: string) => {
    await mockLaborRelationsApi.deleteItem(id);
    return id;
  }
);

const laborRelationsSlice = createSlice({
  name: 'laborRelations',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<LaborRelationsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LaborRelationsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<LaborRelationsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `labor-relations_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<LaborRelationsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchLaborRelationsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchLaborRelationsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchLaborRelationsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch labor-relations items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchLaborRelationsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchLaborRelationsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchLaborRelationsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch labor-relations item';
      });

    // Create Item
    builder
      .addCase(createLaborRelationsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createLaborRelationsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `labor-relations_create_${Date.now()}`,
          type: 'success',
          message: 'LaborRelations item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createLaborRelationsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create labor-relations item';
      });

    // Update Item
    builder
      .addCase(updateLaborRelationsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateLaborRelationsItem.fulfilled, (state, action) => {
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
          id: `labor-relations_update_${Date.now()}`,
          type: 'success',
          message: 'LaborRelations item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateLaborRelationsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update labor-relations item';
      });

    // Delete Item
    builder
      .addCase(deleteLaborRelationsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteLaborRelationsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `labor-relations_delete_${Date.now()}`,
          type: 'success',
          message: 'LaborRelations item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteLaborRelationsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete labor-relations item';
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
} = laborRelationsSlice.actions;

// Selectors
export const selectLaborRelationsItems = (state: RootState) => state.laborRelations?.items || [];
export const selectLaborRelationsItem = (state: RootState) => state.laborRelations?.selectedItem;
export const selectLaborRelationsLoading = (state: RootState) => state.laborRelations?.loading;
export const selectLaborRelationsError = (state: RootState) => state.laborRelations?.error;
export const selectLaborRelationsFilters = (state: RootState) => state.laborRelations?.filters || {};
export const selectLaborRelationsNotifications = (state: RootState) => state.laborRelations?.notifications || [];
export const selectLaborRelationsPagination = (state: RootState) => state.laborRelations?.pagination;

export default laborRelationsSlice.reducer;
