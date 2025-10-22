/**
 * WF-COMP-TBD | components/index.ts - CorporateGovernance Components Module
 * Purpose: Component exports for corporate-governance management
 * Dependencies: React, corporate-governance types, corporate-governance services
 * Features: CorporateGovernance CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CORPORATE_GOVERNANCE PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main corporate-governance page components with CorporateGovernance prefix for routes
 */
export { default as CorporateGovernanceMain } from '../CorporateGovernanceMain';
export { default as CorporateGovernanceDetail } from '../CorporateGovernanceDetail';
export { default as CorporateGovernanceCreate } from '../CorporateGovernanceCreate';
export { default as CorporateGovernanceEdit } from '../CorporateGovernanceEdit';

// ==============================================================================
// CORPORATE_GOVERNANCE MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * CorporateGovernanceList - Main list view for corporate-governance items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as CorporateGovernanceList } from './CorporateGovernanceList';

/**
 * CorporateGovernanceCard - Compact corporate-governance display card
 * Features: Item info, status, quick actions
 */
export { default as CorporateGovernanceCard } from './CorporateGovernanceCard';

/**
 * CorporateGovernanceForm - Create/edit corporate-governance item
 * Features: Validation, field management, submission handling
 */
export { default as CorporateGovernanceForm } from './CorporateGovernanceForm';

/**
 * CorporateGovernanceDetails - Detailed corporate-governance view
 * Features: Full information display, related data, actions
 */
export { default as CorporateGovernanceDetails } from './CorporateGovernanceDetails';

/**
 * CorporateGovernanceFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as CorporateGovernanceFilters } from './CorporateGovernanceFilters';

// ==============================================================================
// CORPORATE_GOVERNANCE UTILITY COMPONENTS
// ==============================================================================

/**
 * CorporateGovernanceSettings - CorporateGovernance-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as CorporateGovernanceSettings } from './CorporateGovernanceSettings';
