/**
 * WF-COMP-TBD | components/index.ts - TaxLaw Components Module
 * Purpose: Component exports for tax-law management
 * Dependencies: React, tax-law types, tax-law services
 * Features: TaxLaw CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN TAX_LAW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main tax-law page components with TaxLaw prefix for routes
 */
export { default as TaxLawMain } from '../TaxLawMain';
export { default as TaxLawDetail } from '../TaxLawDetail';
export { default as TaxLawCreate } from '../TaxLawCreate';
export { default as TaxLawEdit } from '../TaxLawEdit';

// ==============================================================================
// TAX_LAW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * TaxLawList - Main list view for tax-law items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as TaxLawList } from './TaxLawList';

/**
 * TaxLawCard - Compact tax-law display card
 * Features: Item info, status, quick actions
 */
export { default as TaxLawCard } from './TaxLawCard';

/**
 * TaxLawForm - Create/edit tax-law item
 * Features: Validation, field management, submission handling
 */
export { default as TaxLawForm } from './TaxLawForm';

/**
 * TaxLawDetails - Detailed tax-law view
 * Features: Full information display, related data, actions
 */
export { default as TaxLawDetails } from './TaxLawDetails';

/**
 * TaxLawFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as TaxLawFilters } from './TaxLawFilters';

// ==============================================================================
// TAX_LAW UTILITY COMPONENTS
// ==============================================================================

/**
 * TaxLawSettings - TaxLaw-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as TaxLawSettings } from './TaxLawSettings';
