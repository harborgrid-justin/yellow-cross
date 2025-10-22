/**
 * WF-STO-001 | store/index.ts - DocumentManagement Store Module Exports
 * Purpose: Central exports for document-management store module
 * Dependencies: document-managementSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as documentManagementReducer } from './document-managementSlice';

// Export actions
export {
  // DocumentManagement Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './document-managementSlice';

// Export async thunks
export {
  // DocumentManagement Management Thunks
  fetchDocumentManagementItems,
  fetchDocumentManagementItem,
  createDocumentManagementItem,
  updateDocumentManagementItem,
  deleteDocumentManagementItem,
} from './document-managementSlice';

// Export selectors
export {
  selectDocumentManagementItems,
  selectDocumentManagementItem,
  selectDocumentManagementLoading,
  selectDocumentManagementError,
  selectDocumentManagementFilters,
  selectDocumentManagementNotifications,
  selectDocumentManagementPagination,
} from './document-managementSlice';
