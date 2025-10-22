/**
 * WF-STO-001 | store/index.ts - Compliance Store Module Exports
 * Purpose: Central exports for compliance store module
 * Dependencies: complianceSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as complianceReducer } from './complianceSlice';

// Export actions
export {
  // Compliance Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './complianceSlice';

// Export async thunks
export {
  // Compliance Management Thunks
  fetchComplianceItems,
  fetchComplianceItem,
  createComplianceItem,
  updateComplianceItem,
  deleteComplianceItem,
} from './complianceSlice';

// Export selectors
export {
  selectComplianceItems,
  selectComplianceItem,
  selectComplianceLoading,
  selectComplianceError,
  selectComplianceFilters,
  selectComplianceNotifications,
  selectCompliancePagination,
} from './complianceSlice';
