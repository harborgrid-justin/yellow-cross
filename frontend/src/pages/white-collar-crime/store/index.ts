/**
 * WF-STO-001 | store/index.ts - WhiteCollarCrime Store Module Exports
 * Purpose: Central exports for white-collar-crime store module
 * Dependencies: white-collar-crimeSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as whiteCollarCrimeReducer } from './white-collar-crimeSlice';

// Export actions
export {
  // WhiteCollarCrime Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './white-collar-crimeSlice';

// Export async thunks
export {
  // WhiteCollarCrime Management Thunks
  fetchWhiteCollarCrimeItems,
  fetchWhiteCollarCrimeItem,
  createWhiteCollarCrimeItem,
  updateWhiteCollarCrimeItem,
  deleteWhiteCollarCrimeItem,
} from './white-collar-crimeSlice';

// Export selectors
export {
  selectWhiteCollarCrimeItems,
  selectWhiteCollarCrimeItem,
  selectWhiteCollarCrimeLoading,
  selectWhiteCollarCrimeError,
  selectWhiteCollarCrimeFilters,
  selectWhiteCollarCrimeNotifications,
  selectWhiteCollarCrimePagination,
} from './white-collar-crimeSlice';
