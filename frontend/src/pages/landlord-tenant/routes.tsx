/**
 * WF-COMP-TBD | routes.tsx - LandlordTenant page routes
 * Purpose: LandlordTenant route configuration with role-based protection
 * Related: ProtectedRoute, landlord-tenant components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  LandlordTenantMain,
  LandlordTenantDetail,
  LandlordTenantCreate,
  LandlordTenantEdit,
} from './components';

export const LandlordTenantRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main LandlordTenant List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['LANDLORD_TENANT', 'DISTRICT_LANDLORD_TENANT']}>
            <LandlordTenantMain />
          </PrivateRoute>
        } 
      />

      {/* Create New LandlordTenant Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['LANDLORD_TENANT', 'DISTRICT_LANDLORD_TENANT']}>
            <LandlordTenantCreate />
          </PrivateRoute>
        } 
      />

      {/* View LandlordTenant Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['LANDLORD_TENANT', 'DISTRICT_LANDLORD_TENANT']}>
            <LandlordTenantDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit LandlordTenant Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['LANDLORD_TENANT', 'DISTRICT_LANDLORD_TENANT']}>
            <LandlordTenantEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default LandlordTenantRoutes;
