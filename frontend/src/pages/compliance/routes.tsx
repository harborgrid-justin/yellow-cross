/**
 * WF-COMP-TBD | routes.tsx - Compliance page routes
 * Purpose: Compliance route configuration with role-based protection
 * Related: ProtectedRoute, compliance components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ComplianceMain,
  ComplianceDetail,
  ComplianceCreate,
  ComplianceEdit,
} from './components';

export const ComplianceRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Compliance List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['COMPLIANCE', 'DISTRICT_COMPLIANCE']}>
            <ComplianceMain />
          </PrivateRoute>
        } 
      />

      {/* Create New Compliance Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['COMPLIANCE', 'DISTRICT_COMPLIANCE']}>
            <ComplianceCreate />
          </PrivateRoute>
        } 
      />

      {/* View Compliance Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['COMPLIANCE', 'DISTRICT_COMPLIANCE']}>
            <ComplianceDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit Compliance Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['COMPLIANCE', 'DISTRICT_COMPLIANCE']}>
            <ComplianceEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ComplianceRoutes;
