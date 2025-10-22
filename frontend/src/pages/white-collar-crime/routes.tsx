/**
 * WF-COMP-TBD | routes.tsx - WhiteCollarCrime page routes
 * Purpose: WhiteCollarCrime route configuration with role-based protection
 * Related: ProtectedRoute, white-collar-crime components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  WhiteCollarCrimeMain,
  WhiteCollarCrimeDetail,
  WhiteCollarCrimeCreate,
  WhiteCollarCrimeEdit,
} from './components';

export const WhiteCollarCrimeRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main WhiteCollarCrime List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['WHITE_COLLAR_CRIME', 'DISTRICT_WHITE_COLLAR_CRIME']}>
            <WhiteCollarCrimeMain />
          </PrivateRoute>
        } 
      />

      {/* Create New WhiteCollarCrime Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['WHITE_COLLAR_CRIME', 'DISTRICT_WHITE_COLLAR_CRIME']}>
            <WhiteCollarCrimeCreate />
          </PrivateRoute>
        } 
      />

      {/* View WhiteCollarCrime Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['WHITE_COLLAR_CRIME', 'DISTRICT_WHITE_COLLAR_CRIME']}>
            <WhiteCollarCrimeDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit WhiteCollarCrime Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['WHITE_COLLAR_CRIME', 'DISTRICT_WHITE_COLLAR_CRIME']}>
            <WhiteCollarCrimeEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default WhiteCollarCrimeRoutes;
