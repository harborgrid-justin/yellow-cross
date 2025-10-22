/**
 * WF-COMP-TBD | components/index.ts - LandlordTenant Components Module
 * Purpose: Component exports for landlord-tenant management
 * Dependencies: React, landlord-tenant types, landlord-tenant services
 * Features: LandlordTenant CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN LANDLORD_TENANT PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main landlord-tenant page components with LandlordTenant prefix for routes
 */
export { default as LandlordTenantMain } from '../LandlordTenantMain';
export { default as LandlordTenantDetail } from '../LandlordTenantDetail';
export { default as LandlordTenantCreate } from '../LandlordTenantCreate';
export { default as LandlordTenantEdit } from '../LandlordTenantEdit';

// ==============================================================================
// LANDLORD_TENANT MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * LandlordTenantList - Main list view for landlord-tenant items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as LandlordTenantList } from './LandlordTenantList';

/**
 * LandlordTenantCard - Compact landlord-tenant display card
 * Features: Item info, status, quick actions
 */
export { default as LandlordTenantCard } from './LandlordTenantCard';

/**
 * LandlordTenantForm - Create/edit landlord-tenant item
 * Features: Validation, field management, submission handling
 */
export { default as LandlordTenantForm } from './LandlordTenantForm';

/**
 * LandlordTenantDetails - Detailed landlord-tenant view
 * Features: Full information display, related data, actions
 */
export { default as LandlordTenantDetails } from './LandlordTenantDetails';

/**
 * LandlordTenantFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as LandlordTenantFilters } from './LandlordTenantFilters';

// ==============================================================================
// LANDLORD_TENANT UTILITY COMPONENTS
// ==============================================================================

/**
 * LandlordTenantSettings - LandlordTenant-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as LandlordTenantSettings } from './LandlordTenantSettings';
