/**
 * WF-COMP-TBD | components/index.ts - Integration Components Module
 * Purpose: Component exports for integration management
 * Dependencies: React, integration types, integration services
 * Features: Integration CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN INTEGRATION PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main integration page components with Integration prefix for routes
 */
export { default as IntegrationMain } from '../IntegrationMain';
export { default as IntegrationDetail } from '../IntegrationDetail';
export { default as IntegrationCreate } from '../IntegrationCreate';
export { default as IntegrationEdit } from '../IntegrationEdit';

// ==============================================================================
// INTEGRATION MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * IntegrationList - Main list view for integration items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as IntegrationList } from './IntegrationList';

/**
 * IntegrationCard - Compact integration display card
 * Features: Item info, status, quick actions
 */
export { default as IntegrationCard } from './IntegrationCard';

/**
 * IntegrationForm - Create/edit integration item
 * Features: Validation, field management, submission handling
 */
export { default as IntegrationForm } from './IntegrationForm';

/**
 * IntegrationDetails - Detailed integration view
 * Features: Full information display, related data, actions
 */
export { default as IntegrationDetails } from './IntegrationDetails';

/**
 * IntegrationFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as IntegrationFilters } from './IntegrationFilters';

// ==============================================================================
// INTEGRATION UTILITY COMPONENTS
// ==============================================================================

/**
 * IntegrationSettings - Integration-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as IntegrationSettings } from './IntegrationSettings';
