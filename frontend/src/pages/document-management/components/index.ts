/**
 * WF-COMP-TBD | components/index.ts - DocumentManagement Components Module
 * Purpose: Component exports for document-management management
 * Dependencies: React, document-management types, document-management services
 * Features: DocumentManagement CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN DOCUMENT_MANAGEMENT PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main document-management page components with DocumentManagement prefix for routes
 */
export { default as DocumentManagementMain } from '../DocumentManagementMain';
export { default as DocumentManagementDetail } from '../DocumentManagementDetail';
export { default as DocumentManagementCreate } from '../DocumentManagementCreate';
export { default as DocumentManagementEdit } from '../DocumentManagementEdit';

// ==============================================================================
// DOCUMENT_MANAGEMENT MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * DocumentManagementList - Main list view for document-management items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as DocumentManagementList } from './DocumentManagementList';

/**
 * DocumentManagementCard - Compact document-management display card
 * Features: Item info, status, quick actions
 */
export { default as DocumentManagementCard } from './DocumentManagementCard';

/**
 * DocumentManagementForm - Create/edit document-management item
 * Features: Validation, field management, submission handling
 */
export { default as DocumentManagementForm } from './DocumentManagementForm';

/**
 * DocumentManagementDetails - Detailed document-management view
 * Features: Full information display, related data, actions
 */
export { default as DocumentManagementDetails } from './DocumentManagementDetails';

/**
 * DocumentManagementFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as DocumentManagementFilters } from './DocumentManagementFilters';

// ==============================================================================
// DOCUMENT_MANAGEMENT UTILITY COMPONENTS
// ==============================================================================

/**
 * DocumentManagementSettings - DocumentManagement-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as DocumentManagementSettings } from './DocumentManagementSettings';
