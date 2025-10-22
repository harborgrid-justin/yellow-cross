/**
 * WF-SLI-001 | social-securitySlice.ts - SocialSecurity Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface SocialSecurityItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface SocialSecurityState {
  items: SocialSecurityItem[];
  selectedItem: SocialSecurityItem | null;
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

const initialState: SocialSecurityState = {
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
const mockSocialSecurityApi = {
  getItems: async (_params?: any): Promise<{ data: SocialSecurityItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'SocialSecurity User 1',
          description: 'System social-securityistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'SocialSecurity User 2',
          description: 'Department social-security',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<SocialSecurityItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `SocialSecurity User ${id}`,
      description: 'Sample social-security user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<SocialSecurityItem>): Promise<SocialSecurityItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New SocialSecurity',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<SocialSecurityItem>): Promise<SocialSecurityItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated SocialSecurity',
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
export const fetchSocialSecurityItems = createAsyncThunk(
  'social-security/fetchItems', 
  async (params?: any) => mockSocialSecurityApi.getItems(params)
);

export const fetchSocialSecurityItem = createAsyncThunk(
  'social-security/fetchItem', 
  async (id: string) => mockSocialSecurityApi.getItem(id)
);

export const createSocialSecurityItem = createAsyncThunk(
  'social-security/createItem', 
  async (data: Partial<SocialSecurityItem>) => mockSocialSecurityApi.createItem(data)
);

export const updateSocialSecurityItem = createAsyncThunk(
  'social-security/updateItem', 
  async ({ id, data }: { id: string; data: Partial<SocialSecurityItem> }) => mockSocialSecurityApi.updateItem(id, data)
);

export const deleteSocialSecurityItem = createAsyncThunk(
  'social-security/deleteItem', 
  async (id: string) => {
    await mockSocialSecurityApi.deleteItem(id);
    return id;
  }
);

const socialSecuritySlice = createSlice({
  name: 'socialSecurity',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<SocialSecurityItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SocialSecurityState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<SocialSecurityState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `social-security_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<SocialSecurityState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchSocialSecurityItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchSocialSecurityItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchSocialSecurityItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch social-security items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchSocialSecurityItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchSocialSecurityItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchSocialSecurityItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch social-security item';
      });

    // Create Item
    builder
      .addCase(createSocialSecurityItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createSocialSecurityItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `social-security_create_${Date.now()}`,
          type: 'success',
          message: 'SocialSecurity item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createSocialSecurityItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create social-security item';
      });

    // Update Item
    builder
      .addCase(updateSocialSecurityItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateSocialSecurityItem.fulfilled, (state, action) => {
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
          id: `social-security_update_${Date.now()}`,
          type: 'success',
          message: 'SocialSecurity item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateSocialSecurityItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update social-security item';
      });

    // Delete Item
    builder
      .addCase(deleteSocialSecurityItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteSocialSecurityItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `social-security_delete_${Date.now()}`,
          type: 'success',
          message: 'SocialSecurity item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteSocialSecurityItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete social-security item';
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
} = socialSecuritySlice.actions;

// Selectors
export const selectSocialSecurityItems = (state: RootState) => state.socialSecurity?.items || [];
export const selectSocialSecurityItem = (state: RootState) => state.socialSecurity?.selectedItem;
export const selectSocialSecurityLoading = (state: RootState) => state.socialSecurity?.loading;
export const selectSocialSecurityError = (state: RootState) => state.socialSecurity?.error;
export const selectSocialSecurityFilters = (state: RootState) => state.socialSecurity?.filters || {};
export const selectSocialSecurityNotifications = (state: RootState) => state.socialSecurity?.notifications || [];
export const selectSocialSecurityPagination = (state: RootState) => state.socialSecurity?.pagination;

export default socialSecuritySlice.reducer;
