/**
 * WF-STO-001 | store/index.ts - FamilyLaw Store Module Exports
 * Purpose: Central exports for family-law store module
 * Dependencies: family-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as familyLawReducer } from './family-lawSlice';

// Export actions
export {
  // FamilyLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './family-lawSlice';

// Export async thunks
export {
  // FamilyLaw Management Thunks
  fetchFamilyLawItems,
  fetchFamilyLawItem,
  createFamilyLawItem,
  updateFamilyLawItem,
  deleteFamilyLawItem,
} from './family-lawSlice';

// Export selectors
export {
  selectFamilyLawItems,
  selectFamilyLawItem,
  selectFamilyLawLoading,
  selectFamilyLawError,
  selectFamilyLawFilters,
  selectFamilyLawNotifications,
  selectFamilyLawPagination,
} from './family-lawSlice';
