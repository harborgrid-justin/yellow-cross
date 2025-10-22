/**
 * WF-COMP-TBD | routes.tsx - DocumentManagement page routes
 * Purpose: DocumentManagement route configuration with role-based protection
 * Related: ProtectedRoute, document-management components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  DocumentManagementMain,
  DocumentManagementDetail,
  DocumentManagementCreate,
  DocumentManagementEdit,
} from './components';

export const DocumentManagementRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main DocumentManagement List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['DOCUMENT_MANAGEMENT', 'DISTRICT_DOCUMENT_MANAGEMENT']}>
            <DocumentManagementMain />
          </PrivateRoute>
        } 
      />

      {/* Create New DocumentManagement Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['DOCUMENT_MANAGEMENT', 'DISTRICT_DOCUMENT_MANAGEMENT']}>
            <DocumentManagementCreate />
          </PrivateRoute>
        } 
      />

      {/* View DocumentManagement Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['DOCUMENT_MANAGEMENT', 'DISTRICT_DOCUMENT_MANAGEMENT']}>
            <DocumentManagementDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit DocumentManagement Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['DOCUMENT_MANAGEMENT', 'DISTRICT_DOCUMENT_MANAGEMENT']}>
            <DocumentManagementEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default DocumentManagementRoutes;
