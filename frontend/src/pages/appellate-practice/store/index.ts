/**
 * WF-STO-001 | store/index.ts - AppellatePractice Store Module Exports
 * Purpose: Central exports for appellate-practice store module
 * Dependencies: appellate-practiceSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as appellatePracticeReducer } from './appellate-practiceSlice';

// Export actions
export {
  // AppellatePractice Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './appellate-practiceSlice';

// Export async thunks
export {
  // AppellatePractice Management Thunks
  fetchAppellatePracticeItems,
  fetchAppellatePracticeItem,
  createAppellatePracticeItem,
  updateAppellatePracticeItem,
  deleteAppellatePracticeItem,
} from './appellate-practiceSlice';

// Export selectors
export {
  selectAppellatePracticeItems,
  selectAppellatePracticeItem,
  selectAppellatePracticeLoading,
  selectAppellatePracticeError,
  selectAppellatePracticeFilters,
  selectAppellatePracticeNotifications,
  selectAppellatePracticePagination,
} from './appellate-practiceSlice';
