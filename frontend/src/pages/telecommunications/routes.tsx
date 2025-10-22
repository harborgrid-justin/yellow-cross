/**
 * WF-COMP-TBD | routes.tsx - Telecommunications page routes
 * Purpose: Telecommunications route configuration with role-based protection
 * Related: ProtectedRoute, telecommunications components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  TelecommunicationsMain,
  TelecommunicationsDetail,
  TelecommunicationsCreate,
  TelecommunicationsEdit,
} from './components';

export const TelecommunicationsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Telecommunications List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['TELECOMMUNICATIONS', 'DISTRICT_TELECOMMUNICATIONS']}>
            <TelecommunicationsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New Telecommunications Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['TELECOMMUNICATIONS', 'DISTRICT_TELECOMMUNICATIONS']}>
            <TelecommunicationsCreate />
          </PrivateRoute>
        } 
      />

      {/* View Telecommunications Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['TELECOMMUNICATIONS', 'DISTRICT_TELECOMMUNICATIONS']}>
            <TelecommunicationsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit Telecommunications Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['TELECOMMUNICATIONS', 'DISTRICT_TELECOMMUNICATIONS']}>
            <TelecommunicationsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default TelecommunicationsRoutes;
