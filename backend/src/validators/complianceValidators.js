/**
 * Compliance Validation Schemas using Joi
 * Input validation for compliance and risk management operations
 */

const Joi = require('joi');

// Validation schema for compliance item creation
const createComplianceItemSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(300),
  description: Joi.string().trim().allow('').max(2000),
  complianceType: Joi.string().required().valid('Ethics', 'Regulatory', 'Risk Assessment', 'Audit', 'Malpractice Prevention', 'Data Privacy', 'Professional Liability', 'Conflict Check'),
  regulatoryBody: Joi.string().valid('ABA', 'State Bar', 'Federal Agency', 'Court', 'Internal', 'Other').optional(),
  jurisdiction: Joi.string().trim().allow('').max(100),
  priority: Joi.string().valid('Critical', 'High', 'Medium', 'Low').default('Medium'),
  riskLevel: Joi.string().valid('Critical', 'High', 'Medium', 'Low', 'Minimal').default('Medium'),
  riskFactors: Joi.array().items(Joi.object({
    factor: Joi.string().trim().required(),
    impact: Joi.string().valid('Critical', 'High', 'Medium', 'Low').required(),
    likelihood: Joi.string().valid('Very Likely', 'Likely', 'Possible', 'Unlikely').required(),
    mitigation: Joi.string().trim().allow('').max(1000)
  })).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  dueDate: Joi.date().optional(),
  nextReviewDate: Joi.date().optional(),
  requirements: Joi.array().items(Joi.object({
    requirement: Joi.string().trim().required(),
    status: Joi.string().valid('Met', 'Not Met', 'In Progress', 'N/A').default('Not Met'),
    dueDate: Joi.date().optional(),
    evidence: Joi.string().trim().allow(''),
    notes: Joi.string().trim().allow('')
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  category: Joi.string().trim().allow('').max(100),
  notes: Joi.string().trim().allow('').max(5000),
  assignedTo: Joi.string().trim().allow('').max(100),
  createdBy: Joi.string().required().trim()
});

// Validation schema for updating compliance status
const updateComplianceStatusSchema = Joi.object({
  status: Joi.string().required().valid('Active', 'Under Review', 'Compliant', 'Non-Compliant', 'Remediated', 'Closed'),
  notes: Joi.string().trim().allow('').max(1000),
  modifiedBy: Joi.string().required().trim()
});

// Validation schema for risk assessment
const addRiskFactorSchema = Joi.object({
  factor: Joi.string().trim().required().min(3).max(500),
  impact: Joi.string().required().valid('Critical', 'High', 'Medium', 'Low'),
  likelihood: Joi.string().required().valid('Very Likely', 'Likely', 'Possible', 'Unlikely'),
  mitigation: Joi.string().trim().allow('').max(1000)
});

// Validation schema for remediation plan
const remediationPlanSchema = Joi.object({
  plan: Joi.string().required().trim().min(10).max(5000),
  startDate: Joi.date().optional(),
  responsibleParty: Joi.string().trim().required().max(100),
  notes: Joi.string().trim().allow('').max(2000)
});

// Validation schema for audit trail entry
const auditTrailSchema = Joi.object({
  action: Joi.string().required().trim().max(200),
  performedBy: Joi.string().required().trim().max(100),
  details: Joi.string().trim().allow('').max(2000),
  previousValue: Joi.string().trim().allow('').max(500),
  newValue: Joi.string().trim().allow('').max(500)
});

// Validation schema for compliance report
const complianceReportSchema = Joi.object({
  complianceType: Joi.string().valid('Ethics', 'Regulatory', 'Risk Assessment', 'Audit', 'Malpractice Prevention', 'Data Privacy', 'Professional Liability', 'Conflict Check').optional(),
  status: Joi.string().valid('Active', 'Under Review', 'Compliant', 'Non-Compliant', 'Remediated', 'Closed').optional(),
  priority: Joi.string().valid('Critical', 'High', 'Medium', 'Low').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  includeResolved: Joi.boolean().default(false)
});

module.exports = {
  createComplianceItemSchema,
  updateComplianceStatusSchema,
  addRiskFactorSchema,
  remediationPlanSchema,
  auditTrailSchema,
  complianceReportSchema
};
