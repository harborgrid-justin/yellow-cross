/**
 * WF-COMP-TBD | components/index.ts - ReportingAnalytics Components Module
 * Purpose: Component exports for reporting-analytics management
 * Dependencies: React, reporting-analytics types, reporting-analytics services
 * Features: ReportingAnalytics CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN REPORTING_ANALYTICS PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main reporting-analytics page components with ReportingAnalytics prefix for routes
 */
export { default as ReportingAnalyticsMain } from '../ReportingAnalyticsMain';
export { default as ReportingAnalyticsDetail } from '../ReportingAnalyticsDetail';
export { default as ReportingAnalyticsCreate } from '../ReportingAnalyticsCreate';
export { default as ReportingAnalyticsEdit } from '../ReportingAnalyticsEdit';

// ==============================================================================
// REPORTING_ANALYTICS MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * ReportingAnalyticsList - Main list view for reporting-analytics items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as ReportingAnalyticsList } from './ReportingAnalyticsList';

/**
 * ReportingAnalyticsCard - Compact reporting-analytics display card
 * Features: Item info, status, quick actions
 */
export { default as ReportingAnalyticsCard } from './ReportingAnalyticsCard';

/**
 * ReportingAnalyticsForm - Create/edit reporting-analytics item
 * Features: Validation, field management, submission handling
 */
export { default as ReportingAnalyticsForm } from './ReportingAnalyticsForm';

/**
 * ReportingAnalyticsDetails - Detailed reporting-analytics view
 * Features: Full information display, related data, actions
 */
export { default as ReportingAnalyticsDetails } from './ReportingAnalyticsDetails';

/**
 * ReportingAnalyticsFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as ReportingAnalyticsFilters } from './ReportingAnalyticsFilters';

// ==============================================================================
// REPORTING_ANALYTICS UTILITY COMPONENTS
// ==============================================================================

/**
 * ReportingAnalyticsSettings - ReportingAnalytics-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as ReportingAnalyticsSettings } from './ReportingAnalyticsSettings';
