/**
 * WF-STO-001 | store/index.ts - CivilRights Store Module Exports
 * Purpose: Central exports for civil-rights store module
 * Dependencies: civil-rightsSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as civilRightsReducer } from './civil-rightsSlice';

// Export actions
export {
  // CivilRights Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './civil-rightsSlice';

// Export async thunks
export {
  // CivilRights Management Thunks
  fetchCivilRightsItems,
  fetchCivilRightsItem,
  createCivilRightsItem,
  updateCivilRightsItem,
  deleteCivilRightsItem,
} from './civil-rightsSlice';

// Export selectors
export {
  selectCivilRightsItems,
  selectCivilRightsItem,
  selectCivilRightsLoading,
  selectCivilRightsError,
  selectCivilRightsFilters,
  selectCivilRightsNotifications,
  selectCivilRightsPagination,
} from './civil-rightsSlice';
