/**
 * WF-STO-001 | store/index.ts - ImmigrationLaw Store Module Exports
 * Purpose: Central exports for immigration-law store module
 * Dependencies: immigration-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as immigrationLawReducer } from './immigration-lawSlice';

// Export actions
export {
  // ImmigrationLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './immigration-lawSlice';

// Export async thunks
export {
  // ImmigrationLaw Management Thunks
  fetchImmigrationLawItems,
  fetchImmigrationLawItem,
  createImmigrationLawItem,
  updateImmigrationLawItem,
  deleteImmigrationLawItem,
} from './immigration-lawSlice';

// Export selectors
export {
  selectImmigrationLawItems,
  selectImmigrationLawItem,
  selectImmigrationLawLoading,
  selectImmigrationLawError,
  selectImmigrationLawFilters,
  selectImmigrationLawNotifications,
  selectImmigrationLawPagination,
} from './immigration-lawSlice';
