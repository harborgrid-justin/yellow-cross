/**
 * WF-COMP-TBD | routes.tsx - Security page routes
 * Purpose: Security route configuration with role-based protection
 * Related: ProtectedRoute, security components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  SecurityMain,
  SecurityDetail,
  SecurityCreate,
  SecurityEdit,
} from './components';

export const SecurityRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Security List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['SECURITY', 'DISTRICT_SECURITY']}>
            <SecurityMain />
          </PrivateRoute>
        } 
      />

      {/* Create New Security Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['SECURITY', 'DISTRICT_SECURITY']}>
            <SecurityCreate />
          </PrivateRoute>
        } 
      />

      {/* View Security Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['SECURITY', 'DISTRICT_SECURITY']}>
            <SecurityDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit Security Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['SECURITY', 'DISTRICT_SECURITY']}>
            <SecurityEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default SecurityRoutes;
