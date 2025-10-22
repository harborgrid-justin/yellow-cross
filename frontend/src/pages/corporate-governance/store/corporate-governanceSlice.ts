/**
 * WF-SLI-001 | corporate-governanceSlice.ts - CorporateGovernance Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface CorporateGovernanceItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CorporateGovernanceState {
  items: CorporateGovernanceItem[];
  selectedItem: CorporateGovernanceItem | null;
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

const initialState: CorporateGovernanceState = {
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
const mockCorporateGovernanceApi = {
  getItems: async (_params?: any): Promise<{ data: CorporateGovernanceItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'CorporateGovernance User 1',
          description: 'System corporate-governanceistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'CorporateGovernance User 2',
          description: 'Department corporate-governance',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<CorporateGovernanceItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `CorporateGovernance User ${id}`,
      description: 'Sample corporate-governance user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<CorporateGovernanceItem>): Promise<CorporateGovernanceItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New CorporateGovernance',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<CorporateGovernanceItem>): Promise<CorporateGovernanceItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated CorporateGovernance',
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
export const fetchCorporateGovernanceItems = createAsyncThunk(
  'corporate-governance/fetchItems', 
  async (params?: any) => mockCorporateGovernanceApi.getItems(params)
);

export const fetchCorporateGovernanceItem = createAsyncThunk(
  'corporate-governance/fetchItem', 
  async (id: string) => mockCorporateGovernanceApi.getItem(id)
);

export const createCorporateGovernanceItem = createAsyncThunk(
  'corporate-governance/createItem', 
  async (data: Partial<CorporateGovernanceItem>) => mockCorporateGovernanceApi.createItem(data)
);

export const updateCorporateGovernanceItem = createAsyncThunk(
  'corporate-governance/updateItem', 
  async ({ id, data }: { id: string; data: Partial<CorporateGovernanceItem> }) => mockCorporateGovernanceApi.updateItem(id, data)
);

export const deleteCorporateGovernanceItem = createAsyncThunk(
  'corporate-governance/deleteItem', 
  async (id: string) => {
    await mockCorporateGovernanceApi.deleteItem(id);
    return id;
  }
);

const corporateGovernanceSlice = createSlice({
  name: 'corporateGovernance',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<CorporateGovernanceItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CorporateGovernanceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<CorporateGovernanceState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `corporate-governance_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<CorporateGovernanceState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchCorporateGovernanceItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchCorporateGovernanceItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchCorporateGovernanceItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch corporate-governance items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchCorporateGovernanceItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchCorporateGovernanceItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchCorporateGovernanceItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch corporate-governance item';
      });

    // Create Item
    builder
      .addCase(createCorporateGovernanceItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createCorporateGovernanceItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `corporate-governance_create_${Date.now()}`,
          type: 'success',
          message: 'CorporateGovernance item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createCorporateGovernanceItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create corporate-governance item';
      });

    // Update Item
    builder
      .addCase(updateCorporateGovernanceItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateCorporateGovernanceItem.fulfilled, (state, action) => {
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
          id: `corporate-governance_update_${Date.now()}`,
          type: 'success',
          message: 'CorporateGovernance item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateCorporateGovernanceItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update corporate-governance item';
      });

    // Delete Item
    builder
      .addCase(deleteCorporateGovernanceItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteCorporateGovernanceItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `corporate-governance_delete_${Date.now()}`,
          type: 'success',
          message: 'CorporateGovernance item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteCorporateGovernanceItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete corporate-governance item';
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
} = corporateGovernanceSlice.actions;

// Selectors
export const selectCorporateGovernanceItems = (state: RootState) => state.corporateGovernance?.items || [];
export const selectCorporateGovernanceItem = (state: RootState) => state.corporateGovernance?.selectedItem;
export const selectCorporateGovernanceLoading = (state: RootState) => state.corporateGovernance?.loading;
export const selectCorporateGovernanceError = (state: RootState) => state.corporateGovernance?.error;
export const selectCorporateGovernanceFilters = (state: RootState) => state.corporateGovernance?.filters || {};
export const selectCorporateGovernanceNotifications = (state: RootState) => state.corporateGovernance?.notifications || [];
export const selectCorporateGovernancePagination = (state: RootState) => state.corporateGovernance?.pagination;

export default corporateGovernanceSlice.reducer;
