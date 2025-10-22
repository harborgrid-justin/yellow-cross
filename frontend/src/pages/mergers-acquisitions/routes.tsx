/**
 * WF-COMP-TBD | routes.tsx - MergersAcquisitions page routes
 * Purpose: MergersAcquisitions route configuration with role-based protection
 * Related: ProtectedRoute, mergers-acquisitions components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  MergersAcquisitionsMain,
  MergersAcquisitionsDetail,
  MergersAcquisitionsCreate,
  MergersAcquisitionsEdit,
} from './components';

export const MergersAcquisitionsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main MergersAcquisitions List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['MERGERS_ACQUISITIONS', 'DISTRICT_MERGERS_ACQUISITIONS']}>
            <MergersAcquisitionsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New MergersAcquisitions Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['MERGERS_ACQUISITIONS', 'DISTRICT_MERGERS_ACQUISITIONS']}>
            <MergersAcquisitionsCreate />
          </PrivateRoute>
        } 
      />

      {/* View MergersAcquisitions Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['MERGERS_ACQUISITIONS', 'DISTRICT_MERGERS_ACQUISITIONS']}>
            <MergersAcquisitionsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit MergersAcquisitions Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['MERGERS_ACQUISITIONS', 'DISTRICT_MERGERS_ACQUISITIONS']}>
            <MergersAcquisitionsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default MergersAcquisitionsRoutes;
