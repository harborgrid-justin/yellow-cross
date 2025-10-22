/**
 * WF-STO-001 | store/index.ts - ClassAction Store Module Exports
 * Purpose: Central exports for class-action store module
 * Dependencies: class-actionSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as classActionReducer } from './class-actionSlice';

// Export actions
export {
  // ClassAction Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './class-actionSlice';

// Export async thunks
export {
  // ClassAction Management Thunks
  fetchClassActionItems,
  fetchClassActionItem,
  createClassActionItem,
  updateClassActionItem,
  deleteClassActionItem,
} from './class-actionSlice';

// Export selectors
export {
  selectClassActionItems,
  selectClassActionItem,
  selectClassActionLoading,
  selectClassActionError,
  selectClassActionFilters,
  selectClassActionNotifications,
  selectClassActionPagination,
} from './class-actionSlice';
