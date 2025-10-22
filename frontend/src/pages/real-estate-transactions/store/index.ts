/**
 * WF-STO-001 | store/index.ts - RealEstateTransactions Store Module Exports
 * Purpose: Central exports for real-estate-transactions store module
 * Dependencies: real-estate-transactionsSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as realEstateTransactionsReducer } from './real-estate-transactionsSlice';

// Export actions
export {
  // RealEstateTransactions Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './real-estate-transactionsSlice';

// Export async thunks
export {
  // RealEstateTransactions Management Thunks
  fetchRealEstateTransactionsItems,
  fetchRealEstateTransactionsItem,
  createRealEstateTransactionsItem,
  updateRealEstateTransactionsItem,
  deleteRealEstateTransactionsItem,
} from './real-estate-transactionsSlice';

// Export selectors
export {
  selectRealEstateTransactionsItems,
  selectRealEstateTransactionsItem,
  selectRealEstateTransactionsLoading,
  selectRealEstateTransactionsError,
  selectRealEstateTransactionsFilters,
  selectRealEstateTransactionsNotifications,
  selectRealEstateTransactionsPagination,
} from './real-estate-transactionsSlice';
