/**
 * WF-COMP-TBD | components/index.ts - ClassAction Components Module
 * Purpose: Component exports for class-action management
 * Dependencies: React, class-action types, class-action services
 * Features: ClassAction CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CLASS_ACTION PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main class-action page components with ClassAction prefix for routes
 */
export { default as ClassActionMain } from '../ClassActionMain';
export { default as ClassActionDetail } from '../ClassActionDetail';
export { default as ClassActionCreate } from '../ClassActionCreate';
export { default as ClassActionEdit } from '../ClassActionEdit';

// ==============================================================================
// CLASS_ACTION MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ClassActionList - Main list view for class-action items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ClassActionList } from './ClassActionList';

/**
 * ClassActionCard - Compact class-action display card
 * Features: Item info, status, quick actions
 */
export { default as ClassActionCard } from './ClassActionCard';

/**
 * ClassActionForm - Create/edit class-action item
 * Features: Validation, field management, submission handling
 */
export { default as ClassActionForm } from './ClassActionForm';

/**
 * ClassActionDetails - Detailed class-action view
 * Features: Full information display, related data, actions
 */
export { default as ClassActionDetails } from './ClassActionDetails';

/**
 * ClassActionFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ClassActionFilters } from './ClassActionFilters';

// ==============================================================================
// CLASS_ACTION UTILITY COMPONENTS
// ==============================================================================

/**
 * ClassActionSettings - ClassAction-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ClassActionSettings } from './ClassActionSettings';
