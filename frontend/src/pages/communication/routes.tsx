/**
 * WF-COMP-TBD | routes.tsx - Communication page routes
 * Purpose: Communication route configuration with role-based protection
 * Related: ProtectedRoute, communication components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  CommunicationMain,
  CommunicationDetail,
  CommunicationCreate,
  CommunicationEdit,
} from './components';

export const CommunicationRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Communication List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['COMMUNICATION', 'DISTRICT_COMMUNICATION']}>
            <CommunicationMain />
          </PrivateRoute>
        } 
      />

      {/* Create New Communication Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['COMMUNICATION', 'DISTRICT_COMMUNICATION']}>
            <CommunicationCreate />
          </PrivateRoute>
        } 
      />

      {/* View Communication Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['COMMUNICATION', 'DISTRICT_COMMUNICATION']}>
            <CommunicationDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit Communication Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['COMMUNICATION', 'DISTRICT_COMMUNICATION']}>
            <CommunicationEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default CommunicationRoutes;
