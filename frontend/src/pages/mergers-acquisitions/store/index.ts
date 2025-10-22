/**
 * WF-STO-001 | store/index.ts - MergersAcquisitions Store Module Exports
 * Purpose: Central exports for mergers-acquisitions store module
 * Dependencies: mergers-acquisitionsSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as mergersAcquisitionsReducer } from './mergers-acquisitionsSlice';

// Export actions
export {
  // MergersAcquisitions Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './mergers-acquisitionsSlice';

// Export async thunks
export {
  // MergersAcquisitions Management Thunks
  fetchMergersAcquisitionsItems,
  fetchMergersAcquisitionsItem,
  createMergersAcquisitionsItem,
  updateMergersAcquisitionsItem,
  deleteMergersAcquisitionsItem,
} from './mergers-acquisitionsSlice';

// Export selectors
export {
  selectMergersAcquisitionsItems,
  selectMergersAcquisitionsItem,
  selectMergersAcquisitionsLoading,
  selectMergersAcquisitionsError,
  selectMergersAcquisitionsFilters,
  selectMergersAcquisitionsNotifications,
  selectMergersAcquisitionsPagination,
} from './mergers-acquisitionsSlice';
