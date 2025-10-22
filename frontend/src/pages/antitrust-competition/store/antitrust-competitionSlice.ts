/**
 * WF-SLI-001 | antitrust-competitionSlice.ts - AntitrustCompetition Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface AntitrustCompetitionItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface AntitrustCompetitionState {
  items: AntitrustCompetitionItem[];
  selectedItem: AntitrustCompetitionItem | null;
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

const initialState: AntitrustCompetitionState = {
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
const mockAntitrustCompetitionApi = {
  getItems: async (_params?: any): Promise<{ data: AntitrustCompetitionItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'AntitrustCompetition User 1',
          description: 'System antitrust-competitionistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'AntitrustCompetition User 2',
          description: 'Department antitrust-competition',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<AntitrustCompetitionItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `AntitrustCompetition User ${id}`,
      description: 'Sample antitrust-competition user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<AntitrustCompetitionItem>): Promise<AntitrustCompetitionItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New AntitrustCompetition',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<AntitrustCompetitionItem>): Promise<AntitrustCompetitionItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated AntitrustCompetition',
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
export const fetchAntitrustCompetitionItems = createAsyncThunk(
  'antitrust-competition/fetchItems', 
  async (params?: any) => mockAntitrustCompetitionApi.getItems(params)
);

export const fetchAntitrustCompetitionItem = createAsyncThunk(
  'antitrust-competition/fetchItem', 
  async (id: string) => mockAntitrustCompetitionApi.getItem(id)
);

export const createAntitrustCompetitionItem = createAsyncThunk(
  'antitrust-competition/createItem', 
  async (data: Partial<AntitrustCompetitionItem>) => mockAntitrustCompetitionApi.createItem(data)
);

export const updateAntitrustCompetitionItem = createAsyncThunk(
  'antitrust-competition/updateItem', 
  async ({ id, data }: { id: string; data: Partial<AntitrustCompetitionItem> }) => mockAntitrustCompetitionApi.updateItem(id, data)
);

export const deleteAntitrustCompetitionItem = createAsyncThunk(
  'antitrust-competition/deleteItem', 
  async (id: string) => {
    await mockAntitrustCompetitionApi.deleteItem(id);
    return id;
  }
);

const antitrustCompetitionSlice = createSlice({
  name: 'antitrustCompetition',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<AntitrustCompetitionItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AntitrustCompetitionState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<AntitrustCompetitionState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `antitrust-competition_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<AntitrustCompetitionState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchAntitrustCompetitionItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchAntitrustCompetitionItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchAntitrustCompetitionItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch antitrust-competition items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchAntitrustCompetitionItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchAntitrustCompetitionItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchAntitrustCompetitionItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch antitrust-competition item';
      });

    // Create Item
    builder
      .addCase(createAntitrustCompetitionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createAntitrustCompetitionItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `antitrust-competition_create_${Date.now()}`,
          type: 'success',
          message: 'AntitrustCompetition item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createAntitrustCompetitionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create antitrust-competition item';
      });

    // Update Item
    builder
      .addCase(updateAntitrustCompetitionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateAntitrustCompetitionItem.fulfilled, (state, action) => {
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
          id: `antitrust-competition_update_${Date.now()}`,
          type: 'success',
          message: 'AntitrustCompetition item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateAntitrustCompetitionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update antitrust-competition item';
      });

    // Delete Item
    builder
      .addCase(deleteAntitrustCompetitionItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteAntitrustCompetitionItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `antitrust-competition_delete_${Date.now()}`,
          type: 'success',
          message: 'AntitrustCompetition item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteAntitrustCompetitionItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete antitrust-competition item';
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
} = antitrustCompetitionSlice.actions;

// Selectors
export const selectAntitrustCompetitionItems = (state: RootState) => state.antitrustCompetition?.items || [];
export const selectAntitrustCompetitionItem = (state: RootState) => state.antitrustCompetition?.selectedItem;
export const selectAntitrustCompetitionLoading = (state: RootState) => state.antitrustCompetition?.loading;
export const selectAntitrustCompetitionError = (state: RootState) => state.antitrustCompetition?.error;
export const selectAntitrustCompetitionFilters = (state: RootState) => state.antitrustCompetition?.filters || {};
export const selectAntitrustCompetitionNotifications = (state: RootState) => state.antitrustCompetition?.notifications || [];
export const selectAntitrustCompetitionPagination = (state: RootState) => state.antitrustCompetition?.pagination;

export default antitrustCompetitionSlice.reducer;
