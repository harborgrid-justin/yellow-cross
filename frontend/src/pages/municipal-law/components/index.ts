/**
 * WF-COMP-TBD | components/index.ts - MunicipalLaw Components Module
 * Purpose: Component exports for municipal-law management
 * Dependencies: React, municipal-law types, municipal-law services
 * Features: MunicipalLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN MUNICIPAL_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main municipal-law page components with MunicipalLaw prefix for routes
 */
export { default as MunicipalLawMain } from '../MunicipalLawMain';
export { default as MunicipalLawDetail } from '../MunicipalLawDetail';
export { default as MunicipalLawCreate } from '../MunicipalLawCreate';
export { default as MunicipalLawEdit } from '../MunicipalLawEdit';

// ==============================================================================
// MUNICIPAL_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * MunicipalLawList - Main list view for municipal-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as MunicipalLawList } from './MunicipalLawList';

/**
 * MunicipalLawCard - Compact municipal-law display card
 * Features: Item info, status, quick actions
 */
export { default as MunicipalLawCard } from './MunicipalLawCard';

/**
 * MunicipalLawForm - Create/edit municipal-law item
 * Features: Validation, field management, submission handling
 */
export { default as MunicipalLawForm } from './MunicipalLawForm';

/**
 * MunicipalLawDetails - Detailed municipal-law view
 * Features: Full information display, related data, actions
 */
export { default as MunicipalLawDetails } from './MunicipalLawDetails';

/**
 * MunicipalLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as MunicipalLawFilters } from './MunicipalLawFilters';

// ==============================================================================
// MUNICIPAL_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * MunicipalLawSettings - MunicipalLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as MunicipalLawSettings } from './MunicipalLawSettings';
