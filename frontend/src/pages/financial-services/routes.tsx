/**
 * WF-COMP-TBD | routes.tsx - FinancialServices page routes
 * Purpose: FinancialServices route configuration with role-based protection
 * Related: ProtectedRoute, financial-services components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  FinancialServicesMain,
  FinancialServicesDetail,
  FinancialServicesCreate,
  FinancialServicesEdit,
} from './components';

export const FinancialServicesRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main FinancialServices List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['FINANCIAL_SERVICES', 'DISTRICT_FINANCIAL_SERVICES']}>
            <FinancialServicesMain />
          </PrivateRoute>
        } 
      />

      {/* Create New FinancialServices Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['FINANCIAL_SERVICES', 'DISTRICT_FINANCIAL_SERVICES']}>
            <FinancialServicesCreate />
          </PrivateRoute>
        } 
      />

      {/* View FinancialServices Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['FINANCIAL_SERVICES', 'DISTRICT_FINANCIAL_SERVICES']}>
            <FinancialServicesDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit FinancialServices Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['FINANCIAL_SERVICES', 'DISTRICT_FINANCIAL_SERVICES']}>
            <FinancialServicesEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default FinancialServicesRoutes;
