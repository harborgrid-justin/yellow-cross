/**
 * WF-STO-001 | store/index.ts - VeteransAffairs Store Module Exports
 * Purpose: Central exports for veterans-affairs store module
 * Dependencies: veterans-affairsSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as veteransAffairsReducer } from './veterans-affairsSlice';

// Export actions
export {
  // VeteransAffairs Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './veterans-affairsSlice';

// Export async thunks
export {
  // VeteransAffairs Management Thunks
  fetchVeteransAffairsItems,
  fetchVeteransAffairsItem,
  createVeteransAffairsItem,
  updateVeteransAffairsItem,
  deleteVeteransAffairsItem,
} from './veterans-affairsSlice';

// Export selectors
export {
  selectVeteransAffairsItems,
  selectVeteransAffairsItem,
  selectVeteransAffairsLoading,
  selectVeteransAffairsError,
  selectVeteransAffairsFilters,
  selectVeteransAffairsNotifications,
  selectVeteransAffairsPagination,
} from './veterans-affairsSlice';
