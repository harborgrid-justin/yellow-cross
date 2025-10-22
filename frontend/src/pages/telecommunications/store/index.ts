/**
 * WF-STO-001 | store/index.ts - Telecommunications Store Module Exports
 * Purpose: Central exports for telecommunications store module
 * Dependencies: telecommunicationsSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as telecommunicationsReducer } from './telecommunicationsSlice';

// Export actions
export {
  // Telecommunications Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './telecommunicationsSlice';

// Export async thunks
export {
  // Telecommunications Management Thunks
  fetchTelecommunicationsItems,
  fetchTelecommunicationsItem,
  createTelecommunicationsItem,
  updateTelecommunicationsItem,
  deleteTelecommunicationsItem,
} from './telecommunicationsSlice';

// Export selectors
export {
  selectTelecommunicationsItems,
  selectTelecommunicationsItem,
  selectTelecommunicationsLoading,
  selectTelecommunicationsError,
  selectTelecommunicationsFilters,
  selectTelecommunicationsNotifications,
  selectTelecommunicationsPagination,
} from './telecommunicationsSlice';
