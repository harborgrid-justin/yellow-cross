/**
 * WF-STO-001 | store/index.ts - Ediscovery Store Module Exports
 * Purpose: Central exports for ediscovery store module
 * Dependencies: ediscoverySlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as ediscoveryReducer } from './ediscoverySlice';

// Export actions
export {
  // Ediscovery Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './ediscoverySlice';

// Export async thunks
export {
  // Ediscovery Management Thunks
  fetchEdiscoveryItems,
  fetchEdiscoveryItem,
  createEdiscoveryItem,
  updateEdiscoveryItem,
  deleteEdiscoveryItem,
} from './ediscoverySlice';

// Export selectors
export {
  selectEdiscoveryItems,
  selectEdiscoveryItem,
  selectEdiscoveryLoading,
  selectEdiscoveryError,
  selectEdiscoveryFilters,
  selectEdiscoveryNotifications,
  selectEdiscoveryPagination,
} from './ediscoverySlice';
