/**
 * WF-COMP-TBD | routes.tsx - LegalResearch page routes
 * Purpose: LegalResearch route configuration with role-based protection
 * Related: ProtectedRoute, legal-research components
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  LegalResearchMain,
  LegalResearchDetail,
  LegalResearchCreate,
  LegalResearchEdit,
} from './components';

export const LegalResearchRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main LegalResearch List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['LEGAL_RESEARCH', 'DISTRICT_LEGAL_RESEARCH']}>
            <LegalResearchMain />
          </PrivateRoute>
        } 
      />

      {/* Create New LegalResearch Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['LEGAL_RESEARCH', 'DISTRICT_LEGAL_RESEARCH']}>
            <LegalResearchCreate />
          </PrivateRoute>
        } 
      />

      {/* View LegalResearch Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['LEGAL_RESEARCH', 'DISTRICT_LEGAL_RESEARCH']}>
            <LegalResearchDetail />
          </PrivateRoute>
        } 
      />

      {/* Edit LegalResearch Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['LEGAL_RESEARCH', 'DISTRICT_LEGAL_RESEARCH']}>
            <LegalResearchEdit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default LegalResearchRoutes;
