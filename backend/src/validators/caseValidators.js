/**
 * Case Validation Schemas using Joi
 * Input validation for case management operations
 */

const Joi = require('joi');

// Validation schema for case creation
const createCaseSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  clientName: Joi.string().required().trim().min(2).max(100),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  matterType: Joi.string().required().valid(
    'Civil', 'Criminal', 'Corporate', 'Family', 'Immigration', 
    'Real Estate', 'Intellectual Property', 'Tax', 'Employment', 'Other'
  ),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  caseType: Joi.string().trim().allow('').max(100),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  assignedTo: Joi.string().trim().allow('').max(100),
  filingDate: Joi.date().optional(),
  dueDate: Joi.date().optional(),
  estimatedValue: Joi.number().min(0).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for case assignment
const assignCaseSchema = Joi.object({
  assignedTo: Joi.string().required().trim().min(2).max(100),
  assignedBy: Joi.string().required().trim().min(2).max(100),
  reason: Joi.string().trim().allow('').max(500)
});

// Validation schema for case status update
const updateStatusSchema = Joi.object({
  status: Joi.string().required().valid(
    'Open', 'In Progress', 'On Hold', 'Pending Review', 'Closed', 'Archived'
  ),
  updatedBy: Joi.string().required().trim(),
  notes: Joi.string().trim().allow('').max(1000)
});

// Validation schema for case categorization
const categorizeCaseSchema = Joi.object({
  practiceArea: Joi.string().trim().min(2).max(100).optional(),
  caseType: Joi.string().trim().max(100).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  updatedBy: Joi.string().required().trim()
});

// Validation schema for case closing
const closeCaseSchema = Joi.object({
  closedBy: Joi.string().required().trim().min(2).max(100),
  outcome: Joi.string().required().trim().min(3).max(500),
  resolution: Joi.string().trim().allow('').max(2000),
  archiveImmediately: Joi.boolean().default(false)
});

// Validation schema for adding case notes
const createNoteSchema = Joi.object({
  title: Joi.string().trim().allow('').max(200),
  content: Joi.string().required().trim().min(1).max(10000),
  noteType: Joi.string().valid(
    'General', 'Meeting', 'Phone Call', 'Email', 'Court Appearance', 
    'Research', 'Client Communication', 'Internal', 'Other'
  ).default('General'),
  category: Joi.string().trim().allow('').max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
  visibility: Joi.string().valid('Public', 'Private', 'Team Only', 'Client Visible').default('Team Only'),
  createdBy: Joi.string().required().trim().min(2).max(100),
  pinned: Joi.boolean().default(false)
});

// Validation schema for timeline events
const createTimelineEventSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(1000),
  eventType: Joi.string().required().valid(
    'Case Created', 'Status Change', 'Assignment', 'Court Hearing', 'Filing',
    'Deadline', 'Meeting', 'Phone Call', 'Email', 'Document Filed',
    'Payment Received', 'Milestone', 'Note Added', 'Case Closed', 'Custom'
  ),
  eventDate: Joi.date().required(),
  isDeadline: Joi.boolean().default(false),
  category: Joi.string().trim().allow('').max(100),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  createdBy: Joi.string().trim().max(100),
  location: Joi.string().trim().allow('').max(200),
  notes: Joi.string().trim().allow('').max(1000)
});

module.exports = {
  createCaseSchema,
  assignCaseSchema,
  updateStatusSchema,
  categorizeCaseSchema,
  closeCaseSchema,
  createNoteSchema,
  createTimelineEventSchema
};
