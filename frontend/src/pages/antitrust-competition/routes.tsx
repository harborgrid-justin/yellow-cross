/**
 * WF-COMP-TBD | routes.tsx - AntitrustCompetition page routes
 * Purpose: AntitrustCompetition route configuration with role-based protection
 * Related: ProtectedRoute, antitrust-competition components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  AntitrustCompetitionMain,
  AntitrustCompetitionDetail,
  AntitrustCompetitionCreate,
  AntitrustCompetitionEdit,
} from './components';

export const AntitrustCompetitionRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main AntitrustCompetition List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['ANTITRUST_COMPETITION', 'DISTRICT_ANTITRUST_COMPETITION']}>
            <AntitrustCompetitionMain />
          </PrivateRoute>
        } 
      />

      {/* Create New AntitrustCompetition Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['ANTITRUST_COMPETITION', 'DISTRICT_ANTITRUST_COMPETITION']}>
            <AntitrustCompetitionCreate />
          </PrivateRoute>
        } 
      />

      {/* View AntitrustCompetition Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['ANTITRUST_COMPETITION', 'DISTRICT_ANTITRUST_COMPETITION']}>
            <AntitrustCompetitionDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit AntitrustCompetition Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['ANTITRUST_COMPETITION', 'DISTRICT_ANTITRUST_COMPETITION']}>
            <AntitrustCompetitionEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AntitrustCompetitionRoutes;
