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
              <Route path="case-management/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="client-crm" element={<PrivateRoute><ClientCrmPage /></PrivateRoute>} />
              <Route path="client-crm/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="client-crm/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="document-management" element={<PrivateRoute><DocumentManagementPage /></PrivateRoute>} />
              <Route path="document-management/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="document-management/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="time-billing" element={<PrivateRoute><TimeBillingPage /></PrivateRoute>} />
              <Route path="time-billing/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="time-billing/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="calendar-scheduling" element={<PrivateRoute><CalendarSchedulingPage /></PrivateRoute>} />
              <Route path="calendar-scheduling/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="calendar-scheduling/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="task-workflow" element={<PrivateRoute><TaskWorkflowPage /></PrivateRoute>} />
              <Route path="task-workflow/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="task-workflow/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="legal-research" element={<PrivateRoute><LegalResearchPage /></PrivateRoute>} />
              <Route path="legal-research/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="legal-research/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="court-docket" element={<PrivateRoute><CourtDocketPage /></PrivateRoute>} />
              <Route path="court-docket/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="court-docket/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="contract-management" element={<PrivateRoute><ContractManagementPage /></PrivateRoute>} />
              <Route path="contract-management/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="contract-management/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="ediscovery" element={<PrivateRoute><EdiscoveryPage /></PrivateRoute>} />
              <Route path="ediscovery/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="ediscovery/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="compliance" element={<PrivateRoute><CompliancePage /></PrivateRoute>} />
              <Route path="compliance/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="compliance/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="reporting-analytics" element={<PrivateRoute><ReportingAnalyticsPage /></PrivateRoute>} />
              <Route path="reporting-analytics/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="reporting-analytics/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="communication" element={<PrivateRoute><CommunicationPage /></PrivateRoute>} />
              <Route path="communication/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="communication/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="security" element={<PrivateRoute><SecurityPage /></PrivateRoute>} />
              <Route path="security/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="security/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="integration" element={<PrivateRoute><IntegrationPage /></PrivateRoute>} />
              <Route path="integration/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="integration/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              {/* NEW Feature Routes (16-60) */}
              <Route path="litigation-management" element={<PrivateRoute><LitigationManagementPage /></PrivateRoute>} />
              <Route path="litigation-management/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="litigation-management/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="mediation-adr" element={<PrivateRoute><MediationAdrPage /></PrivateRoute>} />
              <Route path="mediation-adr/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="mediation-adr/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="intellectual-property" element={<PrivateRoute><IntellectualPropertyPage /></PrivateRoute>} />
              <Route path="intellectual-property/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="intellectual-property/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="real-estate-transactions" element={<PrivateRoute><RealEstateTransactionsPage /></PrivateRoute>} />
              <Route path="real-estate-transactions/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="real-estate-transactions/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="corporate-governance" element={<PrivateRoute><CorporateGovernancePage /></PrivateRoute>} />
              <Route path="corporate-governance/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="corporate-governance/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="mergers-acquisitions" element={<PrivateRoute><MergersAcquisitionsPage /></PrivateRoute>} />
              <Route path="mergers-acquisitions/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="mergers-acquisitions/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="employment-law" element={<PrivateRoute><EmploymentLawPage /></PrivateRoute>} />
              <Route path="employment-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="employment-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="immigration-law" element={<PrivateRoute><ImmigrationLawPage /></PrivateRoute>} />
              <Route path="immigration-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="immigration-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="family-law" element={<PrivateRoute><FamilyLawPage /></PrivateRoute>} />
              <Route path="family-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="family-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="criminal-defense" element={<PrivateRoute><CriminalDefensePage /></PrivateRoute>} />
              <Route path="criminal-defense/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="criminal-defense/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="bankruptcy-management" element={<PrivateRoute><BankruptcyManagementPage /></PrivateRoute>} />
              <Route path="bankruptcy-management/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="bankruptcy-management/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="estate-planning" element={<PrivateRoute><EstatePlanningPage /></PrivateRoute>} />
              <Route path="estate-planning/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="estate-planning/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="tax-law" element={<PrivateRoute><TaxLawPage /></PrivateRoute>} />
              <Route path="tax-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="tax-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="personal-injury" element={<PrivateRoute><PersonalInjuryPage /></PrivateRoute>} />
              <Route path="personal-injury/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="personal-injury/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="class-action" element={<PrivateRoute><ClassActionPage /></PrivateRoute>} />
              <Route path="class-action/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="class-action/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="securities-law" element={<PrivateRoute><SecuritiesLawPage /></PrivateRoute>} />
              <Route path="securities-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="securities-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="healthcare-law" element={<PrivateRoute><HealthcareLawPage /></PrivateRoute>} />
              <Route path="healthcare-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="healthcare-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="environmental-law" element={<PrivateRoute><EnvironmentalLawPage /></PrivateRoute>} />
              <Route path="environmental-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="environmental-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="insurance-defense" element={<PrivateRoute><InsuranceDefensePage /></PrivateRoute>} />
              <Route path="insurance-defense/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="insurance-defense/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="appellate-practice" element={<PrivateRoute><AppellatePracticePage /></PrivateRoute>} />
              <Route path="appellate-practice/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="appellate-practice/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="financial-services" element={<PrivateRoute><FinancialServicesPage /></PrivateRoute>} />
              <Route path="financial-services/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="financial-services/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="energy-utilities" element={<PrivateRoute><EnergyUtilitiesPage /></PrivateRoute>} />
              <Route path="energy-utilities/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="energy-utilities/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="telecommunications" element={<PrivateRoute><TelecommunicationsPage /></PrivateRoute>} />
              <Route path="telecommunications/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="telecommunications/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="aviation-law" element={<PrivateRoute><AviationLawPage /></PrivateRoute>} />
              <Route path="aviation-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="aviation-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="maritime-law" element={<PrivateRoute><MaritimeLawPage /></PrivateRoute>} />
              <Route path="maritime-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="maritime-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="construction-law" element={<PrivateRoute><ConstructionLawPage /></PrivateRoute>} />
              <Route path="construction-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="construction-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="franchise-law" element={<PrivateRoute><FranchiseLawPage /></PrivateRoute>} />
              <Route path="franchise-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="franchise-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="sports-entertainment" element={<PrivateRoute><SportsEntertainmentPage /></PrivateRoute>} />
              <Route path="sports-entertainment/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="sports-entertainment/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="technology-transactions" element={<PrivateRoute><TechnologyTransactionsPage /></PrivateRoute>} />
              <Route path="technology-transactions/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="technology-transactions/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="data-privacy" element={<PrivateRoute><DataPrivacyPage /></PrivateRoute>} />
              <Route path="data-privacy/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="data-privacy/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="cybersecurity-legal" element={<PrivateRoute><CybersecurityLegalPage /></PrivateRoute>} />
              <Route path="cybersecurity-legal/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="cybersecurity-legal/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="government-contracts" element={<PrivateRoute><GovernmentContractsPage /></PrivateRoute>} />
              <Route path="government-contracts/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="government-contracts/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="non-profit-law" element={<PrivateRoute><NonProfitLawPage /></PrivateRoute>} />
              <Route path="non-profit-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="non-profit-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="education-law" element={<PrivateRoute><EducationLawPage /></PrivateRoute>} />
              <Route path="education-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="education-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="labor-relations" element={<PrivateRoute><LaborRelationsPage /></PrivateRoute>} />
              <Route path="labor-relations/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="labor-relations/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="international-trade" element={<PrivateRoute><InternationalTradePage /></PrivateRoute>} />
              <Route path="international-trade/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="international-trade/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="antitrust-competition" element={<PrivateRoute><AntitrustCompetitionPage /></PrivateRoute>} />
              <Route path="antitrust-competition/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="antitrust-competition/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="white-collar-crime" element={<PrivateRoute><WhiteCollarCrimePage /></PrivateRoute>} />
              <Route path="white-collar-crime/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="white-collar-crime/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="civil-rights" element={<PrivateRoute><CivilRightsPage /></PrivateRoute>} />
              <Route path="civil-rights/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="civil-rights/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="municipal-law" element={<PrivateRoute><MunicipalLawPage /></PrivateRoute>} />
              <Route path="municipal-law/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="municipal-law/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="veterans-affairs" element={<PrivateRoute><VeteransAffairsPage /></PrivateRoute>} />
              <Route path="veterans-affairs/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="veterans-affairs/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="social-security" element={<PrivateRoute><SocialSecurityPage /></PrivateRoute>} />
              <Route path="social-security/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="social-security/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="consumer-protection" element={<PrivateRoute><ConsumerProtectionPage /></PrivateRoute>} />
              <Route path="consumer-protection/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="consumer-protection/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="landlord-tenant" element={<PrivateRoute><LandlordTenantPage /></PrivateRoute>} />
              <Route path="landlord-tenant/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="landlord-tenant/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              
              <Route path="pro-bono" element={<PrivateRoute><ProBonoManagementPage /></PrivateRoute>} />
              <Route path="pro-bono/:subFeature" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
              <Route path="pro-bono/:subFeature/*" element={<PrivateRoute><SubFeaturePage /></PrivateRoute>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
