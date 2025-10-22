/**
 * WF-COMP-TBD | components/index.ts - Security Components Module
 * Purpose: Component exports for security management
 * Dependencies: React, security types, security services
 * Features: Security CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN SECURITY PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main security page components with Security prefix for routes
 */
export { default as SecurityMain } from '../SecurityMain';
export { default as SecurityDetail } from '../SecurityDetail';
export { default as SecurityCreate } from '../SecurityCreate';
export { default as SecurityEdit } from '../SecurityEdit';

// ==============================================================================
// SECURITY MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * SecurityList - Main list view for security items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as SecurityList } from './SecurityList';

/**
 * SecurityCard - Compact security display card
 * Features: Item info, status, quick actions
 */
export { default as SecurityCard } from './SecurityCard';

/**
 * SecurityForm - Create/edit security item
 * Features: Validation, field management, submission handling
 */
export { default as SecurityForm } from './SecurityForm';

/**
 * SecurityDetails - Detailed security view
 * Features: Full information display, related data, actions
 */
export { default as SecurityDetails } from './SecurityDetails';

/**
 * SecurityFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as SecurityFilters } from './SecurityFilters';

// ==============================================================================
// SECURITY UTILITY COMPONENTS
// ==============================================================================

/**
 * SecuritySettings - Security-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as SecuritySettings } from './SecuritySettings';
