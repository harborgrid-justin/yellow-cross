/**
 * WF-COMP-TBD | routes.tsx - EnergyUtilities page routes
 * Purpose: EnergyUtilities route configuration with role-based protection
 * Related: ProtectedRoute, energy-utilities components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  EnergyUtilitiesMain,
  EnergyUtilitiesDetail,
  EnergyUtilitiesCreate,
  EnergyUtilitiesEdit,
} from './components';

export const EnergyUtilitiesRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main EnergyUtilities List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['ENERGY_UTILITIES', 'DISTRICT_ENERGY_UTILITIES']}>
            <EnergyUtilitiesMain />
          </PrivateRoute>
        } 
      />

      {/* Create New EnergyUtilities Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['ENERGY_UTILITIES', 'DISTRICT_ENERGY_UTILITIES']}>
            <EnergyUtilitiesCreate />
          </PrivateRoute>
        } 
      />

      {/* View EnergyUtilities Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['ENERGY_UTILITIES', 'DISTRICT_ENERGY_UTILITIES']}>
            <EnergyUtilitiesDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit EnergyUtilities Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['ENERGY_UTILITIES', 'DISTRICT_ENERGY_UTILITIES']}>
            <EnergyUtilitiesEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default EnergyUtilitiesRoutes;
