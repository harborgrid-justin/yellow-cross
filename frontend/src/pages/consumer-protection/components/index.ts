/**
 * WF-COMP-TBD | components/index.ts - ConsumerProtection Components Module
 * Purpose: Component exports for consumer-protection management
 * Dependencies: React, consumer-protection types, consumer-protection services
 * Features: ConsumerProtection CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CONSUMER_PROTECTION PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main consumer-protection page components with ConsumerProtection prefix for routes
 */
export { default as ConsumerProtectionMain } from '../ConsumerProtectionMain';
export { default as ConsumerProtectionDetail } from '../ConsumerProtectionDetail';
export { default as ConsumerProtectionCreate } from '../ConsumerProtectionCreate';
export { default as ConsumerProtectionEdit } from '../ConsumerProtectionEdit';

// ==============================================================================
// CONSUMER_PROTECTION MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ConsumerProtectionList - Main list view for consumer-protection items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ConsumerProtectionList } from './ConsumerProtectionList';

/**
 * ConsumerProtectionCard - Compact consumer-protection display card
 * Features: Item info, status, quick actions
 */
export { default as ConsumerProtectionCard } from './ConsumerProtectionCard';

/**
 * ConsumerProtectionForm - Create/edit consumer-protection item
 * Features: Validation, field management, submission handling
 */
export { default as ConsumerProtectionForm } from './ConsumerProtectionForm';

/**
 * ConsumerProtectionDetails - Detailed consumer-protection view
 * Features: Full information display, related data, actions
 */
export { default as ConsumerProtectionDetails } from './ConsumerProtectionDetails';

/**
 * ConsumerProtectionFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ConsumerProtectionFilters } from './ConsumerProtectionFilters';

// ==============================================================================
// CONSUMER_PROTECTION UTILITY COMPONENTS
// ==============================================================================

/**
 * ConsumerProtectionSettings - ConsumerProtection-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ConsumerProtectionSettings } from './ConsumerProtectionSettings';
