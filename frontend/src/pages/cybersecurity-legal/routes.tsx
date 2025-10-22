/**
 * WF-COMP-TBD | routes.tsx - CybersecurityLegal page routes
 * Purpose: CybersecurityLegal route configuration with role-based protection
 * Related: ProtectedRoute, cybersecurity-legal components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  CybersecurityLegalMain,
  CybersecurityLegalDetail,
  CybersecurityLegalCreate,
  CybersecurityLegalEdit,
} from './components';

export const CybersecurityLegalRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main CybersecurityLegal List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CYBERSECURITY_LEGAL', 'DISTRICT_CYBERSECURITY_LEGAL']}>
            <CybersecurityLegalMain />
          </PrivateRoute>
        } 
      />

      {/* Create New CybersecurityLegal Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CYBERSECURITY_LEGAL', 'DISTRICT_CYBERSECURITY_LEGAL']}>
            <CybersecurityLegalCreate />
          </PrivateRoute>
        } 
      />

      {/* View CybersecurityLegal Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CYBERSECURITY_LEGAL', 'DISTRICT_CYBERSECURITY_LEGAL']}>
            <CybersecurityLegalDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit CybersecurityLegal Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CYBERSECURITY_LEGAL', 'DISTRICT_CYBERSECURITY_LEGAL']}>
            <CybersecurityLegalEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default CybersecurityLegalRoutes;
