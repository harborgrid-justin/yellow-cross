/**
 * WF-COMP-TBD | routes.tsx - HealthcareLaw page routes
 * Purpose: HealthcareLaw route configuration with role-based protection
 * Related: ProtectedRoute, healthcare-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  HealthcareLawMain,
  HealthcareLawDetail,
  HealthcareLawCreate,
  HealthcareLawEdit,
} from './components';

export const HealthcareLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main HealthcareLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['HEALTHCARE_LAW', 'DISTRICT_HEALTHCARE_LAW']}>
            <HealthcareLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New HealthcareLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['HEALTHCARE_LAW', 'DISTRICT_HEALTHCARE_LAW']}>
            <HealthcareLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View HealthcareLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['HEALTHCARE_LAW', 'DISTRICT_HEALTHCARE_LAW']}>
            <HealthcareLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit HealthcareLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['HEALTHCARE_LAW', 'DISTRICT_HEALTHCARE_LAW']}>
            <HealthcareLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default HealthcareLawRoutes;
