/**
 * WF-SLI-001 | reporting-analyticsSlice.ts - ReportingAnalytics Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface ReportingAnalyticsItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ReportingAnalyticsState {
  items: ReportingAnalyticsItem[];
  selectedItem: ReportingAnalyticsItem | null;
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

const initialState: ReportingAnalyticsState = {
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
const mockReportingAnalyticsApi = {
  getItems: async (_params?: any): Promise<{ data: ReportingAnalyticsItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'ReportingAnalytics User 1',
          description: 'System reporting-analyticsistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'ReportingAnalytics User 2',
          description: 'Department reporting-analytics',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<ReportingAnalyticsItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `ReportingAnalytics User ${id}`,
      description: 'Sample reporting-analytics user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<ReportingAnalyticsItem>): Promise<ReportingAnalyticsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New ReportingAnalytics',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<ReportingAnalyticsItem>): Promise<ReportingAnalyticsItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated ReportingAnalytics',
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
export const fetchReportingAnalyticsItems = createAsyncThunk(
  'reporting-analytics/fetchItems', 
  async (params?: any) => mockReportingAnalyticsApi.getItems(params)
);

export const fetchReportingAnalyticsItem = createAsyncThunk(
  'reporting-analytics/fetchItem', 
  async (id: string) => mockReportingAnalyticsApi.getItem(id)
);

export const createReportingAnalyticsItem = createAsyncThunk(
  'reporting-analytics/createItem', 
  async (data: Partial<ReportingAnalyticsItem>) => mockReportingAnalyticsApi.createItem(data)
);

export const updateReportingAnalyticsItem = createAsyncThunk(
  'reporting-analytics/updateItem', 
  async ({ id, data }: { id: string; data: Partial<ReportingAnalyticsItem> }) => mockReportingAnalyticsApi.updateItem(id, data)
);

export const deleteReportingAnalyticsItem = createAsyncThunk(
  'reporting-analytics/deleteItem', 
  async (id: string) => {
    await mockReportingAnalyticsApi.deleteItem(id);
    return id;
  }
);

const reportingAnalyticsSlice = createSlice({
  name: 'reportingAnalytics',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ReportingAnalyticsItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ReportingAnalyticsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ReportingAnalyticsState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `reporting-analytics_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<ReportingAnalyticsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchReportingAnalyticsItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchReportingAnalyticsItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchReportingAnalyticsItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch reporting-analytics items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchReportingAnalyticsItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchReportingAnalyticsItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchReportingAnalyticsItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch reporting-analytics item';
      });

    // Create Item
    builder
      .addCase(createReportingAnalyticsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createReportingAnalyticsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `reporting-analytics_create_${Date.now()}`,
          type: 'success',
          message: 'ReportingAnalytics item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createReportingAnalyticsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create reporting-analytics item';
      });

    // Update Item
    builder
      .addCase(updateReportingAnalyticsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateReportingAnalyticsItem.fulfilled, (state, action) => {
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
          id: `reporting-analytics_update_${Date.now()}`,
          type: 'success',
          message: 'ReportingAnalytics item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateReportingAnalyticsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update reporting-analytics item';
      });

    // Delete Item
    builder
      .addCase(deleteReportingAnalyticsItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteReportingAnalyticsItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `reporting-analytics_delete_${Date.now()}`,
          type: 'success',
          message: 'ReportingAnalytics item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteReportingAnalyticsItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete reporting-analytics item';
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
} = reportingAnalyticsSlice.actions;

// Selectors
export const selectReportingAnalyticsItems = (state: RootState) => state.reportingAnalytics?.items || [];
export const selectReportingAnalyticsItem = (state: RootState) => state.reportingAnalytics?.selectedItem;
export const selectReportingAnalyticsLoading = (state: RootState) => state.reportingAnalytics?.loading;
export const selectReportingAnalyticsError = (state: RootState) => state.reportingAnalytics?.error;
export const selectReportingAnalyticsFilters = (state: RootState) => state.reportingAnalytics?.filters || {};
export const selectReportingAnalyticsNotifications = (state: RootState) => state.reportingAnalytics?.notifications || [];
export const selectReportingAnalyticsPagination = (state: RootState) => state.reportingAnalytics?.pagination;

export default reportingAnalyticsSlice.reducer;
