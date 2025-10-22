/**
 * WF-STO-001 | store/index.ts - SecuritiesLaw Store Module Exports
 * Purpose: Central exports for securities-law store module
 * Dependencies: securities-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as securitiesLawReducer } from './securities-lawSlice';

// Export actions
export {
  // SecuritiesLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './securities-lawSlice';

// Export async thunks
export {
  // SecuritiesLaw Management Thunks
  fetchSecuritiesLawItems,
  fetchSecuritiesLawItem,
  createSecuritiesLawItem,
  updateSecuritiesLawItem,
  deleteSecuritiesLawItem,
} from './securities-lawSlice';

// Export selectors
export {
  selectSecuritiesLawItems,
  selectSecuritiesLawItem,
  selectSecuritiesLawLoading,
  selectSecuritiesLawError,
  selectSecuritiesLawFilters,
  selectSecuritiesLawNotifications,
  selectSecuritiesLawPagination,
} from './securities-lawSlice';
