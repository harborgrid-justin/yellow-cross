/**
 * WF-STO-001 | store/index.ts - CorporateGovernance Store Module Exports
 * Purpose: Central exports for corporate-governance store module
 * Dependencies: corporate-governanceSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as corporateGovernanceReducer } from './corporate-governanceSlice';

// Export actions
export {
  // CorporateGovernance Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './corporate-governanceSlice';

// Export async thunks
export {
  // CorporateGovernance Management Thunks
  fetchCorporateGovernanceItems,
  fetchCorporateGovernanceItem,
  createCorporateGovernanceItem,
  updateCorporateGovernanceItem,
  deleteCorporateGovernanceItem,
} from './corporate-governanceSlice';

// Export selectors
export {
  selectCorporateGovernanceItems,
  selectCorporateGovernanceItem,
  selectCorporateGovernanceLoading,
  selectCorporateGovernanceError,
  selectCorporateGovernanceFilters,
  selectCorporateGovernanceNotifications,
  selectCorporateGovernancePagination,
} from './corporate-governanceSlice';
