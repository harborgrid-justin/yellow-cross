/**
 * WF-COMP-TBD | components/index.ts - LitigationManagement Components Module
 * Purpose: Component exports for litigation-management management
 * Dependencies: React, litigation-management types, litigation-management services
 * Features: LitigationManagement CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN LITIGATION_MANAGEMENT PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main litigation-management page components with LitigationManagement prefix for routes
 */
export { default as LitigationManagementMain } from '../LitigationManagementMain';
export { default as LitigationManagementDetail } from '../LitigationManagementDetail';
export { default as LitigationManagementCreate } from '../LitigationManagementCreate';
export { default as LitigationManagementEdit } from '../LitigationManagementEdit';

// ==============================================================================
// LITIGATION_MANAGEMENT MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * LitigationManagementList - Main list view for litigation-management items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as LitigationManagementList } from './LitigationManagementList';

/**
 * LitigationManagementCard - Compact litigation-management display card
 * Features: Item info, status, quick actions
 */
export { default as LitigationManagementCard } from './LitigationManagementCard';

/**
 * LitigationManagementForm - Create/edit litigation-management item
 * Features: Validation, field management, submission handling
 */
export { default as LitigationManagementForm } from './LitigationManagementForm';

/**
 * LitigationManagementDetails - Detailed litigation-management view
 * Features: Full information display, related data, actions
 */
export { default as LitigationManagementDetails } from './LitigationManagementDetails';

/**
 * LitigationManagementFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as LitigationManagementFilters } from './LitigationManagementFilters';

// ==============================================================================
// LITIGATION_MANAGEMENT UTILITY COMPONENTS
// ==============================================================================

/**
 * LitigationManagementSettings - LitigationManagement-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as LitigationManagementSettings } from './LitigationManagementSettings';
