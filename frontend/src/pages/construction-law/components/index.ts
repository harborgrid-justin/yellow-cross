/**
 * WF-COMP-TBD | components/index.ts - ConstructionLaw Components Module
 * Purpose: Component exports for construction-law management
 * Dependencies: React, construction-law types, construction-law services
 * Features: ConstructionLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CONSTRUCTION_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main construction-law page components with ConstructionLaw prefix for routes
 */
export { default as ConstructionLawMain } from '../ConstructionLawMain';
export { default as ConstructionLawDetail } from '../ConstructionLawDetail';
export { default as ConstructionLawCreate } from '../ConstructionLawCreate';
export { default as ConstructionLawEdit } from '../ConstructionLawEdit';

// ==============================================================================
// CONSTRUCTION_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ConstructionLawList - Main list view for construction-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ConstructionLawList } from './ConstructionLawList';

/**
 * ConstructionLawCard - Compact construction-law display card
 * Features: Item info, status, quick actions
 */
export { default as ConstructionLawCard } from './ConstructionLawCard';

/**
 * ConstructionLawForm - Create/edit construction-law item
 * Features: Validation, field management, submission handling
 */
export { default as ConstructionLawForm } from './ConstructionLawForm';

/**
 * ConstructionLawDetails - Detailed construction-law view
 * Features: Full information display, related data, actions
 */
export { default as ConstructionLawDetails } from './ConstructionLawDetails';

/**
 * ConstructionLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ConstructionLawFilters } from './ConstructionLawFilters';

// ==============================================================================
// CONSTRUCTION_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * ConstructionLawSettings - ConstructionLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ConstructionLawSettings } from './ConstructionLawSettings';
