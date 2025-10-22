/**
 * WF-COMP-TBD | components/index.ts - SecuritiesLaw Components Module
 * Purpose: Component exports for securities-law management
 * Dependencies: React, securities-law types, securities-law services
 * Features: SecuritiesLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN SECURITIES_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main securities-law page components with SecuritiesLaw prefix for routes
 */
export { default as SecuritiesLawMain } from '../SecuritiesLawMain';
export { default as SecuritiesLawDetail } from '../SecuritiesLawDetail';
export { default as SecuritiesLawCreate } from '../SecuritiesLawCreate';
export { default as SecuritiesLawEdit } from '../SecuritiesLawEdit';

// ==============================================================================
// SECURITIES_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * SecuritiesLawList - Main list view for securities-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as SecuritiesLawList } from './SecuritiesLawList';

/**
 * SecuritiesLawCard - Compact securities-law display card
 * Features: Item info, status, quick actions
 */
export { default as SecuritiesLawCard } from './SecuritiesLawCard';

/**
 * SecuritiesLawForm - Create/edit securities-law item
 * Features: Validation, field management, submission handling
 */
export { default as SecuritiesLawForm } from './SecuritiesLawForm';

/**
 * SecuritiesLawDetails - Detailed securities-law view
 * Features: Full information display, related data, actions
 */
export { default as SecuritiesLawDetails } from './SecuritiesLawDetails';

/**
 * SecuritiesLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as SecuritiesLawFilters } from './SecuritiesLawFilters';

// ==============================================================================
// SECURITIES_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * SecuritiesLawSettings - SecuritiesLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as SecuritiesLawSettings } from './SecuritiesLawSettings';
