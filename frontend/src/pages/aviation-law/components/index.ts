/**
 * WF-COMP-TBD | components/index.ts - AviationLaw Components Module
 * Purpose: Component exports for aviation-law management
 * Dependencies: React, aviation-law types, aviation-law services
 * Features: AviationLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN AVIATION_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main aviation-law page components with AviationLaw prefix for routes
 */
export { default as AviationLawMain } from '../AviationLawMain';
export { default as AviationLawDetail } from '../AviationLawDetail';
export { default as AviationLawCreate } from '../AviationLawCreate';
export { default as AviationLawEdit } from '../AviationLawEdit';

// ==============================================================================
// AVIATION_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * AviationLawList - Main list view for aviation-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as AviationLawList } from './AviationLawList';

/**
 * AviationLawCard - Compact aviation-law display card
 * Features: Item info, status, quick actions
 */
export { default as AviationLawCard } from './AviationLawCard';

/**
 * AviationLawForm - Create/edit aviation-law item
 * Features: Validation, field management, submission handling
 */
export { default as AviationLawForm } from './AviationLawForm';

/**
 * AviationLawDetails - Detailed aviation-law view
 * Features: Full information display, related data, actions
 */
export { default as AviationLawDetails } from './AviationLawDetails';

/**
 * AviationLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as AviationLawFilters } from './AviationLawFilters';

// ==============================================================================
// AVIATION_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * AviationLawSettings - AviationLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as AviationLawSettings } from './AviationLawSettings';
