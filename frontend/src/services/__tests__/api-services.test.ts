/**
 * Verification tests for all API services
 * Purpose: Ensure all API services are properly exported and instantiated
 */

import {
  // Existing services
  authApi,
  caseManagementApi,
  clientCrmApi,
  documentManagementApi,
  calendarSchedulingApi,
  timeBillingApi,
  
  // New services
  antitrustCompetitionApi,
  appellatePracticeApi,
  aviationLawApi,
  bankruptcyManagementApi,
  civilRightsApi,
  classActionApi,
  communicationApi,
  complianceApi,
  constructionLawApi,
  consumerProtectionApi,
  contractManagementApi,
  corporateGovernanceApi,
  courtDocketApi,
  criminalDefenseApi,
  cybersecurityLegalApi,
  dataPrivacyApi,
  ediscoveryApi,
  educationLawApi,
  employmentLawApi,
  energyUtilitiesApi,
  environmentalLawApi,
  estatePlanningApi,
  familyLawApi,
  financialServicesApi,
  franchiseLawApi,
  governmentContractsApi,
  healthcareLawApi,
  immigrationLawApi,
  insuranceDefenseApi,
  integrationApi,
  intellectualPropertyApi,
  internationalTradeApi,
  laborRelationsApi,
  landlordTenantApi,
  legalResearchApi,
  litigationManagementApi,
  maritimeLawApi,
  mediationAdrApi,
  mergersAcquisitionsApi,
  municipalLawApi,
  nonProfitLawApi,
  personalInjuryApi,
  proBonoApi,
  realEstateTransactionsApi,
  reportingAnalyticsApi,
  securitiesLawApi,
  socialSecurityApi,
  sportsEntertainmentApi,
  taskWorkflowApi,
  taxLawApi,
  technologyTransactionsApi,
  telecommunicationsApi,
  veteransAffairsApi,
  whiteCollarCrimeApi,
} from '../index';

