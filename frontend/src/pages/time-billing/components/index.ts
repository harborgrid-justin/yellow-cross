/**
 * WF-COMP-TBD | components/index.ts - TimeBilling Components Module
 * Purpose: Component exports for time-billing management
 * Dependencies: React, time-billing types, time-billing services
 * Features: TimeBilling CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN TIME_BILLING PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main time-billing page components with TimeBilling prefix for routes
 */
export { default as TimeBillingMain } from '../TimeBillingMain';
export { default as TimeBillingDetail } from '../TimeBillingDetail';
export { default as TimeBillingCreate } from '../TimeBillingCreate';
export { default as TimeBillingEdit } from '../TimeBillingEdit';

// ==============================================================================
// TIME_BILLING MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * TimeBillingList - Main list view for time-billing items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as TimeBillingList } from './TimeBillingList';

/**
 * TimeBillingCard - Compact time-billing display card
 * Features: Item info, status, quick actions
 */
export { default as TimeBillingCard } from './TimeBillingCard';

/**
 * TimeBillingForm - Create/edit time-billing item
 * Features: Validation, field management, submission handling
 */
export { default as TimeBillingForm } from './TimeBillingForm';

/**
 * TimeBillingDetails - Detailed time-billing view
 * Features: Full information display, related data, actions
 */
export { default as TimeBillingDetails } from './TimeBillingDetails';

/**
 * TimeBillingFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as TimeBillingFilters } from './TimeBillingFilters';

// ==============================================================================
// TIME_BILLING UTILITY COMPONENTS
// ==============================================================================

/**
 * TimeBillingSettings - TimeBilling-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as TimeBillingSettings } from './TimeBillingSettings';
