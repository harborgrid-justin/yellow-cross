/**
 * WF-COMP-TBD | routes.tsx - EducationLaw page routes
 * Purpose: EducationLaw route configuration with role-based protection
 * Related: ProtectedRoute, education-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  EducationLawMain,
  EducationLawDetail,
  EducationLawCreate,
  EducationLawEdit,
} from './components';

export const EducationLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main EducationLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['EDUCATION_LAW', 'DISTRICT_EDUCATION_LAW']}>
            <EducationLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New EducationLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['EDUCATION_LAW', 'DISTRICT_EDUCATION_LAW']}>
            <EducationLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View EducationLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['EDUCATION_LAW', 'DISTRICT_EDUCATION_LAW']}>
            <EducationLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit EducationLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['EDUCATION_LAW', 'DISTRICT_EDUCATION_LAW']}>
            <EducationLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default EducationLawRoutes;