describe('API Services - Verification', () => {
  describe('Existing Services', () => {
    it('should export authApi', () => {
      expect(authApi).toBeDefined();
      expect(authApi.login).toBeDefined();
    });

    it('should export caseManagementApi', () => {
      expect(caseManagementApi).toBeDefined();
      expect(caseManagementApi.getAll).toBeDefined();
      expect(caseManagementApi.getById).toBeDefined();
      expect(caseManagementApi.create).toBeDefined();
      expect(caseManagementApi.update).toBeDefined();
      expect(caseManagementApi.delete).toBeDefined();
      expect(caseManagementApi.getStatistics).toBeDefined();
      expect(caseManagementApi.search).toBeDefined();
    });

    it('should export clientCrmApi', () => {
      expect(clientCrmApi).toBeDefined();
      expect(clientCrmApi.getAll).toBeDefined();
    });

    it('should export documentManagementApi', () => {
      expect(documentManagementApi).toBeDefined();
      expect(documentManagementApi.getAll).toBeDefined();
    });

    it('should export calendarSchedulingApi', () => {
      expect(calendarSchedulingApi).toBeDefined();
      expect(calendarSchedulingApi.getAll).toBeDefined();
    });

    it('should export timeBillingApi', () => {
      expect(timeBillingApi).toBeDefined();
      expect(timeBillingApi.getAll).toBeDefined();
    });
  });

  describe('New API Services - CRUD Operations', () => {
    const apiServices = [
      { name: 'antitrustCompetitionApi', api: antitrustCompetitionApi },
      { name: 'appellatePracticeApi', api: appellatePracticeApi },
      { name: 'aviationLawApi', api: aviationLawApi },
      { name: 'bankruptcyManagementApi', api: bankruptcyManagementApi },
      { name: 'civilRightsApi', api: civilRightsApi },
      { name: 'classActionApi', api: classActionApi },
      { name: 'communicationApi', api: communicationApi },
      { name: 'complianceApi', api: complianceApi },
      { name: 'constructionLawApi', api: constructionLawApi },
      { name: 'consumerProtectionApi', api: consumerProtectionApi },
      { name: 'contractManagementApi', api: contractManagementApi },
      { name: 'corporateGovernanceApi', api: corporateGovernanceApi },
      { name: 'courtDocketApi', api: courtDocketApi },
      { name: 'criminalDefenseApi', api: criminalDefenseApi },
      { name: 'cybersecurityLegalApi', api: cybersecurityLegalApi },
      { name: 'dataPrivacyApi', api: dataPrivacyApi },
      { name: 'ediscoveryApi', api: ediscoveryApi },
      { name: 'educationLawApi', api: educationLawApi },
      { name: 'employmentLawApi', api: employmentLawApi },
      { name: 'energyUtilitiesApi', api: energyUtilitiesApi },
      { name: 'environmentalLawApi', api: environmentalLawApi },
      { name: 'estatePlanningApi', api: estatePlanningApi },
      { name: 'familyLawApi', api: familyLawApi },
      { name: 'financialServicesApi', api: financialServicesApi },
      { name: 'franchiseLawApi', api: franchiseLawApi },
      { name: 'governmentContractsApi', api: governmentContractsApi },
      { name: 'healthcareLawApi', api: healthcareLawApi },
      { name: 'immigrationLawApi', api: immigrationLawApi },
      { name: 'insuranceDefenseApi', api: insuranceDefenseApi },
      { name: 'integrationApi', api: integrationApi },
      { name: 'intellectualPropertyApi', api: intellectualPropertyApi },
      { name: 'internationalTradeApi', api: internationalTradeApi },
      { name: 'laborRelationsApi', api: laborRelationsApi },
      { name: 'landlordTenantApi', api: landlordTenantApi },
      { name: 'legalResearchApi', api: legalResearchApi },
      { name: 'litigationManagementApi', api: litigationManagementApi },
      { name: 'maritimeLawApi', api: maritimeLawApi },
      { name: 'mediationAdrApi', api: mediationAdrApi },
      { name: 'mergersAcquisitionsApi', api: mergersAcquisitionsApi },
      { name: 'municipalLawApi', api: municipalLawApi },
      { name: 'nonProfitLawApi', api: nonProfitLawApi },
      { name: 'personalInjuryApi', api: personalInjuryApi },
      { name: 'proBonoApi', api: proBonoApi },
      { name: 'realEstateTransactionsApi', api: realEstateTransactionsApi },
      { name: 'reportingAnalyticsApi', api: reportingAnalyticsApi },
      { name: 'securitiesLawApi', api: securitiesLawApi },
      { name: 'socialSecurityApi', api: socialSecurityApi },
      { name: 'sportsEntertainmentApi', api: sportsEntertainmentApi },
      { name: 'taskWorkflowApi', api: taskWorkflowApi },
      { name: 'taxLawApi', api: taxLawApi },
      { name: 'technologyTransactionsApi', api: technologyTransactionsApi },
      { name: 'telecommunicationsApi', api: telecommunicationsApi },
      { name: 'veteransAffairsApi', api: veteransAffairsApi },
      { name: 'whiteCollarCrimeApi', api: whiteCollarCrimeApi },
    ];

    apiServices.forEach(({ name, api }) => {
      describe(name, () => {
        it('should be defined', () => {
          expect(api).toBeDefined();
        });

        it('should have getAll method', () => {
          expect(api.getAll).toBeDefined();
          expect(typeof api.getAll).toBe('function');
        });

        it('should have getById method', () => {
          expect(api.getById).toBeDefined();
          expect(typeof api.getById).toBe('function');
        });

        it('should have create method', () => {
          expect(api.create).toBeDefined();
          expect(typeof api.create).toBe('function');
        });

        it('should have update method', () => {
          expect(api.update).toBeDefined();
          expect(typeof api.update).toBe('function');
        });

        it('should have delete method', () => {
          expect(api.delete).toBeDefined();
          expect(typeof api.delete).toBe('function');
        });

        it('should have getStatistics method', () => {
          expect(api.getStatistics).toBeDefined();
          expect(typeof api.getStatistics).toBe('function');
        });

        it('should have search method', () => {
          expect(api.search).toBeDefined();
          expect(typeof api.search).toBe('function');
        });
      });
    });
  });

  describe('API Count Verification', () => {
    it('should have 60 total API services (6 existing + 54 new)', () => {
      const allApis = [
        authApi,
        caseManagementApi,
        clientCrmApi,
        documentManagementApi,
        calendarSchedulingApi,
        timeBillingApi,
        antitrustCompetitionApi,
        appellatePracticeApi,
        aviationLawApi,
        bankruptcyManagementApi,
        civilRightsApi,
        classActionApi,
        communicationApi,
        complianceApi,
        constructionLawApi,
        consumerProtectionApi,
        contractManagementApi,
        corporateGovernanceApi,
        courtDocketApi,
        criminalDefenseApi,
        cybersecurityLegalApi,
        dataPrivacyApi,
        ediscoveryApi,
        educationLawApi,
        employmentLawApi,
        energyUtilitiesApi,
        environmentalLawApi,
        estatePlanningApi,
        familyLawApi,
        financialServicesApi,
        franchiseLawApi,
        governmentContractsApi,
        healthcareLawApi,
        immigrationLawApi,
        insuranceDefenseApi,
        integrationApi,
        intellectualPropertyApi,
        internationalTradeApi,
        laborRelationsApi,
        landlordTenantApi,
        legalResearchApi,
        litigationManagementApi,
        maritimeLawApi,
        mediationAdrApi,
        mergersAcquisitionsApi,
        municipalLawApi,
        nonProfitLawApi,
        personalInjuryApi,
        proBonoApi,
        realEstateTransactionsApi,
        reportingAnalyticsApi,
        securitiesLawApi,
        socialSecurityApi,
        sportsEntertainmentApi,
        taskWorkflowApi,
        taxLawApi,
        technologyTransactionsApi,
        telecommunicationsApi,
        veteransAffairsApi,
        whiteCollarCrimeApi,
      ];

      expect(allApis).toHaveLength(60);
      allApis.forEach(api => expect(api).toBeDefined());
    });
  });
});
