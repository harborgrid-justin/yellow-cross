/**
 * WF-COMP-TBD | components/index.ts - LaborRelations Components Module
 * Purpose: Component exports for labor-relations management
 * Dependencies: React, labor-relations types, labor-relations services
 * Features: LaborRelations CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN LABOR_RELATIONS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main labor-relations page components with LaborRelations prefix for routes
 */
export { default as LaborRelationsMain } from '../LaborRelationsMain';
export { default as LaborRelationsDetail } from '../LaborRelationsDetail';
export { default as LaborRelationsCreate } from '../LaborRelationsCreate';
export { default as LaborRelationsEdit } from '../LaborRelationsEdit';

// ==============================================================================
// LABOR_RELATIONS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * LaborRelationsList - Main list view for labor-relations items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as LaborRelationsList } from './LaborRelationsList';

/**
 * LaborRelationsCard - Compact labor-relations display card
 * Features: Item info, status, quick actions
 */
export { default as LaborRelationsCard } from './LaborRelationsCard';

/**
 * LaborRelationsForm - Create/edit labor-relations item
 * Features: Validation, field management, submission handling
 */
export { default as LaborRelationsForm } from './LaborRelationsForm';

/**
 * LaborRelationsDetails - Detailed labor-relations view
 * Features: Full information display, related data, actions
 */
export { default as LaborRelationsDetails } from './LaborRelationsDetails';

/**
 * LaborRelationsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as LaborRelationsFilters } from './LaborRelationsFilters';

// ==============================================================================
// LABOR_RELATIONS UTILITY COMPONENTS
// ==============================================================================

/**
 * LaborRelationsSettings - LaborRelations-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as LaborRelationsSettings } from './LaborRelationsSettings';
