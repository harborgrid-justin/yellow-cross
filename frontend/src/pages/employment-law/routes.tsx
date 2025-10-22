/**
 * WF-COMP-TBD | routes.tsx - EmploymentLaw page routes
 * Purpose: EmploymentLaw route configuration with role-based protection
 * Related: ProtectedRoute, employment-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  EmploymentLawMain,
  EmploymentLawDetail,
  EmploymentLawCreate,
  EmploymentLawEdit,
} from './components';

export const EmploymentLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main EmploymentLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['EMPLOYMENT_LAW', 'DISTRICT_EMPLOYMENT_LAW']}>
            <EmploymentLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New EmploymentLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['EMPLOYMENT_LAW', 'DISTRICT_EMPLOYMENT_LAW']}>
            <EmploymentLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View EmploymentLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['EMPLOYMENT_LAW', 'DISTRICT_EMPLOYMENT_LAW']}>
            <EmploymentLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit EmploymentLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['EMPLOYMENT_LAW', 'DISTRICT_EMPLOYMENT_LAW']}>
            <EmploymentLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default EmploymentLawRoutes;
