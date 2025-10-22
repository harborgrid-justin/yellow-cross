/**
 * WF-COMP-TBD | routes.tsx - FranchiseLaw page routes
 * Purpose: FranchiseLaw route configuration with role-based protection
 * Related: ProtectedRoute, franchise-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  FranchiseLawMain,
  FranchiseLawDetail,
  FranchiseLawCreate,
  FranchiseLawEdit,
} from './components';

export const FranchiseLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main FranchiseLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['FRANCHISE_LAW', 'DISTRICT_FRANCHISE_LAW']}>
            <FranchiseLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New FranchiseLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['FRANCHISE_LAW', 'DISTRICT_FRANCHISE_LAW']}>
            <FranchiseLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View FranchiseLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['FRANCHISE_LAW', 'DISTRICT_FRANCHISE_LAW']}>
            <FranchiseLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit FranchiseLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['FRANCHISE_LAW', 'DISTRICT_FRANCHISE_LAW']}>
            <FranchiseLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default FranchiseLawRoutes;
