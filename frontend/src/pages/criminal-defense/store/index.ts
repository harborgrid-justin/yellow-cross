/**
 * WF-STO-001 | store/index.ts - CriminalDefense Store Module Exports
 * Purpose: Central exports for criminal-defense store module
 * Dependencies: criminal-defenseSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as criminalDefenseReducer } from './criminal-defenseSlice';

// Export actions
export {
  // CriminalDefense Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './criminal-defenseSlice';

// Export async thunks
export {
  // CriminalDefense Management Thunks
  fetchCriminalDefenseItems,
  fetchCriminalDefenseItem,
  createCriminalDefenseItem,
  updateCriminalDefenseItem,
  deleteCriminalDefenseItem,
} from './criminal-defenseSlice';

// Export selectors
export {
  selectCriminalDefenseItems,
  selectCriminalDefenseItem,
  selectCriminalDefenseLoading,
  selectCriminalDefenseError,
  selectCriminalDefenseFilters,
  selectCriminalDefenseNotifications,
  selectCriminalDefensePagination,
} from './criminal-defenseSlice';
