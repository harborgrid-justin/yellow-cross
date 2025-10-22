/**
 * WF-STO-001 | store/index.ts - MunicipalLaw Store Module Exports
 * Purpose: Central exports for municipal-law store module
 * Dependencies: municipal-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as municipalLawReducer } from './municipal-lawSlice';

// Export actions
export {
  // MunicipalLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './municipal-lawSlice';

// Export async thunks
export {
  // MunicipalLaw Management Thunks
  fetchMunicipalLawItems,
  fetchMunicipalLawItem,
  createMunicipalLawItem,
  updateMunicipalLawItem,
  deleteMunicipalLawItem,
} from './municipal-lawSlice';

// Export selectors
export {
  selectMunicipalLawItems,
  selectMunicipalLawItem,
  selectMunicipalLawLoading,
  selectMunicipalLawError,
  selectMunicipalLawFilters,
  selectMunicipalLawNotifications,
  selectMunicipalLawPagination,
} from './municipal-lawSlice';
