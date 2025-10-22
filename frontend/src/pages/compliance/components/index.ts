/**
 * WF-COMP-TBD | components/index.ts - Compliance Components Module
 * Purpose: Component exports for compliance management
 * Dependencies: React, compliance types, compliance services
 * Features: Compliance CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN COMPLIANCE PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main compliance page components with Compliance prefix for routes
 */
export { default as ComplianceMain } from '../ComplianceMain';
export { default as ComplianceDetail } from '../ComplianceDetail';
export { default as ComplianceCreate } from '../ComplianceCreate';
export { default as ComplianceEdit } from '../ComplianceEdit';

// ==============================================================================
// COMPLIANCE MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ComplianceList - Main list view for compliance items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ComplianceList } from './ComplianceList';

/**
 * ComplianceCard - Compact compliance display card
 * Features: Item info, status, quick actions
 */
export { default as ComplianceCard } from './ComplianceCard';

/**
 * ComplianceForm - Create/edit compliance item
 * Features: Validation, field management, submission handling
 */
export { default as ComplianceForm } from './ComplianceForm';

/**
 * ComplianceDetails - Detailed compliance view
 * Features: Full information display, related data, actions
 */
export { default as ComplianceDetails } from './ComplianceDetails';

/**
 * ComplianceFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ComplianceFilters } from './ComplianceFilters';

// ==============================================================================
// COMPLIANCE UTILITY COMPONENTS
// ==============================================================================

/**
 * ComplianceSettings - Compliance-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ComplianceSettings } from './ComplianceSettings';
