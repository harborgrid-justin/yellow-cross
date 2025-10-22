/**
 * WF-COMP-TBD | components/index.ts - ContractManagement Components Module
 * Purpose: Component exports for contract-management management
 * Dependencies: React, contract-management types, contract-management services
 * Features: ContractManagement CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CONTRACT_MANAGEMENT PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main contract-management page components with ContractManagement prefix for routes
 */
export { default as ContractManagementMain } from '../ContractManagementMain';
export { default as ContractManagementDetail } from '../ContractManagementDetail';
export { default as ContractManagementCreate } from '../ContractManagementCreate';
export { default as ContractManagementEdit } from '../ContractManagementEdit';

// ==============================================================================
// CONTRACT_MANAGEMENT MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ContractManagementList - Main list view for contract-management items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ContractManagementList } from './ContractManagementList';

/**
 * ContractManagementCard - Compact contract-management display card
 * Features: Item info, status, quick actions
 */
export { default as ContractManagementCard } from './ContractManagementCard';

/**
 * ContractManagementForm - Create/edit contract-management item
 * Features: Validation, field management, submission handling
 */
export { default as ContractManagementForm } from './ContractManagementForm';

/**
 * ContractManagementDetails - Detailed contract-management view
 * Features: Full information display, related data, actions
 */
export { default as ContractManagementDetails } from './ContractManagementDetails';

/**
 * ContractManagementFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ContractManagementFilters } from './ContractManagementFilters';

// ==============================================================================
// CONTRACT_MANAGEMENT UTILITY COMPONENTS
// ==============================================================================

/**
 * ContractManagementSettings - ContractManagement-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ContractManagementSettings } from './ContractManagementSettings';
