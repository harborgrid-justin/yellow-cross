/**
 * WF-COMP-TBD | routes.tsx - EnvironmentalLaw page routes
 * Purpose: EnvironmentalLaw route configuration with role-based protection
 * Related: ProtectedRoute, environmental-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  EnvironmentalLawMain,
  EnvironmentalLawDetail,
  EnvironmentalLawCreate,
  EnvironmentalLawEdit,
} from './components';

export const EnvironmentalLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main EnvironmentalLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['ENVIRONMENTAL_LAW', 'DISTRICT_ENVIRONMENTAL_LAW']}>
            <EnvironmentalLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New EnvironmentalLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['ENVIRONMENTAL_LAW', 'DISTRICT_ENVIRONMENTAL_LAW']}>
            <EnvironmentalLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View EnvironmentalLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['ENVIRONMENTAL_LAW', 'DISTRICT_ENVIRONMENTAL_LAW']}>
            <EnvironmentalLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit EnvironmentalLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['ENVIRONMENTAL_LAW', 'DISTRICT_ENVIRONMENTAL_LAW']}>
            <EnvironmentalLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default EnvironmentalLawRoutes;
