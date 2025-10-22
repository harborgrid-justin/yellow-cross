/**
 * WF-COMP-TBD | components/index.ts - NonProfitLaw Components Module
 * Purpose: Component exports for non-profit-law management
 * Dependencies: React, non-profit-law types, non-profit-law services
 * Features: NonProfitLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN NON_PROFIT_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main non-profit-law page components with NonProfitLaw prefix for routes
 */
export { default as NonProfitLawMain } from '../NonProfitLawMain';
export { default as NonProfitLawDetail } from '../NonProfitLawDetail';
export { default as NonProfitLawCreate } from '../NonProfitLawCreate';
export { default as NonProfitLawEdit } from '../NonProfitLawEdit';

// ==============================================================================
// NON_PROFIT_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * NonProfitLawList - Main list view for non-profit-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as NonProfitLawList } from './NonProfitLawList';

/**
 * NonProfitLawCard - Compact non-profit-law display card
 * Features: Item info, status, quick actions
 */
export { default as NonProfitLawCard } from './NonProfitLawCard';

/**
 * NonProfitLawForm - Create/edit non-profit-law item
 * Features: Validation, field management, submission handling
 */
export { default as NonProfitLawForm } from './NonProfitLawForm';

/**
 * NonProfitLawDetails - Detailed non-profit-law view
 * Features: Full information display, related data, actions
 */
export { default as NonProfitLawDetails } from './NonProfitLawDetails';

/**
 * NonProfitLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as NonProfitLawFilters } from './NonProfitLawFilters';

// ==============================================================================
// NON_PROFIT_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * NonProfitLawSettings - NonProfitLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as NonProfitLawSettings } from './NonProfitLawSettings';
