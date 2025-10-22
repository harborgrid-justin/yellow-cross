/**
 * WF-STO-001 | store/index.ts - EmploymentLaw Store Module Exports
 * Purpose: Central exports for employment-law store module
 * Dependencies: employment-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as employmentLawReducer } from './employment-lawSlice';

// Export actions
export {
  // EmploymentLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './employment-lawSlice';

// Export async thunks
export {
  // EmploymentLaw Management Thunks
  fetchEmploymentLawItems,
  fetchEmploymentLawItem,
  createEmploymentLawItem,
  updateEmploymentLawItem,
  deleteEmploymentLawItem,
} from './employment-lawSlice';

// Export selectors
export {
  selectEmploymentLawItems,
  selectEmploymentLawItem,
  selectEmploymentLawLoading,
  selectEmploymentLawError,
  selectEmploymentLawFilters,
  selectEmploymentLawNotifications,
  selectEmploymentLawPagination,
} from './employment-lawSlice';
