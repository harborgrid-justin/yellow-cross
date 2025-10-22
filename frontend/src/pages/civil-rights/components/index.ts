/**
 * WF-COMP-TBD | components/index.ts - CivilRights Components Module
 * Purpose: Component exports for civil-rights management
 * Dependencies: React, civil-rights types, civil-rights services
 * Features: CivilRights CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CIVIL_RIGHTS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main civil-rights page components with CivilRights prefix for routes
 */
export { default as CivilRightsMain } from '../CivilRightsMain';
export { default as CivilRightsDetail } from '../CivilRightsDetail';
export { default as CivilRightsCreate } from '../CivilRightsCreate';
export { default as CivilRightsEdit } from '../CivilRightsEdit';

// ==============================================================================
// CIVIL_RIGHTS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * CivilRightsList - Main list view for civil-rights items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as CivilRightsList } from './CivilRightsList';

/**
 * CivilRightsCard - Compact civil-rights display card
 * Features: Item info, status, quick actions
 */
export { default as CivilRightsCard } from './CivilRightsCard';

/**
 * CivilRightsForm - Create/edit civil-rights item
 * Features: Validation, field management, submission handling
 */
export { default as CivilRightsForm } from './CivilRightsForm';

/**
 * CivilRightsDetails - Detailed civil-rights view
 * Features: Full information display, related data, actions
 */
export { default as CivilRightsDetails } from './CivilRightsDetails';

/**
 * CivilRightsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as CivilRightsFilters } from './CivilRightsFilters';

// ==============================================================================
// CIVIL_RIGHTS UTILITY COMPONENTS
// ==============================================================================

/**
 * CivilRightsSettings - CivilRights-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as CivilRightsSettings } from './CivilRightsSettings';
