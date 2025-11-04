import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_GUARD } from '@nestjs/core';
import envConfig from './config/env.config';
import { databaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import authentication module
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Import all feature modules
import { CaseModule } from './modules/case/case.module';
import { ClientModule } from './modules/client/client.module';
import { DocumentModule } from './modules/document/document.module';
import { BillingModule } from './modules/billing/billing.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { TaskModule } from './modules/task/task.module';
import { ResearchModule } from './modules/research/research.module';
import { CourtModule } from './modules/court/court.module';
import { ContractModule } from './modules/contract/contract.module';
import { EDiscoveryModule } from './modules/ediscovery/ediscovery.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { SecurityModule } from './modules/security/security.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { LitigationModule } from './modules/litigation/litigation.module';
import { MediationModule } from './modules/mediation/mediation.module';
import { IntellectualPropertyModule } from './modules/intellectual-property/intellectual-property.module';
import { RealEstateModule } from './modules/real-estate/real-estate.module';
import { CorporateGovernanceModule } from './modules/corporate-governance/corporate-governance.module';
import { MergersAcquisitionsModule } from './modules/mergers-acquisitions/mergers-acquisitions.module';
import { EmploymentLawModule } from './modules/employment-law/employment-law.module';
import { ImmigrationLawModule } from './modules/immigration-law/immigration-law.module';
import { FamilyLawModule } from './modules/family-law/family-law.module';
import { CriminalDefenseModule } from './modules/criminal-defense/criminal-defense.module';
import { BankruptcyModule } from './modules/bankruptcy/bankruptcy.module';
import { EstatePlanningModule } from './modules/estate-planning/estate-planning.module';
import { TaxLawModule } from './modules/tax-law/tax-law.module';
import { PersonalInjuryModule } from './modules/personal-injury/personal-injury.module';
import { ClassActionModule } from './modules/class-action/class-action.module';
import { AppellatePracticeModule } from './modules/appellate-practice/appellate-practice.module';
import { EnvironmentalLawModule } from './modules/environmental-law/environmental-law.module';
import { HealthcareLawModule } from './modules/healthcare-law/healthcare-law.module';
import { InsuranceDefenseModule } from './modules/insurance-defense/insurance-defense.module';
import { SecuritiesLawModule } from './modules/securities-law/securities-law.module';
import { FinancialServicesModule } from './modules/financial-services/financial-services.module';
import { EnergyUtilitiesModule } from './modules/energy-utilities/energy-utilities.module';
import { TelecommunicationsModule } from './modules/telecommunications/telecommunications.module';
import { AviationLawModule } from './modules/aviation-law/aviation-law.module';
import { MaritimeLawModule } from './modules/maritime-law/maritime-law.module';
import { ConstructionLawModule } from './modules/construction-law/construction-law.module';
import { FranchiseLawModule } from './modules/franchise-law/franchise-law.module';
import { SportsEntertainmentModule } from './modules/sports-entertainment/sports-entertainment.module';
import { TechnologyTransactionsModule } from './modules/technology-transactions/technology-transactions.module';
import { DataPrivacyModule } from './modules/data-privacy/data-privacy.module';
import { CybersecurityLegalModule } from './modules/cybersecurity-legal/cybersecurity-legal.module';
import { GovernmentContractsModule } from './modules/government-contracts/government-contracts.module';
import { NonProfitLawModule } from './modules/non-profit-law/non-profit-law.module';
import { EducationLawModule } from './modules/education-law/education-law.module';
import { LaborRelationsModule } from './modules/labor-relations/labor-relations.module';
import { InternationalTradeModule } from './modules/international-trade/international-trade.module';
import { AntitrustCompetitionModule } from './modules/antitrust-competition/antitrust-competition.module';
import { WhiteCollarCrimeModule } from './modules/white-collar-crime/white-collar-crime.module';
import { CivilRightsModule } from './modules/civil-rights/civil-rights.module';
import { MunicipalLawModule } from './modules/municipal-law/municipal-law.module';
import { VeteransAffairsModule } from './modules/veterans-affairs/veterans-affairs.module';
import { SocialSecurityModule } from './modules/social-security/social-security.module';
import { ConsumerProtectionModule } from './modules/consumer-protection/consumer-protection.module';
import { LandlordTenantModule } from './modules/landlord-tenant/landlord-tenant.module';
import { ProBonoModule } from './modules/pro-bono/pro-bono.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: '.env',
    }),
    
    // Database
    SequelizeModule.forRoot(databaseConfig()),
    
    // Authentication
    AuthModule,
    
    // All Feature Modules
    CaseModule,
    ClientModule,
    DocumentModule,
    BillingModule,
    CalendarModule,
    TaskModule,
    ResearchModule,
    CourtModule,
    ContractModule,
    EDiscoveryModule,
    ComplianceModule,
    ReportingModule,
    CommunicationModule,
    SecurityModule,
    IntegrationModule,
    LitigationModule,
    MediationModule,
    IntellectualPropertyModule,
    RealEstateModule,
    CorporateGovernanceModule,
    MergersAcquisitionsModule,
    EmploymentLawModule,
    ImmigrationLawModule,
    FamilyLawModule,
    CriminalDefenseModule,
    BankruptcyModule,
    EstatePlanningModule,
    TaxLawModule,
    PersonalInjuryModule,
    ClassActionModule,
    AppellatePracticeModule,
    EnvironmentalLawModule,
    HealthcareLawModule,
    InsuranceDefenseModule,
    SecuritiesLawModule,
    FinancialServicesModule,
    EnergyUtilitiesModule,
    TelecommunicationsModule,
    AviationLawModule,
    MaritimeLawModule,
    ConstructionLawModule,
    FranchiseLawModule,
    SportsEntertainmentModule,
    TechnologyTransactionsModule,
    DataPrivacyModule,
    CybersecurityLegalModule,
    GovernmentContractsModule,
    NonProfitLawModule,
    EducationLawModule,
    LaborRelationsModule,
    InternationalTradeModule,
    AntitrustCompetitionModule,
    WhiteCollarCrimeModule,
    CivilRightsModule,
    MunicipalLawModule,
    VeteransAffairsModule,
    SocialSecurityModule,
    ConsumerProtectionModule,
    LandlordTenantModule,
    ProBonoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
