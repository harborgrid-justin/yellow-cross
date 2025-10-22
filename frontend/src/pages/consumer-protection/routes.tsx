/**
 * WF-COMP-TBD | routes.tsx - ConsumerProtection page routes
 * Purpose: ConsumerProtection route configuration with role-based protection
 * Related: ProtectedRoute, consumer-protection components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ConsumerProtectionMain,
  ConsumerProtectionDetail,
  ConsumerProtectionCreate,
  ConsumerProtectionEdit,
} from './components';

export const ConsumerProtectionRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main ConsumerProtection List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CONSUMER_PROTECTION', 'DISTRICT_CONSUMER_PROTECTION']}>
            <ConsumerProtectionMain />
          </PrivateRoute>
        } 
      />

      {/* Create New ConsumerProtection Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CONSUMER_PROTECTION', 'DISTRICT_CONSUMER_PROTECTION']}>
            <ConsumerProtectionCreate />
          </PrivateRoute>
        } 
      />

      {/* View ConsumerProtection Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CONSUMER_PROTECTION', 'DISTRICT_CONSUMER_PROTECTION']}>
            <ConsumerProtectionDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit ConsumerProtection Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CONSUMER_PROTECTION', 'DISTRICT_CONSUMER_PROTECTION']}>
            <ConsumerProtectionEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ConsumerProtectionRoutes;
