/**
 * WF-COMP-TBD | routes.tsx - IntellectualProperty page routes
 * Purpose: IntellectualProperty route configuration with role-based protection
 * Related: ProtectedRoute, intellectual-property components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  IntellectualPropertyMain,
  IntellectualPropertyDetail,
  IntellectualPropertyCreate,
  IntellectualPropertyEdit,
} from './components';

export const IntellectualPropertyRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main IntellectualProperty List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['INTELLECTUAL_PROPERTY', 'DISTRICT_INTELLECTUAL_PROPERTY']}>
            <IntellectualPropertyMain />
          </PrivateRoute>
        } 
      />

      {/* Create New IntellectualProperty Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['INTELLECTUAL_PROPERTY', 'DISTRICT_INTELLECTUAL_PROPERTY']}>
            <IntellectualPropertyCreate />
          </PrivateRoute>
        } 
      />

      {/* View IntellectualProperty Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['INTELLECTUAL_PROPERTY', 'DISTRICT_INTELLECTUAL_PROPERTY']}>
            <IntellectualPropertyDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit IntellectualProperty Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['INTELLECTUAL_PROPERTY', 'DISTRICT_INTELLECTUAL_PROPERTY']}>
            <IntellectualPropertyEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default IntellectualPropertyRoutes;
