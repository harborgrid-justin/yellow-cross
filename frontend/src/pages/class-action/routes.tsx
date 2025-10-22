/**
 * WF-COMP-TBD | routes.tsx - ClassAction page routes
 * Purpose: ClassAction route configuration with role-based protection
 * Related: ProtectedRoute, class-action components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ClassActionMain,
  ClassActionDetail,
  ClassActionCreate,
  ClassActionEdit,
} from './components';

export const ClassActionRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main ClassAction List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CLASS_ACTION', 'DISTRICT_CLASS_ACTION']}>
            <ClassActionMain />
          </PrivateRoute>
        } 
      />

      {/* Create New ClassAction Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CLASS_ACTION', 'DISTRICT_CLASS_ACTION']}>
            <ClassActionCreate />
          </PrivateRoute>
        } 
      />

      {/* View ClassAction Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CLASS_ACTION', 'DISTRICT_CLASS_ACTION']}>
            <ClassActionDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit ClassAction Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CLASS_ACTION', 'DISTRICT_CLASS_ACTION']}>
            <ClassActionEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ClassActionRoutes;
