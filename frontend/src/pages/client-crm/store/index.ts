/**
 * WF-STO-001 | store/index.ts - ClientCrm Store Module Exports
 * Purpose: Central exports for client-crm store module
 * Dependencies: client-crmSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as clientCrmReducer } from './client-crmSlice';

// Export actions
export {
  // ClientCrm Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './client-crmSlice';

// Export async thunks
export {
  // ClientCrm Management Thunks
  fetchClientCrmItems,
  fetchClientCrmItem,
  createClientCrmItem,
  updateClientCrmItem,
  deleteClientCrmItem,
} from './client-crmSlice';

// Export selectors
export {
  selectClientCrmItems,
  selectClientCrmItem,
  selectClientCrmLoading,
  selectClientCrmError,
  selectClientCrmFilters,
  selectClientCrmNotifications,
  selectClientCrmPagination,
} from './client-crmSlice';
