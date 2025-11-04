/**
 * Client Validation Schemas using Joi
 * Input validation for client CRM operations
 */

import Joi from 'joi';

// Validation schema for client creation
const createClientSchema = Joi.object({
  firstName: Joi.string().required().trim().min(1).max(100),
  lastName: Joi.string().required().trim().min(1).max(100),
  middleName: Joi.string().trim().allow('').max(100),
  type: Joi.string().required().valid('Individual', 'Business', 'Non-Profit', 'Government', 'Other'),
  companyName: Joi.string().trim().allow('').max(200),
  email: Joi.string().email().trim().lowercase().allow(''),
  phone: Joi.string().trim().allow('').max(20),
  mobile: Joi.string().trim().allow('').max(20),
  fax: Joi.string().trim().allow('').max(20),
  address: Joi.object({
    street: Joi.string().trim().allow('').max(200),
    suite: Joi.string().trim().allow('').max(50),
    city: Joi.string().trim().allow('').max(100),
    state: Joi.string().trim().allow('').max(50),
    zipCode: Joi.string().trim().allow('').max(20),
    country: Joi.string().trim().allow('').max(100)
  }).optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Prospect', 'Former', 'Blacklisted').default('Prospect'),
  category: Joi.string().trim().allow('').max(100),
  industry: Joi.string().trim().allow('').max(100),
  source: Joi.string().valid('Referral', 'Website', 'Advertisement', 'Social Media', 'Walk-in', 'Existing Client', 'Other'),
  referredBy: Joi.string().trim().allow('').max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  assignedAttorney: Joi.string().trim().allow('').max(100),
  assignedParalegal: Joi.string().trim().allow('').max(100),
  notes: Joi.string().trim().allow('').max(5000),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for updating client
const updateClientSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100),
  lastName: Joi.string().trim().min(1).max(100),
  middleName: Joi.string().trim().allow('').max(100),
  companyName: Joi.string().trim().allow('').max(200),
  email: Joi.string().email().trim().lowercase().allow(''),
  phone: Joi.string().trim().allow('').max(20),
  mobile: Joi.string().trim().allow('').max(20),
  address: Joi.object({
    street: Joi.string().trim().allow('').max(200),
    suite: Joi.string().trim().allow('').max(50),
    city: Joi.string().trim().allow('').max(100),
    state: Joi.string().trim().allow('').max(50),
    zipCode: Joi.string().trim().allow('').max(20),
    country: Joi.string().trim().allow('').max(100)
  }).optional(),
  category: Joi.string().trim().allow('').max(100),
  industry: Joi.string().trim().allow('').max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  assignedAttorney: Joi.string().trim().allow('').max(100),
  notes: Joi.string().trim().allow('').max(5000),
  lastModifiedBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for communication history
const createCommunicationSchema = Joi.object({
  type: Joi.string().required().valid('Email', 'Phone Call', 'Meeting', 'Text Message', 'Video Conference', 'Mail', 'Portal Message', 'Other'),
  direction: Joi.string().valid('Inbound', 'Outbound').default('Outbound'),
  subject: Joi.string().required().trim().min(1).max(200),
  content: Joi.string().trim().allow('').max(10000),
  summary: Joi.string().trim().allow('').max(1000),
  communicationDate: Joi.date().default(Date.now),
  duration: Joi.number().min(0).max(1440), // max 24 hours in minutes
  caseNumber: Joi.string().trim().allow(''),
  status: Joi.string().valid('Completed', 'Pending Follow-up', 'Scheduled', 'Cancelled').default('Completed'),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Urgent').default('Medium'),
  requiresFollowUp: Joi.boolean().default(false),
  followUpDate: Joi.date().optional(),
  category: Joi.string().trim().allow('').max(100),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  billable: Joi.boolean().default(false),
  billedAmount: Joi.number().min(0).default(0),
  initiatedBy: Joi.string().required().trim().min(2).max(100),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for portal access
const portalAccessSchema = Joi.object({
  enabled: Joi.boolean().required(),
  username: Joi.string().trim().min(3).max(50).when('enabled', {
    is: true,
    then: Joi.required()
  }),
  email: Joi.string().email().required(),
  updatedBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for client onboarding
const onboardingSchema = Joi.object({
  intakeFormData: Joi.object().required(),
  assignedAttorney: Joi.string().trim().max(100),
  assignedParalegal: Joi.string().trim().max(100),
  welcomeEmailSent: Joi.boolean().default(false),
  onboardingCompleted: Joi.boolean().default(false),
  createdBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for billing information
const billingInfoSchema = Joi.object({
  billingPreference: Joi.string().valid('Email', 'Mail', 'Portal', 'Both').default('Email'),
  paymentTerms: Joi.string().valid('Due on Receipt', 'Net 15', 'Net 30', 'Net 60', 'Custom').default('Net 30'),
  paymentMethod: Joi.string().valid('Credit Card', 'Check', 'Wire Transfer', 'ACH', 'Cash', 'Other'),
  creditLimit: Joi.number().min(0).default(0),
  creditStatus: Joi.string().valid('Good', 'Hold', 'Bad').default('Good'),
  updatedBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for conflict checking
const conflictCheckSchema = Joi.object({
  clientId: Joi.string().required(),
  opposingParties: Joi.array().items(Joi.string().trim()).optional(),
  relatedEntities: Joi.array().items(Joi.string().trim()).optional(),
  matterDescription: Joi.string().trim().allow('').max(1000),
  checkedBy: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for client feedback
const clientFeedbackSchema = Joi.object({
  type: Joi.string().required().valid('Survey', 'Review', 'Complaint', 'Compliment', 'Suggestion', 'Other'),
  overallSatisfaction: Joi.number().min(1).max(10),
  communicationRating: Joi.number().min(1).max(10),
  responsivenessRating: Joi.number().min(1).max(10),
  expertiseRating: Joi.number().min(1).max(10),
  valueRating: Joi.number().min(1).max(10),
  comments: Joi.string().trim().allow('').max(2000),
  npsScore: Joi.number().min(0).max(10),
  wouldRecommend: Joi.boolean(),
  caseNumber: Joi.string().trim().allow(''),
  attorneyReviewed: Joi.string().trim().allow('').max(100),
  collectionMethod: Joi.string().valid('Email Survey', 'Phone Interview', 'In-Person', 'Portal', 'Third-Party', 'Other').default('Email Survey'),
  createdBy: Joi.string().trim().max(100)
});

// Validation schema for search
const searchClientsSchema = Joi.object({
  searchTerm: Joi.string().trim().min(1).max(100),
  status: Joi.string().valid('Active', 'Inactive', 'Prospect', 'Former', 'Blacklisted'),
  assignedAttorney: Joi.string().trim().max(100),
  category: Joi.string().trim().max(100),
  tags: Joi.array().items(Joi.string().trim()),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export {

  createClientSchema,
  updateClientSchema,
  createCommunicationSchema,
  portalAccessSchema,
  onboardingSchema,
  billingInfoSchema,
  conflictCheckSchema,
  clientFeedbackSchema,
  searchClientsSchema

};
