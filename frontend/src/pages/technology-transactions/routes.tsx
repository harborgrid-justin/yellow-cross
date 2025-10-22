/**
 * WF-COMP-TBD | routes.tsx - TechnologyTransactions page routes
 * Purpose: TechnologyTransactions route configuration with role-based protection
 * Related: ProtectedRoute, technology-transactions components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  TechnologyTransactionsMain,
  TechnologyTransactionsDetail,
  TechnologyTransactionsCreate,
  TechnologyTransactionsEdit,
} from './components';

export const TechnologyTransactionsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main TechnologyTransactions List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['TECHNOLOGY_TRANSACTIONS', 'DISTRICT_TECHNOLOGY_TRANSACTIONS']}>
            <TechnologyTransactionsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New TechnologyTransactions Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['TECHNOLOGY_TRANSACTIONS', 'DISTRICT_TECHNOLOGY_TRANSACTIONS']}>
            <TechnologyTransactionsCreate />
          </PrivateRoute>
        } 
      />

      {/* View TechnologyTransactions Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['TECHNOLOGY_TRANSACTIONS', 'DISTRICT_TECHNOLOGY_TRANSACTIONS']}>
            <TechnologyTransactionsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit TechnologyTransactions Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['TECHNOLOGY_TRANSACTIONS', 'DISTRICT_TECHNOLOGY_TRANSACTIONS']}>
            <TechnologyTransactionsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default TechnologyTransactionsRoutes;
