/**
 * Contract Validation Schemas using Joi
 * Input validation for contract management operations
 */

const Joi = require('joi');

// Validation schema for contract creation
const createContractSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(300),
  description: Joi.string().trim().allow('').max(2000),
  contractType: Joi.string().required().valid(
    'Service Agreement', 'Employment Contract', 'Non-Disclosure Agreement', 
    'Purchase Agreement', 'Lease Agreement', 'Partnership Agreement', 
    'Consulting Agreement', 'License Agreement', 'Master Service Agreement',
    'Statement of Work', 'Amendment', 'Other'
  ),
  category: Joi.string().trim().allow('').max(100),
  practiceArea: Joi.string().trim().allow('').max(100),
  jurisdiction: Joi.string().trim().allow('').max(100),
  governingLaw: Joi.string().trim().allow('').max(200),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  
  // Parties
  parties: Joi.array().items(Joi.object({
    partyType: Joi.string().required().valid('Client', 'Vendor', 'Supplier', 'Partner', 'Customer', 'Service Provider', 'Other'),
    name: Joi.string().required().trim(),
    entityType: Joi.string().valid('Individual', 'Corporation', 'LLC', 'Partnership', 'Government', 'Non-Profit', 'Other').optional(),
    contactPerson: Joi.string().trim().allow('').optional(),
    email: Joi.string().email().allow('').optional(),
    phone: Joi.string().trim().allow('').optional(),
    address: Joi.string().trim().allow('').optional(),
    signatureRequired: Joi.boolean().default(true)
  })).min(1).required(),
  
  // Dates
  effectiveDate: Joi.date().optional(),
  expirationDate: Joi.date().optional(),
  noticePeriodDays: Joi.number().min(0).default(30),
  
  // Financial
  contractValue: Joi.object({
    amount: Joi.number().min(0).required(),
    currency: Joi.string().default('USD')
  }).optional(),
  paymentTerms: Joi.string().trim().allow('').max(500),
  billingFrequency: Joi.string().valid('One-Time', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Custom').optional(),
  
  // Renewal
  autoRenewal: Joi.boolean().default(false),
  renewalTermLength: Joi.object({
    value: Joi.number().min(1).required(),
    unit: Joi.string().valid('Days', 'Months', 'Years').required()
  }).optional(),
  
  // Template
  fromTemplate: Joi.boolean().default(false),
  templateId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  
  // Relations
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().allow('').max(50),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientName: Joi.string().trim().allow('').max(200),
  
  // Assignment
  assignedTo: Joi.string().trim().allow('').max(100),
  contractOwner: Joi.string().trim().allow('').max(100),
  department: Joi.string().trim().allow('').max(100),
  
  // Approval
  requiresApproval: Joi.boolean().default(true),
  
  // Access
  visibility: Joi.string().valid('Public', 'Private', 'Team Only', 'Department').default('Team Only'),
  confidential: Joi.boolean().default(false),
  
  // Metadata
  createdBy: Joi.string().required().trim(),
  internalNotes: Joi.string().trim().allow('').max(2000)
});

