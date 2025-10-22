/**
 * WF-COMP-TBD | routes.tsx - ContractManagement page routes
 * Purpose: ContractManagement route configuration with role-based protection
 * Related: ProtectedRoute, contract-management components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ContractManagementMain,
  ContractManagementDetail,
  ContractManagementCreate,
  ContractManagementEdit,
} from './components';

export const ContractManagementRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main ContractManagement List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CONTRACT_MANAGEMENT', 'DISTRICT_CONTRACT_MANAGEMENT']}>
            <ContractManagementMain />
          </PrivateRoute>
        } 
      />

      {/* Create New ContractManagement Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CONTRACT_MANAGEMENT', 'DISTRICT_CONTRACT_MANAGEMENT']}>
            <ContractManagementCreate />
          </PrivateRoute>
        } 
      />

      {/* View ContractManagement Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CONTRACT_MANAGEMENT', 'DISTRICT_CONTRACT_MANAGEMENT']}>
            <ContractManagementDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit ContractManagement Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CONTRACT_MANAGEMENT', 'DISTRICT_CONTRACT_MANAGEMENT']}>
            <ContractManagementEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ContractManagementRoutes;
