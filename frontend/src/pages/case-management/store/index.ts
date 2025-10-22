/**
 * WF-STO-001 | store/index.ts - CaseManagement Store Module Exports
 * Purpose: Central exports for case-management store module
 * Dependencies: case-managementSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as caseManagementReducer } from './case-managementSlice';

// Export actions
export {
  // CaseManagement Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './case-managementSlice';

// Export async thunks
export {
  // CaseManagement Management Thunks
  fetchCaseManagementItems,
  fetchCaseManagementItem,
  createCaseManagementItem,
  updateCaseManagementItem,
  deleteCaseManagementItem,
} from './case-managementSlice';

// Export selectors
export {
  selectCaseManagementItems,
  selectCaseManagementItem,
  selectCaseManagementLoading,
  selectCaseManagementError,
  selectCaseManagementFilters,
  selectCaseManagementNotifications,
  selectCaseManagementPagination,
} from './case-managementSlice';
