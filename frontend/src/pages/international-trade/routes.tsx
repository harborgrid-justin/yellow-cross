/**
 * WF-COMP-TBD | routes.tsx - InternationalTrade page routes
 * Purpose: InternationalTrade route configuration with role-based protection
 * Related: ProtectedRoute, international-trade components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  InternationalTradeMain,
  InternationalTradeDetail,
  InternationalTradeCreate,
  InternationalTradeEdit,
} from './components';

export const InternationalTradeRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main InternationalTrade List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['INTERNATIONAL_TRADE', 'DISTRICT_INTERNATIONAL_TRADE']}>
            <InternationalTradeMain />
          </PrivateRoute>
        } 
      />

      {/* Create New InternationalTrade Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['INTERNATIONAL_TRADE', 'DISTRICT_INTERNATIONAL_TRADE']}>
            <InternationalTradeCreate />
          </PrivateRoute>
        } 
      />

      {/* View InternationalTrade Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['INTERNATIONAL_TRADE', 'DISTRICT_INTERNATIONAL_TRADE']}>
            <InternationalTradeDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit InternationalTrade Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['INTERNATIONAL_TRADE', 'DISTRICT_INTERNATIONAL_TRADE']}>
            <InternationalTradeEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default InternationalTradeRoutes;
