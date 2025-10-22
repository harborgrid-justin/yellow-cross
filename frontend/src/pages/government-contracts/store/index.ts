/**
 * WF-STO-001 | store/index.ts - GovernmentContracts Store Module Exports
 * Purpose: Central exports for government-contracts store module
 * Dependencies: government-contractsSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as governmentContractsReducer } from './government-contractsSlice';

// Export actions
export {
  // GovernmentContracts Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './government-contractsSlice';

// Export async thunks
export {
  // GovernmentContracts Management Thunks
  fetchGovernmentContractsItems,
  fetchGovernmentContractsItem,
  createGovernmentContractsItem,
  updateGovernmentContractsItem,
  deleteGovernmentContractsItem,
} from './government-contractsSlice';

// Export selectors
export {
  selectGovernmentContractsItems,
  selectGovernmentContractsItem,
  selectGovernmentContractsLoading,
  selectGovernmentContractsError,
  selectGovernmentContractsFilters,
  selectGovernmentContractsNotifications,
  selectGovernmentContractsPagination,
} from './government-contractsSlice';
