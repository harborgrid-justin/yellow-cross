/**
 * WF-STO-001 | store/index.ts - HealthcareLaw Store Module Exports
 * Purpose: Central exports for healthcare-law store module
 * Dependencies: healthcare-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as healthcareLawReducer } from './healthcare-lawSlice';

// Export actions
export {
  // HealthcareLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './healthcare-lawSlice';

// Export async thunks
export {
  // HealthcareLaw Management Thunks
  fetchHealthcareLawItems,
  fetchHealthcareLawItem,
  createHealthcareLawItem,
  updateHealthcareLawItem,
  deleteHealthcareLawItem,
} from './healthcare-lawSlice';

// Export selectors
export {
  selectHealthcareLawItems,
  selectHealthcareLawItem,
  selectHealthcareLawLoading,
  selectHealthcareLawError,
  selectHealthcareLawFilters,
  selectHealthcareLawNotifications,
  selectHealthcareLawPagination,
} from './healthcare-lawSlice';
