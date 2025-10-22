/**
 * WF-SLI-001 | document-managementSlice.ts - DocumentManagement Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store/store';

// Types
interface DocumentManagementItem {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface DocumentManagementState {
  items: DocumentManagementItem[];
  selectedItem: DocumentManagementItem | null;
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

const initialState: DocumentManagementState = {
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
const mockDocumentManagementApi = {
  getItems: async (_params?: any): Promise<{ data: DocumentManagementItem[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: '1',
          name: 'DocumentManagement User 1',
          description: 'System document-managementistrator',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'DocumentManagement User 2',
          description: 'Department document-management',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  },
  getItem: async (id: string): Promise<DocumentManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: `DocumentManagement User ${id}`,
      description: 'Sample document-management user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  createItem: async (data: Partial<DocumentManagementItem>): Promise<DocumentManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      name: data.name || 'New DocumentManagement',
      description: data.description,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  updateItem: async (id: string, data: Partial<DocumentManagementItem>): Promise<DocumentManagementItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: data.name || 'Updated DocumentManagement',
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
export const fetchDocumentManagementItems = createAsyncThunk(
  'document-management/fetchItems', 
  async (params?: any) => mockDocumentManagementApi.getItems(params)
);

export const fetchDocumentManagementItem = createAsyncThunk(
  'document-management/fetchItem', 
  async (id: string) => mockDocumentManagementApi.getItem(id)
);

export const createDocumentManagementItem = createAsyncThunk(
  'document-management/createItem', 
  async (data: Partial<DocumentManagementItem>) => mockDocumentManagementApi.createItem(data)
);

export const updateDocumentManagementItem = createAsyncThunk(
  'document-management/updateItem', 
  async ({ id, data }: { id: string; data: Partial<DocumentManagementItem> }) => mockDocumentManagementApi.updateItem(id, data)
);

export const deleteDocumentManagementItem = createAsyncThunk(
  'document-management/deleteItem', 
  async (id: string) => {
    await mockDocumentManagementApi.deleteItem(id);
    return id;
  }
);

const documentManagementSlice = createSlice({
  name: 'documentManagement',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<DocumentManagementItem | null>) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<DocumentManagementState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<DocumentManagementState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: `document-management_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setPagination: (state, action: PayloadAction<Partial<DocumentManagementState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch Items
    builder
      .addCase(fetchDocumentManagementItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchDocumentManagementItems.fulfilled, (state, action) => {
        state.loading.items = false;
        const payload: any = action.payload;
        state.items = payload.data?.items || payload.items || payload.data || payload || [];
        
        // Handle pagination if included in response
        if (payload.pagination) {
          state.pagination = payload.pagination;
        }
      })
      .addCase(fetchDocumentManagementItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch document-management items';
      });

    // Fetch Single Item
    builder
      .addCase(fetchDocumentManagementItem.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchDocumentManagementItem.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchDocumentManagementItem.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch document-management item';
      });

    // Create Item
    builder
      .addCase(createDocumentManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(createDocumentManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.items.unshift(action.payload);
        state.notifications.push({
          id: `document-management_create_${Date.now()}`,
          type: 'success',
          message: 'DocumentManagement item created successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(createDocumentManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create document-management item';
      });

    // Update Item
    builder
      .addCase(updateDocumentManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(updateDocumentManagementItem.fulfilled, (state, action) => {
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
          id: `document-management_update_${Date.now()}`,
          type: 'success',
          message: 'DocumentManagement item updated successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(updateDocumentManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update document-management item';
      });

    // Delete Item
    builder
      .addCase(deleteDocumentManagementItem.pending, (state) => {
        state.loading.operations = true;
        state.error = null;
      })
      .addCase(deleteDocumentManagementItem.fulfilled, (state, action) => {
        state.loading.operations = false;
        const deletedId = action.payload;
        state.items = state.items.filter(item => item.id !== deletedId);
        if (state.selectedItem?.id === deletedId) {
          state.selectedItem = null;
        }
        state.notifications.push({
          id: `document-management_delete_${Date.now()}`,
          type: 'success',
          message: 'DocumentManagement item deleted successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(deleteDocumentManagementItem.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete document-management item';
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
} = documentManagementSlice.actions;

// Selectors
export const selectDocumentManagementItems = (state: RootState) => state.documentManagement?.items || [];
export const selectDocumentManagementItem = (state: RootState) => state.documentManagement?.selectedItem;
export const selectDocumentManagementLoading = (state: RootState) => state.documentManagement?.loading;
export const selectDocumentManagementError = (state: RootState) => state.documentManagement?.error;
export const selectDocumentManagementFilters = (state: RootState) => state.documentManagement?.filters || {};
export const selectDocumentManagementNotifications = (state: RootState) => state.documentManagement?.notifications || [];
export const selectDocumentManagementPagination = (state: RootState) => state.documentManagement?.pagination;

export default documentManagementSlice.reducer;
