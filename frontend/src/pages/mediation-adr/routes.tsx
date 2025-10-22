/**
 * WF-COMP-TBD | routes.tsx - MediationAdr page routes
 * Purpose: MediationAdr route configuration with role-based protection
 * Related: ProtectedRoute, mediation-adr components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  MediationAdrMain,
  MediationAdrDetail,
  MediationAdrCreate,
  MediationAdrEdit,
} from './components';

export const MediationAdrRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main MediationAdr List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['MEDIATION_ADR', 'DISTRICT_MEDIATION_ADR']}>
            <MediationAdrMain />
          </PrivateRoute>
        } 
      />

      {/* Create New MediationAdr Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['MEDIATION_ADR', 'DISTRICT_MEDIATION_ADR']}>
            <MediationAdrCreate />
          </PrivateRoute>
        } 
      />

      {/* View MediationAdr Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['MEDIATION_ADR', 'DISTRICT_MEDIATION_ADR']}>
            <MediationAdrDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit MediationAdr Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['MEDIATION_ADR', 'DISTRICT_MEDIATION_ADR']}>
            <MediationAdrEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default MediationAdrRoutes;
