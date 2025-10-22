/**
 * WF-COMP-TBD | components/index.ts - GovernmentContracts Components Module
 * Purpose: Component exports for government-contracts management
 * Dependencies: React, government-contracts types, government-contracts services
 * Features: GovernmentContracts CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN GOVERNMENT_CONTRACTS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main government-contracts page components with GovernmentContracts prefix for routes
 */
export { default as GovernmentContractsMain } from '../GovernmentContractsMain';
export { default as GovernmentContractsDetail } from '../GovernmentContractsDetail';
export { default as GovernmentContractsCreate } from '../GovernmentContractsCreate';
export { default as GovernmentContractsEdit } from '../GovernmentContractsEdit';

// ==============================================================================
// GOVERNMENT_CONTRACTS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * GovernmentContractsList - Main list view for government-contracts items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as GovernmentContractsList } from './GovernmentContractsList';

/**
 * GovernmentContractsCard - Compact government-contracts display card
 * Features: Item info, status, quick actions
 */
export { default as GovernmentContractsCard } from './GovernmentContractsCard';

/**
 * GovernmentContractsForm - Create/edit government-contracts item
 * Features: Validation, field management, submission handling
 */
export { default as GovernmentContractsForm } from './GovernmentContractsForm';

/**
 * GovernmentContractsDetails - Detailed government-contracts view
 * Features: Full information display, related data, actions
 */
export { default as GovernmentContractsDetails } from './GovernmentContractsDetails';

/**
 * GovernmentContractsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as GovernmentContractsFilters } from './GovernmentContractsFilters';

// ==============================================================================
// GOVERNMENT_CONTRACTS UTILITY COMPONENTS
// ==============================================================================

/**
 * GovernmentContractsSettings - GovernmentContracts-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as GovernmentContractsSettings } from './GovernmentContractsSettings';
