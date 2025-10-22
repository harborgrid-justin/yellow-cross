/**
 * WF-COMP-TBD | routes.tsx - DataPrivacy page routes
 * Purpose: DataPrivacy route configuration with role-based protection
 * Related: ProtectedRoute, data-privacy components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  DataPrivacyMain,
  DataPrivacyDetail,
  DataPrivacyCreate,
  DataPrivacyEdit,
} from './components';

export const DataPrivacyRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main DataPrivacy List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['DATA_PRIVACY', 'DISTRICT_DATA_PRIVACY']}>
            <DataPrivacyMain />
          </PrivateRoute>
        } 
      />

      {/* Create New DataPrivacy Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['DATA_PRIVACY', 'DISTRICT_DATA_PRIVACY']}>
            <DataPrivacyCreate />
          </PrivateRoute>
        } 
      />

      {/* View DataPrivacy Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['DATA_PRIVACY', 'DISTRICT_DATA_PRIVACY']}>
            <DataPrivacyDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit DataPrivacy Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['DATA_PRIVACY', 'DISTRICT_DATA_PRIVACY']}>
            <DataPrivacyEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default DataPrivacyRoutes;
