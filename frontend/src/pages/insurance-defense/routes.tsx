/**
 * WF-COMP-TBD | routes.tsx - InsuranceDefense page routes
 * Purpose: InsuranceDefense route configuration with role-based protection
 * Related: ProtectedRoute, insurance-defense components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  InsuranceDefenseMain,
  InsuranceDefenseDetail,
  InsuranceDefenseCreate,
  InsuranceDefenseEdit,
} from './components';

export const InsuranceDefenseRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main InsuranceDefense List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['INSURANCE_DEFENSE', 'DISTRICT_INSURANCE_DEFENSE']}>
            <InsuranceDefenseMain />
          </PrivateRoute>
        } 
      />

      {/* Create New InsuranceDefense Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['INSURANCE_DEFENSE', 'DISTRICT_INSURANCE_DEFENSE']}>
            <InsuranceDefenseCreate />
          </PrivateRoute>
        } 
      />

      {/* View InsuranceDefense Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['INSURANCE_DEFENSE', 'DISTRICT_INSURANCE_DEFENSE']}>
            <InsuranceDefenseDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit InsuranceDefense Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['INSURANCE_DEFENSE', 'DISTRICT_INSURANCE_DEFENSE']}>
            <InsuranceDefenseEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default InsuranceDefenseRoutes;
