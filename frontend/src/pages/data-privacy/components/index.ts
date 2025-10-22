/**
 * WF-COMP-TBD | components/index.ts - DataPrivacy Components Module
 * Purpose: Component exports for data-privacy management
 * Dependencies: React, data-privacy types, data-privacy services
 * Features: DataPrivacy CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN DATA_PRIVACY PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main data-privacy page components with DataPrivacy prefix for routes
 */
export { default as DataPrivacyMain } from '../DataPrivacyMain';
export { default as DataPrivacyDetail } from '../DataPrivacyDetail';
export { default as DataPrivacyCreate } from '../DataPrivacyCreate';
export { default as DataPrivacyEdit } from '../DataPrivacyEdit';

// ==============================================================================
// DATA_PRIVACY MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * DataPrivacyList - Main list view for data-privacy items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as DataPrivacyList } from './DataPrivacyList';

/**
 * DataPrivacyCard - Compact data-privacy display card
 * Features: Item info, status, quick actions
 */
export { default as DataPrivacyCard } from './DataPrivacyCard';

/**
 * DataPrivacyForm - Create/edit data-privacy item
 * Features: Validation, field management, submission handling
 */
export { default as DataPrivacyForm } from './DataPrivacyForm';

/**
 * DataPrivacyDetails - Detailed data-privacy view
 * Features: Full information display, related data, actions
 */
export { default as DataPrivacyDetails } from './DataPrivacyDetails';

/**
 * DataPrivacyFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as DataPrivacyFilters } from './DataPrivacyFilters';

// ==============================================================================
// DATA_PRIVACY UTILITY COMPONENTS
// ==============================================================================

/**
 * DataPrivacySettings - DataPrivacy-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as DataPrivacySettings } from './DataPrivacySettings';
