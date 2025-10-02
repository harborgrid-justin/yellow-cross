/**
 * Compliance Validation Schemas using Joi
 * Input validation for compliance and risk management operations
 */

const Joi = require('joi');

// Validation schema for ethics & compliance record creation
const createComplianceRecordSchema = Joi.object({
  recordType: Joi.string().required().valid(
    'Ethics Rule', 'CLE Requirement', 'Ethics Alert', 'Violation Report', 'Compliance Monitoring', 'Professional Conduct', 'Other'
  ),
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  ethicsRule: Joi.object({
    ruleNumber: Joi.string().trim().max(50),
    ruleName: Joi.string().trim().max(200),
    jurisdiction: Joi.string().trim().max(100),
    category: Joi.string().trim().max(100),
    description: Joi.string().trim().max(2000),
    effectiveDate: Joi.date().optional(),
    complianceDeadline: Joi.date().optional()
  }).optional(),
  cleTracking: Joi.object({
    courseName: Joi.string().trim().max(200),
    provider: Joi.string().trim().max(200),
    courseType: Joi.string().valid('Ethics', 'Legal', 'Professional Development', 'Technology', 'Other'),
    credits: Joi.number().min(0).max(100),
    completedDate: Joi.date().optional(),
    expirationDate: Joi.date().optional(),
    certificateNumber: Joi.string().trim().max(100)
  }).optional(),
  status: Joi.string().valid('Active', 'Pending', 'Completed', 'Violated', 'Under Review', 'Resolved', 'Archived').default('Active'),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  assignedTo: Joi.string().trim().allow('').max(100),
  complianceCategory: Joi.string().valid(
    'Professional Conduct', 'Client Relations', 'Confidentiality', 'Conflict of Interest', 
    'Trust Accounting', 'Advertising', 'Fee Agreements', 'Record Keeping', 'Other'
  ).optional(),
  jurisdiction: Joi.string().trim().allow('').max(100),
  regulatoryBody: Joi.string().trim().allow('').max(200),
  effectiveDate: Joi.date().optional(),
  dueDate: Joi.date().optional(),
  notes: Joi.string().trim().allow('').max(2000),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for risk assessment creation
const createRiskAssessmentSchema = Joi.object({
  assessmentType: Joi.string().required().valid(
    'Case Risk', 'Client Risk', 'Financial Risk', 'Reputational Risk', 'Operational Risk', 'Legal Risk', 'Compliance Risk', 'Other'
  ),
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientName: Joi.string().trim().optional(),
  riskFactors: Joi.array().items(
    Joi.object({
      factor: Joi.string().required().trim(),
      category: Joi.string().trim().optional(),
      description: Joi.string().trim().optional(),
      likelihood: Joi.string().valid('Very Low', 'Low', 'Medium', 'High', 'Very High'),
      impact: Joi.string().valid('Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'),
      score: Joi.number().min(0).max(25)
    })
  ).optional(),
  overallRiskScore: Joi.number().required().min(0).max(100),
  riskLevel: Joi.string().required().valid('Very Low', 'Low', 'Medium', 'High', 'Critical'),
  riskCategory: Joi.string().valid('Financial', 'Legal', 'Operational', 'Reputational', 'Strategic', 'Compliance', 'Market', 'Other').optional(),
  mitigationStrategies: Joi.array().items(
    Joi.object({
      strategy: Joi.string().required().trim(),
      description: Joi.string().trim().optional(),
      priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical'),
      status: Joi.string().valid('Planned', 'In Progress', 'Implemented', 'Deferred', 'Not Applicable'),
      cost: Joi.number().min(0).optional(),
      notes: Joi.string().trim().optional()
    })
  ).optional(),
  status: Joi.string().valid('Open', 'Under Review', 'Mitigated', 'Accepted', 'Transferred', 'Closed', 'Archived').default('Open'),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  assignedTo: Joi.string().trim().allow('').max(100),
  assessmentDate: Joi.date().required(),
  assessedBy: Joi.string().required().trim().min(2).max(100),
  tags: Joi.array().items(Joi.string().trim()).optional()
});

// Validation schema for malpractice check creation
const createMalpracticeCheckSchema = Joi.object({
  checkType: Joi.string().required().valid(
    'Conflict Check', 'Deadline Check', 'Statute of Limitations', 'Quality Review', 'Best Practice Alert', 'Document Review', 'Other'
  ),
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientName: Joi.string().trim().optional(),
  conflictCheck: Joi.object({
    partyNames: Joi.array().items(Joi.string().trim()).optional(),
    opposingParty: Joi.string().trim().optional(),
    opposingCounsel: Joi.string().trim().optional(),
    conflictType: Joi.string().valid('Direct Conflict', 'Indirect Conflict', 'Potential Conflict', 'No Conflict', 'Waived').optional(),
    conflictDetails: Joi.string().trim().optional(),
    waiverObtained: Joi.boolean().optional()
  }).optional(),
  deadlineMonitoring: Joi.object({
    deadlineType: Joi.string().valid('Filing', 'Response', 'Discovery', 'Motion', 'Appeal', 'Statute of Limitations', 'Other').optional(),
    deadlineDate: Joi.date().optional(),
    triggerDate: Joi.date().optional(),
    calculationMethod: Joi.string().trim().optional(),
    responsibleAttorney: Joi.string().trim().optional(),
    backupAttorney: Joi.string().trim().optional()
  }).optional(),
  result: Joi.string().required().valid('Clear', 'Issue Found', 'Conflict Identified', 'Deadline At Risk', 'Action Required', 'Resolved', 'Waived'),
  severity: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  status: Joi.string().valid('Pending', 'In Review', 'Resolved', 'Escalated', 'Waived', 'Closed', 'Archived').default('Pending'),
  assignedTo: Joi.string().trim().allow('').max(100),
  checkDate: Joi.date().required(),
  performedBy: Joi.string().required().trim().min(2).max(100),
  tags: Joi.array().items(Joi.string().trim()).optional()
});

// Validation schema for regulatory compliance creation
const createRegulatoryComplianceSchema = Joi.object({
  complianceType: Joi.string().required().valid(
    'ABA Rules', 'State Bar Rules', 'Trust Accounting', 'Advertising Compliance', 'Fee Agreement', 'Record Keeping', 'Professional Conduct', 'Other'
  ),
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  jurisdiction: Joi.string().required().trim().min(2).max(100),
  regulatoryBody: Joi.string().required().valid(
    'ABA', 'State Bar', 'Federal Court', 'State Court', 'Ethics Committee', 'Bar Association', 'Professional Conduct Board', 'Other'
  ),
  abaCompliance: Joi.object({
    modelRule: Joi.string().trim().optional(),
    ruleNumber: Joi.string().trim().optional(),
    ruleTitle: Joi.string().trim().optional(),
    ruleDescription: Joi.string().trim().optional(),
    complianceRequirements: Joi.array().items(Joi.string().trim()).optional()
  }).optional(),
  stateBarRules: Joi.object({
    state: Joi.string().trim().length(2).optional(),
    ruleNumber: Joi.string().trim().optional(),
    ruleTitle: Joi.string().trim().optional(),
    ruleCategory: Joi.string().trim().optional(),
    requirements: Joi.array().items(Joi.string().trim()).optional(),
    renewalFrequency: Joi.string().trim().optional()
  }).optional(),
  status: Joi.string().valid('Compliant', 'Non-Compliant', 'Pending', 'Under Review', 'Action Required', 'Grace Period', 'Archived').default('Pending'),
  severity: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  assignedTo: Joi.string().trim().allow('').max(100),
  effectiveDate: Joi.date().optional(),
  complianceDeadline: Joi.date().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for privacy compliance (data subject request)
const createPrivacyComplianceSchema = Joi.object({
  complianceType: Joi.string().required().valid(
    'GDPR', 'CCPA', 'HIPAA', 'Data Subject Request', 'Privacy Policy', 'Consent Management', 'Data Breach', 'Privacy Assessment', 'Other'
  ),
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  dataSubject: Joi.object({
    subjectType: Joi.string().valid('Client', 'Employee', 'Vendor', 'Third Party', 'Other').optional(),
    subjectId: Joi.string().trim().optional(),
    subjectName: Joi.string().trim().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().trim().optional(),
    jurisdiction: Joi.string().trim().optional()
  }).optional(),
  dataSubjectRequest: Joi.object({
    requestType: Joi.string().valid('Access', 'Rectification', 'Erasure', 'Restriction', 'Portability', 'Object', 'Opt-Out', 'Do Not Sell', 'Other').optional(),
    requestDate: Joi.date().optional(),
    requestMethod: Joi.string().trim().optional(),
    requestDetails: Joi.string().trim().optional(),
    responseDeadline: Joi.date().optional()
  }).optional(),
  gdprCompliance: Joi.object({
    lawfulBasis: Joi.string().valid('Consent', 'Contract', 'Legal Obligation', 'Vital Interests', 'Public Interest', 'Legitimate Interest').optional(),
    dataCategories: Joi.array().items(
      Joi.object({
        category: Joi.string().trim(),
        description: Joi.string().trim().optional(),
        sensitivity: Joi.string().trim().optional()
      })
    ).optional()
  }).optional(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Overdue', 'Rejected', 'Escalated', 'Closed', 'Archived').default('Pending'),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  assignedTo: Joi.string().trim().allow('').max(100),
  submittedDate: Joi.date().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for liability insurance/claim creation
const createLiabilityInsuranceSchema = Joi.object({
  recordType: Joi.string().required().valid(
    'Insurance Policy', 'Claim', 'Incident Report', 'Coverage Verification', 'Policy Renewal', 'Other'
  ),
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  insurancePolicy: Joi.object({
    policyNumber: Joi.string().trim().max(100).optional(),
    policyType: Joi.string().valid('Professional Liability', 'Malpractice', 'E&O', 'Cyber Liability', 'General Liability', 'Directors & Officers', 'Other').optional(),
    carrier: Joi.string().trim().optional(),
    effectiveDate: Joi.date().optional(),
    expirationDate: Joi.date().optional(),
    policyStatus: Joi.string().valid('Active', 'Expired', 'Pending Renewal', 'Cancelled', 'Under Review').optional(),
    coverageAmount: Joi.number().min(0).optional(),
    deductible: Joi.number().min(0).optional()
  }).optional(),
  claim: Joi.object({
    claimNumber: Joi.string().trim().optional(),
    claimType: Joi.string().valid('Professional Negligence', 'Breach of Duty', 'Conflict of Interest', 'Missed Deadline', 'Error or Omission', 'Breach of Contract', 'Other').optional(),
    claimStatus: Joi.string().valid('Reported', 'Under Investigation', 'Reserved', 'In Litigation', 'Settled', 'Closed', 'Denied').optional(),
    incidentDate: Joi.date().optional(),
    description: Joi.string().trim().optional()
  }).optional(),
  incidentReport: Joi.object({
    incidentType: Joi.string().trim().optional(),
    incidentDate: Joi.date().optional(),
    reportedBy: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    potentialLiability: Joi.boolean().optional()
  }).optional(),
  status: Joi.string().valid('Active', 'Pending', 'Under Review', 'Approved', 'Denied', 'Closed', 'Archived').default('Active'),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  assignedTo: Joi.string().trim().allow('').max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for audit log query
const auditLogQuerySchema = Joi.object({
  logType: Joi.string().valid('User Action', 'System Event', 'Data Access', 'Data Modification', 'Authentication', 'Authorization', 'Security Event', 'Compliance Event', 'Error', 'Other').optional(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  username: Joi.string().trim().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  resourceType: Joi.string().trim().optional(),
  severity: Joi.string().valid('Info', 'Low', 'Medium', 'High', 'Critical').optional(),
  status: Joi.string().valid('Success', 'Failed', 'Warning', 'Error', 'In Progress', 'Completed').optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(50)
});

// Validation schema for compliance report generation
const generateComplianceReportSchema = Joi.object({
  reportType: Joi.string().required().valid(
    'Ethics Compliance', 'Risk Assessment', 'Malpractice Prevention', 'Regulatory Compliance', 
    'Audit Trail', 'Privacy Compliance', 'Liability Management', 'Comprehensive'
  ),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  includeDetails: Joi.boolean().default(true),
  format: Joi.string().valid('JSON', 'PDF', 'CSV', 'Excel').default('JSON'),
  filters: Joi.object({
    status: Joi.array().items(Joi.string()).optional(),
    priority: Joi.array().items(Joi.string()).optional(),
    assignedTo: Joi.string().trim().optional(),
    jurisdiction: Joi.string().trim().optional()
  }).optional(),
  generatedBy: Joi.string().required().trim().min(2).max(100)
});

module.exports = {
  createComplianceRecordSchema,
  createRiskAssessmentSchema,
  createMalpracticeCheckSchema,
  createRegulatoryComplianceSchema,
  createPrivacyComplianceSchema,
  createLiabilityInsuranceSchema,
  auditLogQuerySchema,
  generateComplianceReportSchema
};
