/**
 * WF-COMP-TBD | routes.tsx - BankruptcyManagement page routes
 * Purpose: BankruptcyManagement route configuration with role-based protection
 * Related: ProtectedRoute, bankruptcy-management components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  BankruptcyManagementMain,
  BankruptcyManagementDetail,
  BankruptcyManagementCreate,
  BankruptcyManagementEdit,
} from './components';

export const BankruptcyManagementRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main BankruptcyManagement List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['BANKRUPTCY_MANAGEMENT', 'DISTRICT_BANKRUPTCY_MANAGEMENT']}>
            <BankruptcyManagementMain />
          </PrivateRoute>
        } 
      />

      {/* Create New BankruptcyManagement Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['BANKRUPTCY_MANAGEMENT', 'DISTRICT_BANKRUPTCY_MANAGEMENT']}>
            <BankruptcyManagementCreate />
          </PrivateRoute>
        } 
      />

      {/* View BankruptcyManagement Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['BANKRUPTCY_MANAGEMENT', 'DISTRICT_BANKRUPTCY_MANAGEMENT']}>
            <BankruptcyManagementDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit BankruptcyManagement Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['BANKRUPTCY_MANAGEMENT', 'DISTRICT_BANKRUPTCY_MANAGEMENT']}>
            <BankruptcyManagementEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default BankruptcyManagementRoutes;
