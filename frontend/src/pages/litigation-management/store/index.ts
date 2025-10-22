/**
 * WF-STO-001 | store/index.ts - LitigationManagement Store Module Exports
 * Purpose: Central exports for litigation-management store module
 * Dependencies: litigation-managementSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as litigationManagementReducer } from './litigation-managementSlice';

// Export actions
export {
  // LitigationManagement Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './litigation-managementSlice';

// Export async thunks
export {
  // LitigationManagement Management Thunks
  fetchLitigationManagementItems,
  fetchLitigationManagementItem,
  createLitigationManagementItem,
  updateLitigationManagementItem,
  deleteLitigationManagementItem,
} from './litigation-managementSlice';

// Export selectors
export {
  selectLitigationManagementItems,
  selectLitigationManagementItem,
  selectLitigationManagementLoading,
  selectLitigationManagementError,
  selectLitigationManagementFilters,
  selectLitigationManagementNotifications,
  selectLitigationManagementPagination,
} from './litigation-managementSlice';
