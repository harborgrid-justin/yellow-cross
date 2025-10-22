/**
 * WF-STO-001 | store/index.ts - EducationLaw Store Module Exports
 * Purpose: Central exports for education-law store module
 * Dependencies: education-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as educationLawReducer } from './education-lawSlice';

// Export actions
export {
  // EducationLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './education-lawSlice';

// Export async thunks
export {
  // EducationLaw Management Thunks
  fetchEducationLawItems,
  fetchEducationLawItem,
  createEducationLawItem,
  updateEducationLawItem,
  deleteEducationLawItem,
} from './education-lawSlice';

// Export selectors
export {
  selectEducationLawItems,
  selectEducationLawItem,
  selectEducationLawLoading,
  selectEducationLawError,
  selectEducationLawFilters,
  selectEducationLawNotifications,
  selectEducationLawPagination,
} from './education-lawSlice';
