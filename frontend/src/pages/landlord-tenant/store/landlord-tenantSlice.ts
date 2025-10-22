/**
 * WF-SLI-001 | landlord-tenantSlice.ts - LandlordTenant Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface LandlordTenantItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface LandlordTenantState {
  items: LandlordTenantItem[];
  selectedItem: LandlordTenantItem | null;
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

const initialState: LandlordTenantState = {
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
const mockLandlordTenantApi = {
  getItems: async (_params?: any): Promise<{ data: LandlordTenantItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'LandlordTenant User 1',
          description: 'System landlord-tenantistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'LandlordTenant User 2',
          description: 'Department landlord-tenant',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<LandlordTenantItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `LandlordTenant User ${id}`,
      description: 'Sample landlord-tenant user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<LandlordTenantItem>): Promise<LandlordTenantItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New LandlordTenant',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<LandlordTenantItem>): Promise<LandlordTenantItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated LandlordTenant',
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
export const fetchLandlordTenantItems = createAsyncThunk(
  'landlord-tenant/fetchItems', 
  async (params?: any) => mockLandlordTenantApi.getItems(params)
);

export const fetchLandlordTenantItem = createAsyncThunk(
  'landlord-tenant/fetchItem', 
  async (id: string) => mockLandlordTenantApi.getItem(id)
);

export const createLandlordTenantItem = createAsyncThunk(
  'landlord-tenant/createItem', 
  async (data: Partial<LandlordTenantItem>) => mockLandlordTenantApi.createItem(data)
);

export const updateLandlordTenantItem = createAsyncThunk(
  'landlord-tenant/updateItem', 
  async ({ id, data }: { id: string; data: Partial<LandlordTenantItem> }) => mockLandlordTenantApi.updateItem(id, data)
);

export const deleteLandlordTenantItem = createAsyncThunk(
  'landlord-tenant/deleteItem', 
  async (id: string) => {
    await mockLandlordTenantApi.deleteItem(id);
    return id;
  }
);

const landlordTenantSlice = createSlice({
  name: 'landlordTenant',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<LandlordTenantItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LandlordTenantState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<LandlordTenantState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `landlord-tenant_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<LandlordTenantState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchLandlordTenantItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchLandlordTenantItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchLandlordTenantItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch landlord-tenant items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchLandlordTenantItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchLandlordTenantItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchLandlordTenantItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch landlord-tenant item';
      });

    // Create Item
    builder
      .addCase(createLandlordTenantItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createLandlordTenantItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `landlord-tenant_create_${Date.now()}`,
          type: 'success',
          message: 'LandlordTenant item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createLandlordTenantItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create landlord-tenant item';
      });

    // Update Item
    builder
      .addCase(updateLandlordTenantItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateLandlordTenantItem.fulfilled, (state, action) => {
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
          id: `landlord-tenant_update_${Date.now()}`,
          type: 'success',
          message: 'LandlordTenant item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateLandlordTenantItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update landlord-tenant item';
      });

    // Delete Item
    builder
      .addCase(deleteLandlordTenantItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteLandlordTenantItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `landlord-tenant_delete_${Date.now()}`,
          type: 'success',
          message: 'LandlordTenant item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteLandlordTenantItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete landlord-tenant item';
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
} = landlordTenantSlice.actions;

// Selectors
export const selectLandlordTenantItems = (state: RootState) => state.landlordTenant?.items || [];
export const selectLandlordTenantItem = (state: RootState) => state.landlordTenant?.selectedItem;
export const selectLandlordTenantLoading = (state: RootState) => state.landlordTenant?.loading;
export const selectLandlordTenantError = (state: RootState) => state.landlordTenant?.error;
export const selectLandlordTenantFilters = (state: RootState) => state.landlordTenant?.filters || {};
export const selectLandlordTenantNotifications = (state: RootState) => state.landlordTenant?.notifications || [];
export const selectLandlordTenantPagination = (state: RootState) => state.landlordTenant?.pagination;

export default landlordTenantSlice.reducer;
