/**
 * WF-COMP-TBD | routes.tsx - TaskWorkflow page routes
 * Purpose: TaskWorkflow route configuration with role-based protection
 * Related: ProtectedRoute, task-workflow components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  TaskWorkflowMain,
  TaskWorkflowDetail,
  TaskWorkflowCreate,
  TaskWorkflowEdit,
} from './components';

export const TaskWorkflowRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main TaskWorkflow List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['TASK_WORKFLOW', 'DISTRICT_TASK_WORKFLOW']}>
            <TaskWorkflowMain />
          </PrivateRoute>
        } 
      />

      {/* Create New TaskWorkflow Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['TASK_WORKFLOW', 'DISTRICT_TASK_WORKFLOW']}>
            <TaskWorkflowCreate />
          </PrivateRoute>
        } 
      />

      {/* View TaskWorkflow Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['TASK_WORKFLOW', 'DISTRICT_TASK_WORKFLOW']}>
            <TaskWorkflowDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit TaskWorkflow Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['TASK_WORKFLOW', 'DISTRICT_TASK_WORKFLOW']}>
            <TaskWorkflowEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default TaskWorkflowRoutes;
