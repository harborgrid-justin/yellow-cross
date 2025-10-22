/**
 * WF-COMP-TBD | routes.tsx - MunicipalLaw page routes
 * Purpose: MunicipalLaw route configuration with role-based protection
 * Related: ProtectedRoute, municipal-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  MunicipalLawMain,
  MunicipalLawDetail,
  MunicipalLawCreate,
  MunicipalLawEdit,
} from './components';

export const MunicipalLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main MunicipalLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['MUNICIPAL_LAW', 'DISTRICT_MUNICIPAL_LAW']}>
            <MunicipalLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New MunicipalLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['MUNICIPAL_LAW', 'DISTRICT_MUNICIPAL_LAW']}>
            <MunicipalLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View MunicipalLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['MUNICIPAL_LAW', 'DISTRICT_MUNICIPAL_LAW']}>
            <MunicipalLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit MunicipalLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['MUNICIPAL_LAW', 'DISTRICT_MUNICIPAL_LAW']}>
            <MunicipalLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default MunicipalLawRoutes;
