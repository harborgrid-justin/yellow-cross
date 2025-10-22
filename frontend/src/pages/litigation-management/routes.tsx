/**
 * WF-COMP-TBD | routes.tsx - LitigationManagement page routes
 * Purpose: LitigationManagement route configuration with role-based protection
 * Related: ProtectedRoute, litigation-management components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  LitigationManagementMain,
  LitigationManagementDetail,
  LitigationManagementCreate,
  LitigationManagementEdit,
} from './components';

export const LitigationManagementRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main LitigationManagement List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['LITIGATION_MANAGEMENT', 'DISTRICT_LITIGATION_MANAGEMENT']}>
            <LitigationManagementMain />
          </PrivateRoute>
        } 
      />

      {/* Create New LitigationManagement Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['LITIGATION_MANAGEMENT', 'DISTRICT_LITIGATION_MANAGEMENT']}>
            <LitigationManagementCreate />
          </PrivateRoute>
        } 
      />

      {/* View LitigationManagement Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['LITIGATION_MANAGEMENT', 'DISTRICT_LITIGATION_MANAGEMENT']}>
            <LitigationManagementDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit LitigationManagement Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['LITIGATION_MANAGEMENT', 'DISTRICT_LITIGATION_MANAGEMENT']}>
            <LitigationManagementEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default LitigationManagementRoutes;
