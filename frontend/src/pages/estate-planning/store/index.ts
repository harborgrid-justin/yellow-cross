/**
 * WF-STO-001 | store/index.ts - EstatePlanning Store Module Exports
 * Purpose: Central exports for estate-planning store module
 * Dependencies: estate-planningSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as estatePlanningReducer } from './estate-planningSlice';

// Export actions
export {
  // EstatePlanning Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './estate-planningSlice';

// Export async thunks
export {
  // EstatePlanning Management Thunks
  fetchEstatePlanningItems,
  fetchEstatePlanningItem,
  createEstatePlanningItem,
  updateEstatePlanningItem,
  deleteEstatePlanningItem,
} from './estate-planningSlice';

// Export selectors
export {
  selectEstatePlanningItems,
  selectEstatePlanningItem,
  selectEstatePlanningLoading,
  selectEstatePlanningError,
  selectEstatePlanningFilters,
  selectEstatePlanningNotifications,
  selectEstatePlanningPagination,
} from './estate-planningSlice';
