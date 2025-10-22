/**
 * WF-COMP-TBD | components/index.ts - SocialSecurity Components Module
 * Purpose: Component exports for social-security management
 * Dependencies: React, social-security types, social-security services
 * Features: SocialSecurity CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN SOCIAL_SECURITY PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main social-security page components with SocialSecurity prefix for routes
 */
export { default as SocialSecurityMain } from '../SocialSecurityMain';
export { default as SocialSecurityDetail } from '../SocialSecurityDetail';
export { default as SocialSecurityCreate } from '../SocialSecurityCreate';
export { default as SocialSecurityEdit } from '../SocialSecurityEdit';

// ==============================================================================
// SOCIAL_SECURITY MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * SocialSecurityList - Main list view for social-security items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as SocialSecurityList } from './SocialSecurityList';

/**
 * SocialSecurityCard - Compact social-security display card
 * Features: Item info, status, quick actions
 */
export { default as SocialSecurityCard } from './SocialSecurityCard';

/**
 * SocialSecurityForm - Create/edit social-security item
 * Features: Validation, field management, submission handling
 */
export { default as SocialSecurityForm } from './SocialSecurityForm';

/**
 * SocialSecurityDetails - Detailed social-security view
 * Features: Full information display, related data, actions
 */
export { default as SocialSecurityDetails } from './SocialSecurityDetails';

/**
 * SocialSecurityFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as SocialSecurityFilters } from './SocialSecurityFilters';

// ==============================================================================
// SOCIAL_SECURITY UTILITY COMPONENTS
// ==============================================================================

/**
 * SocialSecuritySettings - SocialSecurity-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as SocialSecuritySettings } from './SocialSecuritySettings';
