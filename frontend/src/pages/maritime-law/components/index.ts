/**
 * WF-COMP-TBD | components/index.ts - MaritimeLaw Components Module
 * Purpose: Component exports for maritime-law management
 * Dependencies: React, maritime-law types, maritime-law services
 * Features: MaritimeLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN MARITIME_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main maritime-law page components with MaritimeLaw prefix for routes
 */
export { default as MaritimeLawMain } from '../MaritimeLawMain';
export { default as MaritimeLawDetail } from '../MaritimeLawDetail';
export { default as MaritimeLawCreate } from '../MaritimeLawCreate';
export { default as MaritimeLawEdit } from '../MaritimeLawEdit';

// ==============================================================================
// MARITIME_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * MaritimeLawList - Main list view for maritime-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as MaritimeLawList } from './MaritimeLawList';

/**
 * MaritimeLawCard - Compact maritime-law display card
 * Features: Item info, status, quick actions
 */
export { default as MaritimeLawCard } from './MaritimeLawCard';

/**
 * MaritimeLawForm - Create/edit maritime-law item
 * Features: Validation, field management, submission handling
 */
export { default as MaritimeLawForm } from './MaritimeLawForm';

/**
 * MaritimeLawDetails - Detailed maritime-law view
 * Features: Full information display, related data, actions
 */
export { default as MaritimeLawDetails } from './MaritimeLawDetails';

/**
 * MaritimeLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as MaritimeLawFilters } from './MaritimeLawFilters';

// ==============================================================================
// MARITIME_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * MaritimeLawSettings - MaritimeLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as MaritimeLawSettings } from './MaritimeLawSettings';
