/**
 * WF-SLI-001 | calendar-schedulingSlice.ts - CalendarScheduling Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface CalendarSchedulingItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CalendarSchedulingState {
  items: CalendarSchedulingItem[];
  selectedItem: CalendarSchedulingItem | null;
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

const initialState: CalendarSchedulingState = {
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
const mockCalendarSchedulingApi = {
  getItems: async (_params?: any): Promise<{ data: CalendarSchedulingItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'CalendarScheduling User 1',
          description: 'System calendar-schedulingistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'CalendarScheduling User 2',
          description: 'Department calendar-scheduling',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<CalendarSchedulingItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `CalendarScheduling User ${id}`,
      description: 'Sample calendar-scheduling user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<CalendarSchedulingItem>): Promise<CalendarSchedulingItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New CalendarScheduling',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<CalendarSchedulingItem>): Promise<CalendarSchedulingItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated CalendarScheduling',
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
export const fetchCalendarSchedulingItems = createAsyncThunk(
  'calendar-scheduling/fetchItems', 
  async (params?: any) => mockCalendarSchedulingApi.getItems(params)
);

export const fetchCalendarSchedulingItem = createAsyncThunk(
  'calendar-scheduling/fetchItem', 
  async (id: string) => mockCalendarSchedulingApi.getItem(id)
);

export const createCalendarSchedulingItem = createAsyncThunk(
  'calendar-scheduling/createItem', 
  async (data: Partial<CalendarSchedulingItem>) => mockCalendarSchedulingApi.createItem(data)
);

export const updateCalendarSchedulingItem = createAsyncThunk(
  'calendar-scheduling/updateItem', 
  async ({ id, data }: { id: string; data: Partial<CalendarSchedulingItem> }) => mockCalendarSchedulingApi.updateItem(id, data)
);

export const deleteCalendarSchedulingItem = createAsyncThunk(
  'calendar-scheduling/deleteItem', 
  async (id: string) => {
    await mockCalendarSchedulingApi.deleteItem(id);
    return id;
  }
);

const calendarSchedulingSlice = createSlice({
  name: 'calendarScheduling',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<CalendarSchedulingItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CalendarSchedulingState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<CalendarSchedulingState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `calendar-scheduling_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<CalendarSchedulingState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchCalendarSchedulingItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchCalendarSchedulingItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchCalendarSchedulingItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch calendar-scheduling items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchCalendarSchedulingItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchCalendarSchedulingItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchCalendarSchedulingItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch calendar-scheduling item';
      });

    // Create Item
    builder
      .addCase(createCalendarSchedulingItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createCalendarSchedulingItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `calendar-scheduling_create_${Date.now()}`,
          type: 'success',
          message: 'CalendarScheduling item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createCalendarSchedulingItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create calendar-scheduling item';
      });

    // Update Item
    builder
      .addCase(updateCalendarSchedulingItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateCalendarSchedulingItem.fulfilled, (state, action) => {
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
          id: `calendar-scheduling_update_${Date.now()}`,
          type: 'success',
          message: 'CalendarScheduling item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateCalendarSchedulingItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update calendar-scheduling item';
      });

    // Delete Item
    builder
      .addCase(deleteCalendarSchedulingItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteCalendarSchedulingItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `calendar-scheduling_delete_${Date.now()}`,
          type: 'success',
          message: 'CalendarScheduling item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteCalendarSchedulingItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete calendar-scheduling item';
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
} = calendarSchedulingSlice.actions;

// Selectors
export const selectCalendarSchedulingItems = (state: RootState) => state.calendarScheduling?.items || [];
export const selectCalendarSchedulingItem = (state: RootState) => state.calendarScheduling?.selectedItem;
export const selectCalendarSchedulingLoading = (state: RootState) => state.calendarScheduling?.loading;
export const selectCalendarSchedulingError = (state: RootState) => state.calendarScheduling?.error;
export const selectCalendarSchedulingFilters = (state: RootState) => state.calendarScheduling?.filters || {};
export const selectCalendarSchedulingNotifications = (state: RootState) => state.calendarScheduling?.notifications || [];
export const selectCalendarSchedulingPagination = (state: RootState) => state.calendarScheduling?.pagination;

export default calendarSchedulingSlice.reducer;
