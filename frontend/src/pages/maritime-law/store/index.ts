/**
 * WF-STO-001 | store/index.ts - MaritimeLaw Store Module Exports
 * Purpose: Central exports for maritime-law store module
 * Dependencies: maritime-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as maritimeLawReducer } from './maritime-lawSlice';

// Export actions
export {
  // MaritimeLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './maritime-lawSlice';

// Export async thunks
export {
  // MaritimeLaw Management Thunks
  fetchMaritimeLawItems,
  fetchMaritimeLawItem,
  createMaritimeLawItem,
  updateMaritimeLawItem,
  deleteMaritimeLawItem,
} from './maritime-lawSlice';

// Export selectors
export {
  selectMaritimeLawItems,
  selectMaritimeLawItem,
  selectMaritimeLawLoading,
  selectMaritimeLawError,
  selectMaritimeLawFilters,
  selectMaritimeLawNotifications,
  selectMaritimeLawPagination,
} from './maritime-lawSlice';
