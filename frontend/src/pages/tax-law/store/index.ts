/**
 * WF-STO-001 | store/index.ts - TaxLaw Store Module Exports
 * Purpose: Central exports for tax-law store module
 * Dependencies: tax-lawSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as taxLawReducer } from './tax-lawSlice';

// Export actions
export {
  // TaxLaw Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './tax-lawSlice';

// Export async thunks
export {
  // TaxLaw Management Thunks
  fetchTaxLawItems,
  fetchTaxLawItem,
  createTaxLawItem,
  updateTaxLawItem,
  deleteTaxLawItem,
} from './tax-lawSlice';

// Export selectors
export {
  selectTaxLawItems,
  selectTaxLawItem,
  selectTaxLawLoading,
  selectTaxLawError,
  selectTaxLawFilters,
  selectTaxLawNotifications,
  selectTaxLawPagination,
} from './tax-lawSlice';
