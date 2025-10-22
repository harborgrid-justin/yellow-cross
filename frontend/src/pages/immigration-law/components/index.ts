/**
 * WF-COMP-TBD | components/index.ts - ImmigrationLaw Components Module
 * Purpose: Component exports for immigration-law management
 * Dependencies: React, immigration-law types, immigration-law services
 * Features: ImmigrationLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN IMMIGRATION_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main immigration-law page components with ImmigrationLaw prefix for routes
 */
export { default as ImmigrationLawMain } from '../ImmigrationLawMain';
export { default as ImmigrationLawDetail } from '../ImmigrationLawDetail';
export { default as ImmigrationLawCreate } from '../ImmigrationLawCreate';
export { default as ImmigrationLawEdit } from '../ImmigrationLawEdit';

// ==============================================================================
// IMMIGRATION_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ImmigrationLawList - Main list view for immigration-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ImmigrationLawList } from './ImmigrationLawList';

/**
 * ImmigrationLawCard - Compact immigration-law display card
 * Features: Item info, status, quick actions
 */
export { default as ImmigrationLawCard } from './ImmigrationLawCard';

/**
 * ImmigrationLawForm - Create/edit immigration-law item
 * Features: Validation, field management, submission handling
 */
export { default as ImmigrationLawForm } from './ImmigrationLawForm';

/**
 * ImmigrationLawDetails - Detailed immigration-law view
 * Features: Full information display, related data, actions
 */
export { default as ImmigrationLawDetails } from './ImmigrationLawDetails';

/**
 * ImmigrationLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ImmigrationLawFilters } from './ImmigrationLawFilters';

// ==============================================================================
// IMMIGRATION_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * ImmigrationLawSettings - ImmigrationLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ImmigrationLawSettings } from './ImmigrationLawSettings';
