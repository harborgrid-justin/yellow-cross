/**
 * WF-COMP-TBD | routes.tsx - ImmigrationLaw page routes
 * Purpose: ImmigrationLaw route configuration with role-based protection
 * Related: ProtectedRoute, immigration-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ImmigrationLawMain,
  ImmigrationLawDetail,
  ImmigrationLawCreate,
  ImmigrationLawEdit,
} from './components';

export const ImmigrationLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main ImmigrationLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['IMMIGRATION_LAW', 'DISTRICT_IMMIGRATION_LAW']}>
            <ImmigrationLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New ImmigrationLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['IMMIGRATION_LAW', 'DISTRICT_IMMIGRATION_LAW']}>
            <ImmigrationLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View ImmigrationLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['IMMIGRATION_LAW', 'DISTRICT_IMMIGRATION_LAW']}>
            <ImmigrationLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit ImmigrationLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['IMMIGRATION_LAW', 'DISTRICT_IMMIGRATION_LAW']}>
            <ImmigrationLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ImmigrationLawRoutes;
