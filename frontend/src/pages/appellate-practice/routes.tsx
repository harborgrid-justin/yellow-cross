/**
 * WF-COMP-TBD | routes.tsx - AppellatePractice page routes
 * Purpose: AppellatePractice route configuration with role-based protection
 * Related: ProtectedRoute, appellate-practice components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  AppellatePracticeMain,
  AppellatePracticeDetail,
  AppellatePracticeCreate,
  AppellatePracticeEdit,
} from './components';

export const AppellatePracticeRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main AppellatePractice List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['APPELLATE_PRACTICE', 'DISTRICT_APPELLATE_PRACTICE']}>
            <AppellatePracticeMain />
          </PrivateRoute>
        } 
      />

      {/* Create New AppellatePractice Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['APPELLATE_PRACTICE', 'DISTRICT_APPELLATE_PRACTICE']}>
            <AppellatePracticeCreate />
          </PrivateRoute>
        } 
      />

      {/* View AppellatePractice Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['APPELLATE_PRACTICE', 'DISTRICT_APPELLATE_PRACTICE']}>
            <AppellatePracticeDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit AppellatePractice Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['APPELLATE_PRACTICE', 'DISTRICT_APPELLATE_PRACTICE']}>
            <AppellatePracticeEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AppellatePracticeRoutes;
