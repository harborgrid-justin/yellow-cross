/**
 * WF-COMP-TBD | routes.tsx - ReportingAnalytics page routes
 * Purpose: ReportingAnalytics route configuration with role-based protection
 * Related: ProtectedRoute, reporting-analytics components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  ReportingAnalyticsMain,
  ReportingAnalyticsDetail,
  ReportingAnalyticsCreate,
  ReportingAnalyticsEdit,
} from './components';

export const ReportingAnalyticsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main ReportingAnalytics List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['REPORTING_ANALYTICS', 'DISTRICT_REPORTING_ANALYTICS']}>
            <ReportingAnalyticsMain />
          </PrivateRoute>
        } 
      />

      {/* Create New ReportingAnalytics Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['REPORTING_ANALYTICS', 'DISTRICT_REPORTING_ANALYTICS']}>
            <ReportingAnalyticsCreate />
          </PrivateRoute>
        } 
      />

      {/* View ReportingAnalytics Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['REPORTING_ANALYTICS', 'DISTRICT_REPORTING_ANALYTICS']}>
            <ReportingAnalyticsDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit ReportingAnalytics Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['REPORTING_ANALYTICS', 'DISTRICT_REPORTING_ANALYTICS']}>
            <ReportingAnalyticsEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default ReportingAnalyticsRoutes;
