/**
 * WF-COMP-TBD | components/index.ts - AppellatePractice Components Module
 * Purpose: Component exports for appellate-practice management
 * Dependencies: React, appellate-practice types, appellate-practice services
 * Features: AppellatePractice CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN APPELLATE_PRACTICE PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main appellate-practice page components with AppellatePractice prefix for routes
 */
export { default as AppellatePracticeMain } from '../AppellatePracticeMain';
export { default as AppellatePracticeDetail } from '../AppellatePracticeDetail';
export { default as AppellatePracticeCreate } from '../AppellatePracticeCreate';
export { default as AppellatePracticeEdit } from '../AppellatePracticeEdit';

// ==============================================================================
// APPELLATE_PRACTICE MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * AppellatePracticeList - Main list view for appellate-practice items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as AppellatePracticeList } from './AppellatePracticeList';

/**
 * AppellatePracticeCard - Compact appellate-practice display card
 * Features: Item info, status, quick actions
 */
export { default as AppellatePracticeCard } from './AppellatePracticeCard';

/**
 * AppellatePracticeForm - Create/edit appellate-practice item
 * Features: Validation, field management, submission handling
 */
export { default as AppellatePracticeForm } from './AppellatePracticeForm';

/**
 * AppellatePracticeDetails - Detailed appellate-practice view
 * Features: Full information display, related data, actions
 */
export { default as AppellatePracticeDetails } from './AppellatePracticeDetails';

/**
 * AppellatePracticeFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as AppellatePracticeFilters } from './AppellatePracticeFilters';

// ==============================================================================
// APPELLATE_PRACTICE UTILITY COMPONENTS
// ==============================================================================

/**
 * AppellatePracticeSettings - AppellatePractice-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as AppellatePracticeSettings } from './AppellatePracticeSettings';