// Validation schema for contract review submission
const submitReviewSchema = Joi.object({
  reviewType: Joi.string().required().valid('Legal Review', 'Financial Review', 'Compliance Review', 'Management Approval', 'General Review'),
  assignedReviewers: Joi.array().items(Joi.string().trim()).min(1).required(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  dueDate: Joi.date().optional(),
  reviewNotes: Joi.string().trim().allow('').max(1000),
  submittedBy: Joi.string().required().trim()
});

// Validation schema for contract approval
const approveContractSchema = Joi.object({
  decision: Joi.string().required().valid('Approved', 'Rejected', 'Conditional'),
  approvedBy: Joi.string().required().trim(),
  comments: Joi.string().trim().allow('').max(1000),
  conditions: Joi.string().trim().allow('').max(1000),
  requiresChanges: Joi.boolean().default(false)
});

// Validation schema for negotiation submission
const createNegotiationSchema = Joi.object({
  subject: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  negotiationType: Joi.string().required().valid('Clause Modification', 'Term Change', 'Pricing', 'Timeline', 'Scope', 'General', 'Other'),
  proposedBy: Joi.string().required().trim(),
  partyType: Joi.string().required().valid('Internal', 'External', 'Client', 'Vendor'),
  assignedTo: Joi.string().trim().allow('').max(100),
  
  changes: Joi.array().items(Joi.object({
    changeType: Joi.string().required().valid('Addition', 'Deletion', 'Modification', 'Redline'),
    section: Joi.string().trim().allow(''),
    clause: Joi.string().trim().allow(''),
    originalText: Joi.string().trim().allow(''),
    proposedText: Joi.string().trim().allow(''),
    position: Joi.object({
      startLine: Joi.number().min(1).optional(),
      endLine: Joi.number().min(1).optional(),
      page: Joi.number().min(1).optional()
    }).optional()
  })).optional(),
  
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  dueDate: Joi.date().optional(),
  impactLevel: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  
  financialImpact: Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string().default('USD'),
    description: Joi.string().trim().allow('')
  }).optional(),
  
  legalImpact: Joi.string().trim().allow('').max(1000),
  businessImpact: Joi.string().trim().allow('').max(1000),
  internalNotes: Joi.string().trim().allow('').max(2000)
});

// Validation schema for negotiation response
const respondNegotiationSchema = Joi.object({
  respondedBy: Joi.string().required().trim(),
  responseText: Joi.string().required().trim().max(2000),
  decision: Joi.string().required().valid('Accepted', 'Rejected', 'Counter Proposal', 'Need Discussion'),
  counterProposal: Joi.object({
    proposedText: Joi.string().required().trim(),
    rationale: Joi.string().trim().allow('')
  }).optional()
});

// Validation schema for contract status update
const updateContractStatusSchema = Joi.object({
  status: Joi.string().required().valid(
    'Draft', 'Under Review', 'In Negotiation', 'Awaiting Approval', 
    'Awaiting Signature', 'Executed', 'Active', 'Expired', 
    'Terminated', 'Renewed', 'Archived'
  ),
  updatedBy: Joi.string().required().trim(),
  notes: Joi.string().trim().allow('').max(1000)
});

// Validation schema for contract lifecycle stage update
const updateLifecycleStageSchema = Joi.object({
  lifecycleStage: Joi.string().required().valid('Pre-Execution', 'Execution', 'Post-Execution', 'Renewal', 'Termination'),
  updatedBy: Joi.string().required().trim(),
  notes: Joi.string().trim().allow('').max(500)
});

// Validation schema for contract renewal
const renewContractSchema = Joi.object({
  newExpirationDate: Joi.date().required(),
  renewedBy: Joi.string().required().trim(),
  terms: Joi.string().trim().allow('').max(1000),
  contractValue: Joi.object({
    amount: Joi.number().min(0).required(),
    currency: Joi.string().default('USD')
  }).optional(),
  autoRenewal: Joi.boolean().optional()
});

// Validation schema for adding contract obligation
const addObligationSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().required().trim().max(2000),
  obligationType: Joi.string().required().valid(
    'Deliverable', 'Payment', 'Reporting', 'Audit', 'Insurance', 
    'Confidentiality', 'Data Protection', 'Service Level', 
    'Milestone', 'Notification', 'Renewal Notice', 'Other'
  ),
  category: Joi.string().trim().allow('').max(100),
  responsibleParty: Joi.string().required().valid('Client', 'Vendor', 'Internal', 'Third Party'),
  responsiblePerson: Joi.string().trim().allow('').max(100),
  assignedTo: Joi.string().trim().allow('').max(100),
  dueDate: Joi.date().required(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  frequency: Joi.string().valid('One-Time', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual').default('One-Time'),
  
  deliverableDetails: Joi.object({
    deliverableType: Joi.string().trim(),
    quantity: Joi.number().min(0),
    unit: Joi.string().trim(),
    specifications: Joi.string().trim(),
    acceptanceCriteria: Joi.string().trim()
  }).optional(),
  
  paymentDetails: Joi.object({
    amount: Joi.number().min(0).required(),
    currency: Joi.string().default('USD'),
    paymentMethod: Joi.string().trim(),
    invoiceNumber: Joi.string().trim(),
    paymentReference: Joi.string().trim()
  }).optional(),
  
  complianceRequired: Joi.boolean().default(true),
  isCritical: Joi.boolean().default(false),
  createdBy: Joi.string().required().trim()
});

