/**
 * WF-COMP-TBD | routes.tsx - EstatePlanning page routes
 * Purpose: EstatePlanning route configuration with role-based protection
 * Related: ProtectedRoute, estate-planning components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  EstatePlanningMain,
  EstatePlanningDetail,
  EstatePlanningCreate,
  EstatePlanningEdit,
} from './components';

export const EstatePlanningRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main EstatePlanning List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['ESTATE_PLANNING', 'DISTRICT_ESTATE_PLANNING']}>
            <EstatePlanningMain />
          </PrivateRoute>
        } 
      />

      {/* Create New EstatePlanning Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['ESTATE_PLANNING', 'DISTRICT_ESTATE_PLANNING']}>
            <EstatePlanningCreate />
          </PrivateRoute>
        } 
      />

      {/* View EstatePlanning Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['ESTATE_PLANNING', 'DISTRICT_ESTATE_PLANNING']}>
            <EstatePlanningDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit EstatePlanning Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['ESTATE_PLANNING', 'DISTRICT_ESTATE_PLANNING']}>
            <EstatePlanningEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default EstatePlanningRoutes;
