/**
 * WF-COMP-TBD | routes.tsx - LaborRelations page routes
 * Purpose: LaborRelations route configuration with role-based protection
 * Related: ProtectedRoute, labor-relations components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  LaborRelationsMain,
  LaborRelationsDetail,
  LaborRelationsCreate,
  LaborRelationsEdit,
} from './components';

export const LaborRelationsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main LaborRelations List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['LABOR_RELATIONS', 'DISTRICT_LABOR_RELATIONS']}>
            <LaborRelationsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New LaborRelations Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['LABOR_RELATIONS', 'DISTRICT_LABOR_RELATIONS']}>
            <LaborRelationsCreate />
          </PrivateRoute>
        } 
      />

      {/* View LaborRelations Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['LABOR_RELATIONS', 'DISTRICT_LABOR_RELATIONS']}>
            <LaborRelationsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit LaborRelations Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['LABOR_RELATIONS', 'DISTRICT_LABOR_RELATIONS']}>
            <LaborRelationsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default LaborRelationsRoutes;
