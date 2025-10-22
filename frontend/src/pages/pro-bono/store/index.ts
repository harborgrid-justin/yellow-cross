/**
 * WF-STO-001 | store/index.ts - ProBono Store Module Exports
 * Purpose: Central exports for pro-bono store module
 * Dependencies: pro-bonoSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as proBonoReducer } from './pro-bonoSlice';

// Export actions
export {
  // ProBono Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './pro-bonoSlice';

// Export async thunks
export {
  // ProBono Management Thunks
  fetchProBonoItems,
  fetchProBonoItem,
  createProBonoItem,
  updateProBonoItem,
  deleteProBonoItem,
} from './pro-bonoSlice';

// Export selectors
export {
  selectProBonoItems,
  selectProBonoItem,
  selectProBonoLoading,
  selectProBonoError,
  selectProBonoFilters,
  selectProBonoNotifications,
  selectProBonoPagination,
} from './pro-bonoSlice';
