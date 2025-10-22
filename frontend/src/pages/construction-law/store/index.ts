/**
 * WF-STO-001 | store/index.ts - ConstructionLaw Store Module Exports
 * Purpose: Central exports for construction-law store module
 * Dependencies: construction-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as constructionLawReducer } from './construction-lawSlice';

// Export actions
export {
  // ConstructionLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './construction-lawSlice';

// Export async thunks
export {
  // ConstructionLaw Management Thunks
  fetchConstructionLawItems,
  fetchConstructionLawItem,
  createConstructionLawItem,
  updateConstructionLawItem,
  deleteConstructionLawItem,
} from './construction-lawSlice';

// Export selectors
export {
  selectConstructionLawItems,
  selectConstructionLawItem,
  selectConstructionLawLoading,
  selectConstructionLawError,
  selectConstructionLawFilters,
  selectConstructionLawNotifications,
  selectConstructionLawPagination,
} from './construction-lawSlice';
