/**
 * Research Validation Schemas using Joi
 * Input validation for legal research operations
 */

const Joi = require('joi');

// Validation schema for research integration creation
const createIntegrationSchema = Joi.object({
  platform: Joi.string().required().valid('Westlaw', 'LexisNexis', 'Bloomberg Law', 'Fastcase', 'Casetext', 'Other'),
  apiKey: Joi.string().trim().optional(),
  accountId: Joi.string().trim().optional(),
  accessLevel: Joi.string().valid('Basic', 'Standard', 'Premium', 'Enterprise').default('Standard'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for knowledge base article creation
const createKnowledgeBaseSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  content: Joi.string().required().min(10),
  summary: Joi.string().trim().max(500).optional(),
  category: Joi.string().required().valid('Best Practice', 'Procedure', 'Template', 'Case Study', 'Legal Analysis', 'Training', 'Policy', 'Other'),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  visibility: Joi.string().valid('Public', 'Team Only', 'Restricted', 'Private').default('Team Only'),
  status: Joi.string().valid('Draft', 'Published', 'Archived', 'Under Review').default('Draft'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for case law entry creation
const createCaseLawSchema = Joi.object({
  caseName: Joi.string().required().trim().min(3).max(300),
  citation: Joi.string().required().trim().min(3).max(200),
  court: Joi.string().required().trim().min(2).max(200),
  jurisdiction: Joi.string().required().trim().min(2).max(100),
  level: Joi.string().valid('Supreme Court', 'Court of Appeals', 'District Court', 'State Supreme Court', 'State Appellate', 'Trial Court', 'Other').optional(),
  decisionDate: Joi.date().required(),
  summary: Joi.string().required().min(10),
  fullText: Joi.string().optional(),
  holdings: Joi.array().items(Joi.string().trim()).optional(),
  keyIssues: Joi.array().items(Joi.string().trim()).optional(),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  legalTopics: Joi.array().items(Joi.string().trim()).optional(),
  keywords: Joi.array().items(Joi.string().trim()).optional(),
  precedentValue: Joi.string().valid('Binding', 'Persuasive', 'Distinguishable', 'Limited').default('Persuasive'),
  outcome: Joi.string().valid('Affirmed', 'Reversed', 'Remanded', 'Vacated', 'Dismissed', 'Modified', 'Other').optional(),
  addedBy: Joi.string().required().trim()
});

// Validation schema for legal memorandum creation
const createMemorandumSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  subject: Joi.string().required().trim().min(3).max(300),
  question: Joi.string().required().min(10),
  briefAnswer: Joi.string().required().min(10),
  facts: Joi.string().required().min(10),
  discussion: Joi.string().required().min(10),
  conclusion: Joi.string().required().min(10),
  memoType: Joi.string().required().valid('Research Memo', 'Opinion Letter', 'Case Brief', 'Legal Analysis', 'Strategy Memo', 'Client Advice', 'Other'),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  author: Joi.string().required().trim(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  matter: Joi.string().trim().optional(),
  confidentiality: Joi.string().valid('Privileged', 'Work Product', 'Confidential', 'Internal', 'Public').default('Privileged'),
  visibility: Joi.string().valid('Public', 'Team Only', 'Restricted', 'Private').default('Team Only'),
  status: Joi.string().valid('Draft', 'Under Review', 'Approved', 'Final', 'Archived').default('Draft'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for citation creation
const createCitationSchema = Joi.object({
  citationText: Joi.string().required().trim().min(3).max(500),
  citationType: Joi.string().required().valid('Case', 'Statute', 'Regulation', 'Constitution', 'Book', 'Law Review', 'Journal', 'Treatise', 'Other'),
  caseName: Joi.string().trim().max(300).optional(),
  reporter: Joi.string().trim().max(100).optional(),
  volume: Joi.string().trim().max(50).optional(),
  page: Joi.string().trim().max(50).optional(),
  court: Joi.string().trim().max(200).optional(),
  year: Joi.number().min(1600).max(2100).optional(),
  author: Joi.string().trim().max(200).optional(),
  title: Joi.string().trim().max(300).optional(),
  publication: Joi.string().trim().max(200).optional(),
  publisher: Joi.string().trim().max(200).optional(),
  url: Joi.string().uri().optional(),
  practiceArea: Joi.string().trim().max(100).optional(),
  jurisdiction: Joi.string().trim().max(100).optional(),
  topics: Joi.array().items(Joi.string().trim()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for practice area resource creation
const createResourceSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().required().min(10),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  subCategory: Joi.string().trim().max(100).optional(),
  resourceType: Joi.string().required().valid('Form', 'Template', 'Checklist', 'Guide', 'Statute', 'Regulation', 'Court Rule', 'Expert Directory', 'Reference Material', 'Other'),
  content: Joi.string().optional(),
  contentType: Joi.string().valid('Text', 'Document', 'Link', 'Video', 'Audio', 'Presentation').default('Text'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  keywords: Joi.array().items(Joi.string().trim()).optional(),
  jurisdiction: Joi.string().trim().max(100).optional(),
  visibility: Joi.string().valid('Public', 'Team Only', 'Practice Area Only', 'Restricted', 'Private').default('Practice Area Only'),
  status: Joi.string().valid('Draft', 'Published', 'Under Review', 'Archived', 'Deprecated').default('Draft'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for legal update creation
const createUpdateSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  summary: Joi.string().required().min(10),
  fullText: Joi.string().optional(),
  updateType: Joi.string().required().valid('Legislative', 'Regulatory', 'Case Law', 'Court Rule', 'Administrative', 'Industry Alert', 'Practice Alert', 'Other'),
  source: Joi.string().required().trim().min(2).max(200),
  sourceUrl: Joi.string().uri().optional(),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  jurisdiction: Joi.string().required().trim().min(2).max(100),
  topics: Joi.array().items(Joi.string().trim()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  impactLevel: Joi.string().valid('Critical', 'High', 'Medium', 'Low', 'Informational').default('Medium'),
  urgency: Joi.string().valid('Immediate', 'High', 'Normal', 'Low').default('Normal'),
  effectiveDate: Joi.date().optional(),
  publishedDate: Joi.date().required(),
  expirationDate: Joi.date().optional(),
  deadlineDate: Joi.date().optional(),
  requiresAction: Joi.boolean().default(false),
  status: Joi.string().valid('Draft', 'Published', 'Archived', 'Superseded').default('Published'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for research project creation
const createProjectSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().required().min(10),
  projectType: Joi.string().required().valid('Case Research', 'Legal Analysis', 'Literature Review', 'Statutory Research', 'Regulatory Research', 'General Research', 'Other'),
  practiceArea: Joi.string().required().trim().min(2).max(100),
  jurisdiction: Joi.string().trim().max(100).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  matter: Joi.string().trim().optional(),
  owner: Joi.string().required().trim(),
  dueDate: Joi.date().optional(),
  visibility: Joi.string().valid('Public', 'Team Only', 'Private', 'Restricted').default('Team Only'),
  status: Joi.string().valid('Active', 'In Progress', 'On Hold', 'Completed', 'Archived').default('Active'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for search queries
const searchSchema = Joi.object({
  query: Joi.string().required().trim().min(1).max(500),
  practiceArea: Joi.string().trim().max(100).optional(),
  jurisdiction: Joi.string().trim().max(100).optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

// Validation schema for adding team member to project
const addTeamMemberSchema = Joi.object({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  name: Joi.string().required().trim().min(2).max(100),
  role: Joi.string().valid('Owner', 'Editor', 'Contributor', 'Viewer').default('Contributor')
});

// Validation schema for adding research item
const addResearchItemSchema = Joi.object({
  itemType: Joi.string().required().valid('Case Law', 'Statute', 'Article', 'Memo', 'Note', 'Citation', 'Document', 'Link'),
  title: Joi.string().required().trim().min(3).max(300),
  content: Joi.string().optional(),
  reference: Joi.object().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  addedBy: Joi.string().required().trim()
});

// Validation schema for adding annotation
const addAnnotationSchema = Joi.object({
  itemId: Joi.string().required(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  username: Joi.string().required().trim().min(2).max(100),
  text: Joi.string().required().min(1).max(2000),
  highlightedText: Joi.string().trim().max(1000).optional()
});

// Validation schema for adding comment
const addCommentSchema = Joi.object({
  itemId: Joi.string().required(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  username: Joi.string().required().trim().min(2).max(100),
  text: Joi.string().required().min(1).max(2000)
});

module.exports = {
  createIntegrationSchema,
  createKnowledgeBaseSchema,
  createCaseLawSchema,
  createMemorandumSchema,
  createCitationSchema,
  createResourceSchema,
  createUpdateSchema,
  createProjectSchema,
  searchSchema,
  addTeamMemberSchema,
  addResearchItemSchema,
  addAnnotationSchema,
  addCommentSchema
};
