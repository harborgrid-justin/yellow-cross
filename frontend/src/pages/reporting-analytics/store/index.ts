/**
 * WF-STO-001 | store/index.ts - ReportingAnalytics Store Module Exports
 * Purpose: Central exports for reporting-analytics store module
 * Dependencies: reporting-analyticsSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as reportingAnalyticsReducer } from './reporting-analyticsSlice';

// Export actions
export {
  // ReportingAnalytics Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './reporting-analyticsSlice';

// Export async thunks
export {
  // ReportingAnalytics Management Thunks
  fetchReportingAnalyticsItems,
  fetchReportingAnalyticsItem,
  createReportingAnalyticsItem,
  updateReportingAnalyticsItem,
  deleteReportingAnalyticsItem,
} from './reporting-analyticsSlice';

// Export selectors
export {
  selectReportingAnalyticsItems,
  selectReportingAnalyticsItem,
  selectReportingAnalyticsLoading,
  selectReportingAnalyticsError,
  selectReportingAnalyticsFilters,
  selectReportingAnalyticsNotifications,
  selectReportingAnalyticsPagination,
} from './reporting-analyticsSlice';
