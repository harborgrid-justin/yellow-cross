/**
 * WF-STO-001 | store/index.ts - EnvironmentalLaw Store Module Exports
 * Purpose: Central exports for environmental-law store module
 * Dependencies: environmental-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as environmentalLawReducer } from './environmental-lawSlice';

// Export actions
export {
  // EnvironmentalLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './environmental-lawSlice';

// Export async thunks
export {
  // EnvironmentalLaw Management Thunks
  fetchEnvironmentalLawItems,
  fetchEnvironmentalLawItem,
  createEnvironmentalLawItem,
  updateEnvironmentalLawItem,
  deleteEnvironmentalLawItem,
} from './environmental-lawSlice';

// Export selectors
export {
  selectEnvironmentalLawItems,
  selectEnvironmentalLawItem,
  selectEnvironmentalLawLoading,
  selectEnvironmentalLawError,
  selectEnvironmentalLawFilters,
  selectEnvironmentalLawNotifications,
  selectEnvironmentalLawPagination,
} from './environmental-lawSlice';
