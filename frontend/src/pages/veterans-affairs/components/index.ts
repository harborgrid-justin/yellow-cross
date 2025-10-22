/**
 * WF-COMP-TBD | components/index.ts - VeteransAffairs Components Module
 * Purpose: Component exports for veterans-affairs management
 * Dependencies: React, veterans-affairs types, veterans-affairs services
 * Features: VeteransAffairs CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN VETERANS_AFFAIRS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main veterans-affairs page components with VeteransAffairs prefix for routes
 */
export { default as VeteransAffairsMain } from '../VeteransAffairsMain';
export { default as VeteransAffairsDetail } from '../VeteransAffairsDetail';
export { default as VeteransAffairsCreate } from '../VeteransAffairsCreate';
export { default as VeteransAffairsEdit } from '../VeteransAffairsEdit';

// ==============================================================================
// VETERANS_AFFAIRS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * VeteransAffairsList - Main list view for veterans-affairs items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as VeteransAffairsList } from './VeteransAffairsList';

/**
 * VeteransAffairsCard - Compact veterans-affairs display card
 * Features: Item info, status, quick actions
 */
export { default as VeteransAffairsCard } from './VeteransAffairsCard';

/**
 * VeteransAffairsForm - Create/edit veterans-affairs item
 * Features: Validation, field management, submission handling
 */
export { default as VeteransAffairsForm } from './VeteransAffairsForm';

/**
 * VeteransAffairsDetails - Detailed veterans-affairs view
 * Features: Full information display, related data, actions
 */
export { default as VeteransAffairsDetails } from './VeteransAffairsDetails';

/**
 * VeteransAffairsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as VeteransAffairsFilters } from './VeteransAffairsFilters';

// ==============================================================================
// VETERANS_AFFAIRS UTILITY COMPONENTS
// ==============================================================================

/**
 * VeteransAffairsSettings - VeteransAffairs-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as VeteransAffairsSettings } from './VeteransAffairsSettings';
