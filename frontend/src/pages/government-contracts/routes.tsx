/**
 * WF-COMP-TBD | routes.tsx - GovernmentContracts page routes
 * Purpose: GovernmentContracts route configuration with role-based protection
 * Related: ProtectedRoute, government-contracts components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  GovernmentContractsMain,
  GovernmentContractsDetail,
  GovernmentContractsCreate,
  GovernmentContractsEdit,
} from './components';

export const GovernmentContractsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main GovernmentContracts List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['GOVERNMENT_CONTRACTS', 'DISTRICT_GOVERNMENT_CONTRACTS']}>
            <GovernmentContractsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New GovernmentContracts Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['GOVERNMENT_CONTRACTS', 'DISTRICT_GOVERNMENT_CONTRACTS']}>
            <GovernmentContractsCreate />
          </PrivateRoute>
        } 
      />

      {/* View GovernmentContracts Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['GOVERNMENT_CONTRACTS', 'DISTRICT_GOVERNMENT_CONTRACTS']}>
            <GovernmentContractsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit GovernmentContracts Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['GOVERNMENT_CONTRACTS', 'DISTRICT_GOVERNMENT_CONTRACTS']}>
            <GovernmentContractsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default GovernmentContractsRoutes;
