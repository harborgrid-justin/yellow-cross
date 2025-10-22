/**
 * WF-COMP-TBD | routes.tsx - CaseManagement page routes
 * Purpose: CaseManagement route configuration with role-based protection
 * Related: ProtectedRoute, case-management components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  CaseManagementMain,
  CaseManagementDetail,
  CaseManagementCreate,
  CaseManagementEdit,
} from './components';

export const CaseManagementRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main CaseManagement List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CASE_MANAGEMENT', 'DISTRICT_CASE_MANAGEMENT']}>
            <CaseManagementMain />
          </PrivateRoute>
        } 
      />

      {/* Create New CaseManagement Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CASE_MANAGEMENT', 'DISTRICT_CASE_MANAGEMENT']}>
            <CaseManagementCreate />
          </PrivateRoute>
        } 
      />

      {/* View CaseManagement Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CASE_MANAGEMENT', 'DISTRICT_CASE_MANAGEMENT']}>
            <CaseManagementDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit CaseManagement Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CASE_MANAGEMENT', 'DISTRICT_CASE_MANAGEMENT']}>
            <CaseManagementEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default CaseManagementRoutes;
