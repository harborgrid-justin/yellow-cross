/**
 * WF-COMP-TBD | components/index.ts - FinancialServices Components Module
 * Purpose: Component exports for financial-services management
 * Dependencies: React, financial-services types, financial-services services
 * Features: FinancialServices CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN FINANCIAL_SERVICES PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main financial-services page components with FinancialServices prefix for routes
 */
export { default as FinancialServicesMain } from '../FinancialServicesMain';
export { default as FinancialServicesDetail } from '../FinancialServicesDetail';
export { default as FinancialServicesCreate } from '../FinancialServicesCreate';
export { default as FinancialServicesEdit } from '../FinancialServicesEdit';

// ==============================================================================
// FINANCIAL_SERVICES MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * FinancialServicesList - Main list view for financial-services items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as FinancialServicesList } from './FinancialServicesList';

/**
 * FinancialServicesCard - Compact financial-services display card
 * Features: Item info, status, quick actions
 */
export { default as FinancialServicesCard } from './FinancialServicesCard';

/**
 * FinancialServicesForm - Create/edit financial-services item
 * Features: Validation, field management, submission handling
 */
export { default as FinancialServicesForm } from './FinancialServicesForm';

/**
 * FinancialServicesDetails - Detailed financial-services view
 * Features: Full information display, related data, actions
 */
export { default as FinancialServicesDetails } from './FinancialServicesDetails';

/**
 * FinancialServicesFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as FinancialServicesFilters } from './FinancialServicesFilters';

// ==============================================================================
// FINANCIAL_SERVICES UTILITY COMPONENTS
// ==============================================================================

/**
 * FinancialServicesSettings - FinancialServices-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as FinancialServicesSettings } from './FinancialServicesSettings';
