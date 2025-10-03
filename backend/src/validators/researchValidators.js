/**
 * Research Validation Schemas using Joi
 * Input validation for legal research operations
 */

const Joi = require('joi');

// Validation schema for research item creation
const createResearchItemSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(500),
  summary: Joi.string().trim().allow('').max(5000),
  itemType: Joi.string().required().valid('Case Law', 'Statute', 'Regulation', 'Legal Memo', 'Article', 'Practice Guide', 'Form', 'Other'),
  citation: Joi.object({
    full: Joi.string().trim().allow('').max(500),
    shortForm: Joi.string().trim().allow('').max(200),
    parallelCitations: Joi.array().items(Joi.string().trim())
  }).optional(),
  jurisdiction: Joi.string().trim().allow('').max(100),
  court: Joi.string().trim().allow('').max(200),
  decisionDate: Joi.date().optional(),
  filedDate: Joi.date().optional(),
  fullText: Joi.string().allow('').max(100000),
  excerpt: Joi.string().trim().allow('').max(5000),
  keyPoints: Joi.array().items(Joi.string().trim()).optional(),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  topics: Joi.array().items(Joi.string().trim()).optional(),
  legalIssues: Joi.array().items(Joi.string().trim()).optional(),
  caseDetails: Joi.object({
    parties: Joi.object({
      plaintiff: Joi.string().trim().allow(''),
      defendant: Joi.string().trim().allow('')
    }),
    caseNumber: Joi.string().trim().allow(''),
    judgeNames: Joi.array().items(Joi.string().trim()),
    disposition: Joi.string().trim().allow(''),
    outcome: Joi.string().trim().allow('')
  }).optional(),
  relevance: Joi.string().valid('High', 'Medium', 'Low').default('Medium'),
  precedentialValue: Joi.string().valid('Binding', 'Persuasive', 'Not Precedential').default('Persuasive'),
  analysis: Joi.string().trim().allow('').max(10000),
  notes: Joi.string().trim().allow('').max(5000),
  externalLinks: Joi.array().items(Joi.object({
    source: Joi.string().valid('Westlaw', 'LexisNexis', 'Google Scholar', 'Court Website', 'Other'),
    url: Joi.string().uri().allow(''),
    documentId: Joi.string().trim().allow('')
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  keywords: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for research search
const searchResearchSchema = Joi.object({
  query: Joi.string().required().trim().min(1),
  practiceArea: Joi.string().trim().optional(),
  itemType: Joi.string().valid('Case Law', 'Statute', 'Regulation', 'Legal Memo', 'Article', 'Practice Guide', 'Form', 'Other').optional(),
  jurisdiction: Joi.string().trim().optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  relevance: Joi.string().valid('High', 'Medium', 'Low').optional(),
  limit: Joi.number().min(1).max(100).default(20)
});

// Validation schema for bookmark
const addBookmarkSchema = Joi.object({
  userId: Joi.string().required().trim(),
  notes: Joi.string().trim().allow('').max(1000)
});

// Validation schema for sharing
const shareResearchSchema = Joi.object({
  userId: Joi.string().required().trim(),
  permission: Joi.string().valid('View', 'Edit').default('View')
});

module.exports = {
  createResearchItemSchema,
  searchResearchSchema,
  addBookmarkSchema,
  shareResearchSchema
};
