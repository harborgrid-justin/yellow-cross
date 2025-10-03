import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Feature pages
import CaseManagementPage from './pages/features/case-management/CaseManagementPage';
import ClientCrmPage from './pages/features/client-crm/ClientCrmPage';
import DocumentManagementPage from './pages/features/document-management/DocumentManagementPage';
import TimeBillingPage from './pages/features/time-billing/TimeBillingPage';
import CalendarSchedulingPage from './pages/features/calendar-scheduling/CalendarSchedulingPage';
import TaskWorkflowPage from './pages/features/task-workflow/TaskWorkflowPage';
import LegalResearchPage from './pages/features/legal-research/LegalResearchPage';
import CourtDocketPage from './pages/features/court-docket/CourtDocketPage';
import ContractManagementPage from './pages/features/contract-management/ContractManagementPage';
import EdiscoveryPage from './pages/features/ediscovery/EdiscoveryPage';
import CompliancePage from './pages/features/compliance/CompliancePage';
import ReportingAnalyticsPage from './pages/features/reporting-analytics/ReportingAnalyticsPage';
import CommunicationPage from './pages/features/communication/CommunicationPage';
import SecurityPage from './pages/features/security/SecurityPage';
import IntegrationPage from './pages/features/integration/IntegrationPage';

// Sub-feature pages (dynamic imports for code splitting)
import SubFeaturePage from './pages/SubFeaturePage';

import './styles/app.css';

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
