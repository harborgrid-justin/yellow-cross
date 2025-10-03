/**
 * Document Validation Schemas using Joi
 * Input validation for document management operations
 */

const Joi = require('joi');

// Validation schema for document upload
const uploadDocumentSchema = Joi.object({
  filename: Joi.string().required().trim().min(1).max(255),
  title: Joi.string().trim().allow('').max(200),
  description: Joi.string().trim().allow('').max(2000),
  fileType: Joi.string().required().trim(),
  fileSize: Joi.number().required().min(0).max(500 * 1024 * 1024), // Max 500MB
  mimeType: Joi.string().required().trim(),
  storagePath: Joi.string().trim().allow(''),
  cloudUrl: Joi.string().uri().trim().allow(''),
  checksum: Joi.string().trim().allow(''),
  category: Joi.string().valid('Pleadings', 'Contracts', 'Evidence', 'Correspondence', 'Research', 'Court Filings', 'Discovery', 'Other').default('Other'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  folderPath: Joi.string().trim().default('/'),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  visibility: Joi.string().valid('Public', 'Private', 'Team Only', 'Client Visible').default('Team Only'),
  extractedText: Joi.string().trim().allow('').max(100000),
  pageCount: Joi.number().min(0).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for document organization
const organizeDocumentSchema = Joi.object({
  folderPath: Joi.string().trim().optional(),
  folderId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  category: Joi.string().valid('Pleadings', 'Contracts', 'Evidence', 'Correspondence', 'Research', 'Court Filings', 'Discovery', 'Other').optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  title: Joi.string().trim().max(200).optional(),
  description: Joi.string().trim().max(2000).optional(),
  customMetadata: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  updatedBy: Joi.string().required().trim()
});

// Validation schema for document permissions
const permissionsSchema = Joi.object({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  username: Joi.string().required().trim().min(2).max(100),
  role: Joi.string().required().valid('Owner', 'Editor', 'Viewer', 'Reviewer'),
  grantedBy: Joi.string().required().trim()
});

// Validation schema for document search
const searchDocumentSchema = Joi.object({
  q: Joi.string().trim().min(1).max(500).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  category: Joi.string().valid('Pleadings', 'Contracts', 'Evidence', 'Correspondence', 'Research', 'Court Filings', 'Discovery', 'Other').optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().trim().optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  fileType: Joi.string().trim().optional(),
  minSize: Joi.number().min(0).optional(),
  maxSize: Joi.number().min(0).optional(),
  folderPath: Joi.string().trim().optional(),
  isTemplate: Joi.boolean().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

// Validation schema for version creation
const createVersionSchema = Joi.object({
  filename: Joi.string().required().trim().min(1).max(255),
  fileType: Joi.string().required().trim(),
  fileSize: Joi.number().required().min(0).max(500 * 1024 * 1024),
  mimeType: Joi.string().required().trim(),
  storagePath: Joi.string().trim().allow(''),
  cloudUrl: Joi.string().uri().trim().allow(''),
  checksum: Joi.string().trim().allow(''),
  changeType: Joi.string().valid('Minor Edit', 'Major Revision', 'Content Update', 'Format Change', 'Correction', 'Review Update').default('Minor Edit'),
  changeDescription: Joi.string().trim().allow('').max(1000),
  changeSummary: Joi.string().trim().allow('').max(500),
  createdBy: Joi.string().required().trim()
});

// Validation schema for template creation
const createTemplateSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  category: Joi.string().required().valid('Legal Document', 'Contract', 'Pleading', 'Motion', 'Brief', 'Form', 'Letter', 'Agreement', 'Discovery', 'Other'),
  subCategory: Joi.string().trim().allow('').max(100),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  jurisdiction: Joi.string().trim().allow('').max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  content: Joi.string().required(),
  contentFormat: Joi.string().valid('Plain Text', 'Rich Text', 'HTML', 'Markdown', 'JSON').default('Plain Text'),
  variables: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim(),
      label: Joi.string().required().trim(),
      type: Joi.string().valid('Text', 'Number', 'Date', 'Email', 'Phone', 'Address', 'Select', 'Multiline', 'Boolean').default('Text'),
      description: Joi.string().trim().allow(''),
      required: Joi.boolean().default(false),
      defaultValue: Joi.string().trim().allow(''),
      options: Joi.array().items(Joi.string().trim()).optional(),
      placeholder: Joi.string().trim().allow('')
    })
  ).optional(),
  visibility: Joi.string().valid('Public', 'Private', 'Team', 'Organization').default('Team'),
  allowCustomization: Joi.boolean().default(true),
  requiresApproval: Joi.boolean().default(false),
  outputFormats: Joi.array().items(Joi.string().valid('PDF', 'DOCX', 'TXT', 'HTML', 'RTF')).optional(),
  defaultOutputFormat: Joi.string().valid('PDF', 'DOCX', 'TXT', 'HTML', 'RTF').default('PDF'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for template automation
const automateDocumentSchema = Joi.object({
  templateId: Joi.string().required().trim(),
  variableValues: Joi.object().required(),
  outputFormat: Joi.string().valid('PDF', 'DOCX', 'TXT', 'HTML', 'RTF').default('PDF'),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  saveAsDocument: Joi.boolean().default(true),
  documentTitle: Joi.string().trim().max(200).optional(),
  folderPath: Joi.string().trim().default('/'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for collaboration
const collaborateDocumentSchema = Joi.object({
  action: Joi.string().required().valid('lock', 'unlock', 'checkout', 'checkin', 'comment', 'review'),
  comment: Joi.string().trim().allow('').max(2000),
  username: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for batch operations
const batchOperationSchema = Joi.object({
  documentIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).required(),
  operation: Joi.string().required().valid('move', 'copy', 'delete', 'archive', 'tag', 'categorize'),
  targetFolderPath: Joi.string().trim().when('operation', { is: Joi.valid('move', 'copy'), then: Joi.required() }),
  tags: Joi.array().items(Joi.string().trim()).when('operation', { is: 'tag', then: Joi.required() }),
  category: Joi.string().valid('Pleadings', 'Contracts', 'Evidence', 'Correspondence', 'Research', 'Court Filings', 'Discovery', 'Other').when('operation', { is: 'categorize', then: Joi.required() }),
  performedBy: Joi.string().required().trim()
});

module.exports = {
  uploadDocumentSchema,
  organizeDocumentSchema,
  permissionsSchema,
  searchDocumentSchema,
  createVersionSchema,
  createTemplateSchema,
  automateDocumentSchema,
  collaborateDocumentSchema,
  batchOperationSchema
};
