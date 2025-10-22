/**
 * WF-COMP-TBD | components/index.ts - EnvironmentalLaw Components Module
 * Purpose: Component exports for environmental-law management
 * Dependencies: React, environmental-law types, environmental-law services
 * Features: EnvironmentalLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN ENVIRONMENTAL_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main environmental-law page components with EnvironmentalLaw prefix for routes
 */
export { default as EnvironmentalLawMain } from '../EnvironmentalLawMain';
export { default as EnvironmentalLawDetail } from '../EnvironmentalLawDetail';
export { default as EnvironmentalLawCreate } from '../EnvironmentalLawCreate';
export { default as EnvironmentalLawEdit } from '../EnvironmentalLawEdit';

// ==============================================================================
// ENVIRONMENTAL_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * EnvironmentalLawList - Main list view for environmental-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as EnvironmentalLawList } from './EnvironmentalLawList';

/**
 * EnvironmentalLawCard - Compact environmental-law display card
 * Features: Item info, status, quick actions
 */
export { default as EnvironmentalLawCard } from './EnvironmentalLawCard';

/**
 * EnvironmentalLawForm - Create/edit environmental-law item
 * Features: Validation, field management, submission handling
 */
export { default as EnvironmentalLawForm } from './EnvironmentalLawForm';

/**
 * EnvironmentalLawDetails - Detailed environmental-law view
 * Features: Full information display, related data, actions
 */
export { default as EnvironmentalLawDetails } from './EnvironmentalLawDetails';

/**
 * EnvironmentalLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as EnvironmentalLawFilters } from './EnvironmentalLawFilters';

// ==============================================================================
// ENVIRONMENTAL_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * EnvironmentalLawSettings - EnvironmentalLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as EnvironmentalLawSettings } from './EnvironmentalLawSettings';
