/**
 * WF-COMP-011 | components/index.ts - Admin Components Module
 * Purpose: Component exports for admin management
 * Dependencies: React, admin types, admin services
 * Features: Admin CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN ADMIN PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main admin page components with Admin prefix for routes
 */
export { default as AdminMain } from '../AdminMain';
export { default as AdminDetail } from '../AdminDetail';
export { default as AdminCreate } from '../AdminCreate';
export { default as AdminEdit } from '../AdminEdit';

// ==============================================================================
// ADMIN MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * AdminList - Main list view for admin items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as AdminList } from './AdminList';

/**
 * AdminCard - Compact admin display card
 * Features: Item info, status, quick actions
 */
export { default as AdminCard } from './AdminCard';

/**
 * AdminForm - Create/edit admin item
 * Features: Validation, field management, submission handling
 */
export { default as AdminForm } from './AdminForm';

/**
 * AdminDetails - Detailed admin view
 * Features: Full information display, related data, actions
 */
export { default as AdminDetails } from './AdminDetails';

/**
 * AdminFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as AdminFilters } from './AdminFilters';

// ==============================================================================
// ADMIN UTILITY COMPONENTS
// ==============================================================================

/**
 * AdminSettings - Admin-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as AdminSettings } from './AdminSettings';
