/**
 * WF-COMP-TBD | routes.tsx - CivilRights page routes
 * Purpose: CivilRights route configuration with role-based protection
 * Related: ProtectedRoute, civil-rights components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  CivilRightsMain,
  CivilRightsDetail,
  CivilRightsCreate,
  CivilRightsEdit,
} from './components';

export const CivilRightsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main CivilRights List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CIVIL_RIGHTS', 'DISTRICT_CIVIL_RIGHTS']}>
            <CivilRightsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New CivilRights Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CIVIL_RIGHTS', 'DISTRICT_CIVIL_RIGHTS']}>
            <CivilRightsCreate />
          </PrivateRoute>
        } 
      />

      {/* View CivilRights Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CIVIL_RIGHTS', 'DISTRICT_CIVIL_RIGHTS']}>
            <CivilRightsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit CivilRights Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CIVIL_RIGHTS', 'DISTRICT_CIVIL_RIGHTS']}>
            <CivilRightsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default CivilRightsRoutes;
