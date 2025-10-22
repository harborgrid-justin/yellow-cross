/**
 * WF-COMP-TBD | components/index.ts - RealEstateTransactions Components Module
 * Purpose: Component exports for real-estate-transactions management
 * Dependencies: React, real-estate-transactions types, real-estate-transactions services
 * Features: RealEstateTransactions CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN REAL_ESTATE_TRANSACTIONS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main real-estate-transactions page components with RealEstateTransactions prefix for routes
 */
export { default as RealEstateTransactionsMain } from '../RealEstateTransactionsMain';
export { default as RealEstateTransactionsDetail } from '../RealEstateTransactionsDetail';
export { default as RealEstateTransactionsCreate } from '../RealEstateTransactionsCreate';
export { default as RealEstateTransactionsEdit } from '../RealEstateTransactionsEdit';

// ==============================================================================
// REAL_ESTATE_TRANSACTIONS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * RealEstateTransactionsList - Main list view for real-estate-transactions items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as RealEstateTransactionsList } from './RealEstateTransactionsList';

/**
 * RealEstateTransactionsCard - Compact real-estate-transactions display card
 * Features: Item info, status, quick actions
 */
export { default as RealEstateTransactionsCard } from './RealEstateTransactionsCard';

/**
 * RealEstateTransactionsForm - Create/edit real-estate-transactions item
 * Features: Validation, field management, submission handling
 */
export { default as RealEstateTransactionsForm } from './RealEstateTransactionsForm';

/**
 * RealEstateTransactionsDetails - Detailed real-estate-transactions view
 * Features: Full information display, related data, actions
 */
export { default as RealEstateTransactionsDetails } from './RealEstateTransactionsDetails';

/**
 * RealEstateTransactionsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as RealEstateTransactionsFilters } from './RealEstateTransactionsFilters';

// ==============================================================================
// REAL_ESTATE_TRANSACTIONS UTILITY COMPONENTS
// ==============================================================================

/**
 * RealEstateTransactionsSettings - RealEstateTransactions-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as RealEstateTransactionsSettings } from './RealEstateTransactionsSettings';
