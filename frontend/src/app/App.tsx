import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../shared/context/AuthContext';
import PrivateRoute from '../shared/components/PrivateRoute';
import Layout from '../shared/components/Layout';
import HomePage from '../features/auth/HomePage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ProfilePage from '../features/auth/ProfilePage';

// Core Feature pages (1-15)
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

// NEW Feature pages (16-60)
import LitigationManagementPage from '../features/litigation-management/LitigationManagementPage';
import MediationAdrPage from '../features/mediation-adr/MediationAdrPage';
import IntellectualPropertyPage from '../features/intellectual-property/IntellectualPropertyPage';
import RealEstateTransactionsPage from '../features/real-estate-transactions/RealEstateTransactionsPage';
import CorporateGovernancePage from '../features/corporate-governance/CorporateGovernancePage';
import MergersAcquisitionsPage from '../features/mergers-acquisitions/MergersAcquisitionsPage';
import EmploymentLawPage from '../features/employment-law/EmploymentLawPage';
import ImmigrationLawPage from '../features/immigration-law/ImmigrationLawPage';
import FamilyLawPage from '../features/family-law/FamilyLawPage';
import CriminalDefensePage from '../features/criminal-defense/CriminalDefensePage';
import BankruptcyManagementPage from '../features/bankruptcy-management/BankruptcyManagementPage';
import EstatePlanningPage from '../features/estate-planning/EstatePlanningPage';
import TaxLawPage from '../features/tax-law/TaxLawPage';
import PersonalInjuryPage from '../features/personal-injury/PersonalInjuryPage';
import ClassActionPage from '../features/class-action/ClassActionPage';
import SecuritiesLawPage from '../features/securities-law/SecuritiesLawPage';
import HealthcareLawPage from '../features/healthcare-law/HealthcareLawPage';
import EnvironmentalLawPage from '../features/environmental-law/EnvironmentalLawPage';
import InsuranceDefensePage from '../features/insurance-defense/InsuranceDefensePage';
import AppellatePracticePage from '../features/appellate-practice/AppellatePracticePage';
import FinancialServicesPage from '../features/financial-services/FinancialServicesPage';
import EnergyUtilitiesPage from '../features/energy-utilities/EnergyUtilitiesPage';
import TelecommunicationsPage from '../features/telecommunications/TelecommunicationsPage';
import AviationLawPage from '../features/aviation-law/AviationLawPage';
import MaritimeLawPage from '../features/maritime-law/MaritimeLawPage';
import ConstructionLawPage from '../features/construction-law/ConstructionLawPage';
import FranchiseLawPage from '../features/franchise-law/FranchiseLawPage';
import SportsEntertainmentPage from '../features/sports-entertainment/SportsEntertainmentPage';
import TechnologyTransactionsPage from '../features/technology-transactions/TechnologyTransactionsPage';
import DataPrivacyPage from '../features/data-privacy/DataPrivacyPage';
import CybersecurityLegalPage from '../features/cybersecurity-legal/CybersecurityLegalPage';
import GovernmentContractsPage from '../features/government-contracts/GovernmentContractsPage';
import NonProfitLawPage from '../features/non-profit-law/NonProfitLawPage';
import EducationLawPage from '../features/education-law/EducationLawPage';
import LaborRelationsPage from '../features/labor-relations/LaborRelationsPage';
import InternationalTradePage from '../features/international-trade/InternationalTradePage';
import AntitrustCompetitionPage from '../features/antitrust-competition/AntitrustCompetitionPage';
import WhiteCollarCrimePage from '../features/white-collar-crime/WhiteCollarCrimePage';
import CivilRightsPage from '../features/civil-rights/CivilRightsPage';
import MunicipalLawPage from '../features/municipal-law/MunicipalLawPage';
import VeteransAffairsPage from '../features/veterans-affairs/VeteransAffairsPage';
import SocialSecurityPage from '../features/social-security/SocialSecurityPage';
import ConsumerProtectionPage from '../features/consumer-protection/ConsumerProtectionPage';
import LandlordTenantPage from '../features/landlord-tenant/LandlordTenantPage';
import ProBonoManagementPage from '../features/pro-bono/ProBonoManagementPage';

// Sub-feature pages (dynamic imports for code splitting)
import SubFeaturePage from '../shared/components/SubFeaturePage';

import '../assets/styles/app.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            
            {/* Feature Routes - All Protected */}
            <Route path="features">
              <Route path="case-management" element={<PrivateRoute><CaseManagementPage /></PrivateRoute>} />
              <Route path="case-management/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="client-crm" element={<PrivateRoute><ClientCrmPage /></PrivateRoute>} />
              <Route path="client-crm/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="document-management" element={<PrivateRoute><DocumentManagementPage /></PrivateRoute>} />
              <Route path="document-management/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="time-billing" element={<PrivateRoute><TimeBillingPage /></PrivateRoute>} />
              <Route path="time-billing/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="calendar-scheduling" element={<PrivateRoute><CalendarSchedulingPage /></PrivateRoute>} />
              <Route path="calendar-scheduling/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="task-workflow" element={<PrivateRoute><TaskWorkflowPage /></PrivateRoute>} />
              <Route path="task-workflow/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="legal-research" element={<PrivateRoute><LegalResearchPage /></PrivateRoute>} />
              <Route path="legal-research/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="court-docket" element={<PrivateRoute><CourtDocketPage /></PrivateRoute>} />
              <Route path="court-docket/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="contract-management" element={<PrivateRoute><ContractManagementPage /></PrivateRoute>} />
              <Route path="contract-management/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="ediscovery" element={<PrivateRoute><EdiscoveryPage /></PrivateRoute>} />
              <Route path="ediscovery/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="compliance" element={<PrivateRoute><CompliancePage /></PrivateRoute>} />
              <Route path="compliance/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="reporting-analytics" element={<PrivateRoute><ReportingAnalyticsPage /></PrivateRoute>} />
              <Route path="reporting-analytics/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="communication" element={<PrivateRoute><CommunicationPage /></PrivateRoute>} />
              <Route path="communication/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="security" element={<PrivateRoute><SecurityPage /></PrivateRoute>} />
              <Route path="security/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="integration" element={<PrivateRoute><IntegrationPage /></PrivateRoute>} />
              <Route path="integration/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
