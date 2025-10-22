/**
 * WF-COMP-TBD | components/index.ts - MergersAcquisitions Components Module
 * Purpose: Component exports for mergers-acquisitions management
 * Dependencies: React, mergers-acquisitions types, mergers-acquisitions services
 * Features: MergersAcquisitions CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN MERGERS_ACQUISITIONS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main mergers-acquisitions page components with MergersAcquisitions prefix for routes
 */
export { default as MergersAcquisitionsMain } from '../MergersAcquisitionsMain';
export { default as MergersAcquisitionsDetail } from '../MergersAcquisitionsDetail';
export { default as MergersAcquisitionsCreate } from '../MergersAcquisitionsCreate';
export { default as MergersAcquisitionsEdit } from '../MergersAcquisitionsEdit';

// ==============================================================================
// MERGERS_ACQUISITIONS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * MergersAcquisitionsList - Main list view for mergers-acquisitions items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as MergersAcquisitionsList } from './MergersAcquisitionsList';

/**
 * MergersAcquisitionsCard - Compact mergers-acquisitions display card
 * Features: Item info, status, quick actions
 */
export { default as MergersAcquisitionsCard } from './MergersAcquisitionsCard';

/**
 * MergersAcquisitionsForm - Create/edit mergers-acquisitions item
 * Features: Validation, field management, submission handling
 */
export { default as MergersAcquisitionsForm } from './MergersAcquisitionsForm';

/**
 * MergersAcquisitionsDetails - Detailed mergers-acquisitions view
 * Features: Full information display, related data, actions
 */
export { default as MergersAcquisitionsDetails } from './MergersAcquisitionsDetails';

/**
 * MergersAcquisitionsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as MergersAcquisitionsFilters } from './MergersAcquisitionsFilters';

// ==============================================================================
// MERGERS_ACQUISITIONS UTILITY COMPONENTS
// ==============================================================================

/**
 * MergersAcquisitionsSettings - MergersAcquisitions-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as MergersAcquisitionsSettings } from './MergersAcquisitionsSettings';
