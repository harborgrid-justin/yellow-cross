/**
 * WF-STO-001 | store/index.ts - PersonalInjury Store Module Exports
 * Purpose: Central exports for personal-injury store module
 * Dependencies: personal-injurySlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as personalInjuryReducer } from './personal-injurySlice';

// Export actions
export {
  // PersonalInjury Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './personal-injurySlice';

// Export async thunks
export {
  // PersonalInjury Management Thunks
  fetchPersonalInjuryItems,
  fetchPersonalInjuryItem,
  createPersonalInjuryItem,
  updatePersonalInjuryItem,
  deletePersonalInjuryItem,
} from './personal-injurySlice';

// Export selectors
export {
  selectPersonalInjuryItems,
  selectPersonalInjuryItem,
  selectPersonalInjuryLoading,
  selectPersonalInjuryError,
  selectPersonalInjuryFilters,
  selectPersonalInjuryNotifications,
  selectPersonalInjuryPagination,
} from './personal-injurySlice';
