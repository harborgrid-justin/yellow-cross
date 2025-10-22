/**
 * WF-SLI-001 | complianceSlice.ts - Compliance Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ComplianceItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ComplianceState {
  items: ComplianceItem[];
  selectedItem: ComplianceItem | null;
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

const initialState: ComplianceState = {
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
const mockComplianceApi = {
  getItems: async (_params?: any): Promise<{ data: ComplianceItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'Compliance User 1',
          description: 'System complianceistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Compliance User 2',
          description: 'Department compliance',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ComplianceItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `Compliance User ${id}`,
      description: 'Sample compliance user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ComplianceItem>): Promise<ComplianceItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New Compliance',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ComplianceItem>): Promise<ComplianceItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated Compliance',
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
export const fetchComplianceItems = createAsyncThunk(
  'compliance/fetchItems', 
  async (params?: any) => mockComplianceApi.getItems(params)
);

export const fetchComplianceItem = createAsyncThunk(
  'compliance/fetchItem', 
  async (id: string) => mockComplianceApi.getItem(id)
);

export const createComplianceItem = createAsyncThunk(
  'compliance/createItem', 
  async (data: Partial<ComplianceItem>) => mockComplianceApi.createItem(data)
);

export const updateComplianceItem = createAsyncThunk(
  'compliance/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ComplianceItem> }) => mockComplianceApi.updateItem(id, data)
);

export const deleteComplianceItem = createAsyncThunk(
  'compliance/deleteItem', 
  async (id: string) => {
    await mockComplianceApi.deleteItem(id);
    return id;
  }
);

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ComplianceItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ComplianceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ComplianceState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `compliance_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ComplianceState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchComplianceItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchComplianceItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchComplianceItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch compliance items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchComplianceItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchComplianceItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchComplianceItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch compliance item';
      });

    // Create Item
    builder
      .addCase(createComplianceItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createComplianceItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `compliance_create_${Date.now()}`,
          type: 'success',
          message: 'Compliance item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createComplianceItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create compliance item';
      });

    // Update Item
    builder
      .addCase(updateComplianceItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateComplianceItem.fulfilled, (state, action) => {
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
          id: `compliance_update_${Date.now()}`,
          type: 'success',
          message: 'Compliance item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateComplianceItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update compliance item';
      });

    // Delete Item
    builder
      .addCase(deleteComplianceItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteComplianceItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `compliance_delete_${Date.now()}`,
          type: 'success',
          message: 'Compliance item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteComplianceItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete compliance item';
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
} = complianceSlice.actions;

// Selectors
export const selectComplianceItems = (state: RootState) => state.compliance?.items || [];
export const selectComplianceItem = (state: RootState) => state.compliance?.selectedItem;
export const selectComplianceLoading = (state: RootState) => state.compliance?.loading;
export const selectComplianceError = (state: RootState) => state.compliance?.error;
export const selectComplianceFilters = (state: RootState) => state.compliance?.filters || {};
export const selectComplianceNotifications = (state: RootState) => state.compliance?.notifications || [];
export const selectCompliancePagination = (state: RootState) => state.compliance?.pagination;

export default complianceSlice.reducer;
