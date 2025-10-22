/**
 * WF-STO-001 | store/index.ts - Communication Store Module Exports
 * Purpose: Central exports for communication store module
 * Dependencies: communicationSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as communicationReducer } from './communicationSlice';

// Export actions
export {
  // Communication Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './communicationSlice';

// Export async thunks
export {
  // Communication Management Thunks
  fetchCommunicationItems,
  fetchCommunicationItem,
  createCommunicationItem,
  updateCommunicationItem,
  deleteCommunicationItem,
} from './communicationSlice';

// Export selectors
export {
  selectCommunicationItems,
  selectCommunicationItem,
  selectCommunicationLoading,
  selectCommunicationError,
  selectCommunicationFilters,
  selectCommunicationNotifications,
  selectCommunicationPagination,
} from './communicationSlice';
