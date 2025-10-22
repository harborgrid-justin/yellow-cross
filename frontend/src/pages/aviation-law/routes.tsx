/**
 * WF-COMP-TBD | routes.tsx - AviationLaw page routes
 * Purpose: AviationLaw route configuration with role-based protection
 * Related: ProtectedRoute, aviation-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  AviationLawMain,
  AviationLawDetail,
  AviationLawCreate,
  AviationLawEdit,
} from './components';

export const AviationLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main AviationLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['AVIATION_LAW', 'DISTRICT_AVIATION_LAW']}>
            <AviationLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New AviationLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['AVIATION_LAW', 'DISTRICT_AVIATION_LAW']}>
            <AviationLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View AviationLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['AVIATION_LAW', 'DISTRICT_AVIATION_LAW']}>
            <AviationLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit AviationLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['AVIATION_LAW', 'DISTRICT_AVIATION_LAW']}>
            <AviationLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AviationLawRoutes;
