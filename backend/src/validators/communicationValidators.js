/**
 * Communication Validation Schemas using Joi
 * Input validation for communication and collaboration operations
 */

const Joi = require('joi');

// Validation schema for message creation
const createMessageSchema = Joi.object({
  subject: Joi.string().trim().allow('').max(300),
  body: Joi.string().required().min(1).max(10000),
  messageType: Joi.string().required().valid('Internal', 'Client', 'Email', 'SMS', 'Video Conference', 'File Share', 'System'),
  sender: Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().optional()
  }).required(),
  recipients: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('To', 'CC', 'BCC').default('To')
  })).min(1).required(),
  threadId: Joi.string().optional(),
  inReplyTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  priority: Joi.string().valid('High', 'Normal', 'Low').default('Normal'),
  labels: Joi.array().items(Joi.string().trim()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  isConfidential: Joi.boolean().default(false)
});

// Validation schema for message update
const updateMessageSchema = Joi.object({
  subject: Joi.string().trim().allow('').max(300).optional(),
  body: Joi.string().min(1).max(10000).optional(),
  status: Joi.string().valid('Draft', 'Sent', 'Delivered', 'Read', 'Archived', 'Deleted').optional(),
  isStarred: Joi.boolean().optional(),
  isFlagged: Joi.boolean().optional(),
  labels: Joi.array().items(Joi.string().trim()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional()
});

// Validation schema for attachment
const addAttachmentSchema = Joi.object({
  fileName: Joi.string().required().trim().max(255),
  fileSize: Joi.number().required().min(0).max(50 * 1024 * 1024), // Max 50MB
  fileType: Joi.string().required().trim(),
  url: Joi.string().required().uri()
});

// Validation schema for template creation
const createTemplateSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(1000),
  subject: Joi.string().trim().allow('').max(300),
  body: Joi.string().required().min(1).max(50000),
  templateType: Joi.string().required().valid('Email', 'Letter', 'SMS', 'Notice', 'Agreement', 'Invoice', 'General'),
  category: Joi.string().trim().allow('').max(100),
  variables: Joi.array().items(Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().trim().allow(''),
    defaultValue: Joi.string().trim().allow(''),
    required: Joi.boolean().default(false)
  })).optional(),
  format: Joi.string().valid('Plain Text', 'HTML', 'Markdown', 'Rich Text').default('HTML'),
  visibility: Joi.string().valid('Public', 'Private', 'Shared').default('Private'),
  sharedWith: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    role: Joi.string().required()
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for template update
const updateTemplateSchema = Joi.object({
  name: Joi.string().trim().min(3).max(200).optional(),
  description: Joi.string().trim().allow('').max(1000).optional(),
  subject: Joi.string().trim().allow('').max(300).optional(),
  body: Joi.string().min(1).max(50000).optional(),
  category: Joi.string().trim().allow('').max(100).optional(),
  status: Joi.string().valid('Active', 'Draft', 'Archived').optional(),
  lastModifiedBy: Joi.string().required().trim()
});

// Validation schema for template rendering
const renderTemplateSchema = Joi.object({
  templateId: Joi.string().required(),
  variables: Joi.object().pattern(Joi.string(), Joi.any()).required()
});

// Validation schema for collaboration space
const collaborationSpaceSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(1000),
  spaceType: Joi.string().required().valid('Case', 'Project', 'Team', 'Client', 'General'),
  members: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    role: Joi.string().valid('Owner', 'Admin', 'Member', 'Viewer').default('Member')
  })).min(1).required(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  isPrivate: Joi.boolean().default(false),
  createdBy: Joi.string().required().trim()
});

// Validation schema for video conference
const videoConferenceSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(1000),
  scheduledTime: Joi.date().required(),
  duration: Joi.number().required().min(15).max(480), // 15 min to 8 hours
  participants: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('Host', 'Co-Host', 'Participant').default('Participant')
  })).min(1).required(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  recordingEnabled: Joi.boolean().default(false),
  hostId: Joi.string().required()
});

module.exports = {
  createMessageSchema,
  updateMessageSchema,
  addAttachmentSchema,
  createTemplateSchema,
  updateTemplateSchema,
  renderTemplateSchema,
  collaborationSpaceSchema,
  videoConferenceSchema
};
