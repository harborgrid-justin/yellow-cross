/**
 * WF-STO-001 | store/index.ts - CalendarScheduling Store Module Exports
 * Purpose: Central exports for calendar-scheduling store module
 * Dependencies: calendar-schedulingSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as calendarSchedulingReducer } from './calendar-schedulingSlice';

// Export actions
export {
  // CalendarScheduling Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './calendar-schedulingSlice';

// Export async thunks
export {
  // CalendarScheduling Management Thunks
  fetchCalendarSchedulingItems,
  fetchCalendarSchedulingItem,
  createCalendarSchedulingItem,
  updateCalendarSchedulingItem,
  deleteCalendarSchedulingItem,
} from './calendar-schedulingSlice';

// Export selectors
export {
  selectCalendarSchedulingItems,
  selectCalendarSchedulingItem,
  selectCalendarSchedulingLoading,
  selectCalendarSchedulingError,
  selectCalendarSchedulingFilters,
  selectCalendarSchedulingNotifications,
  selectCalendarSchedulingPagination,
} from './calendar-schedulingSlice';
