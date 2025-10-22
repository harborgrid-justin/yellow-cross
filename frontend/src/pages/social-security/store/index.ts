/**
 * WF-STO-001 | store/index.ts - SocialSecurity Store Module Exports
 * Purpose: Central exports for social-security store module
 * Dependencies: social-securitySlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as socialSecurityReducer } from './social-securitySlice';

// Export actions
export {
  // SocialSecurity Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './social-securitySlice';

// Export async thunks
export {
  // SocialSecurity Management Thunks
  fetchSocialSecurityItems,
  fetchSocialSecurityItem,
  createSocialSecurityItem,
  updateSocialSecurityItem,
  deleteSocialSecurityItem,
} from './social-securitySlice';

// Export selectors
export {
  selectSocialSecurityItems,
  selectSocialSecurityItem,
  selectSocialSecurityLoading,
  selectSocialSecurityError,
  selectSocialSecurityFilters,
  selectSocialSecurityNotifications,
  selectSocialSecurityPagination,
} from './social-securitySlice';
