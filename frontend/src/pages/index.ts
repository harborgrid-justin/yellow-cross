/**
 * WF-MAIN-001 | pages/index.ts - Pages Module Exports
 * Purpose: Central exports for all page modules
 * Last Updated: 2025-10-22 | File Type: .ts
 * 
 * Note: Domain-specific exports (actions, selectors, thunks) should be imported
 * directly from each domain's store to avoid naming conflicts.
 * Routes are exported here for convenience.
 */

// Export only Routes from each domain to avoid naming conflicts
// Each domain should import its own store items directly
export { AdminRoutes } from './admin';
export { AntitrustCompetitionRoutes } from './antitrust-competition';
export { AppellatePracticeRoutes } from './appellate-practice';
export { AviationLawRoutes } from './aviation-law';
export { BankruptcyManagementRoutes } from './bankruptcy-management';
export { CalendarSchedulingRoutes } from './calendar-scheduling';
export { CaseManagementRoutes } from './case-management';
export { CivilRightsRoutes } from './civil-rights';
export { ClassActionRoutes } from './class-action';
export { ClientCrmRoutes } from './client-crm';
export { CommunicationRoutes } from './communication';
export { ComplianceRoutes } from './compliance';
export { ConstructionLawRoutes } from './construction-law';
export { ConsumerProtectionRoutes } from './consumer-protection';
export { ContractManagementRoutes } from './contract-management';
export { CorporateGovernanceRoutes } from './corporate-governance';
export { CourtDocketRoutes } from './court-docket';
export { CriminalDefenseRoutes } from './criminal-defense';
export { CybersecurityLegalRoutes } from './cybersecurity-legal';
export { DataPrivacyRoutes } from './data-privacy';
export { DocumentManagementRoutes } from './document-management';
export { EdiscoveryRoutes } from './ediscovery';
export { EducationLawRoutes } from './education-law';
export { EmploymentLawRoutes } from './employment-law';
export { EnergyUtilitiesRoutes } from './energy-utilities';
export { EnvironmentalLawRoutes } from './environmental-law';
export { EstatePlanningRoutes } from './estate-planning';
export { FamilyLawRoutes } from './family-law';
export { FinancialServicesRoutes } from './financial-services';
export { FranchiseLawRoutes } from './franchise-law';
export { GovernmentContractsRoutes } from './government-contracts';
export { HealthcareLawRoutes } from './healthcare-law';
export { ImmigrationLawRoutes } from './immigration-law';
export { InsuranceDefenseRoutes } from './insurance-defense';
export { IntegrationRoutes } from './integration';
export { IntellectualPropertyRoutes } from './intellectual-property';
export { InternationalTradeRoutes } from './international-trade';
export { LaborRelationsRoutes } from './labor-relations';
export { LandlordTenantRoutes } from './landlord-tenant';
export { LegalResearchRoutes } from './legal-research';
export { LitigationManagementRoutes } from './litigation-management';
export { MaritimeLawRoutes } from './maritime-law';
export { MediationAdrRoutes } from './mediation-adr';
export { MergersAcquisitionsRoutes } from './mergers-acquisitions';
export { MunicipalLawRoutes } from './municipal-law';
export { NonProfitLawRoutes } from './non-profit-law';
export { PersonalInjuryRoutes } from './personal-injury';
export { ProBonoRoutes } from './pro-bono';
export { RealEstateTransactionsRoutes } from './real-estate-transactions';
export { ReportingAnalyticsRoutes } from './reporting-analytics';
export { SecuritiesLawRoutes } from './securities-law';
export { SecurityRoutes } from './security';
export { SocialSecurityRoutes } from './social-security';
export { SportsEntertainmentRoutes } from './sports-entertainment';
export { TaskWorkflowRoutes } from './task-workflow';
export { TaxLawRoutes } from './tax-law';
export { TechnologyTransactionsRoutes } from './technology-transactions';
export { TelecommunicationsRoutes } from './telecommunications';
export { TimeBillingRoutes } from './time-billing';
export { VeteransAffairsRoutes } from './veterans-affairs';
export { WhiteCollarCrimeRoutes } from './white-collar-crime';
