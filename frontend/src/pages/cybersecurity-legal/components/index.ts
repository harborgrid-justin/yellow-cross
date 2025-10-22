/**
 * WF-COMP-TBD | components/index.ts - CybersecurityLegal Components Module
 * Purpose: Component exports for cybersecurity-legal management
 * Dependencies: React, cybersecurity-legal types, cybersecurity-legal services
 * Features: CybersecurityLegal CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CYBERSECURITY_LEGAL PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main cybersecurity-legal page components with CybersecurityLegal prefix for routes
 */
export { default as CybersecurityLegalMain } from '../CybersecurityLegalMain';
export { default as CybersecurityLegalDetail } from '../CybersecurityLegalDetail';
export { default as CybersecurityLegalCreate } from '../CybersecurityLegalCreate';
export { default as CybersecurityLegalEdit } from '../CybersecurityLegalEdit';

// ==============================================================================
// CYBERSECURITY_LEGAL MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * CybersecurityLegalList - Main list view for cybersecurity-legal items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as CybersecurityLegalList } from './CybersecurityLegalList';

/**
 * CybersecurityLegalCard - Compact cybersecurity-legal display card
 * Features: Item info, status, quick actions
 */
export { default as CybersecurityLegalCard } from './CybersecurityLegalCard';

/**
 * CybersecurityLegalForm - Create/edit cybersecurity-legal item
 * Features: Validation, field management, submission handling
 */
export { default as CybersecurityLegalForm } from './CybersecurityLegalForm';

/**
 * CybersecurityLegalDetails - Detailed cybersecurity-legal view
 * Features: Full information display, related data, actions
 */
export { default as CybersecurityLegalDetails } from './CybersecurityLegalDetails';

/**
 * CybersecurityLegalFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as CybersecurityLegalFilters } from './CybersecurityLegalFilters';

// ==============================================================================
// CYBERSECURITY_LEGAL UTILITY COMPONENTS
// ==============================================================================

/**
 * CybersecurityLegalSettings - CybersecurityLegal-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as CybersecurityLegalSettings } from './CybersecurityLegalSettings';
