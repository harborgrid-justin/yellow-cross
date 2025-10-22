/**
 * WF-STO-001 | store/index.ts - ConsumerProtection Store Module Exports
 * Purpose: Central exports for consumer-protection store module
 * Dependencies: consumer-protectionSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as consumerProtectionReducer } from './consumer-protectionSlice';

// Export actions
export {
  // ConsumerProtection Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './consumer-protectionSlice';

// Export async thunks
export {
  // ConsumerProtection Management Thunks
  fetchConsumerProtectionItems,
  fetchConsumerProtectionItem,
  createConsumerProtectionItem,
  updateConsumerProtectionItem,
  deleteConsumerProtectionItem,
} from './consumer-protectionSlice';

// Export selectors
export {
  selectConsumerProtectionItems,
  selectConsumerProtectionItem,
  selectConsumerProtectionLoading,
  selectConsumerProtectionError,
  selectConsumerProtectionFilters,
  selectConsumerProtectionNotifications,
  selectConsumerProtectionPagination,
} from './consumer-protectionSlice';
