/**
 * WF-STO-001 | store/index.ts - InsuranceDefense Store Module Exports
 * Purpose: Central exports for insurance-defense store module
 * Dependencies: insurance-defenseSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as insuranceDefenseReducer } from './insurance-defenseSlice';

// Export actions
export {
  // InsuranceDefense Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './insurance-defenseSlice';

// Export async thunks
export {
  // InsuranceDefense Management Thunks
  fetchInsuranceDefenseItems,
  fetchInsuranceDefenseItem,
  createInsuranceDefenseItem,
  updateInsuranceDefenseItem,
  deleteInsuranceDefenseItem,
} from './insurance-defenseSlice';

// Export selectors
export {
  selectInsuranceDefenseItems,
  selectInsuranceDefenseItem,
  selectInsuranceDefenseLoading,
  selectInsuranceDefenseError,
  selectInsuranceDefenseFilters,
  selectInsuranceDefenseNotifications,
  selectInsuranceDefensePagination,
} from './insurance-defenseSlice';
