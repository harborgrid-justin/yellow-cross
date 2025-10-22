/**
 * WF-COMP-TBD | routes.tsx - CalendarScheduling page routes
 * Purpose: CalendarScheduling route configuration with role-based protection
 * Related: ProtectedRoute, calendar-scheduling components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  CalendarSchedulingMain,
  CalendarSchedulingDetail,
  CalendarSchedulingCreate,
  CalendarSchedulingEdit,
} from './components';

export const CalendarSchedulingRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main CalendarScheduling List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['CALENDAR_SCHEDULING', 'DISTRICT_CALENDAR_SCHEDULING']}>
            <CalendarSchedulingMain />
          </PrivateRoute>
        } 
      />

      {/* Create New CalendarScheduling Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['CALENDAR_SCHEDULING', 'DISTRICT_CALENDAR_SCHEDULING']}>
            <CalendarSchedulingCreate />
          </PrivateRoute>
        } 
      />

      {/* View CalendarScheduling Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['CALENDAR_SCHEDULING', 'DISTRICT_CALENDAR_SCHEDULING']}>
            <CalendarSchedulingDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit CalendarScheduling Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['CALENDAR_SCHEDULING', 'DISTRICT_CALENDAR_SCHEDULING']}>
            <CalendarSchedulingEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default CalendarSchedulingRoutes;
