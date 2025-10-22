/**
 * WF-COMP-TBD | components/index.ts - Telecommunications Components Module
 * Purpose: Component exports for telecommunications management
 * Dependencies: React, telecommunications types, telecommunications services
 * Features: Telecommunications CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN TELECOMMUNICATIONS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main telecommunications page components with Telecommunications prefix for routes
 */
export { default as TelecommunicationsMain } from '../TelecommunicationsMain';
export { default as TelecommunicationsDetail } from '../TelecommunicationsDetail';
export { default as TelecommunicationsCreate } from '../TelecommunicationsCreate';
export { default as TelecommunicationsEdit } from '../TelecommunicationsEdit';

// ==============================================================================
// TELECOMMUNICATIONS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * TelecommunicationsList - Main list view for telecommunications items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as TelecommunicationsList } from './TelecommunicationsList';

/**
 * TelecommunicationsCard - Compact telecommunications display card
 * Features: Item info, status, quick actions
 */
export { default as TelecommunicationsCard } from './TelecommunicationsCard';

/**
 * TelecommunicationsForm - Create/edit telecommunications item
 * Features: Validation, field management, submission handling
 */
export { default as TelecommunicationsForm } from './TelecommunicationsForm';

/**
 * TelecommunicationsDetails - Detailed telecommunications view
 * Features: Full information display, related data, actions
 */
export { default as TelecommunicationsDetails } from './TelecommunicationsDetails';

/**
 * TelecommunicationsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as TelecommunicationsFilters } from './TelecommunicationsFilters';

// ==============================================================================
// TELECOMMUNICATIONS UTILITY COMPONENTS
// ==============================================================================

/**
 * TelecommunicationsSettings - Telecommunications-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as TelecommunicationsSettings } from './TelecommunicationsSettings';
