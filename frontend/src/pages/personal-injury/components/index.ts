/**
 * WF-COMP-TBD | components/index.ts - PersonalInjury Components Module
 * Purpose: Component exports for personal-injury management
 * Dependencies: React, personal-injury types, personal-injury services
 * Features: PersonalInjury CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN PERSONAL_INJURY PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main personal-injury page components with PersonalInjury prefix for routes
 */
export { default as PersonalInjuryMain } from '../PersonalInjuryMain';
export { default as PersonalInjuryDetail } from '../PersonalInjuryDetail';
export { default as PersonalInjuryCreate } from '../PersonalInjuryCreate';
export { default as PersonalInjuryEdit } from '../PersonalInjuryEdit';

// ==============================================================================
// PERSONAL_INJURY MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * PersonalInjuryList - Main list view for personal-injury items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as PersonalInjuryList } from './PersonalInjuryList';

/**
 * PersonalInjuryCard - Compact personal-injury display card
 * Features: Item info, status, quick actions
 */
export { default as PersonalInjuryCard } from './PersonalInjuryCard';

/**
 * PersonalInjuryForm - Create/edit personal-injury item
 * Features: Validation, field management, submission handling
 */
export { default as PersonalInjuryForm } from './PersonalInjuryForm';

/**
 * PersonalInjuryDetails - Detailed personal-injury view
 * Features: Full information display, related data, actions
 */
export { default as PersonalInjuryDetails } from './PersonalInjuryDetails';

/**
 * PersonalInjuryFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as PersonalInjuryFilters } from './PersonalInjuryFilters';

// ==============================================================================
// PERSONAL_INJURY UTILITY COMPONENTS
// ==============================================================================

/**
 * PersonalInjurySettings - PersonalInjury-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as PersonalInjurySettings } from './PersonalInjurySettings';
