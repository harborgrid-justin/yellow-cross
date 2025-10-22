/**
 * WF-COMP-TBD | components/index.ts - InternationalTrade Components Module
 * Purpose: Component exports for international-trade management
 * Dependencies: React, international-trade types, international-trade services
 * Features: InternationalTrade CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN INTERNATIONAL_TRADE PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main international-trade page components with InternationalTrade prefix for routes
 */
export { default as InternationalTradeMain } from '../InternationalTradeMain';
export { default as InternationalTradeDetail } from '../InternationalTradeDetail';
export { default as InternationalTradeCreate } from '../InternationalTradeCreate';
export { default as InternationalTradeEdit } from '../InternationalTradeEdit';

// ==============================================================================
// INTERNATIONAL_TRADE MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * InternationalTradeList - Main list view for international-trade items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as InternationalTradeList } from './InternationalTradeList';

/**
 * InternationalTradeCard - Compact international-trade display card
 * Features: Item info, status, quick actions
 */
export { default as InternationalTradeCard } from './InternationalTradeCard';

/**
 * InternationalTradeForm - Create/edit international-trade item
 * Features: Validation, field management, submission handling
 */
export { default as InternationalTradeForm } from './InternationalTradeForm';

/**
 * InternationalTradeDetails - Detailed international-trade view
 * Features: Full information display, related data, actions
 */
export { default as InternationalTradeDetails } from './InternationalTradeDetails';

/**
 * InternationalTradeFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as InternationalTradeFilters } from './InternationalTradeFilters';

// ==============================================================================
// INTERNATIONAL_TRADE UTILITY COMPONENTS
// ==============================================================================

/**
 * InternationalTradeSettings - InternationalTrade-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as InternationalTradeSettings } from './InternationalTradeSettings';
