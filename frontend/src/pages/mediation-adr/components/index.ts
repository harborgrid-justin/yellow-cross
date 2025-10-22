/**
 * WF-COMP-TBD | components/index.ts - MediationAdr Components Module
 * Purpose: Component exports for mediation-adr management
 * Dependencies: React, mediation-adr types, mediation-adr services
 * Features: MediationAdr CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN MEDIATION_ADR PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main mediation-adr page components with MediationAdr prefix for routes
 */
export { default as MediationAdrMain } from '../MediationAdrMain';
export { default as MediationAdrDetail } from '../MediationAdrDetail';
export { default as MediationAdrCreate } from '../MediationAdrCreate';
export { default as MediationAdrEdit } from '../MediationAdrEdit';

// ==============================================================================
// MEDIATION_ADR MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * MediationAdrList - Main list view for mediation-adr items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as MediationAdrList } from './MediationAdrList';

/**
 * MediationAdrCard - Compact mediation-adr display card
 * Features: Item info, status, quick actions
 */
export { default as MediationAdrCard } from './MediationAdrCard';

/**
 * MediationAdrForm - Create/edit mediation-adr item
 * Features: Validation, field management, submission handling
 */
export { default as MediationAdrForm } from './MediationAdrForm';

/**
 * MediationAdrDetails - Detailed mediation-adr view
 * Features: Full information display, related data, actions
 */
export { default as MediationAdrDetails } from './MediationAdrDetails';

/**
 * MediationAdrFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as MediationAdrFilters } from './MediationAdrFilters';

// ==============================================================================
// MEDIATION_ADR UTILITY COMPONENTS
// ==============================================================================

/**
 * MediationAdrSettings - MediationAdr-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as MediationAdrSettings } from './MediationAdrSettings';
