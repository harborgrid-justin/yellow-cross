/**
 * WF-COMP-TBD | components/index.ts - CaseManagement Components Module
 * Purpose: Component exports for case-management management
 * Dependencies: React, case-management types, case-management services
 * Features: CaseManagement CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CASE_MANAGEMENT PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main case-management page components with CaseManagement prefix for routes
 */
export { default as CaseManagementMain } from '../CaseManagementMain';
export { default as CaseManagementDetail } from '../CaseManagementDetail';
export { default as CaseManagementCreate } from '../CaseManagementCreate';
export { default as CaseManagementEdit } from '../CaseManagementEdit';

// ==============================================================================
// CASE_MANAGEMENT MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * CaseManagementList - Main list view for case-management items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as CaseManagementList } from './CaseManagementList';

/**
 * CaseManagementCard - Compact case-management display card
 * Features: Item info, status, quick actions
 */
export { default as CaseManagementCard } from './CaseManagementCard';

/**
 * CaseManagementForm - Create/edit case-management item
 * Features: Validation, field management, submission handling
 */
export { default as CaseManagementForm } from './CaseManagementForm';

/**
 * CaseManagementDetails - Detailed case-management view
 * Features: Full information display, related data, actions
 */
export { default as CaseManagementDetails } from './CaseManagementDetails';

/**
 * CaseManagementFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as CaseManagementFilters } from './CaseManagementFilters';

// ==============================================================================
// CASE_MANAGEMENT UTILITY COMPONENTS
// ==============================================================================

/**
 * CaseManagementSettings - CaseManagement-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as CaseManagementSettings } from './CaseManagementSettings';
