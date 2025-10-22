/**
 * WF-COMP-TBD | routes.tsx - SocialSecurity page routes
 * Purpose: SocialSecurity route configuration with role-based protection
 * Related: ProtectedRoute, social-security components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  SocialSecurityMain,
  SocialSecurityDetail,
  SocialSecurityCreate,
  SocialSecurityEdit,
} from './components';

export const SocialSecurityRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main SocialSecurity List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['SOCIAL_SECURITY', 'DISTRICT_SOCIAL_SECURITY']}>
            <SocialSecurityMain />
          </PrivateRoute>
        } 
      />

      {/* Create New SocialSecurity Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['SOCIAL_SECURITY', 'DISTRICT_SOCIAL_SECURITY']}>
            <SocialSecurityCreate />
          </PrivateRoute>
        } 
      />

      {/* View SocialSecurity Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['SOCIAL_SECURITY', 'DISTRICT_SOCIAL_SECURITY']}>
            <SocialSecurityDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit SocialSecurity Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['SOCIAL_SECURITY', 'DISTRICT_SOCIAL_SECURITY']}>
            <SocialSecurityEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default SocialSecurityRoutes;
