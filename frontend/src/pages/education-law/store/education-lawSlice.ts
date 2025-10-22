/**
 * WF-SLI-001 | education-lawSlice.ts - EducationLaw Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface EducationLawItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface EducationLawState {
  items: EducationLawItem[];
  selectedItem: EducationLawItem | null;
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

const initialState: EducationLawState = {
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
const mockEducationLawApi = {
  getItems: async (_params?: any): Promise<{ data: EducationLawItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'EducationLaw User 1',
          description: 'System education-lawistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'EducationLaw User 2',
          description: 'Department education-law',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<EducationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `EducationLaw User ${id}`,
      description: 'Sample education-law user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<EducationLawItem>): Promise<EducationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New EducationLaw',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<EducationLawItem>): Promise<EducationLawItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated EducationLaw',
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
export const fetchEducationLawItems = createAsyncThunk(
  'education-law/fetchItems', 
  async (params?: any) => mockEducationLawApi.getItems(params)
);

export const fetchEducationLawItem = createAsyncThunk(
  'education-law/fetchItem', 
  async (id: string) => mockEducationLawApi.getItem(id)
);

export const createEducationLawItem = createAsyncThunk(
  'education-law/createItem', 
  async (data: Partial<EducationLawItem>) => mockEducationLawApi.createItem(data)
);

export const updateEducationLawItem = createAsyncThunk(
  'education-law/updateItem', 
  async ({ id, data }: { id: string; data: Partial<EducationLawItem> }) => mockEducationLawApi.updateItem(id, data)
);

export const deleteEducationLawItem = createAsyncThunk(
  'education-law/deleteItem', 
  async (id: string) => {
    await mockEducationLawApi.deleteItem(id);
    return id;
  }
);

const educationLawSlice = createSlice({
  name: 'educationLaw',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<EducationLawItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EducationLawState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<EducationLawState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `education-law_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<EducationLawState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchEducationLawItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchEducationLawItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchEducationLawItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch education-law items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchEducationLawItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchEducationLawItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchEducationLawItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch education-law item';
      });

    // Create Item
    builder
      .addCase(createEducationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createEducationLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `education-law_create_${Date.now()}`,
          type: 'success',
          message: 'EducationLaw item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createEducationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create education-law item';
      });

    // Update Item
    builder
      .addCase(updateEducationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateEducationLawItem.fulfilled, (state, action) => {
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
          id: `education-law_update_${Date.now()}`,
          type: 'success',
          message: 'EducationLaw item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateEducationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update education-law item';
      });

    // Delete Item
    builder
      .addCase(deleteEducationLawItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteEducationLawItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `education-law_delete_${Date.now()}`,
          type: 'success',
          message: 'EducationLaw item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteEducationLawItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete education-law item';
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
} = educationLawSlice.actions;

// Selectors
export const selectEducationLawItems = (state: RootState) => state.educationLaw?.items || [];
export const selectEducationLawItem = (state: RootState) => state.educationLaw?.selectedItem;
export const selectEducationLawLoading = (state: RootState) => state.educationLaw?.loading;
export const selectEducationLawError = (state: RootState) => state.educationLaw?.error;
export const selectEducationLawFilters = (state: RootState) => state.educationLaw?.filters || {};
export const selectEducationLawNotifications = (state: RootState) => state.educationLaw?.notifications || [];
export const selectEducationLawPagination = (state: RootState) => state.educationLaw?.pagination;

export default educationLawSlice.reducer;
