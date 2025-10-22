/**
 * WF-COMP-TBD | components/index.ts - EmploymentLaw Components Module
 * Purpose: Component exports for employment-law management
 * Dependencies: React, employment-law types, employment-law services
 * Features: EmploymentLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN EMPLOYMENT_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main employment-law page components with EmploymentLaw prefix for routes
 */
export { default as EmploymentLawMain } from '../EmploymentLawMain';
export { default as EmploymentLawDetail } from '../EmploymentLawDetail';
export { default as EmploymentLawCreate } from '../EmploymentLawCreate';
export { default as EmploymentLawEdit } from '../EmploymentLawEdit';

// ==============================================================================
// EMPLOYMENT_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * EmploymentLawList - Main list view for employment-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as EmploymentLawList } from './EmploymentLawList';

/**
 * EmploymentLawCard - Compact employment-law display card
 * Features: Item info, status, quick actions
 */
export { default as EmploymentLawCard } from './EmploymentLawCard';

/**
 * EmploymentLawForm - Create/edit employment-law item
 * Features: Validation, field management, submission handling
 */
export { default as EmploymentLawForm } from './EmploymentLawForm';

/**
 * EmploymentLawDetails - Detailed employment-law view
 * Features: Full information display, related data, actions
 */
export { default as EmploymentLawDetails } from './EmploymentLawDetails';

/**
 * EmploymentLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as EmploymentLawFilters } from './EmploymentLawFilters';

// ==============================================================================
// EMPLOYMENT_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * EmploymentLawSettings - EmploymentLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as EmploymentLawSettings } from './EmploymentLawSettings';
