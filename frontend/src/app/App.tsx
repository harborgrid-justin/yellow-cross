import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../shared/components/Layout';
import HomePage from '../features/auth/HomePage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';

// Feature pages
import CaseManagementPage from '../features/case-management/CaseManagementPage';
import ClientCrmPage from '../features/client-crm/ClientCrmPage';
import DocumentManagementPage from '../features/document-management/DocumentManagementPage';
import TimeBillingPage from '../features/time-billing/TimeBillingPage';
import CalendarSchedulingPage from '../features/calendar-scheduling/CalendarSchedulingPage';
import TaskWorkflowPage from '../features/task-workflow/TaskWorkflowPage';
import LegalResearchPage from '../features/legal-research/LegalResearchPage';
import CourtDocketPage from '../features/court-docket/CourtDocketPage';
import ContractManagementPage from '../features/contract-management/ContractManagementPage';
import EdiscoveryPage from '../features/ediscovery/EdiscoveryPage';
import CompliancePage from '../features/compliance/CompliancePage';
import ReportingAnalyticsPage from '../features/reporting-analytics/ReportingAnalyticsPage';
import CommunicationPage from '../features/communication/CommunicationPage';
import SecurityPage from '../features/security/SecurityPage';
import IntegrationPage from '../features/integration/IntegrationPage';

// Sub-feature pages (dynamic imports for code splitting)
import SubFeaturePage from '../shared/components/SubFeaturePage';

import '../assets/styles/app.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Feature Routes */}
          <Route path="features">
            <Route path="case-management" element={<CaseManagementPage />} />
            <Route path="case-management/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="client-crm" element={<ClientCrmPage />} />
            <Route path="client-crm/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="document-management" element={<DocumentManagementPage />} />
            <Route path="document-management/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="time-billing" element={<TimeBillingPage />} />
            <Route path="time-billing/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="calendar-scheduling" element={<CalendarSchedulingPage />} />
            <Route path="calendar-scheduling/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="task-workflow" element={<TaskWorkflowPage />} />
            <Route path="task-workflow/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="legal-research" element={<LegalResearchPage />} />
            <Route path="legal-research/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="court-docket" element={<CourtDocketPage />} />
            <Route path="court-docket/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="contract-management" element={<ContractManagementPage />} />
            <Route path="contract-management/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="ediscovery" element={<EdiscoveryPage />} />
            <Route path="ediscovery/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="compliance/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="reporting-analytics" element={<ReportingAnalyticsPage />} />
            <Route path="reporting-analytics/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="communication" element={<CommunicationPage />} />
            <Route path="communication/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="security" element={<SecurityPage />} />
            <Route path="security/:subFeature" element={<SubFeaturePage />} />
            
            <Route path="integration" element={<IntegrationPage />} />
            <Route path="integration/:subFeature" element={<SubFeaturePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
