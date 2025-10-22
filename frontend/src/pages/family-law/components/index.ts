/**
 * WF-COMP-TBD | components/index.ts - FamilyLaw Components Module
 * Purpose: Component exports for family-law management
 * Dependencies: React, family-law types, family-law services
 * Features: FamilyLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN FAMILY_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main family-law page components with FamilyLaw prefix for routes
 */
export { default as FamilyLawMain } from '../FamilyLawMain';
export { default as FamilyLawDetail } from '../FamilyLawDetail';
export { default as FamilyLawCreate } from '../FamilyLawCreate';
export { default as FamilyLawEdit } from '../FamilyLawEdit';

// ==============================================================================
// FAMILY_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * FamilyLawList - Main list view for family-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as FamilyLawList } from './FamilyLawList';

/**
 * FamilyLawCard - Compact family-law display card
 * Features: Item info, status, quick actions
 */
export { default as FamilyLawCard } from './FamilyLawCard';

/**
 * FamilyLawForm - Create/edit family-law item
 * Features: Validation, field management, submission handling
 */
export { default as FamilyLawForm } from './FamilyLawForm';

/**
 * FamilyLawDetails - Detailed family-law view
 * Features: Full information display, related data, actions
 */
export { default as FamilyLawDetails } from './FamilyLawDetails';

/**
 * FamilyLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as FamilyLawFilters } from './FamilyLawFilters';

// ==============================================================================
// FAMILY_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * FamilyLawSettings - FamilyLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as FamilyLawSettings } from './FamilyLawSettings';
