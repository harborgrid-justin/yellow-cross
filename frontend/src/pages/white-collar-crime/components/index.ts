/**
 * WF-COMP-TBD | components/index.ts - WhiteCollarCrime Components Module
 * Purpose: Component exports for white-collar-crime management
 * Dependencies: React, white-collar-crime types, white-collar-crime services
 * Features: WhiteCollarCrime CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN WHITE_COLLAR_CRIME PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main white-collar-crime page components with WhiteCollarCrime prefix for routes
 */
export { default as WhiteCollarCrimeMain } from '../WhiteCollarCrimeMain';
export { default as WhiteCollarCrimeDetail } from '../WhiteCollarCrimeDetail';
export { default as WhiteCollarCrimeCreate } from '../WhiteCollarCrimeCreate';
export { default as WhiteCollarCrimeEdit } from '../WhiteCollarCrimeEdit';

// ==============================================================================
// WHITE_COLLAR_CRIME MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * WhiteCollarCrimeList - Main list view for white-collar-crime items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as WhiteCollarCrimeList } from './WhiteCollarCrimeList';

/**
 * WhiteCollarCrimeCard - Compact white-collar-crime display card
 * Features: Item info, status, quick actions
 */
export { default as WhiteCollarCrimeCard } from './WhiteCollarCrimeCard';

/**
 * WhiteCollarCrimeForm - Create/edit white-collar-crime item
 * Features: Validation, field management, submission handling
 */
export { default as WhiteCollarCrimeForm } from './WhiteCollarCrimeForm';

/**
 * WhiteCollarCrimeDetails - Detailed white-collar-crime view
 * Features: Full information display, related data, actions
 */
export { default as WhiteCollarCrimeDetails } from './WhiteCollarCrimeDetails';

/**
 * WhiteCollarCrimeFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as WhiteCollarCrimeFilters } from './WhiteCollarCrimeFilters';

// ==============================================================================
// WHITE_COLLAR_CRIME UTILITY COMPONENTS
// ==============================================================================

/**
 * WhiteCollarCrimeSettings - WhiteCollarCrime-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as WhiteCollarCrimeSettings } from './WhiteCollarCrimeSettings';
