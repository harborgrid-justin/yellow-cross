/**
 * WF-COMP-TBD | routes.tsx - ProBono page routes
 * Purpose: ProBono route configuration with role-based protection
 * Related: ProtectedRoute, pro-bono components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ProBonoMain,
  ProBonoDetail,
  ProBonoCreate,
  ProBonoEdit,
} from './components';

export const ProBonoRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main ProBono List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['PRO_BONO', 'DISTRICT_PRO_BONO']}>
            <ProBonoMain />
          </PrivateRoute>
        } 
      />

      {/* Create New ProBono Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['PRO_BONO', 'DISTRICT_PRO_BONO']}>
            <ProBonoCreate />
          </PrivateRoute>
        } 
      />

      {/* View ProBono Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['PRO_BONO', 'DISTRICT_PRO_BONO']}>
            <ProBonoDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit ProBono Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['PRO_BONO', 'DISTRICT_PRO_BONO']}>
            <ProBonoEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ProBonoRoutes;
