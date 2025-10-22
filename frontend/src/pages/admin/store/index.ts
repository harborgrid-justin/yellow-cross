/**
 * WF-STO-001 | store/index.ts - Admin Store Module Exports
 * Purpose: Central exports for admin store module
 * Dependencies: adminSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as adminReducer } from './adminSlice';

// Export actions
export {
  // Admin Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './adminSlice';

// Export async thunks
export {
  // Admin Management Thunks
  fetchAdminItems,
  fetchAdminItem,
  createAdminItem,
  updateAdminItem,
  deleteAdminItem,
} from './adminSlice';

// Export selectors
export {
  selectAdminItems,
  selectAdminItem,
  selectAdminLoading,
  selectAdminError,
  selectAdminFilters,
  selectAdminNotifications,
  selectAdminPagination,
} from './adminSlice';
