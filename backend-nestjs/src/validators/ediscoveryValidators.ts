/**
 * eDiscovery Validators
 * Joi validation schemas for all eDiscovery endpoints
 */

import Joi from 'joi';

// Evidence Collection & Preservation
const collectEvidenceSchema = Joi.object({
  caseId: Joi.string().required(),
  caseNumber: Joi.string().required(),
  evidenceType: Joi.string().valid('Email', 'Document', 'Database', 'System Files', 'Social Media', 'Audio', 'Video', 'Image', 'Mobile Device', 'Other').required(),
  description: Joi.string().required(),
  sourceSystem: Joi.string().allow(''),
  collectionMethod: Joi.string().valid('Forensic Imaging', 'Live Collection', 'Network Capture', 'Cloud Export', 'Manual Collection', 'Other'),
  custodian: Joi.string().required(),
  custodianEmail: Joi.string().email().allow(''),
  custodianDepartment: Joi.string().allow(''),
  fileSize: Joi.number().min(0),
  checksum: Joi.string().allow(''),
  collectedBy: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  notes: Joi.string().allow('')
});

// Document Review Assignment
const assignReviewSchema = Joi.object({
  caseId: Joi.string().required(),
  caseNumber: Joi.string().required(),
  documentId: Joi.string(),
  evidenceId: Joi.string(),
  documentTitle: Joi.string().allow(''),
  documentType: Joi.string().allow(''),
  batesNumber: Joi.string().allow(''),
  assignedTo: Joi.string().required(),
  assignedBy: Joi.string().required(),
  dueDate: Joi.date().iso(),
  batchId: Joi.string().allow(''),
  batchName: Joi.string().allow('')
});

// Complete Review
const completeReviewSchema = Joi.object({
  relevance: Joi.string().valid('Relevant', 'Not Relevant', 'Potentially Relevant', 'Privileged', 'Needs Second Review').required(),
  privilege: Joi.string().valid('None', 'Attorney-Client', 'Work Product', 'Trade Secret', 'Other'),
  confidentiality: Joi.string().valid('Public', 'Internal', 'Confidential', 'Highly Confidential'),
  responsiveness: Joi.string().valid('Responsive', 'Non-Responsive', 'Partially Responsive'),
  issues: Joi.array().items(Joi.object({
    issueCode: Joi.string(),
    issueDescription: Joi.string()
  })),
  tags: Joi.array().items(Joi.string()),
  produceDocument: Joi.boolean(),
  productionNotes: Joi.string().allow(''),
  redactionRequired: Joi.boolean(),
  reviewNotes: Joi.string().allow(''),
  timeSpentMinutes: Joi.number().min(0)
});

// ESI Processing
const processESISchema = Joi.object({
  caseId: Joi.string().required(),
  evidenceIds: Joi.array().items(Joi.string()).min(1).required(),
  processingType: Joi.string().valid('De-duplication', 'Text Extraction', 'Metadata Extraction', 'File Extraction', 'Full Processing').required(),
  processedBy: Joi.string().required(),
  extractText: Joi.boolean().default(true),
  extractMetadata: Joi.boolean().default(true),
  deduplication: Joi.boolean().default(true)
});

// Privilege Log Entry
const createPrivilegeLogSchema = Joi.object({
  caseId: Joi.string().required(),
  caseNumber: Joi.string().required(),
  documentId: Joi.string(),
  evidenceId: Joi.string(),
  batesNumber: Joi.string().allow(''),
  documentDate: Joi.date().iso(),
  documentType: Joi.string().allow(''),
  privilegeType: Joi.string().valid('Attorney-Client', 'Work Product', 'Trade Secret', 'Settlement Negotiations', 'Joint Defense', 'Other').required(),
  privilegeBasis: Joi.string().required(),
  author: Joi.string().required(),
  authorRole: Joi.string().allow(''),
  recipients: Joi.array().items(Joi.object({
    name: Joi.string(),
    role: Joi.string(),
    email: Joi.string().email()
  })),
  documentDescription: Joi.string().required(),
  subject: Joi.string().allow(''),
  attorney: Joi.string().required(),
  lawFirm: Joi.string().allow(''),
  attorneyRole: Joi.string().allow(''),
  containsLegalAdvice: Joi.boolean().default(true),
  legalAdviceDescription: Joi.string().allow(''),
  identifiedBy: Joi.string().required(),
  notes: Joi.string().allow('')
});

