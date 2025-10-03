/**
 * Court Validation Schemas using Joi
 * Input validation for court and docket management operations
 */

const Joi = require('joi');

// Validation schema for court docket creation
const createDocketSchema = Joi.object({
  courtCaseNumber: Joi.string().required().trim().min(3).max(100),
  title: Joi.string().required().trim().min(3).max(500),
  courtInfo: Joi.object({
    courtName: Joi.string().required().trim().min(3).max(200),
    jurisdiction: Joi.string().trim().allow('').max(100),
    courtType: Joi.string().valid('Federal', 'State', 'Appellate', 'Supreme', 'District', 'Municipal', 'Bankruptcy', 'Other'),
    division: Joi.string().trim().allow('').max(100),
    location: Joi.string().trim().allow('').max(200)
  }).required(),
  caseType: Joi.string().required().valid('Civil', 'Criminal', 'Bankruptcy', 'Appeals', 'Family', 'Probate', 'Other'),
  filingDate: Joi.date().required(),
  parties: Joi.object({
    plaintiffs: Joi.array().items(Joi.object({
      name: Joi.string().trim().required(),
      role: Joi.string().trim().allow(''),
      representedBy: Joi.string().trim().allow(''),
      attorney: Joi.string().trim().allow('')
    })),
    defendants: Joi.array().items(Joi.object({
      name: Joi.string().trim().required(),
      role: Joi.string().trim().allow(''),
      representedBy: Joi.string().trim().allow(''),
      attorney: Joi.string().trim().allow('')
    })),
    otherParties: Joi.array().items(Joi.object({
      name: Joi.string().trim(),
      role: Joi.string().trim(),
      party: Joi.string().trim()
    }))
  }).optional(),
  judge: Joi.object({
    name: Joi.string().trim().allow(''),
    chambersPhone: Joi.string().trim().allow(''),
    preferences: Joi.string().trim().allow(''),
    notes: Joi.string().trim().allow('')
  }).optional(),
  caseId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  caseNumber: Joi.string().trim().allow('').max(50),
  createdBy: Joi.string().required().trim()
});

// Validation schema for docket entry
const addDocketEntrySchema = Joi.object({
  entryDate: Joi.date().required(),
  filedDate: Joi.date().optional(),
  documentType: Joi.string().trim().required().max(200),
  description: Joi.string().trim().required().min(10).max(2000),
  filedBy: Joi.string().trim().required().max(200),
  documentUrl: Joi.string().uri().allow('').max(500),
  pageCount: Joi.number().min(0).optional(),
  isSealed: Joi.boolean().default(false),
  notes: Joi.string().trim().allow('').max(1000)
});

// Validation schema for hearing
const addHearingSchema = Joi.object({
  hearingDate: Joi.date().required(),
  hearingType: Joi.string().trim().required().max(200),
  location: Joi.string().trim().allow('').max(200),
  judgeAssigned: Joi.string().trim().allow('').max(100),
  purpose: Joi.string().trim().allow('').max(1000),
  result: Joi.string().trim().allow('').max(1000),
  notes: Joi.string().trim().allow('').max(2000)
});

// Validation schema for e-filing
const eFilingSchema = Joi.object({
  documentType: Joi.string().trim().required().max(200),
  documentUrl: Joi.string().uri().required(),
  notes: Joi.string().trim().allow('').max(1000)
});

// Validation schema for opposing counsel
const addOpposingCounselSchema = Joi.object({
  name: Joi.string().trim().required().min(2).max(100),
  firmName: Joi.string().trim().allow('').max(200),
  email: Joi.string().email().allow('').max(100),
  phone: Joi.string().trim().allow('').max(50),
  address: Joi.string().trim().allow('').max(500),
  representsParty: Joi.string().trim().allow('').max(200),
  barNumber: Joi.string().trim().allow('').max(50),
  notes: Joi.string().trim().allow('').max(1000)
});

module.exports = {
  createDocketSchema,
  addDocketEntrySchema,
  addHearingSchema,
  eFilingSchema,
  addOpposingCounselSchema
};
