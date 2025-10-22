/**
 * WF-COMP-TBD | routes.tsx - TaxLaw page routes
 * Purpose: TaxLaw route configuration with role-based protection
 * Related: ProtectedRoute, tax-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  TaxLawMain,
  TaxLawDetail,
  TaxLawCreate,
  TaxLawEdit,
} from './components';

export const TaxLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main TaxLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['TAX_LAW', 'DISTRICT_TAX_LAW']}>
            <TaxLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New TaxLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['TAX_LAW', 'DISTRICT_TAX_LAW']}>
            <TaxLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View TaxLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['TAX_LAW', 'DISTRICT_TAX_LAW']}>
            <TaxLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit TaxLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['TAX_LAW', 'DISTRICT_TAX_LAW']}>
            <TaxLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default TaxLawRoutes;
