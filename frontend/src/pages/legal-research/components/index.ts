/**
 * WF-COMP-TBD | components/index.ts - LegalResearch Components Module
 * Purpose: Component exports for legal-research management
 * Dependencies: React, legal-research types, legal-research services
 * Features: LegalResearch CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN LEGAL_RESEARCH PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main legal-research page components with LegalResearch prefix for routes
 */
export { default as LegalResearchMain } from '../LegalResearchMain';
export { default as LegalResearchDetail } from '../LegalResearchDetail';
export { default as LegalResearchCreate } from '../LegalResearchCreate';
export { default as LegalResearchEdit } from '../LegalResearchEdit';

// ==============================================================================
// LEGAL_RESEARCH MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * LegalResearchList - Main list view for legal-research items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as LegalResearchList } from './LegalResearchList';

/**
 * LegalResearchCard - Compact legal-research display card
 * Features: Item info, status, quick actions
 */
export { default as LegalResearchCard } from './LegalResearchCard';

/**
 * LegalResearchForm - Create/edit legal-research item
 * Features: Validation, field management, submission handling
 */
export { default as LegalResearchForm } from './LegalResearchForm';

/**
 * LegalResearchDetails - Detailed legal-research view
 * Features: Full information display, related data, actions
 */
export { default as LegalResearchDetails } from './LegalResearchDetails';

/**
 * LegalResearchFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as LegalResearchFilters } from './LegalResearchFilters';

// ==============================================================================
// LEGAL_RESEARCH UTILITY COMPONENTS
// ==============================================================================

/**
 * LegalResearchSettings - LegalResearch-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as LegalResearchSettings } from './LegalResearchSettings';
