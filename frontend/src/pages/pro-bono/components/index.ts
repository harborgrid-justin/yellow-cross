/**
 * WF-COMP-TBD | components/index.ts - ProBono Components Module
 * Purpose: Component exports for pro-bono management
 * Dependencies: React, pro-bono types, pro-bono services
 * Features: ProBono CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN PRO_BONO PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main pro-bono page components with ProBono prefix for routes
 */
export { default as ProBonoMain } from '../ProBonoMain';
export { default as ProBonoDetail } from '../ProBonoDetail';
export { default as ProBonoCreate } from '../ProBonoCreate';
export { default as ProBonoEdit } from '../ProBonoEdit';

// ==============================================================================
// PRO_BONO MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ProBonoList - Main list view for pro-bono items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ProBonoList } from './ProBonoList';

/**
 * ProBonoCard - Compact pro-bono display card
 * Features: Item info, status, quick actions
 */
export { default as ProBonoCard } from './ProBonoCard';

/**
 * ProBonoForm - Create/edit pro-bono item
 * Features: Validation, field management, submission handling
 */
export { default as ProBonoForm } from './ProBonoForm';

/**
 * ProBonoDetails - Detailed pro-bono view
 * Features: Full information display, related data, actions
 */
export { default as ProBonoDetails } from './ProBonoDetails';

/**
 * ProBonoFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ProBonoFilters } from './ProBonoFilters';

// ==============================================================================
// PRO_BONO UTILITY COMPONENTS
// ==============================================================================

/**
 * ProBonoSettings - ProBono-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ProBonoSettings } from './ProBonoSettings';
