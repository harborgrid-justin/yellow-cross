/**
 * WF-STO-001 | store/index.ts - LegalResearch Store Module Exports
 * Purpose: Central exports for legal-research store module
 * Dependencies: legal-researchSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as legalResearchReducer } from './legal-researchSlice';

// Export actions
export {
  // LegalResearch Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './legal-researchSlice';

// Export async thunks
export {
  // LegalResearch Management Thunks
  fetchLegalResearchItems,
  fetchLegalResearchItem,
  createLegalResearchItem,
  updateLegalResearchItem,
  deleteLegalResearchItem,
} from './legal-researchSlice';

// Export selectors
export {
  selectLegalResearchItems,
  selectLegalResearchItem,
  selectLegalResearchLoading,
  selectLegalResearchError,
  selectLegalResearchFilters,
  selectLegalResearchNotifications,
  selectLegalResearchPagination,
} from './legal-researchSlice';
