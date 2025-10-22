/**
 * WF-COMP-012 | routes.tsx - Admin page routes
 * Purpose: Admin route configuration with role-based protection
 * Related: ProtectedRoute, admin components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  AdminMain,
  AdminDetail,
  AdminCreate,
  AdminEdit,
} from './components';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Admin List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['ADMIN', 'DISTRICT_ADMIN']}>
            <AdminMain />
          </PrivateRoute>
        } 
      />

      {/* Create New Admin Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['ADMIN', 'DISTRICT_ADMIN']}>
            <AdminCreate />
          </PrivateRoute>
        } 
      />

      {/* View Admin Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['ADMIN', 'DISTRICT_ADMIN']}>
            <AdminDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit Admin Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['ADMIN', 'DISTRICT_ADMIN']}>
            <AdminEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
