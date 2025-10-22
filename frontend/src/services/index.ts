/**
 * WF-IDX-XXX | index.ts - Services module exports
 * Purpose: Centralized exports for all service modules
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// Core infrastructure exports
export {
  apiInstance,
  tokenUtils,
  API_ENDPOINTS,
} from './config/apiConfig';

// Utility exports
export {
  handleApiError,
  extractApiData,
  extractApiDataOptional,
  buildUrlParams,
  buildPaginationParams,
  formatDateForApi,
  parseDateFromApi,
  withRetry,
  createFormData,
  isApiResponse,
  isPaginatedResponse,
  apiCache,
  withCache,
  debounce,
} from './utils/apiUtils';

// Type exports
export type { ApiError, PaginatedResponse } from './utils/apiUtils';
export * from './types';

// Core service exports
export * from './core';

// Authentication API
export { authApi } from './modules/authApi';
export type {
  AuthApi,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  AuthResponse,
  User,
} from './modules/authApi';

// Domain-specific API exports
export { caseManagementApi } from './modules/caseManagementApi';
export type {
  CaseManagementApi,
  CreateCaseData,
  UpdateCaseData,
  PaginatedCaseResponse,
  CaseStatistics,
} from './modules/caseManagementApi';

export { clientCrmApi } from './modules/clientCrmApi';
export type {
  ClientCrmApi,
  Client,
  CreateClientData,
  UpdateClientData,
  ClientCommunication,
} from './modules/clientCrmApi';

export { documentManagementApi } from './modules/documentManagementApi';
export type {
  DocumentManagementApi,
  Document,
  CreateDocumentData,
  UpdateDocumentData,
  DocumentVersion,
} from './modules/documentManagementApi';

export { calendarSchedulingApi } from './modules/calendarSchedulingApi';
export type {
  CalendarSchedulingApi,
  CalendarEvent,
  CreateEventData,
  UpdateEventData,
} from './modules/calendarSchedulingApi';

export { timeBillingApi } from './modules/timeBillingApi';
export type {
  TimeBillingApi,
  TimeEntry,
  CreateTimeEntryData,
  Invoice,
  CreateInvoiceData,
} from './modules/timeBillingApi';

// Security exports
export { secureTokenManager } from './security/SecureTokenManager';

// Monitoring exports
export { apiMetrics } from './monitoring/ApiMetrics';

// Audit exports
export { auditService } from './audit';
export type { AuditLogEntry } from './audit';
export { AuditAction, AuditStatus } from './audit';

// Cache exports
export { apiCache as cacheService } from './cache/ApiCache';

// ==========================================
// NEW API SERVICE EXPORTS (54 services)
// ==========================================

// Antitrust Competition API
export { antitrustCompetitionApi } from './modules/antitrustCompetitionApi';
export type {
  AntitrustCompetitionApi,
  AntitrustCase,
  CreateAntitrustCaseData,
  UpdateAntitrustCaseData,
  AntitrustCaseFilters,
  AntitrustCaseStatistics,
} from './modules/antitrustCompetitionApi';

// Appellate Practice API
export { appellatePracticeApi } from './modules/appellatePracticeApi';
export type {
  AppellatePracticeApi,
  Appeal,
  CreateAppealData,
  UpdateAppealData,
  AppealFilters,
  AppealStatistics,
} from './modules/appellatePracticeApi';

// Aviation Law API
export { aviationLawApi } from './modules/aviationLawApi';
export type {
  AviationLawApi,
  AviationCase,
  CreateAviationCaseData,
  UpdateAviationCaseData,
  AviationCaseFilters,
  AviationCaseStatistics,
} from './modules/aviationLawApi';

// Bankruptcy Management API
export { bankruptcyManagementApi } from './modules/bankruptcyManagementApi';
export type {
  BankruptcyManagementApi,
  BankruptcyCase,
  CreateBankruptcyCaseData,
  UpdateBankruptcyCaseData,
  BankruptcyCaseFilters,
  BankruptcyCaseStatistics,
} from './modules/bankruptcyManagementApi';

// Civil Rights API
export { civilRightsApi } from './modules/civilRightsApi';
export type {
  CivilRightsApi,
  CivilRightsCase,
  CreateCivilRightsCaseData,
  UpdateCivilRightsCaseData,
  CivilRightsCaseFilters,
  CivilRightsCaseStatistics,
} from './modules/civilRightsApi';

// Class Action API
export { classActionApi } from './modules/classActionApi';
export type {
  ClassActionApi,
  ClassActionCase,
  CreateClassActionCaseData,
  UpdateClassActionCaseData,
  ClassActionCaseFilters,
  ClassActionCaseStatistics,
} from './modules/classActionApi';

// Communication API
export { communicationApi } from './modules/communicationApi';
export type {
  CommunicationApi,
  Communication,
  CreateCommunicationData,
  UpdateCommunicationData,
  CommunicationFilters,
  CommunicationStatistics,
} from './modules/communicationApi';

// Compliance API
export { complianceApi } from './modules/complianceApi';
export type {
  ComplianceApi,
  ComplianceItem,
  CreateComplianceItemData,
  UpdateComplianceItemData,
  ComplianceItemFilters,
  ComplianceItemStatistics,
} from './modules/complianceApi';

// Construction Law API
export { constructionLawApi } from './modules/constructionLawApi';
export type {
  ConstructionLawApi,
  ConstructionCase,
  CreateConstructionCaseData,
  UpdateConstructionCaseData,
  ConstructionCaseFilters,
  ConstructionCaseStatistics,
} from './modules/constructionLawApi';

// Consumer Protection API
export { consumerProtectionApi } from './modules/consumerProtectionApi';
export type {
  ConsumerProtectionApi,
  ConsumerCase,
  CreateConsumerCaseData,
  UpdateConsumerCaseData,
  ConsumerCaseFilters,
  ConsumerCaseStatistics,
} from './modules/consumerProtectionApi';

// Contract Management API
export { contractManagementApi } from './modules/contractManagementApi';
export type {
  ContractManagementApi,
  Contract,
  CreateContractData,
  UpdateContractData,
  ContractFilters,
  ContractStatistics,
} from './modules/contractManagementApi';

// Corporate Governance API
export { corporateGovernanceApi } from './modules/corporateGovernanceApi';
export type {
  CorporateGovernanceApi,
  GovernanceItem,
  CreateGovernanceItemData,
  UpdateGovernanceItemData,
  GovernanceItemFilters,
  GovernanceItemStatistics,
} from './modules/corporateGovernanceApi';

// Court Docket API
export { courtDocketApi } from './modules/courtDocketApi';
export type {
  CourtDocketApi,
  DocketEntry,
  CreateDocketEntryData,
  UpdateDocketEntryData,
  DocketEntryFilters,
  DocketEntryStatistics,
} from './modules/courtDocketApi';

// Criminal Defense API
export { criminalDefenseApi } from './modules/criminalDefenseApi';
export type {
  CriminalDefenseApi,
  CriminalCase,
  CreateCriminalCaseData,
  UpdateCriminalCaseData,
  CriminalCaseFilters,
  CriminalCaseStatistics,
} from './modules/criminalDefenseApi';

// Cybersecurity Legal API
export { cybersecurityLegalApi } from './modules/cybersecurityLegalApi';
export type {
  CybersecurityLegalApi,
  CybersecurityCase,
  CreateCybersecurityCaseData,
  UpdateCybersecurityCaseData,
  CybersecurityCaseFilters,
  CybersecurityCaseStatistics,
} from './modules/cybersecurityLegalApi';

// Data Privacy API
export { dataPrivacyApi } from './modules/dataPrivacyApi';
export type {
  DataPrivacyApi,
  PrivacyCase,
  CreatePrivacyCaseData,
  UpdatePrivacyCaseData,
  PrivacyCaseFilters,
  PrivacyCaseStatistics,
} from './modules/dataPrivacyApi';

// eDiscovery API
export { ediscoveryApi } from './modules/ediscoveryApi';
export type {
  EdiscoveryApi,
  DiscoveryItem,
  CreateDiscoveryItemData,
  UpdateDiscoveryItemData,
  DiscoveryItemFilters,
  DiscoveryItemStatistics,
} from './modules/ediscoveryApi';

// Education Law API
export { educationLawApi } from './modules/educationLawApi';
export type {
  EducationLawApi,
  EducationCase,
  CreateEducationCaseData,
  UpdateEducationCaseData,
  EducationCaseFilters,
  EducationCaseStatistics,
} from './modules/educationLawApi';

// Employment Law API
export { employmentLawApi } from './modules/employmentLawApi';
export type {
  EmploymentLawApi,
  EmploymentCase,
  CreateEmploymentCaseData,
  UpdateEmploymentCaseData,
  EmploymentCaseFilters,
  EmploymentCaseStatistics,
} from './modules/employmentLawApi';

// Energy Utilities API
export { energyUtilitiesApi } from './modules/energyUtilitiesApi';
export type {
  EnergyUtilitiesApi,
  EnergyCase,
  CreateEnergyCaseData,
  UpdateEnergyCaseData,
  EnergyCaseFilters,
  EnergyCaseStatistics,
} from './modules/energyUtilitiesApi';

// Environmental Law API
export { environmentalLawApi } from './modules/environmentalLawApi';
export type {
  EnvironmentalLawApi,
  EnvironmentalCase,
  CreateEnvironmentalCaseData,
  UpdateEnvironmentalCaseData,
  EnvironmentalCaseFilters,
  EnvironmentalCaseStatistics,
} from './modules/environmentalLawApi';

// Estate Planning API
export { estatePlanningApi } from './modules/estatePlanningApi';
export type {
  EstatePlanningApi,
  Estate,
  CreateEstateData,
  UpdateEstateData,
  EstateFilters,
  EstateStatistics,
} from './modules/estatePlanningApi';

// Family Law API
export { familyLawApi } from './modules/familyLawApi';
export type {
  FamilyLawApi,
  FamilyCase,
  CreateFamilyCaseData,
  UpdateFamilyCaseData,
  FamilyCaseFilters,
  FamilyCaseStatistics,
} from './modules/familyLawApi';

// Financial Services API
export { financialServicesApi } from './modules/financialServicesApi';
export type {
  FinancialServicesApi,
  FinancialCase,
  CreateFinancialCaseData,
  UpdateFinancialCaseData,
  FinancialCaseFilters,
  FinancialCaseStatistics,
} from './modules/financialServicesApi';

// Franchise Law API
export { franchiseLawApi } from './modules/franchiseLawApi';
export type {
  FranchiseLawApi,
  FranchiseCase,
  CreateFranchiseCaseData,
  UpdateFranchiseCaseData,
  FranchiseCaseFilters,
  FranchiseCaseStatistics,
} from './modules/franchiseLawApi';

// Government Contracts API
export { governmentContractsApi } from './modules/governmentContractsApi';
export type {
  GovernmentContractsApi,
  GovernmentContract,
  CreateGovernmentContractData,
  UpdateGovernmentContractData,
  GovernmentContractFilters,
  GovernmentContractStatistics,
} from './modules/governmentContractsApi';

// Healthcare Law API
export { healthcareLawApi } from './modules/healthcareLawApi';
export type {
  HealthcareLawApi,
  HealthcareCase,
  CreateHealthcareCaseData,
  UpdateHealthcareCaseData,
  HealthcareCaseFilters,
  HealthcareCaseStatistics,
} from './modules/healthcareLawApi';

// Immigration Law API
export { immigrationLawApi } from './modules/immigrationLawApi';
export type {
  ImmigrationLawApi,
  ImmigrationCase,
  CreateImmigrationCaseData,
  UpdateImmigrationCaseData,
  ImmigrationCaseFilters,
  ImmigrationCaseStatistics,
} from './modules/immigrationLawApi';

// Insurance Defense API
export { insuranceDefenseApi } from './modules/insuranceDefenseApi';
export type {
  InsuranceDefenseApi,
  InsuranceCase,
  CreateInsuranceCaseData,
  UpdateInsuranceCaseData,
  InsuranceCaseFilters,
  InsuranceCaseStatistics,
} from './modules/insuranceDefenseApi';

// Integration API
export { integrationApi } from './modules/integrationApi';
export type {
  IntegrationApi,
  Integration,
  CreateIntegrationData,
  UpdateIntegrationData,
  IntegrationFilters,
  IntegrationStatistics,
} from './modules/integrationApi';

// Intellectual Property API
export { intellectualPropertyApi } from './modules/intellectualPropertyApi';
export type {
  IntellectualPropertyApi,
  IPCase,
  CreateIPCaseData,
  UpdateIPCaseData,
  IPCaseFilters,
  IPCaseStatistics,
} from './modules/intellectualPropertyApi';

// International Trade API
export { internationalTradeApi } from './modules/internationalTradeApi';
export type {
  InternationalTradeApi,
  TradeCase,
  CreateTradeCaseData,
  UpdateTradeCaseData,
  TradeCaseFilters,
  TradeCaseStatistics,
} from './modules/internationalTradeApi';

// Labor Relations API
export { laborRelationsApi } from './modules/laborRelationsApi';
export type {
  LaborRelationsApi,
  LaborCase,
  CreateLaborCaseData,
  UpdateLaborCaseData,
  LaborCaseFilters,
  LaborCaseStatistics,
} from './modules/laborRelationsApi';

// Landlord Tenant API
export { landlordTenantApi } from './modules/landlordTenantApi';
export type {
  LandlordTenantApi,
  TenancyCase,
  CreateTenancyCaseData,
  UpdateTenancyCaseData,
  TenancyCaseFilters,
  TenancyCaseStatistics,
} from './modules/landlordTenantApi';

// Legal Research API
export { legalResearchApi } from './modules/legalResearchApi';
export type {
  LegalResearchApi,
  ResearchItem,
  CreateResearchItemData,
  UpdateResearchItemData,
  ResearchItemFilters,
  ResearchItemStatistics,
} from './modules/legalResearchApi';

// Litigation Management API
export { litigationManagementApi } from './modules/litigationManagementApi';
export type {
  LitigationManagementApi,
  Litigation,
  CreateLitigationData,
  UpdateLitigationData,
  LitigationFilters,
  LitigationStatistics,
} from './modules/litigationManagementApi';

// Maritime Law API
export { maritimeLawApi } from './modules/maritimeLawApi';
export type {
  MaritimeLawApi,
  MaritimeCase,
  CreateMaritimeCaseData,
  UpdateMaritimeCaseData,
  MaritimeCaseFilters,
  MaritimeCaseStatistics,
} from './modules/maritimeLawApi';

// Mediation ADR API
export { mediationAdrApi } from './modules/mediationAdrApi';
export type {
  MediationAdrApi,
  MediationCase,
  CreateMediationCaseData,
  UpdateMediationCaseData,
  MediationCaseFilters,
  MediationCaseStatistics,
} from './modules/mediationAdrApi';

// Mergers Acquisitions API
export { mergersAcquisitionsApi } from './modules/mergersAcquisitionsApi';
export type {
  MergersAcquisitionsApi,
  MandA,
  CreateMandAData,
  UpdateMandAData,
  MandAFilters,
  MandAStatistics,
} from './modules/mergersAcquisitionsApi';

// Municipal Law API
export { municipalLawApi } from './modules/municipalLawApi';
export type {
  MunicipalLawApi,
  MunicipalCase,
  CreateMunicipalCaseData,
  UpdateMunicipalCaseData,
  MunicipalCaseFilters,
  MunicipalCaseStatistics,
} from './modules/municipalLawApi';

// Non-Profit Law API
export { nonProfitLawApi } from './modules/nonProfitLawApi';
export type {
  NonProfitLawApi,
  NonProfitCase,
  CreateNonProfitCaseData,
  UpdateNonProfitCaseData,
  NonProfitCaseFilters,
  NonProfitCaseStatistics,
} from './modules/nonProfitLawApi';

// Personal Injury API
export { personalInjuryApi } from './modules/personalInjuryApi';
export type {
  PersonalInjuryApi,
  InjuryCase,
  CreateInjuryCaseData,
  UpdateInjuryCaseData,
  InjuryCaseFilters,
  InjuryCaseStatistics,
} from './modules/personalInjuryApi';

// Pro Bono API
export { proBonoApi } from './modules/proBonoApi';
export type {
  ProBonoApi,
  ProBonoCase,
  CreateProBonoCaseData,
  UpdateProBonoCaseData,
  ProBonoCaseFilters,
  ProBonoCaseStatistics,
} from './modules/proBonoApi';

// Real Estate Transactions API
export { realEstateTransactionsApi } from './modules/realEstateTransactionsApi';
export type {
  RealEstateTransactionsApi,
  RealEstateTransaction,
  CreateRealEstateTransactionData,
  UpdateRealEstateTransactionData,
  RealEstateTransactionFilters,
  RealEstateTransactionStatistics,
} from './modules/realEstateTransactionsApi';

// Reporting Analytics API
export { reportingAnalyticsApi } from './modules/reportingAnalyticsApi';
export type {
  ReportingAnalyticsApi,
  Report,
  CreateReportData,
  UpdateReportData,
  ReportFilters,
  ReportStatistics,
} from './modules/reportingAnalyticsApi';

// Securities Law API
export { securitiesLawApi } from './modules/securitiesLawApi';
export type {
  SecuritiesLawApi,
  SecuritiesCase,
  CreateSecuritiesCaseData,
  UpdateSecuritiesCaseData,
  SecuritiesCaseFilters,
  SecuritiesCaseStatistics,
} from './modules/securitiesLawApi';

// Social Security API
export { socialSecurityApi } from './modules/socialSecurityApi';
export type {
  SocialSecurityApi,
  SSCase,
  CreateSSCaseData,
  UpdateSSCaseData,
  SSCaseFilters,
  SSCaseStatistics,
} from './modules/socialSecurityApi';

// Sports Entertainment API
export { sportsEntertainmentApi } from './modules/sportsEntertainmentApi';
export type {
  SportsEntertainmentApi,
  EntertainmentCase,
  CreateEntertainmentCaseData,
  UpdateEntertainmentCaseData,
  EntertainmentCaseFilters,
  EntertainmentCaseStatistics,
} from './modules/sportsEntertainmentApi';

// Task Workflow API
export { taskWorkflowApi } from './modules/taskWorkflowApi';
export type {
  TaskWorkflowApi,
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TaskStatistics,
} from './modules/taskWorkflowApi';

// Tax Law API
export { taxLawApi } from './modules/taxLawApi';
export type {
  TaxLawApi,
  TaxCase,
  CreateTaxCaseData,
  UpdateTaxCaseData,
  TaxCaseFilters,
  TaxCaseStatistics,
} from './modules/taxLawApi';

// Technology Transactions API
export { technologyTransactionsApi } from './modules/technologyTransactionsApi';
export type {
  TechnologyTransactionsApi,
  TechTransaction,
  CreateTechTransactionData,
  UpdateTechTransactionData,
  TechTransactionFilters,
  TechTransactionStatistics,
} from './modules/technologyTransactionsApi';

// Telecommunications API
export { telecommunicationsApi } from './modules/telecommunicationsApi';
export type {
  TelecommunicationsApi,
  TelecomCase,
  CreateTelecomCaseData,
  UpdateTelecomCaseData,
  TelecomCaseFilters,
  TelecomCaseStatistics,
} from './modules/telecommunicationsApi';

// Veterans Affairs API
export { veteransAffairsApi } from './modules/veteransAffairsApi';
export type {
  VeteransAffairsApi,
  VeteransCase,
  CreateVeteransCaseData,
  UpdateVeteransCaseData,
  VeteransCaseFilters,
  VeteransCaseStatistics,
} from './modules/veteransAffairsApi';

// White Collar Crime API
export { whiteCollarCrimeApi } from './modules/whiteCollarCrimeApi';
export type {
  WhiteCollarCrimeApi,
  WhiteCollarCase,
  CreateWhiteCollarCaseData,
  UpdateWhiteCollarCaseData,
  WhiteCollarCaseFilters,
  WhiteCollarCaseStatistics,
} from './modules/whiteCollarCrimeApi';


