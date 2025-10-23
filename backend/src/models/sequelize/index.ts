/**
 * Sequelize Models Index
 * Exports all Sequelize models
 */

import { User } from './User';
import { Case } from './Case';
import { CaseNote } from './CaseNote';
import { CaseTimelineEvent } from './CaseTimelineEvent';
import { Document } from './Document';
import { DocumentVersion } from './DocumentVersion';
import { DocumentReview } from './DocumentReview';
import { Task } from './Task';
import { TaskComment } from './TaskComment';
import { TaskTemplate } from './TaskTemplate';
import { Workflow } from './Workflow';
import { Evidence } from './Evidence';
import { PrivilegeLog } from './PrivilegeLog';
import { Production } from './Production';
import { LegalHold } from './LegalHold';
import { Client } from './Client';
import { ClientCommunication } from './ClientCommunication';
import { ClientFeedback } from './ClientFeedback';
import { Contract } from './Contract';
import { CalendarEvent } from './CalendarEvent';
import { Deadline } from './Deadline';
import { TimeEntry } from './TimeEntry';
import { Expense } from './Expense';
import { Invoice } from './Invoice';
import { Message } from './Message';
import { CommunicationTemplate } from './CommunicationTemplate';
import { ResearchItem } from './ResearchItem';
import { CourtDocket } from './CourtDocket';
import { ComplianceItem } from './ComplianceItem';
import { Report } from './Report';
import { SecurityAuditLog } from './SecurityAuditLog';
import { Integration } from './Integration';
import { DocumentTemplate } from './DocumentTemplate';
import SavedSearch from './SavedSearch';
import { LitigationMatter } from './LitigationMatter';
import { Mediation } from './Mediation';
import { IntellectualProperty } from './IntellectualProperty';
import { RealEstateTransaction } from './RealEstateTransaction';
import { CorporateGovernance } from './CorporateGovernance';
import { MergerAcquisition } from './MergerAcquisition';
import { EmploymentLawMatter } from './EmploymentLawMatter';
import { ImmigrationCase } from './ImmigrationCase';
import { FamilyLawCase } from './FamilyLawCase';
import { CriminalDefenseCase } from './CriminalDefenseCase';
import { BankruptcyCase } from './BankruptcyCase';
import { EstatePlanningMatter } from './EstatePlanningMatter';
import { TaxLawMatter } from './TaxLawMatter';
import { PersonalInjuryCase } from './PersonalInjuryCase';
import { ClassActionCase } from './ClassActionCase';
import { AppellateCase } from './AppellateCase';
import { EnvironmentalLawMatter } from './EnvironmentalLawMatter';
import { HealthcareLawMatter } from './HealthcareLawMatter';
import { InsuranceDefenseCase } from './InsuranceDefenseCase';
import { SecuritiesLawMatter } from './SecuritiesLawMatter';
import { FinancialServicesMatter } from './FinancialServicesMatter';
import { EnergyUtilitiesMatter } from './EnergyUtilitiesMatter';
import { TelecommunicationsMatter } from './TelecommunicationsMatter';
import { AviationLawMatter } from './AviationLawMatter';
import { MaritimeLawMatter } from './MaritimeLawMatter';
import { ConstructionLawMatter } from './ConstructionLawMatter';
import { FranchiseLawMatter } from './FranchiseLawMatter';
import { SportsEntertainmentMatter } from './SportsEntertainmentMatter';
import { TechnologyTransactionsMatter } from './TechnologyTransactionsMatter';
import { DataPrivacyMatter } from './DataPrivacyMatter';
import { CybersecurityLegalMatter } from './CybersecurityLegalMatter';
import { GovernmentContractsMatter } from './GovernmentContractsMatter';
import { NonProfitLawMatter } from './NonProfitLawMatter';
import { EducationLawMatter } from './EducationLawMatter';
import { LaborRelationsMatter } from './LaborRelationsMatter';
import { InternationalTradeMatter } from './InternationalTradeMatter';
import { AntitrustCompetitionMatter } from './AntitrustCompetitionMatter';
import { WhiteCollarCrimeMatter } from './WhiteCollarCrimeMatter';
import { CivilRightsMatter } from './CivilRightsMatter';
import { MunicipalLawMatter } from './MunicipalLawMatter';
import { VeteransAffairsMatter } from './VeteransAffairsMatter';
import { SocialSecurityMatter } from './SocialSecurityMatter';
import { ConsumerProtectionMatter } from './ConsumerProtectionMatter';
import { LandlordTenantMatter } from './LandlordTenantMatter';
import { ProBonoMatter } from './ProBonoMatter';
import { Notification } from './Notification';
import { NotificationPreference } from './NotificationPreference';

