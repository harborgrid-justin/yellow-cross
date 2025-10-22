/**
 * WF-COMP-TBD | components/index.ts - FranchiseLaw Components Module
 * Purpose: Component exports for franchise-law management
 * Dependencies: React, franchise-law types, franchise-law services
 * Features: FranchiseLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN FRANCHISE_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main franchise-law page components with FranchiseLaw prefix for routes
 */
export { default as FranchiseLawMain } from '../FranchiseLawMain';
export { default as FranchiseLawDetail } from '../FranchiseLawDetail';
export { default as FranchiseLawCreate } from '../FranchiseLawCreate';
export { default as FranchiseLawEdit } from '../FranchiseLawEdit';

// ==============================================================================
// FRANCHISE_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * FranchiseLawList - Main list view for franchise-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as FranchiseLawList } from './FranchiseLawList';

/**
 * FranchiseLawCard - Compact franchise-law display card
 * Features: Item info, status, quick actions
 */
export { default as FranchiseLawCard } from './FranchiseLawCard';

/**
 * FranchiseLawForm - Create/edit franchise-law item
 * Features: Validation, field management, submission handling
 */
export { default as FranchiseLawForm } from './FranchiseLawForm';

/**
 * FranchiseLawDetails - Detailed franchise-law view
 * Features: Full information display, related data, actions
 */
export { default as FranchiseLawDetails } from './FranchiseLawDetails';

/**
 * FranchiseLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as FranchiseLawFilters } from './FranchiseLawFilters';

// ==============================================================================
// FRANCHISE_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * FranchiseLawSettings - FranchiseLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as FranchiseLawSettings } from './FranchiseLawSettings';
