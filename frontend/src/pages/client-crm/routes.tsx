/**
 * WF-COMP-TBD | routes.tsx - ClientCrm page routes
 * Purpose: ClientCrm route configuration with role-based protection
 * Related: ProtectedRoute, client-crm components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ClientCrmMain,
  ClientCrmDetail,
  ClientCrmCreate,
  ClientCrmEdit,
} from './components';

export const ClientCrmRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main ClientCrm List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CLIENT_CRM', 'DISTRICT_CLIENT_CRM']}>
            <ClientCrmMain />
          </PrivateRoute>
        } 
      />

      {/* Create New ClientCrm Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CLIENT_CRM', 'DISTRICT_CLIENT_CRM']}>
            <ClientCrmCreate />
          </PrivateRoute>
        } 
      />

      {/* View ClientCrm Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CLIENT_CRM', 'DISTRICT_CLIENT_CRM']}>
            <ClientCrmDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit ClientCrm Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CLIENT_CRM', 'DISTRICT_CLIENT_CRM']}>
            <ClientCrmEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ClientCrmRoutes;
