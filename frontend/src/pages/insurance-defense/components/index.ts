/**
 * WF-COMP-TBD | components/index.ts - InsuranceDefense Components Module
 * Purpose: Component exports for insurance-defense management
 * Dependencies: React, insurance-defense types, insurance-defense services
 * Features: InsuranceDefense CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN INSURANCE_DEFENSE PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main insurance-defense page components with InsuranceDefense prefix for routes
 */
export { default as InsuranceDefenseMain } from '../InsuranceDefenseMain';
export { default as InsuranceDefenseDetail } from '../InsuranceDefenseDetail';
export { default as InsuranceDefenseCreate } from '../InsuranceDefenseCreate';
export { default as InsuranceDefenseEdit } from '../InsuranceDefenseEdit';

// ==============================================================================
// INSURANCE_DEFENSE MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * InsuranceDefenseList - Main list view for insurance-defense items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as InsuranceDefenseList } from './InsuranceDefenseList';

/**
 * InsuranceDefenseCard - Compact insurance-defense display card
 * Features: Item info, status, quick actions
 */
export { default as InsuranceDefenseCard } from './InsuranceDefenseCard';

/**
 * InsuranceDefenseForm - Create/edit insurance-defense item
 * Features: Validation, field management, submission handling
 */
export { default as InsuranceDefenseForm } from './InsuranceDefenseForm';

/**
 * InsuranceDefenseDetails - Detailed insurance-defense view
 * Features: Full information display, related data, actions
 */
export { default as InsuranceDefenseDetails } from './InsuranceDefenseDetails';

/**
 * InsuranceDefenseFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as InsuranceDefenseFilters } from './InsuranceDefenseFilters';

// ==============================================================================
// INSURANCE_DEFENSE UTILITY COMPONENTS
// ==============================================================================

/**
 * InsuranceDefenseSettings - InsuranceDefense-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as InsuranceDefenseSettings } from './InsuranceDefenseSettings';
