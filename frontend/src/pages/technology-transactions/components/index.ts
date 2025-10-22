/**
 * WF-COMP-TBD | components/index.ts - TechnologyTransactions Components Module
 * Purpose: Component exports for technology-transactions management
 * Dependencies: React, technology-transactions types, technology-transactions services
 * Features: TechnologyTransactions CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN TECHNOLOGY_TRANSACTIONS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main technology-transactions page components with TechnologyTransactions prefix for routes
 */
export { default as TechnologyTransactionsMain } from '../TechnologyTransactionsMain';
export { default as TechnologyTransactionsDetail } from '../TechnologyTransactionsDetail';
export { default as TechnologyTransactionsCreate } from '../TechnologyTransactionsCreate';
export { default as TechnologyTransactionsEdit } from '../TechnologyTransactionsEdit';

// ==============================================================================
// TECHNOLOGY_TRANSACTIONS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * TechnologyTransactionsList - Main list view for technology-transactions items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as TechnologyTransactionsList } from './TechnologyTransactionsList';

/**
 * TechnologyTransactionsCard - Compact technology-transactions display card
 * Features: Item info, status, quick actions
 */
export { default as TechnologyTransactionsCard } from './TechnologyTransactionsCard';

/**
 * TechnologyTransactionsForm - Create/edit technology-transactions item
 * Features: Validation, field management, submission handling
 */
export { default as TechnologyTransactionsForm } from './TechnologyTransactionsForm';

/**
 * TechnologyTransactionsDetails - Detailed technology-transactions view
 * Features: Full information display, related data, actions
 */
export { default as TechnologyTransactionsDetails } from './TechnologyTransactionsDetails';

/**
 * TechnologyTransactionsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as TechnologyTransactionsFilters } from './TechnologyTransactionsFilters';

// ==============================================================================
// TECHNOLOGY_TRANSACTIONS UTILITY COMPONENTS
// ==============================================================================

/**
 * TechnologyTransactionsSettings - TechnologyTransactions-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as TechnologyTransactionsSettings } from './TechnologyTransactionsSettings';
