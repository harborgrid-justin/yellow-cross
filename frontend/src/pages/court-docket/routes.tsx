/**
 * WF-COMP-TBD | routes.tsx - CourtDocket page routes
 * Purpose: CourtDocket route configuration with role-based protection
 * Related: ProtectedRoute, court-docket components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  CourtDocketMain,
  CourtDocketDetail,
  CourtDocketCreate,
  CourtDocketEdit,
} from './components';

export const CourtDocketRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main CourtDocket List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['COURT_DOCKET', 'DISTRICT_COURT_DOCKET']}>
            <CourtDocketMain />
          </PrivateRoute>
        } 
      />

      {/* Create New CourtDocket Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['COURT_DOCKET', 'DISTRICT_COURT_DOCKET']}>
            <CourtDocketCreate />
          </PrivateRoute>
        } 
      />

      {/* View CourtDocket Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['COURT_DOCKET', 'DISTRICT_COURT_DOCKET']}>
            <CourtDocketDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit CourtDocket Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['COURT_DOCKET', 'DISTRICT_COURT_DOCKET']}>
            <CourtDocketEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default CourtDocketRoutes;
