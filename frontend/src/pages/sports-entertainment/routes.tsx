/**
 * WF-COMP-TBD | routes.tsx - SportsEntertainment page routes
 * Purpose: SportsEntertainment route configuration with role-based protection
 * Related: ProtectedRoute, sports-entertainment components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  SportsEntertainmentMain,
  SportsEntertainmentDetail,
  SportsEntertainmentCreate,
  SportsEntertainmentEdit,
} from './components';

export const SportsEntertainmentRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main SportsEntertainment List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['SPORTS_ENTERTAINMENT', 'DISTRICT_SPORTS_ENTERTAINMENT']}>
            <SportsEntertainmentMain />
          </PrivateRoute>
        } 
      />

      {/* Create New SportsEntertainment Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['SPORTS_ENTERTAINMENT', 'DISTRICT_SPORTS_ENTERTAINMENT']}>
            <SportsEntertainmentCreate />
          </PrivateRoute>
        } 
      />

      {/* View SportsEntertainment Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['SPORTS_ENTERTAINMENT', 'DISTRICT_SPORTS_ENTERTAINMENT']}>
            <SportsEntertainmentDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit SportsEntertainment Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['SPORTS_ENTERTAINMENT', 'DISTRICT_SPORTS_ENTERTAINMENT']}>
            <SportsEntertainmentEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default SportsEntertainmentRoutes;
