/**
 * WF-STO-001 | store/index.ts - LandlordTenant Store Module Exports
 * Purpose: Central exports for landlord-tenant store module
 * Dependencies: landlord-tenantSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as landlordTenantReducer } from './landlord-tenantSlice';

// Export actions
export {
  // LandlordTenant Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './landlord-tenantSlice';

// Export async thunks
export {
  // LandlordTenant Management Thunks
  fetchLandlordTenantItems,
  fetchLandlordTenantItem,
  createLandlordTenantItem,
  updateLandlordTenantItem,
  deleteLandlordTenantItem,
} from './landlord-tenantSlice';

// Export selectors
export {
  selectLandlordTenantItems,
  selectLandlordTenantItem,
  selectLandlordTenantLoading,
  selectLandlordTenantError,
  selectLandlordTenantFilters,
  selectLandlordTenantNotifications,
  selectLandlordTenantPagination,
} from './landlord-tenantSlice';
