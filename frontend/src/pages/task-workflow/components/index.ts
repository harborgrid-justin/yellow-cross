/**
 * WF-COMP-TBD | components/index.ts - TaskWorkflow Components Module
 * Purpose: Component exports for task-workflow management
 * Dependencies: React, task-workflow types, task-workflow services
 * Features: TaskWorkflow CRUD operations, filtering, search, validation
 */

// ==============================================================================
// MAIN TASK_WORKFLOW PAGE COMPONENTS
// ==============================================================================

/**
 * Re-export main task-workflow page components with TaskWorkflow prefix for routes
 */
export { default as TaskWorkflowMain } from '../TaskWorkflowMain';
export { default as TaskWorkflowDetail } from '../TaskWorkflowDetail';
export { default as TaskWorkflowCreate } from '../TaskWorkflowCreate';
export { default as TaskWorkflowEdit } from '../TaskWorkflowEdit';

// ==============================================================================
// TASK_WORKFLOW MANAGEMENT COMPONENTS
// ==============================================================================

/**
 * TaskWorkflowList - Main list view for task-workflow items
 * Features: Filtering, sorting, pagination, bulk actions
 */
export { default as TaskWorkflowList } from './TaskWorkflowList';

/**
 * TaskWorkflowCard - Compact task-workflow display card
 * Features: Item info, status, quick actions
 */
export { default as TaskWorkflowCard } from './TaskWorkflowCard';

/**
 * TaskWorkflowForm - Create/edit task-workflow item
 * Features: Validation, field management, submission handling
 */
export { default as TaskWorkflowForm } from './TaskWorkflowForm';

/**
 * TaskWorkflowDetails - Detailed task-workflow view
 * Features: Full information display, related data, actions
 */
export { default as TaskWorkflowDetails } from './TaskWorkflowDetails';

/**
 * TaskWorkflowFilters - Filtering and search component
 * Features: Advanced filtering, search, sorting options
 */
export { default as TaskWorkflowFilters } from './TaskWorkflowFilters';

// ==============================================================================
// TASK_WORKFLOW UTILITY COMPONENTS
// ==============================================================================

/**
 * TaskWorkflowSettings - TaskWorkflow-specific settings
 * Features: Configuration, preferences, advanced options
 */
export { default as TaskWorkflowSettings } from './TaskWorkflowSettings';
