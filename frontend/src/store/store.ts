/**
 * Redux Store Configuration
 * Configures the Redux store with Redux Toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import caseManagementReducer from './slices/caseManagementSlice';
import { adminReducer } from '../pages/admin/store';

// Domain page reducers - converted from features to pages domain structure
import { antitrustCompetitionReducer } from '../pages/antitrust-competition/store';
import { appellatePracticeReducer } from '../pages/appellate-practice/store';
import { aviationLawReducer } from '../pages/aviation-law/store';
import { bankruptcyManagementReducer } from '../pages/bankruptcy-management/store';
import { calendarSchedulingReducer } from '../pages/calendar-scheduling/store';
import { caseManagementReducer as caseManagementPageReducer } from '../pages/case-management/store';
import { civilRightsReducer } from '../pages/civil-rights/store';
import { classActionReducer } from '../pages/class-action/store';
import { clientCrmReducer } from '../pages/client-crm/store';
import { communicationReducer } from '../pages/communication/store';
import { complianceReducer } from '../pages/compliance/store';
import { constructionLawReducer } from '../pages/construction-law/store';
import { consumerProtectionReducer } from '../pages/consumer-protection/store';
import { contractManagementReducer } from '../pages/contract-management/store';
import { corporateGovernanceReducer } from '../pages/corporate-governance/store';
import { courtDocketReducer } from '../pages/court-docket/store';
import { criminalDefenseReducer } from '../pages/criminal-defense/store';
import { cybersecurityLegalReducer } from '../pages/cybersecurity-legal/store';
import { dataPrivacyReducer } from '../pages/data-privacy/store';
import { documentManagementReducer } from '../pages/document-management/store';
import { ediscoveryReducer } from '../pages/ediscovery/store';
import { educationLawReducer } from '../pages/education-law/store';
import { employmentLawReducer } from '../pages/employment-law/store';
import { energyUtilitiesReducer } from '../pages/energy-utilities/store';
import { environmentalLawReducer } from '../pages/environmental-law/store';
import { estatePlanningReducer } from '../pages/estate-planning/store';
import { familyLawReducer } from '../pages/family-law/store';
import { financialServicesReducer } from '../pages/financial-services/store';
import { franchiseLawReducer } from '../pages/franchise-law/store';
import { governmentContractsReducer } from '../pages/government-contracts/store';
import { healthcareLawReducer } from '../pages/healthcare-law/store';
import { immigrationLawReducer } from '../pages/immigration-law/store';
import { insuranceDefenseReducer } from '../pages/insurance-defense/store';
import { integrationReducer } from '../pages/integration/store';
import { intellectualPropertyReducer } from '../pages/intellectual-property/store';
import { internationalTradeReducer } from '../pages/international-trade/store';
import { laborRelationsReducer } from '../pages/labor-relations/store';
import { landlordTenantReducer } from '../pages/landlord-tenant/store';
import { legalResearchReducer } from '../pages/legal-research/store';
import { litigationManagementReducer } from '../pages/litigation-management/store';
import { maritimeLawReducer } from '../pages/maritime-law/store';
import { mediationAdrReducer } from '../pages/mediation-adr/store';
import { mergersAcquisitionsReducer } from '../pages/mergers-acquisitions/store';
import { municipalLawReducer } from '../pages/municipal-law/store';
import { nonProfitLawReducer } from '../pages/non-profit-law/store';
import { personalInjuryReducer } from '../pages/personal-injury/store';
import { proBonoReducer } from '../pages/pro-bono/store';
import { realEstateTransactionsReducer } from '../pages/real-estate-transactions/store';
import { reportingAnalyticsReducer } from '../pages/reporting-analytics/store';
import { securitiesLawReducer } from '../pages/securities-law/store';
import { securityReducer } from '../pages/security/store';
import { socialSecurityReducer } from '../pages/social-security/store';
import { sportsEntertainmentReducer } from '../pages/sports-entertainment/store';
import { taskWorkflowReducer } from '../pages/task-workflow/store';
import { taxLawReducer } from '../pages/tax-law/store';
import { technologyTransactionsReducer } from '../pages/technology-transactions/store';
import { telecommunicationsReducer } from '../pages/telecommunications/store';
import { timeBillingReducer } from '../pages/time-billing/store';
import { veteransAffairsReducer } from '../pages/veterans-affairs/store';
import { whiteCollarCrimeReducer } from '../pages/white-collar-crime/store';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    caseManagement: caseManagementReducer,
    admin: adminReducer,
    // Domain page reducers
    antitrustCompetition: antitrustCompetitionReducer,
    appellatePractice: appellatePracticeReducer,
    aviationLaw: aviationLawReducer,
    bankruptcyManagement: bankruptcyManagementReducer,
    calendarScheduling: calendarSchedulingReducer,
    caseManagementPage: caseManagementPageReducer,
    civilRights: civilRightsReducer,
    classAction: classActionReducer,
    clientCrm: clientCrmReducer,
    communication: communicationReducer,
    compliance: complianceReducer,
    constructionLaw: constructionLawReducer,
    consumerProtection: consumerProtectionReducer,
    contractManagement: contractManagementReducer,
    corporateGovernance: corporateGovernanceReducer,
    courtDocket: courtDocketReducer,
    criminalDefense: criminalDefenseReducer,
    cybersecurityLegal: cybersecurityLegalReducer,
    dataPrivacy: dataPrivacyReducer,
    documentManagement: documentManagementReducer,
    ediscovery: ediscoveryReducer,
    educationLaw: educationLawReducer,
    employmentLaw: employmentLawReducer,
    energyUtilities: energyUtilitiesReducer,
    environmentalLaw: environmentalLawReducer,
    estatePlanning: estatePlanningReducer,
    familyLaw: familyLawReducer,
    financialServices: financialServicesReducer,
    franchiseLaw: franchiseLawReducer,
    governmentContracts: governmentContractsReducer,
    healthcareLaw: healthcareLawReducer,
    immigrationLaw: immigrationLawReducer,
    insuranceDefense: insuranceDefenseReducer,
    integration: integrationReducer,
    intellectualProperty: intellectualPropertyReducer,
    internationalTrade: internationalTradeReducer,
    laborRelations: laborRelationsReducer,
    landlordTenant: landlordTenantReducer,
    legalResearch: legalResearchReducer,
    litigationManagement: litigationManagementReducer,
    maritimeLaw: maritimeLawReducer,
    mediationAdr: mediationAdrReducer,
    mergersAcquisitions: mergersAcquisitionsReducer,
    municipalLaw: municipalLawReducer,
    nonProfitLaw: nonProfitLawReducer,
    personalInjury: personalInjuryReducer,
    proBono: proBonoReducer,
    realEstateTransactions: realEstateTransactionsReducer,
    reportingAnalytics: reportingAnalyticsReducer,
    securitiesLaw: securitiesLawReducer,
    security: securityReducer,
    socialSecurity: socialSecurityReducer,
    sportsEntertainment: sportsEntertainmentReducer,
    taskWorkflow: taskWorkflowReducer,
    taxLaw: taxLawReducer,
    technologyTransactions: technologyTransactionsReducer,
    telecommunications: telecommunicationsReducer,
    timeBilling: timeBillingReducer,
    veteransAffairs: veteransAffairsReducer,
    whiteCollarCrime: whiteCollarCrimeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess', 'auth/restoreSession'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
