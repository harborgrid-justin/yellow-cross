/**
 * WF-COMP-TBD | components/index.ts - EducationLaw Components Module
 * Purpose: Component exports for education-law management
 * Dependencies: React, education-law types, education-law services
 * Features: EducationLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN EDUCATION_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main education-law page components with EducationLaw prefix for routes
 */
export { default as EducationLawMain } from '../EducationLawMain';
export { default as EducationLawDetail } from '../EducationLawDetail';
export { default as EducationLawCreate } from '../EducationLawCreate';
export { default as EducationLawEdit } from '../EducationLawEdit';

// ==============================================================================
// EDUCATION_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * EducationLawList - Main list view for education-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as EducationLawList } from './EducationLawList';

/**
 * EducationLawCard - Compact education-law display card
 * Features: Item info, status, quick actions
 */
export { default as EducationLawCard } from './EducationLawCard';

/**
 * EducationLawForm - Create/edit education-law item
 * Features: Validation, field management, submission handling
 */
export { default as EducationLawForm } from './EducationLawForm';

/**
 * EducationLawDetails - Detailed education-law view
 * Features: Full information display, related data, actions
 */
export { default as EducationLawDetails } from './EducationLawDetails';

/**
 * EducationLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as EducationLawFilters } from './EducationLawFilters';

// ==============================================================================
// EDUCATION_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * EducationLawSettings - EducationLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as EducationLawSettings } from './EducationLawSettings';
