/**
 * WF-COMP-TBD | components/index.ts - Communication Components Module
 * Purpose: Component exports for communication management
 * Dependencies: React, communication types, communication services
 * Features: Communication CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN COMMUNICATION PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main communication page components with Communication prefix for routes
 */
export { default as CommunicationMain } from '../CommunicationMain';
export { default as CommunicationDetail } from '../CommunicationDetail';
export { default as CommunicationCreate } from '../CommunicationCreate';
export { default as CommunicationEdit } from '../CommunicationEdit';

// ==============================================================================
// COMMUNICATION MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * CommunicationList - Main list view for communication items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as CommunicationList } from './CommunicationList';

/**
 * CommunicationCard - Compact communication display card
 * Features: Item info, status, quick actions
 */
export { default as CommunicationCard } from './CommunicationCard';

/**
 * CommunicationForm - Create/edit communication item
 * Features: Validation, field management, submission handling
 */
export { default as CommunicationForm } from './CommunicationForm';

/**
 * CommunicationDetails - Detailed communication view
 * Features: Full information display, related data, actions
 */
export { default as CommunicationDetails } from './CommunicationDetails';

/**
 * CommunicationFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as CommunicationFilters } from './CommunicationFilters';

// ==============================================================================
// COMMUNICATION UTILITY COMPONENTS
// ==============================================================================

/**
 * CommunicationSettings - Communication-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as CommunicationSettings } from './CommunicationSettings';
