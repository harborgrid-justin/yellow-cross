/**
 * WF-STO-001 | store/index.ts - AntitrustCompetition Store Module Exports
 * Purpose: Central exports for antitrust-competition store module
 * Dependencies: antitrust-competitionSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as antitrustCompetitionReducer } from './antitrust-competitionSlice';

// Export actions
export {
  // AntitrustCompetition Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './antitrust-competitionSlice';

// Export async thunks
export {
  // AntitrustCompetition Management Thunks
  fetchAntitrustCompetitionItems,
  fetchAntitrustCompetitionItem,
  createAntitrustCompetitionItem,
  updateAntitrustCompetitionItem,
  deleteAntitrustCompetitionItem,
} from './antitrust-competitionSlice';

// Export selectors
export {
  selectAntitrustCompetitionItems,
  selectAntitrustCompetitionItem,
  selectAntitrustCompetitionLoading,
  selectAntitrustCompetitionError,
  selectAntitrustCompetitionFilters,
  selectAntitrustCompetitionNotifications,
  selectAntitrustCompetitionPagination,
} from './antitrust-competitionSlice';
