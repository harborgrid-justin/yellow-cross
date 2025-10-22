/**
 * WF-COMP-TBD | routes.tsx - NonProfitLaw page routes
 * Purpose: NonProfitLaw route configuration with role-based protection
 * Related: ProtectedRoute, non-profit-law components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  NonProfitLawMain,
  NonProfitLawDetail,
  NonProfitLawCreate,
  NonProfitLawEdit,
} from './components';

export const NonProfitLawRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main NonProfitLaw List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['NON_PROFIT_LAW', 'DISTRICT_NON_PROFIT_LAW']}>
            <NonProfitLawMain />
          </PrivateRoute>
        } 
      />

      {/* Create New NonProfitLaw Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['NON_PROFIT_LAW', 'DISTRICT_NON_PROFIT_LAW']}>
            <NonProfitLawCreate />
          </PrivateRoute>
        } 
      />

      {/* View NonProfitLaw Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['NON_PROFIT_LAW', 'DISTRICT_NON_PROFIT_LAW']}>
            <NonProfitLawDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit NonProfitLaw Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['NON_PROFIT_LAW', 'DISTRICT_NON_PROFIT_LAW']}>
            <NonProfitLawEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default NonProfitLawRoutes;
