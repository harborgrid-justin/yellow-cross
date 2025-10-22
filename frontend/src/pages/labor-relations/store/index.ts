/**
 * WF-STO-001 | store/index.ts - LaborRelations Store Module Exports
 * Purpose: Central exports for labor-relations store module
 * Dependencies: labor-relationsSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as laborRelationsReducer } from './labor-relationsSlice';

// Export actions
export {
  // LaborRelations Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './labor-relationsSlice';

// Export async thunks
export {
  // LaborRelations Management Thunks
  fetchLaborRelationsItems,
  fetchLaborRelationsItem,
  createLaborRelationsItem,
  updateLaborRelationsItem,
  deleteLaborRelationsItem,
} from './labor-relationsSlice';

// Export selectors
export {
  selectLaborRelationsItems,
  selectLaborRelationsItem,
  selectLaborRelationsLoading,
  selectLaborRelationsError,
  selectLaborRelationsFilters,
  selectLaborRelationsNotifications,
  selectLaborRelationsPagination,
} from './labor-relationsSlice';
