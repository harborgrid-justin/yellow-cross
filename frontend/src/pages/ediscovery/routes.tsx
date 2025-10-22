/**
 * WF-COMP-TBD | routes.tsx - Ediscovery page routes
 * Purpose: Ediscovery route configuration with role-based protection
 * Related: ProtectedRoute, ediscovery components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  EdiscoveryMain,
  EdiscoveryDetail,
  EdiscoveryCreate,
  EdiscoveryEdit,
} from './components';

export const EdiscoveryRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Ediscovery List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['EDISCOVERY', 'DISTRICT_EDISCOVERY']}>
            <EdiscoveryMain />
          </PrivateRoute>
        } 
      />

      {/* Create New Ediscovery Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['EDISCOVERY', 'DISTRICT_EDISCOVERY']}>
            <EdiscoveryCreate />
          </PrivateRoute>
        } 
      />

      {/* View Ediscovery Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['EDISCOVERY', 'DISTRICT_EDISCOVERY']}>
            <EdiscoveryDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit Ediscovery Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['EDISCOVERY', 'DISTRICT_EDISCOVERY']}>
            <EdiscoveryEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default EdiscoveryRoutes;
