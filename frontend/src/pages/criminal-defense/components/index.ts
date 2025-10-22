/**
 * WF-COMP-TBD | components/index.ts - CriminalDefense Components Module
 * Purpose: Component exports for criminal-defense management
 * Dependencies: React, criminal-defense types, criminal-defense services
 * Features: CriminalDefense CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CRIMINAL_DEFENSE PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main criminal-defense page components with CriminalDefense prefix for routes
 */
export { default as CriminalDefenseMain } from '../CriminalDefenseMain';
export { default as CriminalDefenseDetail } from '../CriminalDefenseDetail';
export { default as CriminalDefenseCreate } from '../CriminalDefenseCreate';
export { default as CriminalDefenseEdit } from '../CriminalDefenseEdit';

// ==============================================================================
// CRIMINAL_DEFENSE MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * CriminalDefenseList - Main list view for criminal-defense items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as CriminalDefenseList } from './CriminalDefenseList';

/**
 * CriminalDefenseCard - Compact criminal-defense display card
 * Features: Item info, status, quick actions
 */
export { default as CriminalDefenseCard } from './CriminalDefenseCard';

/**
 * CriminalDefenseForm - Create/edit criminal-defense item
 * Features: Validation, field management, submission handling
 */
export { default as CriminalDefenseForm } from './CriminalDefenseForm';

/**
 * CriminalDefenseDetails - Detailed criminal-defense view
 * Features: Full information display, related data, actions
 */
export { default as CriminalDefenseDetails } from './CriminalDefenseDetails';

/**
 * CriminalDefenseFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as CriminalDefenseFilters } from './CriminalDefenseFilters';

// ==============================================================================
// CRIMINAL_DEFENSE UTILITY COMPONENTS
// ==============================================================================

/**
 * CriminalDefenseSettings - CriminalDefense-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as CriminalDefenseSettings } from './CriminalDefenseSettings';
