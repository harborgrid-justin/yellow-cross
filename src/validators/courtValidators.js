/**
 * Court & Docket Management - Validation Schemas
 * Joi validation schemas for all court-related operations
 */

const Joi = require('joi');

// Validation schema for court docket creation
const createDocketSchema = Joi.object({
  docketNumber: Joi.string().required().trim().min(3).max(100),
  caseNumber: Joi.string().required().trim().min(3).max(100),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  courtName: Joi.string().required().trim().min(2).max(200),
  courtType: Joi.string().required().valid('Federal', 'State', 'District', 'Appeals', 'Supreme', 'Municipal', 'County', 'Other'),
  jurisdiction: Joi.string().required().trim().min(2).max(100),
  divisionNumber: Joi.string().trim().max(50).optional(),
  caseTitle: Joi.string().required().trim().min(3).max(500),
  caseType: Joi.string().required().valid('Civil', 'Criminal', 'Family', 'Probate', 'Bankruptcy', 'Appeals', 'Small Claims', 'Other'),
  natureOfSuit: Joi.string().trim().max(200).optional(),
  plaintiff: Joi.string().required().trim().min(2).max(200),
  defendant: Joi.string().required().trim().min(2).max(200),
  filingDate: Joi.date().required(),
  judgeName: Joi.string().trim().max(200).optional(),
  courtroom: Joi.string().trim().max(100).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().max(5000).allow('').optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for adding docket entry
const addDocketEntrySchema = Joi.object({
  filingDate: Joi.date().required(),
  docketText: Joi.string().required().trim().min(3).max(2000),
  documentType: Joi.string().trim().max(100).optional(),
  filedBy: Joi.string().trim().max(200).optional(),
  documentUrl: Joi.string().uri().optional(),
  pageCount: Joi.number().min(0).max(10000).optional(),
  isSealed: Joi.boolean().default(false),
  addedBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for electronic filing creation
const createElectronicFilingSchema = Joi.object({
  filingId: Joi.string().required().trim().min(3).max(100),
  courtName: Joi.string().required().trim().min(2).max(200),
  courtSystem: Joi.string().required().valid('Federal', 'State', 'CM/ECF', 'Tyler Technologies', 'Other'),
  caseNumber: Joi.string().required().trim().min(3).max(100),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  filingType: Joi.string().required().valid('Motion', 'Brief', 'Pleading', 'Notice', 'Order', 'Declaration', 'Exhibit', 'Response', 'Reply', 'Other'),
  documentTitle: Joi.string().required().trim().min(3).max(300),
  filingParty: Joi.string().required().valid('Plaintiff', 'Defendant', 'Petitioner', 'Respondent', 'Intervenor', 'Amicus', 'Third Party'),
  attorneyName: Joi.string().required().trim().min(2).max(200),
  attorneyBarNumber: Joi.string().trim().max(50).optional(),
  firmName: Joi.string().trim().max(200).optional(),
  attorneyEmail: Joi.string().email().optional(),
  filingFee: Joi.number().min(0).default(0),
  urgentFiling: Joi.boolean().default(false),
  confidential: Joi.boolean().default(false),
  sealedFiling: Joi.boolean().default(false),
  notes: Joi.string().trim().max(5000).allow('').optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for court rule creation
const createCourtRuleSchema = Joi.object({
  ruleId: Joi.string().required().trim().min(3).max(100),
  ruleNumber: Joi.string().required().trim().min(1).max(50),
  title: Joi.string().required().trim().min(3).max(300),
  courtName: Joi.string().required().trim().min(2).max(200),
  courtType: Joi.string().required().valid('Federal', 'State', 'District', 'Appeals', 'Supreme', 'Municipal', 'County', 'Other'),
  jurisdiction: Joi.string().required().trim().min(2).max(100),
  ruleType: Joi.string().required().valid('Civil Procedure', 'Criminal Procedure', 'Appellate Procedure', 'Evidence', 'Local Rule', 'Standing Order', 'Administrative Order', 'Practice Direction', 'Other'),
  fullText: Joi.string().required().min(10),
  summary: Joi.string().trim().max(1000).allow('').optional(),
  effectiveDate: Joi.date().required(),
  status: Joi.string().valid('Active', 'Superseded', 'Repealed', 'Proposed', 'Under Review').default('Active'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  keywords: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for opposing counsel creation
const createOpposingCounselSchema = Joi.object({
  counselId: Joi.string().required().trim().min(3).max(100),
  firstName: Joi.string().required().trim().min(1).max(100),
  lastName: Joi.string().required().trim().min(1).max(100),
  middleName: Joi.string().trim().max(100).allow('').optional(),
  firmName: Joi.string().required().trim().min(2).max(200),
  primaryEmail: Joi.string().required().email(),
  secondaryEmail: Joi.string().email().optional(),
  officePhone: Joi.string().trim().max(50).optional(),
  mobilePhone: Joi.string().trim().max(50).optional(),
  barNumber: Joi.string().trim().max(50).optional(),
  practiceAreas: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Retired', 'Deceased').default('Active'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().max(5000).allow('').optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for adding opposing counsel communication
const addCommunicationSchema = Joi.object({
  date: Joi.date().default(Date.now),
  type: Joi.string().required().valid('Email', 'Phone Call', 'Letter', 'Meeting', 'Court Appearance', 'Deposition', 'Other'),
  subject: Joi.string().trim().max(200).optional(),
  summary: Joi.string().required().trim().min(3).max(2000),
  outcome: Joi.string().trim().max(500).optional(),
  caseNumber: Joi.string().trim().max(100).optional(),
  recordedBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for judge creation
const createJudgeSchema = Joi.object({
  judgeId: Joi.string().required().trim().min(3).max(100),
  firstName: Joi.string().required().trim().min(1).max(100),
  lastName: Joi.string().required().trim().min(1).max(100),
  middleName: Joi.string().trim().max(100).allow('').optional(),
  honorific: Joi.string().valid('Judge', 'Justice', 'Magistrate Judge', 'Chief Judge', 'Chief Justice', 'Associate Justice').default('Judge'),
  court: Joi.string().required().trim().min(2).max(200),
  courtType: Joi.string().required().valid('Federal', 'State', 'District', 'Appeals', 'Supreme', 'Municipal', 'County', 'Administrative', 'Other'),
  jurisdiction: Joi.string().required().trim().min(2).max(100),
  status: Joi.string().valid('Active', 'Senior Status', 'Retired', 'Deceased', 'Inactive').default('Active'),
  appointmentDate: Joi.date().optional(),
  biography: Joi.string().trim().max(10000).allow('').optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for courtroom calendar event creation
const createCalendarEventSchema = Joi.object({
  eventId: Joi.string().required().trim().min(3).max(100),
  courtName: Joi.string().required().trim().min(2).max(200),
  courtroom: Joi.string().required().trim().min(1).max(100),
  judgeName: Joi.string().required().trim().min(2).max(200),
  eventType: Joi.string().required().valid('Hearing', 'Trial', 'Motion Hearing', 'Status Conference', 'Settlement Conference', 'Pretrial Conference', 'Sentencing', 'Arraignment', 'Oral Arguments', 'Emergency Hearing', 'Calendar Call', 'Chambers Conference', 'Other'),
  eventTitle: Joi.string().required().trim().min(3).max(300),
  eventDescription: Joi.string().trim().max(2000).allow('').optional(),
  scheduledDate: Joi.date().required(),
  scheduledTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  estimatedDuration: Joi.number().required().min(1).max(1440), // max 24 hours in minutes
  caseNumber: Joi.string().required().trim().min(3).max(100),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseTitle: Joi.string().trim().max(500).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Emergency').default('Medium'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().max(5000).allow('').optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for docket alert creation
const createDocketAlertSchema = Joi.object({
  alertId: Joi.string().required().trim().min(3).max(100),
  alertName: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().max(500).allow('').optional(),
  targetType: Joi.string().required().valid('Case', 'Docket', 'Judge', 'Opposing Counsel', 'Court', 'Party Name', 'Custom'),
  caseNumber: Joi.string().trim().max(100).when('targetType', {
    is: Joi.valid('Case', 'Docket'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  courtName: Joi.string().trim().max(200).optional(),
  frequency: Joi.string().required().valid('Real-Time', 'Hourly', 'Daily', 'Weekly', 'Custom').default('Real-Time'),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().max(5000).allow('').optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for court document creation
const createCourtDocumentSchema = Joi.object({
  documentId: Joi.string().required().trim().min(3).max(100),
  courtName: Joi.string().required().trim().min(2).max(200),
  caseNumber: Joi.string().required().trim().min(3).max(100),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  documentTitle: Joi.string().required().trim().min(3).max(300),
  documentType: Joi.string().required().valid('Motion', 'Order', 'Brief', 'Pleading', 'Notice', 'Declaration', 'Exhibit', 'Transcript', 'Judgment', 'Opinion', 'Minute Entry', 'Correspondence', 'Stipulation', 'Response', 'Reply', 'Petition', 'Complaint', 'Answer', 'Other'),
  filingDate: Joi.date().required(),
  filedBy: Joi.string().trim().max(200).optional(),
  filingParty: Joi.string().valid('Plaintiff', 'Defendant', 'Court', 'Petitioner', 'Respondent', 'Third Party', 'Other').optional(),
  pageCount: Joi.number().min(0).max(10000).optional(),
  accessLevel: Joi.string().valid('Public', 'Restricted', 'Sealed', 'Confidential').default('Public'),
  isSealed: Joi.boolean().default(false),
  importance: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().max(5000).allow('').optional(),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for document retrieval
const retrieveDocumentSchema = Joi.object({
  retrievedBy: Joi.string().required().trim().min(2).max(100),
  retrievalSource: Joi.string().valid('PACER', 'State System', 'Court Website', 'Manual Upload', 'API', 'Email', 'Other').default('PACER'),
  retrievalCost: Joi.number().min(0).optional()
});

module.exports = {
  createDocketSchema,
  addDocketEntrySchema,
  createElectronicFilingSchema,
  createCourtRuleSchema,
  createOpposingCounselSchema,
  addCommunicationSchema,
  createJudgeSchema,
  createCalendarEventSchema,
  createDocketAlertSchema,
  createCourtDocumentSchema,
  retrieveDocumentSchema
};
