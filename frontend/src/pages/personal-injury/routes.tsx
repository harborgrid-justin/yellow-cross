/**
 * WF-COMP-TBD | routes.tsx - PersonalInjury page routes
 * Purpose: PersonalInjury route configuration with role-based protection
 * Related: ProtectedRoute, personal-injury components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  PersonalInjuryMain,
  PersonalInjuryDetail,
  PersonalInjuryCreate,
  PersonalInjuryEdit,
} from './components';

export const PersonalInjuryRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main PersonalInjury List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['PERSONAL_INJURY', 'DISTRICT_PERSONAL_INJURY']}>
            <PersonalInjuryMain />
          </PrivateRoute>
        } 
      />

      {/* Create New PersonalInjury Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['PERSONAL_INJURY', 'DISTRICT_PERSONAL_INJURY']}>
            <PersonalInjuryCreate />
          </PrivateRoute>
        } 
      />

      {/* View PersonalInjury Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['PERSONAL_INJURY', 'DISTRICT_PERSONAL_INJURY']}>
            <PersonalInjuryDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit PersonalInjury Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['PERSONAL_INJURY', 'DISTRICT_PERSONAL_INJURY']}>
            <PersonalInjuryEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default PersonalInjuryRoutes;
