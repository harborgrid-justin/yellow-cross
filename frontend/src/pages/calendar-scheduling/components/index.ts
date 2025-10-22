/**
 * WF-COMP-TBD | components/index.ts - CalendarScheduling Components Module
 * Purpose: Component exports for calendar-scheduling management
 * Dependencies: React, calendar-scheduling types, calendar-scheduling services
 * Features: CalendarScheduling CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN CALENDAR_SCHEDULING PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main calendar-scheduling page components with CalendarScheduling prefix for routes
 */
export { default as CalendarSchedulingMain } from '../CalendarSchedulingMain';
export { default as CalendarSchedulingDetail } from '../CalendarSchedulingDetail';
export { default as CalendarSchedulingCreate } from '../CalendarSchedulingCreate';
export { default as CalendarSchedulingEdit } from '../CalendarSchedulingEdit';

// ==============================================================================
// CALENDAR_SCHEDULING MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * CalendarSchedulingList - Main list view for calendar-scheduling items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as CalendarSchedulingList } from './CalendarSchedulingList';

/**
 * CalendarSchedulingCard - Compact calendar-scheduling display card
 * Features: Item info, status, quick actions
 */
export { default as CalendarSchedulingCard } from './CalendarSchedulingCard';

/**
 * CalendarSchedulingForm - Create/edit calendar-scheduling item
 * Features: Validation, field management, submission handling
 */
export { default as CalendarSchedulingForm } from './CalendarSchedulingForm';

/**
 * CalendarSchedulingDetails - Detailed calendar-scheduling view
 * Features: Full information display, related data, actions
 */
export { default as CalendarSchedulingDetails } from './CalendarSchedulingDetails';

/**
 * CalendarSchedulingFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as CalendarSchedulingFilters } from './CalendarSchedulingFilters';

// ==============================================================================
// CALENDAR_SCHEDULING UTILITY COMPONENTS
// ==============================================================================

/**
 * CalendarSchedulingSettings - CalendarScheduling-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as CalendarSchedulingSettings } from './CalendarSchedulingSettings';
