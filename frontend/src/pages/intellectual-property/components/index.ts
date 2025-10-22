/**
 * WF-COMP-TBD | components/index.ts - IntellectualProperty Components Module
 * Purpose: Component exports for intellectual-property management
 * Dependencies: React, intellectual-property types, intellectual-property services
 * Features: IntellectualProperty CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN INTELLECTUAL_PROPERTY PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main intellectual-property page components with IntellectualProperty prefix for routes
 */
export { default as IntellectualPropertyMain } from '../IntellectualPropertyMain';
export { default as IntellectualPropertyDetail } from '../IntellectualPropertyDetail';
export { default as IntellectualPropertyCreate } from '../IntellectualPropertyCreate';
export { default as IntellectualPropertyEdit } from '../IntellectualPropertyEdit';

// ==============================================================================
// INTELLECTUAL_PROPERTY MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * IntellectualPropertyList - Main list view for intellectual-property items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as IntellectualPropertyList } from './IntellectualPropertyList';

/**
 * IntellectualPropertyCard - Compact intellectual-property display card
 * Features: Item info, status, quick actions
 */
export { default as IntellectualPropertyCard } from './IntellectualPropertyCard';

/**
 * IntellectualPropertyForm - Create/edit intellectual-property item
 * Features: Validation, field management, submission handling
 */
export { default as IntellectualPropertyForm } from './IntellectualPropertyForm';

/**
 * IntellectualPropertyDetails - Detailed intellectual-property view
 * Features: Full information display, related data, actions
 */
export { default as IntellectualPropertyDetails } from './IntellectualPropertyDetails';

/**
 * IntellectualPropertyFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as IntellectualPropertyFilters } from './IntellectualPropertyFilters';

// ==============================================================================
// INTELLECTUAL_PROPERTY UTILITY COMPONENTS
// ==============================================================================

/**
 * IntellectualPropertySettings - IntellectualProperty-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as IntellectualPropertySettings } from './IntellectualPropertySettings';
