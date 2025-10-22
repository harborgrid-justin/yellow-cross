/**
 * WF-SLI-001 | personal-injurySlice.ts - PersonalInjury Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface PersonalInjuryItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface PersonalInjuryState {
  items: PersonalInjuryItem[];
  selectedItem: PersonalInjuryItem | null;
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

const initialState: PersonalInjuryState = {
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
const mockPersonalInjuryApi = {
  getItems: async (_params?: any): Promise<{ data: PersonalInjuryItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'PersonalInjury User 1',
          description: 'System personal-injuryistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'PersonalInjury User 2',
          description: 'Department personal-injury',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<PersonalInjuryItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `PersonalInjury User ${id}`,
      description: 'Sample personal-injury user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<PersonalInjuryItem>): Promise<PersonalInjuryItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New PersonalInjury',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<PersonalInjuryItem>): Promise<PersonalInjuryItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated PersonalInjury',
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
export const fetchPersonalInjuryItems = createAsyncThunk(
  'personal-injury/fetchItems', 
  async (params?: any) => mockPersonalInjuryApi.getItems(params)
);

export const fetchPersonalInjuryItem = createAsyncThunk(
  'personal-injury/fetchItem', 
  async (id: string) => mockPersonalInjuryApi.getItem(id)
);

export const createPersonalInjuryItem = createAsyncThunk(
  'personal-injury/createItem', 
  async (data: Partial<PersonalInjuryItem>) => mockPersonalInjuryApi.createItem(data)
);

export const updatePersonalInjuryItem = createAsyncThunk(
  'personal-injury/updateItem', 
  async ({ id, data }: { id: string; data: Partial<PersonalInjuryItem> }) => mockPersonalInjuryApi.updateItem(id, data)
);

export const deletePersonalInjuryItem = createAsyncThunk(
  'personal-injury/deleteItem', 
  async (id: string) => {
    await mockPersonalInjuryApi.deleteItem(id);
    return id;
  }
);

const personalInjurySlice = createSlice({
  name: 'personalInjury',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<PersonalInjuryItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<PersonalInjuryState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<PersonalInjuryState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `personal-injury_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<PersonalInjuryState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchPersonalInjuryItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchPersonalInjuryItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchPersonalInjuryItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch personal-injury items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchPersonalInjuryItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchPersonalInjuryItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchPersonalInjuryItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch personal-injury item';
      });

    // Create Item
    builder
      .addCase(createPersonalInjuryItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createPersonalInjuryItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `personal-injury_create_${Date.now()}`,
          type: 'success',
          message: 'PersonalInjury item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createPersonalInjuryItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create personal-injury item';
      });

    // Update Item
    builder
      .addCase(updatePersonalInjuryItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updatePersonalInjuryItem.fulfilled, (state, action) => {
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
          id: `personal-injury_update_${Date.now()}`,
          type: 'success',
          message: 'PersonalInjury item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updatePersonalInjuryItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update personal-injury item';
      });

    // Delete Item
    builder
      .addCase(deletePersonalInjuryItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deletePersonalInjuryItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `personal-injury_delete_${Date.now()}`,
          type: 'success',
          message: 'PersonalInjury item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deletePersonalInjuryItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete personal-injury item';
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
} = personalInjurySlice.actions;

// Selectors
export const selectPersonalInjuryItems = (state: RootState) => state.personalInjury?.items || [];
export const selectPersonalInjuryItem = (state: RootState) => state.personalInjury?.selectedItem;
export const selectPersonalInjuryLoading = (state: RootState) => state.personalInjury?.loading;
export const selectPersonalInjuryError = (state: RootState) => state.personalInjury?.error;
export const selectPersonalInjuryFilters = (state: RootState) => state.personalInjury?.filters || {};
export const selectPersonalInjuryNotifications = (state: RootState) => state.personalInjury?.notifications || [];
export const selectPersonalInjuryPagination = (state: RootState) => state.personalInjury?.pagination;

export default personalInjurySlice.reducer;
