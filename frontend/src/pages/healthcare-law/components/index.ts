/**
 * WF-COMP-TBD | components/index.ts - HealthcareLaw Components Module
 * Purpose: Component exports for healthcare-law management
 * Dependencies: React, healthcare-law types, healthcare-law services
 * Features: HealthcareLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN HEALTHCARE_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main healthcare-law page components with HealthcareLaw prefix for routes
 */
export { default as HealthcareLawMain } from '../HealthcareLawMain';
export { default as HealthcareLawDetail } from '../HealthcareLawDetail';
export { default as HealthcareLawCreate } from '../HealthcareLawCreate';
export { default as HealthcareLawEdit } from '../HealthcareLawEdit';

// ==============================================================================
// HEALTHCARE_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * HealthcareLawList - Main list view for healthcare-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as HealthcareLawList } from './HealthcareLawList';

/**
 * HealthcareLawCard - Compact healthcare-law display card
 * Features: Item info, status, quick actions
 */
export { default as HealthcareLawCard } from './HealthcareLawCard';

/**
 * HealthcareLawForm - Create/edit healthcare-law item
 * Features: Validation, field management, submission handling
 */
export { default as HealthcareLawForm } from './HealthcareLawForm';

/**
 * HealthcareLawDetails - Detailed healthcare-law view
 * Features: Full information display, related data, actions
 */
export { default as HealthcareLawDetails } from './HealthcareLawDetails';

/**
 * HealthcareLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as HealthcareLawFilters } from './HealthcareLawFilters';

// ==============================================================================
// HEALTHCARE_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * HealthcareLawSettings - HealthcareLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as HealthcareLawSettings } from './HealthcareLawSettings';
