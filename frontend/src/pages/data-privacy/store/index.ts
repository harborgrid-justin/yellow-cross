/**
 * WF-STO-001 | store/index.ts - DataPrivacy Store Module Exports
 * Purpose: Central exports for data-privacy store module
 * Dependencies: data-privacySlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as dataPrivacyReducer } from './data-privacySlice';

// Export actions
export {
  // DataPrivacy Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './data-privacySlice';

// Export async thunks
export {
  // DataPrivacy Management Thunks
  fetchDataPrivacyItems,
  fetchDataPrivacyItem,
  createDataPrivacyItem,
  updateDataPrivacyItem,
  deleteDataPrivacyItem,
} from './data-privacySlice';

// Export selectors
export {
  selectDataPrivacyItems,
  selectDataPrivacyItem,
  selectDataPrivacyLoading,
  selectDataPrivacyError,
  selectDataPrivacyFilters,
  selectDataPrivacyNotifications,
  selectDataPrivacyPagination,
} from './data-privacySlice';
