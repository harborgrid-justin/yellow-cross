/**
 * WF-COMP-TBD | routes.tsx - ConstructionLaw page routes
 * Purpose: ConstructionLaw route configuration with role-based protection
 * Related: ProtectedRoute, construction-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ConstructionLawMain,
  ConstructionLawDetail,
  ConstructionLawCreate,
  ConstructionLawEdit,
} from './components';

export const ConstructionLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main ConstructionLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CONSTRUCTION_LAW', 'DISTRICT_CONSTRUCTION_LAW']}>
            <ConstructionLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New ConstructionLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CONSTRUCTION_LAW', 'DISTRICT_CONSTRUCTION_LAW']}>
            <ConstructionLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View ConstructionLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CONSTRUCTION_LAW', 'DISTRICT_CONSTRUCTION_LAW']}>
            <ConstructionLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit ConstructionLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CONSTRUCTION_LAW', 'DISTRICT_CONSTRUCTION_LAW']}>
            <ConstructionLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ConstructionLawRoutes;
