/**
 * WF-COMP-TBD | components/index.ts - AntitrustCompetition Components Module
 * Purpose: Component exports for antitrust-competition management
 * Dependencies: React, antitrust-competition types, antitrust-competition services
 * Features: AntitrustCompetition CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN ANTITRUST_COMPETITION PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main antitrust-competition page components with AntitrustCompetition prefix for routes
 */
export { default as AntitrustCompetitionMain } from '../AntitrustCompetitionMain';
export { default as AntitrustCompetitionDetail } from '../AntitrustCompetitionDetail';
export { default as AntitrustCompetitionCreate } from '../AntitrustCompetitionCreate';
export { default as AntitrustCompetitionEdit } from '../AntitrustCompetitionEdit';

// ==============================================================================
// ANTITRUST_COMPETITION MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * AntitrustCompetitionList - Main list view for antitrust-competition items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as AntitrustCompetitionList } from './AntitrustCompetitionList';

/**
 * AntitrustCompetitionCard - Compact antitrust-competition display card
 * Features: Item info, status, quick actions
 */
export { default as AntitrustCompetitionCard } from './AntitrustCompetitionCard';

/**
 * AntitrustCompetitionForm - Create/edit antitrust-competition item
 * Features: Validation, field management, submission handling
 */
export { default as AntitrustCompetitionForm } from './AntitrustCompetitionForm';

/**
 * AntitrustCompetitionDetails - Detailed antitrust-competition view
 * Features: Full information display, related data, actions
 */
export { default as AntitrustCompetitionDetails } from './AntitrustCompetitionDetails';

/**
 * AntitrustCompetitionFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as AntitrustCompetitionFilters } from './AntitrustCompetitionFilters';

// ==============================================================================
// ANTITRUST_COMPETITION UTILITY COMPONENTS
// ==============================================================================

/**
 * AntitrustCompetitionSettings - AntitrustCompetition-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as AntitrustCompetitionSettings } from './AntitrustCompetitionSettings';
