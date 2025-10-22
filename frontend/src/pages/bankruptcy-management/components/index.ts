/**
 * WF-COMP-TBD | components/index.ts - BankruptcyManagement Components Module
 * Purpose: Component exports for bankruptcy-management management
 * Dependencies: React, bankruptcy-management types, bankruptcy-management services
 * Features: BankruptcyManagement CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN BANKRUPTCY_MANAGEMENT PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main bankruptcy-management page components with BankruptcyManagement prefix for routes
 */
export { default as BankruptcyManagementMain } from '../BankruptcyManagementMain';
export { default as BankruptcyManagementDetail } from '../BankruptcyManagementDetail';
export { default as BankruptcyManagementCreate } from '../BankruptcyManagementCreate';
export { default as BankruptcyManagementEdit } from '../BankruptcyManagementEdit';

// ==============================================================================
// BANKRUPTCY_MANAGEMENT MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * BankruptcyManagementList - Main list view for bankruptcy-management items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as BankruptcyManagementList } from './BankruptcyManagementList';

/**
 * BankruptcyManagementCard - Compact bankruptcy-management display card
 * Features: Item info, status, quick actions
 */
export { default as BankruptcyManagementCard } from './BankruptcyManagementCard';

/**
 * BankruptcyManagementForm - Create/edit bankruptcy-management item
 * Features: Validation, field management, submission handling
 */
export { default as BankruptcyManagementForm } from './BankruptcyManagementForm';

/**
 * BankruptcyManagementDetails - Detailed bankruptcy-management view
 * Features: Full information display, related data, actions
 */
export { default as BankruptcyManagementDetails } from './BankruptcyManagementDetails';

/**
 * BankruptcyManagementFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as BankruptcyManagementFilters } from './BankruptcyManagementFilters';

// ==============================================================================
// BANKRUPTCY_MANAGEMENT UTILITY COMPONENTS
// ==============================================================================

/**
 * BankruptcyManagementSettings - BankruptcyManagement-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as BankruptcyManagementSettings } from './BankruptcyManagementSettings';
