/**
 * WF-COMP-TBD | routes.tsx - TimeBilling page routes
 * Purpose: TimeBilling route configuration with role-based protection
 * Related: ProtectedRoute, time-billing components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  TimeBillingMain,
  TimeBillingDetail,
  TimeBillingCreate,
  TimeBillingEdit,
} from './components';

export const TimeBillingRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main TimeBilling List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['TIME_BILLING', 'DISTRICT_TIME_BILLING']}>
            <TimeBillingMain />
          </PrivateRoute>
        } 
      />

      {/* Create New TimeBilling Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['TIME_BILLING', 'DISTRICT_TIME_BILLING']}>
            <TimeBillingCreate />
          </PrivateRoute>
        } 
      />

      {/* View TimeBilling Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['TIME_BILLING', 'DISTRICT_TIME_BILLING']}>
            <TimeBillingDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit TimeBilling Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['TIME_BILLING', 'DISTRICT_TIME_BILLING']}>
            <TimeBillingEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default TimeBillingRoutes;
