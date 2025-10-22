/**
 * WF-STO-001 | store/index.ts - NonProfitLaw Store Module Exports
 * Purpose: Central exports for non-profit-law store module
 * Dependencies: non-profit-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as nonProfitLawReducer } from './non-profit-lawSlice';

// Export actions
export {
  // NonProfitLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './non-profit-lawSlice';

// Export async thunks
export {
  // NonProfitLaw Management Thunks
  fetchNonProfitLawItems,
  fetchNonProfitLawItem,
  createNonProfitLawItem,
  updateNonProfitLawItem,
  deleteNonProfitLawItem,
} from './non-profit-lawSlice';

// Export selectors
export {
  selectNonProfitLawItems,
  selectNonProfitLawItem,
  selectNonProfitLawLoading,
  selectNonProfitLawError,
  selectNonProfitLawFilters,
  selectNonProfitLawNotifications,
  selectNonProfitLawPagination,
} from './non-profit-lawSlice';
