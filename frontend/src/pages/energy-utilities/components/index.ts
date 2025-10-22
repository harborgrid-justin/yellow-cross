/**
 * WF-COMP-TBD | components/index.ts - EnergyUtilities Components Module
 * Purpose: Component exports for energy-utilities management
 * Dependencies: React, energy-utilities types, energy-utilities services
 * Features: EnergyUtilities CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN ENERGY_UTILITIES PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main energy-utilities page components with EnergyUtilities prefix for routes
 */
export { default as EnergyUtilitiesMain } from '../EnergyUtilitiesMain';
export { default as EnergyUtilitiesDetail } from '../EnergyUtilitiesDetail';
export { default as EnergyUtilitiesCreate } from '../EnergyUtilitiesCreate';
export { default as EnergyUtilitiesEdit } from '../EnergyUtilitiesEdit';

// ==============================================================================
// ENERGY_UTILITIES MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * EnergyUtilitiesList - Main list view for energy-utilities items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as EnergyUtilitiesList } from './EnergyUtilitiesList';

/**
 * EnergyUtilitiesCard - Compact energy-utilities display card
 * Features: Item info, status, quick actions
 */
export { default as EnergyUtilitiesCard } from './EnergyUtilitiesCard';

/**
 * EnergyUtilitiesForm - Create/edit energy-utilities item
 * Features: Validation, field management, submission handling
 */
export { default as EnergyUtilitiesForm } from './EnergyUtilitiesForm';

/**
 * EnergyUtilitiesDetails - Detailed energy-utilities view
 * Features: Full information display, related data, actions
 */
export { default as EnergyUtilitiesDetails } from './EnergyUtilitiesDetails';

/**
 * EnergyUtilitiesFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as EnergyUtilitiesFilters } from './EnergyUtilitiesFilters';

// ==============================================================================
// ENERGY_UTILITIES UTILITY COMPONENTS
// ==============================================================================

/**
 * EnergyUtilitiesSettings - EnergyUtilities-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as EnergyUtilitiesSettings } from './EnergyUtilitiesSettings';