// Production Creation
const createProductionSchema = Joi.object({
  productionName: Joi.string().required(),
  caseId: Joi.string().required(),
  caseNumber: Joi.string().required(),
  productionType: Joi.string().valid('Initial', 'Supplemental', 'Rolling', 'Final').default('Initial'),
  productionFormat: Joi.string().valid('Native', 'TIFF', 'PDF', 'Paper', 'Load File', 'Mixed').required(),
  batesPrefix: Joi.string().required(),
  batesStartNumber: Joi.number().min(1).required(),
  producedTo: Joi.string().required(),
  recipientFirm: Joi.string().allow(''),
  recipientEmail: Joi.string().email().allow(''),
  recipientAddress: Joi.string().allow(''),
  dueDate: Joi.date().iso(),
  deliveryMethod: Joi.string().valid('Electronic', 'Physical', 'Secure Portal', 'FTP', 'Mail', 'Hand Delivery').default('Electronic'),
  includeMetadata: Joi.boolean().default(true),
  metadataFields: Joi.array().items(Joi.string()),
  createdBy: Joi.string().required(),
  notes: Joi.string().allow('')
});

// Evidence Tagging & Coding
const tagEvidenceSchema = Joi.object({
  evidenceId: Joi.string(),
  documentReviewId: Joi.string(),
  tags: Joi.array().items(Joi.string()).min(1),
  issues: Joi.array().items(Joi.object({
    issueCode: Joi.string().required(),
    issueDescription: Joi.string()
  })),
  relevance: Joi.string().valid('Relevant', 'Potentially Relevant', 'Not Relevant', 'Privileged', 'Pending Review'),
  confidentialityLevel: Joi.string().valid('Public', 'Internal', 'Confidential', 'Highly Confidential'),
  taggedBy: Joi.string().required()
});

// Legal Hold Creation
const createLegalHoldSchema = Joi.object({
  holdName: Joi.string().required(),
  caseId: Joi.string().required(),
  caseNumber: Joi.string().required(),
  description: Joi.string().required(),
  legalBasis: Joi.string().required(),
  scope: Joi.string().required(),
  effectiveDate: Joi.date().iso().default(() => new Date()),
  dataTypes: Joi.array().items(Joi.string().valid('Email', 'Documents', 'Database', 'Social Media', 'Text Messages', 'Voice Mail', 'Calendar', 'Instant Messages', 'Other')),
  dataSources: Joi.array().items(Joi.string()),
  preservationInstructions: Joi.string().allow(''),
  custodians: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    department: Joi.string().allow(''),
    title: Joi.string().allow('')
  })).min(1).required(),
  notificationTemplate: Joi.string().allow(''),
  notificationContent: Joi.string().allow(''),
  notificationMethod: Joi.string().valid('Email', 'In Person', 'Mail', 'System').default('Email'),
  reminderFrequency: Joi.string().valid('None', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly').default('Monthly'),
  createdBy: Joi.string().required(),
  notes: Joi.string().allow('')
});

// Legal Hold Acknowledgment
const acknowledgeLegalHoldSchema = Joi.object({
  custodianEmail: Joi.string().email().required(),
  acknowledgmentMethod: Joi.string().valid('Email', 'In Person', 'Phone', 'System').default('Email')
});

export {

  collectEvidenceSchema,
  assignReviewSchema,
  completeReviewSchema,
  processESISchema,
  createPrivilegeLogSchema,
  createProductionSchema,
  tagEvidenceSchema,
  createLegalHoldSchema,
  acknowledgeLegalHoldSchema

};
