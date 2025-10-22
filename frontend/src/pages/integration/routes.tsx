/**
 * WF-COMP-TBD | routes.tsx - Integration page routes
 * Purpose: Integration route configuration with role-based protection
 * Related: ProtectedRoute, integration components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  IntegrationMain,
  IntegrationDetail,
  IntegrationCreate,
  IntegrationEdit,
} from './components';

export const IntegrationRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Integration List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['INTEGRATION', 'DISTRICT_INTEGRATION']}>
            <IntegrationMain />
          </PrivateRoute>
        } 
      />

      {/* Create New Integration Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['INTEGRATION', 'DISTRICT_INTEGRATION']}>
            <IntegrationCreate />
          </PrivateRoute>
        } 
      />

      {/* View Integration Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['INTEGRATION', 'DISTRICT_INTEGRATION']}>
            <IntegrationDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit Integration Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['INTEGRATION', 'DISTRICT_INTEGRATION']}>
            <IntegrationEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default IntegrationRoutes;
