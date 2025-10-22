/**
 * WF-STO-001 | store/index.ts - FinancialServices Store Module Exports
 * Purpose: Central exports for financial-services store module
 * Dependencies: financial-servicesSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as financialServicesReducer } from './financial-servicesSlice';

// Export actions
export {
  // FinancialServices Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './financial-servicesSlice';

// Export async thunks
export {
  // FinancialServices Management Thunks
  fetchFinancialServicesItems,
  fetchFinancialServicesItem,
  createFinancialServicesItem,
  updateFinancialServicesItem,
  deleteFinancialServicesItem,
} from './financial-servicesSlice';

// Export selectors
export {
  selectFinancialServicesItems,
  selectFinancialServicesItem,
  selectFinancialServicesLoading,
  selectFinancialServicesError,
  selectFinancialServicesFilters,
  selectFinancialServicesNotifications,
  selectFinancialServicesPagination,
} from './financial-servicesSlice';
