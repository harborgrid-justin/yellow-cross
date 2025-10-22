/**
 * WF-COMP-TBD | routes.tsx - FamilyLaw page routes
 * Purpose: FamilyLaw route configuration with role-based protection
 * Related: ProtectedRoute, family-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  FamilyLawMain,
  FamilyLawDetail,
  FamilyLawCreate,
  FamilyLawEdit,
} from './components';

export const FamilyLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main FamilyLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['FAMILY_LAW', 'DISTRICT_FAMILY_LAW']}>
            <FamilyLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New FamilyLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['FAMILY_LAW', 'DISTRICT_FAMILY_LAW']}>
            <FamilyLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View FamilyLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['FAMILY_LAW', 'DISTRICT_FAMILY_LAW']}>
            <FamilyLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit FamilyLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['FAMILY_LAW', 'DISTRICT_FAMILY_LAW']}>
            <FamilyLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default FamilyLawRoutes;
