/**
 * WF-STO-001 | store/index.ts - ContractManagement Store Module Exports
 * Purpose: Central exports for contract-management store module
 * Dependencies: contract-managementSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as contractManagementReducer } from './contract-managementSlice';

// Export actions
export {
  // ContractManagement Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './contract-managementSlice';

// Export async thunks
export {
  // ContractManagement Management Thunks
  fetchContractManagementItems,
  fetchContractManagementItem,
  createContractManagementItem,
  updateContractManagementItem,
  deleteContractManagementItem,
} from './contract-managementSlice';

// Export selectors
export {
  selectContractManagementItems,
  selectContractManagementItem,
  selectContractManagementLoading,
  selectContractManagementError,
  selectContractManagementFilters,
  selectContractManagementNotifications,
  selectContractManagementPagination,
} from './contract-managementSlice';
