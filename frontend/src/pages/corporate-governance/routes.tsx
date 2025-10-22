/**
 * WF-COMP-TBD | routes.tsx - CorporateGovernance page routes
 * Purpose: CorporateGovernance route configuration with role-based protection
 * Related: ProtectedRoute, corporate-governance components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  CorporateGovernanceMain,
  CorporateGovernanceDetail,
  CorporateGovernanceCreate,
  CorporateGovernanceEdit,
} from './components';

export const CorporateGovernanceRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main CorporateGovernance List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CORPORATE_GOVERNANCE', 'DISTRICT_CORPORATE_GOVERNANCE']}>
            <CorporateGovernanceMain />
          </PrivateRoute>
        } 
      />

      {/* Create New CorporateGovernance Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CORPORATE_GOVERNANCE', 'DISTRICT_CORPORATE_GOVERNANCE']}>
            <CorporateGovernanceCreate />
          </PrivateRoute>
        } 
      />

      {/* View CorporateGovernance Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CORPORATE_GOVERNANCE', 'DISTRICT_CORPORATE_GOVERNANCE']}>
            <CorporateGovernanceDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit CorporateGovernance Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CORPORATE_GOVERNANCE', 'DISTRICT_CORPORATE_GOVERNANCE']}>
            <CorporateGovernanceEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default CorporateGovernanceRoutes;
