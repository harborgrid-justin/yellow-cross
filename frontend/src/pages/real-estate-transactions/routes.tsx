/**
 * WF-COMP-TBD | routes.tsx - RealEstateTransactions page routes
 * Purpose: RealEstateTransactions route configuration with role-based protection
 * Related: ProtectedRoute, real-estate-transactions components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  RealEstateTransactionsMain,
  RealEstateTransactionsDetail,
  RealEstateTransactionsCreate,
  RealEstateTransactionsEdit,
} from './components';

export const RealEstateTransactionsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main RealEstateTransactions List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['REAL_ESTATE_TRANSACTIONS', 'DISTRICT_REAL_ESTATE_TRANSACTIONS']}>
            <RealEstateTransactionsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New RealEstateTransactions Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['REAL_ESTATE_TRANSACTIONS', 'DISTRICT_REAL_ESTATE_TRANSACTIONS']}>
            <RealEstateTransactionsCreate />
          </PrivateRoute>
        } 
      />

      {/* View RealEstateTransactions Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['REAL_ESTATE_TRANSACTIONS', 'DISTRICT_REAL_ESTATE_TRANSACTIONS']}>
            <RealEstateTransactionsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit RealEstateTransactions Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['REAL_ESTATE_TRANSACTIONS', 'DISTRICT_REAL_ESTATE_TRANSACTIONS']}>
            <RealEstateTransactionsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default RealEstateTransactionsRoutes;
