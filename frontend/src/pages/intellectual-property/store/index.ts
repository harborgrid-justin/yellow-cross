/**
 * WF-STO-001 | store/index.ts - IntellectualProperty Store Module Exports
 * Purpose: Central exports for intellectual-property store module
 * Dependencies: intellectual-propertySlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export reducer
export { default as intellectualPropertyReducer } from './intellectual-propertySlice';

// Export actions
export {
  // IntellectualProperty Actions
  setSelectedItem,
  setFilters,
  clearFilters,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  resetState,
} from './intellectual-propertySlice';

// Export async thunks
export {
  // IntellectualProperty Management Thunks
  fetchIntellectualPropertyItems,
  fetchIntellectualPropertyItem,
  createIntellectualPropertyItem,
  updateIntellectualPropertyItem,
  deleteIntellectualPropertyItem,
} from './intellectual-propertySlice';

// Export selectors
export {
  selectIntellectualPropertyItems,
  selectIntellectualPropertyItem,
  selectIntellectualPropertyLoading,
  selectIntellectualPropertyError,
  selectIntellectualPropertyFilters,
  selectIntellectualPropertyNotifications,
  selectIntellectualPropertyPagination,
} from './intellectual-propertySlice';
