/**
 * WF-COMP-TBD | components/index.ts - Ediscovery Components Module
 * Purpose: Component exports for ediscovery management
 * Dependencies: React, ediscovery types, ediscovery services
 * Features: Ediscovery CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN EDISCOVERY PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main ediscovery page components with Ediscovery prefix for routes
 */
export { default as EdiscoveryMain } from '../EdiscoveryMain';
export { default as EdiscoveryDetail } from '../EdiscoveryDetail';
export { default as EdiscoveryCreate } from '../EdiscoveryCreate';
export { default as EdiscoveryEdit } from '../EdiscoveryEdit';

// ==============================================================================
// EDISCOVERY MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * EdiscoveryList - Main list view for ediscovery items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as EdiscoveryList } from './EdiscoveryList';

/**
 * EdiscoveryCard - Compact ediscovery display card
 * Features: Item info, status, quick actions
 */
export { default as EdiscoveryCard } from './EdiscoveryCard';

/**
 * EdiscoveryForm - Create/edit ediscovery item
 * Features: Validation, field management, submission handling
 */
export { default as EdiscoveryForm } from './EdiscoveryForm';

/**
 * EdiscoveryDetails - Detailed ediscovery view
 * Features: Full information display, related data, actions
 */
export { default as EdiscoveryDetails } from './EdiscoveryDetails';

/**
 * EdiscoveryFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as EdiscoveryFilters } from './EdiscoveryFilters';

// ==============================================================================
// EDISCOVERY UTILITY COMPONENTS
// ==============================================================================

/**
 * EdiscoverySettings - Ediscovery-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as EdiscoverySettings } from './EdiscoverySettings';
