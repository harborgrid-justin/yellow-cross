/**
 * WF-STO-001 | store/index.ts - FranchiseLaw Store Module Exports
 * Purpose: Central exports for franchise-law store module
 * Dependencies: franchise-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as franchiseLawReducer } from './franchise-lawSlice';

// Export actions
export {
  // FranchiseLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './franchise-lawSlice';

// Export async thunks
export {
  // FranchiseLaw Management Thunks
  fetchFranchiseLawItems,
  fetchFranchiseLawItem,
  createFranchiseLawItem,
  updateFranchiseLawItem,
  deleteFranchiseLawItem,
} from './franchise-lawSlice';

// Export selectors
export {
  selectFranchiseLawItems,
  selectFranchiseLawItem,
  selectFranchiseLawLoading,
  selectFranchiseLawError,
  selectFranchiseLawFilters,
  selectFranchiseLawNotifications,
  selectFranchiseLawPagination,
} from './franchise-lawSlice';