// Validation schema for updating obligation status
const updateObligationStatusSchema = Joi.object({
  status: Joi.string().required().valid('Pending', 'In Progress', 'Completed', 'Overdue', 'Waived', 'Not Applicable'),
  updatedBy: Joi.string().required().trim(),
  notes: Joi.string().trim().allow('').max(1000),
  completionPercentage: Joi.number().min(0).max(100).optional(),
  verifiedBy: Joi.string().trim().allow('').optional(),
  verificationNotes: Joi.string().trim().allow('').max(500)
});

// Validation schema for compliance check
const checkComplianceSchema = Joi.object({
  contractId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  includeObligations: Joi.boolean().default(true),
  includeRisks: Joi.boolean().default(true),
  checkedBy: Joi.string().required().trim()
});

// Validation schema for creating contract clause
const createClauseSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(1000),
  category: Joi.string().required().valid(
    'Confidentiality', 'Payment Terms', 'Termination', 'Liability', 
    'Indemnification', 'Intellectual Property', 'Warranty', 'Force Majeure',
    'Dispute Resolution', 'Governing Law', 'Non-Compete', 'Assignment',
    'Amendment', 'Severability', 'Notices', 'General', 'Other'
  ),
  subCategory: Joi.string().trim().allow('').max(100),
  practiceArea: Joi.string().trim().allow('').max(100),
  jurisdiction: Joi.string().trim().allow('').max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  
  content: Joi.string().required().trim(),
  contentFormat: Joi.string().valid('Plain Text', 'Rich Text', 'HTML', 'Markdown').default('Plain Text'),
  
  variables: Joi.array().items(Joi.object({
    name: Joi.string().required().trim(),
    label: Joi.string().trim(),
    type: Joi.string().valid('Text', 'Number', 'Date', 'Select', 'Boolean').default('Text'),
    description: Joi.string().trim().allow(''),
    required: Joi.boolean().default(false),
    defaultValue: Joi.string().trim().allow(''),
    options: Joi.array().items(Joi.string().trim()).optional()
  })).optional(),
  
  riskLevel: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
  requiresReview: Joi.boolean().default(false),
  visibility: Joi.string().valid('Public', 'Private', 'Team', 'Organization').default('Team'),
  createdBy: Joi.string().required().trim(),
  internalNotes: Joi.string().trim().allow('').max(1000),
  legalNotes: Joi.string().trim().allow('').max(1000)
});

// Validation schema for contract analytics filters
const analyticsFiltersSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  status: Joi.array().items(Joi.string()).optional(),
  contractType: Joi.array().items(Joi.string()).optional(),
  practiceArea: Joi.string().trim().allow('').optional(),
  assignedTo: Joi.string().trim().allow('').optional(),
  groupBy: Joi.string().valid('status', 'type', 'practiceArea', 'month', 'quarter').default('status'),
  includeArchived: Joi.boolean().default(false)
});

// Validation schema for contract amendment
const addAmendmentSchema = Joi.object({
  description: Joi.string().required().trim().max(1000),
  effectiveDate: Joi.date().required(),
  documentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  createdBy: Joi.string().required().trim(),
  changes: Joi.string().trim().allow('').max(2000)
});

// Validation schema for risk assessment
const addRiskFactorSchema = Joi.object({
  factor: Joi.string().required().trim().max(200),
  severity: Joi.string().required().valid('Low', 'Medium', 'High', 'Critical'),
  mitigation: Joi.string().trim().allow('').max(1000),
  identifiedBy: Joi.string().required().trim()
});

module.exports = {
  createContractSchema,
  submitReviewSchema,
  approveContractSchema,
  createNegotiationSchema,
  respondNegotiationSchema,
  updateContractStatusSchema,
  updateLifecycleStageSchema,
  renewContractSchema,
  addObligationSchema,
  updateObligationStatusSchema,
  checkComplianceSchema,
  createClauseSchema,
  analyticsFiltersSchema,
  addAmendmentSchema,
  addRiskFactorSchema
};
