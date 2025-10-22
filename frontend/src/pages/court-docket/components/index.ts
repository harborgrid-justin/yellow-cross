/**
 * WF-COMP-TBD | components/index.ts - CourtDocket Components Module
 * Purpose: Component exports for court-docket management
 * Dependencies: React, court-docket types, court-docket services
 * Features: CourtDocket CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN COURT_DOCKET PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main court-docket page components with CourtDocket prefix for routes
 */
export { default as CourtDocketMain } from '../CourtDocketMain';
export { default as CourtDocketDetail } from '../CourtDocketDetail';
export { default as CourtDocketCreate } from '../CourtDocketCreate';
export { default as CourtDocketEdit } from '../CourtDocketEdit';

// ==============================================================================
// COURT_DOCKET MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * CourtDocketList - Main list view for court-docket items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as CourtDocketList } from './CourtDocketList';

/**
 * CourtDocketCard - Compact court-docket display card
 * Features: Item info, status, quick actions
 */
export { default as CourtDocketCard } from './CourtDocketCard';

/**
 * CourtDocketForm - Create/edit court-docket item
 * Features: Validation, field management, submission handling
 */
export { default as CourtDocketForm } from './CourtDocketForm';

/**
 * CourtDocketDetails - Detailed court-docket view
 * Features: Full information display, related data, actions
 */
export { default as CourtDocketDetails } from './CourtDocketDetails';

/**
 * CourtDocketFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as CourtDocketFilters } from './CourtDocketFilters';

// ==============================================================================
// COURT_DOCKET UTILITY COMPONENTS
// ==============================================================================

/**
 * CourtDocketSettings - CourtDocket-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as CourtDocketSettings } from './CourtDocketSettings';
