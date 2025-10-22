/**
 * WF-COMP-TBD | routes.tsx - MaritimeLaw page routes
 * Purpose: MaritimeLaw route configuration with role-based protection
 * Related: ProtectedRoute, maritime-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  MaritimeLawMain,
  MaritimeLawDetail,
  MaritimeLawCreate,
  MaritimeLawEdit,
} from './components';

export const MaritimeLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main MaritimeLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['MARITIME_LAW', 'DISTRICT_MARITIME_LAW']}>
            <MaritimeLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New MaritimeLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['MARITIME_LAW', 'DISTRICT_MARITIME_LAW']}>
            <MaritimeLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View MaritimeLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['MARITIME_LAW', 'DISTRICT_MARITIME_LAW']}>
            <MaritimeLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit MaritimeLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['MARITIME_LAW', 'DISTRICT_MARITIME_LAW']}>
            <MaritimeLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default MaritimeLawRoutes;