// Named exports
export {
  User,
  Case,
  CaseNote,
  CaseTimelineEvent,
  Document,
  DocumentVersion,
  DocumentReview,
  Task,
  TaskComment,
  TaskTemplate,
  Workflow,
  Evidence,
  PrivilegeLog,
  Production,
  LegalHold,
  Client,
  ClientCommunication,
  ClientFeedback,
  Contract,
  CalendarEvent,
  Deadline,
  TimeEntry,
  Expense,
  Invoice,
  Message,
  CommunicationTemplate,
  ResearchItem,
  CourtDocket,
  ComplianceItem,
  Report,
  SecurityAuditLog,
  Integration,
  DocumentTemplate,
  SavedSearch,
  LitigationMatter,
  Mediation,
  IntellectualProperty,
  RealEstateTransaction,
  CorporateGovernance,
  MergerAcquisition,
  EmploymentLawMatter,
  ImmigrationCase,
  FamilyLawCase,
  CriminalDefenseCase,
  BankruptcyCase,
  EstatePlanningMatter,
  TaxLawMatter,
  PersonalInjuryCase,
  ClassActionCase,
  AppellateCase,
  EnvironmentalLawMatter,
  HealthcareLawMatter,
  InsuranceDefenseCase,
  SecuritiesLawMatter,
  FinancialServicesMatter,
  EnergyUtilitiesMatter,
  TelecommunicationsMatter,
  AviationLawMatter,
  MaritimeLawMatter,
  ConstructionLawMatter,
  FranchiseLawMatter,
  SportsEntertainmentMatter,
  TechnologyTransactionsMatter,
  DataPrivacyMatter,
  CybersecurityLegalMatter,
  GovernmentContractsMatter,
  NonProfitLawMatter,
  EducationLawMatter,
  LaborRelationsMatter,
  InternationalTradeMatter,
  AntitrustCompetitionMatter,
  WhiteCollarCrimeMatter,
  CivilRightsMatter,
  MunicipalLawMatter,
  VeteransAffairsMatter,
  SocialSecurityMatter,
  ConsumerProtectionMatter,
  LandlordTenantMatter,
  ProBonoMatter,
  Notification,
  NotificationPreference
};

// Export all models as a default object
export default {
  User,
  Case,
  CaseNote,
  CaseTimelineEvent,
  Document,
  DocumentVersion,
  DocumentReview,
  Task,
  TaskComment,
  TaskTemplate,
  Workflow,
  Evidence,
  PrivilegeLog,
  Production,
  LegalHold,
  Client,
  ClientCommunication,
  ClientFeedback,
  Contract,
  CalendarEvent,
  Deadline,
  TimeEntry,
  Expense,
  Invoice,
  Message,
  CommunicationTemplate,
  ResearchItem,
  CourtDocket,
  ComplianceItem,
  Report,
  SecurityAuditLog,
  Integration,
  DocumentTemplate,
  SavedSearch,
  LitigationMatter,
  Mediation,
  IntellectualProperty,
  RealEstateTransaction,
  CorporateGovernance,
  MergerAcquisition,
  EmploymentLawMatter,
  ImmigrationCase,
  FamilyLawCase,
  CriminalDefenseCase,
  BankruptcyCase,
  EstatePlanningMatter,
  TaxLawMatter,
  PersonalInjuryCase,
  ClassActionCase,
  AppellateCase,
  EnvironmentalLawMatter,
  HealthcareLawMatter,
  InsuranceDefenseCase,
  SecuritiesLawMatter,
  FinancialServicesMatter,
  EnergyUtilitiesMatter,
  TelecommunicationsMatter,
  AviationLawMatter,
  MaritimeLawMatter,
  ConstructionLawMatter,
  FranchiseLawMatter,
  SportsEntertainmentMatter,
  TechnologyTransactionsMatter,
  DataPrivacyMatter,
  CybersecurityLegalMatter,
  GovernmentContractsMatter,
  NonProfitLawMatter,
  EducationLawMatter,
  LaborRelationsMatter,
  InternationalTradeMatter,
  AntitrustCompetitionMatter,
  WhiteCollarCrimeMatter,
  CivilRightsMatter,
  MunicipalLawMatter,
  VeteransAffairsMatter,
  SocialSecurityMatter,
  ConsumerProtectionMatter,
  LandlordTenantMatter,
  ProBonoMatter,
  Notification,
  NotificationPreference
};
