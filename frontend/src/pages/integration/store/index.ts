/**
 * WF-STO-001 | store/index.ts - Integration Store Module Exports
 * Purpose: Central exports for integration store module
 * Dependencies: integrationSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as integrationReducer } from './integrationSlice';

// Export actions
export {
  // Integration Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './integrationSlice';

// Export async thunks
export {
  // Integration Management Thunks
  fetchIntegrationItems,
  fetchIntegrationItem,
  createIntegrationItem,
  updateIntegrationItem,
  deleteIntegrationItem,
} from './integrationSlice';

// Export selectors
export {
  selectIntegrationItems,
  selectIntegrationItem,
  selectIntegrationLoading,
  selectIntegrationError,
  selectIntegrationFilters,
  selectIntegrationNotifications,
  selectIntegrationPagination,
} from './integrationSlice';
