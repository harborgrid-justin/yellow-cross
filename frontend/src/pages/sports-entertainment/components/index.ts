/**
 * WF-COMP-TBD | components/index.ts - SportsEntertainment Components Module
 * Purpose: Component exports for sports-entertainment management
 * Dependencies: React, sports-entertainment types, sports-entertainment services
 * Features: SportsEntertainment CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN SPORTS_ENTERTAINMENT PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main sports-entertainment page components with SportsEntertainment prefix for routes
 */
export { default as SportsEntertainmentMain } from '../SportsEntertainmentMain';
export { default as SportsEntertainmentDetail } from '../SportsEntertainmentDetail';
export { default as SportsEntertainmentCreate } from '../SportsEntertainmentCreate';
export { default as SportsEntertainmentEdit } from '../SportsEntertainmentEdit';

// ==============================================================================
// SPORTS_ENTERTAINMENT MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * SportsEntertainmentList - Main list view for sports-entertainment items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as SportsEntertainmentList } from './SportsEntertainmentList';

/**
 * SportsEntertainmentCard - Compact sports-entertainment display card
 * Features: Item info, status, quick actions
 */
export { default as SportsEntertainmentCard } from './SportsEntertainmentCard';

/**
 * SportsEntertainmentForm - Create/edit sports-entertainment item
 * Features: Validation, field management, submission handling
 */
export { default as SportsEntertainmentForm } from './SportsEntertainmentForm';

/**
 * SportsEntertainmentDetails - Detailed sports-entertainment view
 * Features: Full information display, related data, actions
 */
export { default as SportsEntertainmentDetails } from './SportsEntertainmentDetails';

/**
 * SportsEntertainmentFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as SportsEntertainmentFilters } from './SportsEntertainmentFilters';

// ==============================================================================
// SPORTS_ENTERTAINMENT UTILITY COMPONENTS
// ==============================================================================

/**
 * SportsEntertainmentSettings - SportsEntertainment-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as SportsEntertainmentSettings } from './SportsEntertainmentSettings';
