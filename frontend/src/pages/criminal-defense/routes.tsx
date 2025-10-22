/**
 * WF-COMP-TBD | routes.tsx - CriminalDefense page routes
 * Purpose: CriminalDefense route configuration with role-based protection
 * Related: ProtectedRoute, criminal-defense components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  CriminalDefenseMain,
  CriminalDefenseDetail,
  CriminalDefenseCreate,
  CriminalDefenseEdit,
} from './components';

export const CriminalDefenseRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main CriminalDefense List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CRIMINAL_DEFENSE', 'DISTRICT_CRIMINAL_DEFENSE']}>
            <CriminalDefenseMain />
          </PrivateRoute>
        } 
      />

      {/* Create New CriminalDefense Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CRIMINAL_DEFENSE', 'DISTRICT_CRIMINAL_DEFENSE']}>
            <CriminalDefenseCreate />
          </PrivateRoute>
        } 
      />

      {/* View CriminalDefense Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CRIMINAL_DEFENSE', 'DISTRICT_CRIMINAL_DEFENSE']}>
            <CriminalDefenseDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit CriminalDefense Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CRIMINAL_DEFENSE', 'DISTRICT_CRIMINAL_DEFENSE']}>
            <CriminalDefenseEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default CriminalDefenseRoutes;
