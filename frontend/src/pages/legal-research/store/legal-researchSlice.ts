/**
 * WF-SLI-001 | legal-researchSlice.ts - LegalResearch Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface LegalResearchItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface LegalResearchState {
  items: LegalResearchItem[];
  selectedItem: LegalResearchItem | null;
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

const initialState: LegalResearchState = {
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
const mockLegalResearchApi = {
  getItems: async (_params?: any): Promise<{ data: LegalResearchItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'LegalResearch User 1',
          description: 'System legal-researchistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'LegalResearch User 2',
          description: 'Department legal-research',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<LegalResearchItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `LegalResearch User ${id}`,
      description: 'Sample legal-research user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<LegalResearchItem>): Promise<LegalResearchItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New LegalResearch',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<LegalResearchItem>): Promise<LegalResearchItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated LegalResearch',
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
export const fetchLegalResearchItems = createAsyncThunk(
  'legal-research/fetchItems', 
  async (params?: any) => mockLegalResearchApi.getItems(params)
);

export const fetchLegalResearchItem = createAsyncThunk(
  'legal-research/fetchItem', 
  async (id: string) => mockLegalResearchApi.getItem(id)
);

export const createLegalResearchItem = createAsyncThunk(
  'legal-research/createItem', 
  async (data: Partial<LegalResearchItem>) => mockLegalResearchApi.createItem(data)
);

export const updateLegalResearchItem = createAsyncThunk(
  'legal-research/updateItem', 
  async ({ id, data }: { id: string; data: Partial<LegalResearchItem> }) => mockLegalResearchApi.updateItem(id, data)
);

export const deleteLegalResearchItem = createAsyncThunk(
  'legal-research/deleteItem', 
  async (id: string) => {
    await mockLegalResearchApi.deleteItem(id);
    return id;
  }
);

const legalResearchSlice = createSlice({
  name: 'legalResearch',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<LegalResearchItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LegalResearchState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<LegalResearchState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `legal-research_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<LegalResearchState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchLegalResearchItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchLegalResearchItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchLegalResearchItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch legal-research items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchLegalResearchItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchLegalResearchItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchLegalResearchItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch legal-research item';
      });

    // Create Item
    builder
      .addCase(createLegalResearchItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createLegalResearchItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `legal-research_create_${Date.now()}`,
          type: 'success',
          message: 'LegalResearch item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createLegalResearchItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create legal-research item';
      });

    // Update Item
    builder
      .addCase(updateLegalResearchItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateLegalResearchItem.fulfilled, (state, action) => {
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
          id: `legal-research_update_${Date.now()}`,
          type: 'success',
          message: 'LegalResearch item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateLegalResearchItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update legal-research item';
      });

    // Delete Item
    builder
      .addCase(deleteLegalResearchItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteLegalResearchItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `legal-research_delete_${Date.now()}`,
          type: 'success',
          message: 'LegalResearch item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteLegalResearchItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete legal-research item';
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
} = legalResearchSlice.actions;

// Selectors
export const selectLegalResearchItems = (state: RootState) => state.legalResearch?.items || [];
export const selectLegalResearchItem = (state: RootState) => state.legalResearch?.selectedItem;
export const selectLegalResearchLoading = (state: RootState) => state.legalResearch?.loading;
export const selectLegalResearchError = (state: RootState) => state.legalResearch?.error;
export const selectLegalResearchFilters = (state: RootState) => state.legalResearch?.filters || {};
export const selectLegalResearchNotifications = (state: RootState) => state.legalResearch?.notifications || [];
export const selectLegalResearchPagination = (state: RootState) => state.legalResearch?.pagination;

export default legalResearchSlice.reducer;
