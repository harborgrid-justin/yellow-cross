/**
 * WF-COMP-TBD | components/index.ts - EstatePlanning Components Module
 * Purpose: Component exports for estate-planning management
 * Dependencies: React, estate-planning types, estate-planning services
 * Features: EstatePlanning CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN ESTATE_PLANNING PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main estate-planning page components with EstatePlanning prefix for routes
 */
export { default as EstatePlanningMain } from '../EstatePlanningMain';
export { default as EstatePlanningDetail } from '../EstatePlanningDetail';
export { default as EstatePlanningCreate } from '../EstatePlanningCreate';
export { default as EstatePlanningEdit } from '../EstatePlanningEdit';

// ==============================================================================
// ESTATE_PLANNING MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * EstatePlanningList - Main list view for estate-planning items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as EstatePlanningList } from './EstatePlanningList';

/**
 * EstatePlanningCard - Compact estate-planning display card
 * Features: Item info, status, quick actions
 */
export { default as EstatePlanningCard } from './EstatePlanningCard';

/**
 * EstatePlanningForm - Create/edit estate-planning item
 * Features: Validation, field management, submission handling
 */
export { default as EstatePlanningForm } from './EstatePlanningForm';

/**
 * EstatePlanningDetails - Detailed estate-planning view
 * Features: Full information display, related data, actions
 */
export { default as EstatePlanningDetails } from './EstatePlanningDetails';

/**
 * EstatePlanningFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as EstatePlanningFilters } from './EstatePlanningFilters';

// ==============================================================================
// ESTATE_PLANNING UTILITY COMPONENTS
// ==============================================================================

/**
 * EstatePlanningSettings - EstatePlanning-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as EstatePlanningSettings } from './EstatePlanningSettings';
