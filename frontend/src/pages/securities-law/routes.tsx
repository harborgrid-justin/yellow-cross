/**
 * WF-COMP-TBD | routes.tsx - SecuritiesLaw page routes
 * Purpose: SecuritiesLaw route configuration with role-based protection
 * Related: ProtectedRoute, securities-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  SecuritiesLawMain,
  SecuritiesLawDetail,
  SecuritiesLawCreate,
  SecuritiesLawEdit,
} from './components';

export const SecuritiesLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main SecuritiesLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['SECURITIES_LAW', 'DISTRICT_SECURITIES_LAW']}>
            <SecuritiesLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New SecuritiesLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['SECURITIES_LAW', 'DISTRICT_SECURITIES_LAW']}>
            <SecuritiesLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View SecuritiesLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['SECURITIES_LAW', 'DISTRICT_SECURITIES_LAW']}>
            <SecuritiesLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit SecuritiesLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['SECURITIES_LAW', 'DISTRICT_SECURITIES_LAW']}>
            <SecuritiesLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default SecuritiesLawRoutes;
