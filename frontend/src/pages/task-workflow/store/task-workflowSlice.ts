/**
 * WF-SLI-001 | task-workflowSlice.ts - TaskWorkflow Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface TaskWorkflowItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface TaskWorkflowState {
  items: TaskWorkflowItem[];
  selectedItem: TaskWorkflowItem | null;
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

const initialState: TaskWorkflowState = {
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
const mockTaskWorkflowApi = {
  getItems: async (_params?: any): Promise<{ data: TaskWorkflowItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'TaskWorkflow User 1',
          description: 'System task-workflowistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'TaskWorkflow User 2',
          description: 'Department task-workflow',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<TaskWorkflowItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `TaskWorkflow User ${id}`,
      description: 'Sample task-workflow user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<TaskWorkflowItem>): Promise<TaskWorkflowItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New TaskWorkflow',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<TaskWorkflowItem>): Promise<TaskWorkflowItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated TaskWorkflow',
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
export const fetchTaskWorkflowItems = createAsyncThunk(
  'task-workflow/fetchItems', 
  async (params?: any) => mockTaskWorkflowApi.getItems(params)
);

export const fetchTaskWorkflowItem = createAsyncThunk(
  'task-workflow/fetchItem', 
  async (id: string) => mockTaskWorkflowApi.getItem(id)
);

export const createTaskWorkflowItem = createAsyncThunk(
  'task-workflow/createItem', 
  async (data: Partial<TaskWorkflowItem>) => mockTaskWorkflowApi.createItem(data)
);

export const updateTaskWorkflowItem = createAsyncThunk(
  'task-workflow/updateItem', 
  async ({ id, data }: { id: string; data: Partial<TaskWorkflowItem> }) => mockTaskWorkflowApi.updateItem(id, data)
);

export const deleteTaskWorkflowItem = createAsyncThunk(
  'task-workflow/deleteItem', 
  async (id: string) => {
    await mockTaskWorkflowApi.deleteItem(id);
    return id;
  }
);

const taskWorkflowSlice = createSlice({
  name: 'taskWorkflow',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<TaskWorkflowItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TaskWorkflowState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<TaskWorkflowState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `task-workflow_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<TaskWorkflowState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchTaskWorkflowItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchTaskWorkflowItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchTaskWorkflowItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch task-workflow items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchTaskWorkflowItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchTaskWorkflowItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchTaskWorkflowItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch task-workflow item';
      });

    // Create Item
    builder
      .addCase(createTaskWorkflowItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createTaskWorkflowItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `task-workflow_create_${Date.now()}`,
          type: 'success',
          message: 'TaskWorkflow item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createTaskWorkflowItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create task-workflow item';
      });

    // Update Item
    builder
      .addCase(updateTaskWorkflowItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateTaskWorkflowItem.fulfilled, (state, action) => {
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
          id: `task-workflow_update_${Date.now()}`,
          type: 'success',
          message: 'TaskWorkflow item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateTaskWorkflowItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update task-workflow item';
      });

    // Delete Item
    builder
      .addCase(deleteTaskWorkflowItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteTaskWorkflowItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `task-workflow_delete_${Date.now()}`,
          type: 'success',
          message: 'TaskWorkflow item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteTaskWorkflowItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete task-workflow item';
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
} = taskWorkflowSlice.actions;

// Selectors
export const selectTaskWorkflowItems = (state: RootState) => state.taskWorkflow?.items || [];
export const selectTaskWorkflowItem = (state: RootState) => state.taskWorkflow?.selectedItem;
export const selectTaskWorkflowLoading = (state: RootState) => state.taskWorkflow?.loading;
export const selectTaskWorkflowError = (state: RootState) => state.taskWorkflow?.error;
export const selectTaskWorkflowFilters = (state: RootState) => state.taskWorkflow?.filters || {};
export const selectTaskWorkflowNotifications = (state: RootState) => state.taskWorkflow?.notifications || [];
export const selectTaskWorkflowPagination = (state: RootState) => state.taskWorkflow?.pagination;

export default taskWorkflowSlice.reducer;
