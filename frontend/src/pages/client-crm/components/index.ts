/**
 * WF-COMP-TBD | components/index.ts - ClientCrm Components Module
 * Purpose: Component exports for client-crm management
 * Dependencies: React, client-crm types, client-crm services
 * Features: ClientCrm CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CLIENT_CRM PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main client-crm page components with ClientCrm prefix for routes
 */
export { default as ClientCrmMain } from '../ClientCrmMain';
export { default as ClientCrmDetail } from '../ClientCrmDetail';
export { default as ClientCrmCreate } from '../ClientCrmCreate';
export { default as ClientCrmEdit } from '../ClientCrmEdit';

// ==============================================================================
// CLIENT_CRM MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ClientCrmList - Main list view for client-crm items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ClientCrmList } from './ClientCrmList';

/**
 * ClientCrmCard - Compact client-crm display card
 * Features: Item info, status, quick actions
 */
export { default as ClientCrmCard } from './ClientCrmCard';

/**
 * ClientCrmForm - Create/edit client-crm item
 * Features: Validation, field management, submission handling
 */
export { default as ClientCrmForm } from './ClientCrmForm';

/**
 * ClientCrmDetails - Detailed client-crm view
 * Features: Full information display, related data, actions
 */
export { default as ClientCrmDetails } from './ClientCrmDetails';

/**
 * ClientCrmFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ClientCrmFilters } from './ClientCrmFilters';

// ==============================================================================
// CLIENT_CRM UTILITY COMPONENTS
// ==============================================================================

/**
 * ClientCrmSettings - ClientCrm-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ClientCrmSettings } from './ClientCrmSettings';
