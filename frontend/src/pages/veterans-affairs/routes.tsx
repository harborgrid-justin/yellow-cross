/**
 * WF-COMP-TBD | routes.tsx - VeteransAffairs page routes
 * Purpose: VeteransAffairs route configuration with role-based protection
 * Related: ProtectedRoute, veterans-affairs components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  VeteransAffairsMain,
  VeteransAffairsDetail,
  VeteransAffairsCreate,
  VeteransAffairsEdit,
} from './components';

export const VeteransAffairsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main VeteransAffairs List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['VETERANS_AFFAIRS', 'DISTRICT_VETERANS_AFFAIRS']}>
            <VeteransAffairsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New VeteransAffairs Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['VETERANS_AFFAIRS', 'DISTRICT_VETERANS_AFFAIRS']}>
            <VeteransAffairsCreate />
          </PrivateRoute>
        } 
      />

      {/* View VeteransAffairs Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['VETERANS_AFFAIRS', 'DISTRICT_VETERANS_AFFAIRS']}>
            <VeteransAffairsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit VeteransAffairs Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['VETERANS_AFFAIRS', 'DISTRICT_VETERANS_AFFAIRS']}>
            <VeteransAffairsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default VeteransAffairsRoutes;
