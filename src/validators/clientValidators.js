/**
 * Client Validation Schemas using Joi
 * Input validation for client relationship management operations
 */

const Joi = require('joi');

// Validation schema for client creation
const createClientSchema = Joi.object({
  firstName: Joi.string().required().trim().min(2).max(100),
  lastName: Joi.string().required().trim().min(2).max(100),
  email: Joi.string().required().trim().email(),
  phone: Joi.string().trim().allow('').max(20),
  alternatePhone: Joi.string().trim().allow('').max(20),
  
  address: Joi.object({
    street: Joi.string().trim().allow('').max(200),
    city: Joi.string().trim().allow('').max(100),
    state: Joi.string().trim().allow('').max(50),
    zipCode: Joi.string().trim().allow('').max(20),
    country: Joi.string().trim().allow('').max(100)
  }).optional(),
  
  clientType: Joi.string().valid('Individual', 'Business', 'Corporation', 'Non-Profit', 'Government', 'Other').default('Individual'),
  clientCategory: Joi.string().valid('VIP', 'Standard', 'Pro Bono', 'Referral', 'Retainer').default('Standard'),
  industryType: Joi.string().trim().allow('').max(100),
  
  primaryAttorney: Joi.string().trim().allow('').max(100),
  referralSource: Joi.string().trim().allow('').max(200),
  referredBy: Joi.string().trim().allow('').max(100),
  
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().allow('').max(2000),
  createdBy: Joi.string().required().trim()
});

// Validation schema for client intake
const clientIntakeSchema = Joi.object({
  firstName: Joi.string().required().trim().min(2).max(100),
  lastName: Joi.string().required().trim().min(2).max(100),
  email: Joi.string().required().trim().email(),
  phone: Joi.string().required().trim().max(20),
  
  address: Joi.object({
    street: Joi.string().required().trim().max(200),
    city: Joi.string().required().trim().max(100),
    state: Joi.string().required().trim().max(50),
    zipCode: Joi.string().required().trim().max(20),
    country: Joi.string().trim().default('USA').max(100)
  }).required(),
  
  clientType: Joi.string().required().valid('Individual', 'Business', 'Corporation', 'Non-Profit', 'Government', 'Other'),
  matterType: Joi.string().required().trim().min(3).max(200),
  matterDescription: Joi.string().required().trim().min(10).max(2000),
  
  referralSource: Joi.string().trim().allow('').max(200),
  referredBy: Joi.string().trim().allow('').max(100),
  
  intakeFormData: Joi.object().optional(),
  documentsProvided: Joi.array().items(Joi.string()).optional(),
  
  createdBy: Joi.string().required().trim()
});

// Validation schema for communication logging
const logCommunicationSchema = Joi.object({
  clientId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  communicationType: Joi.string().required().valid('Email', 'Phone Call', 'Meeting', 'Video Call', 'Text Message', 'Letter', 'Portal Message', 'Other'),
  direction: Joi.string().required().valid('Inbound', 'Outbound'),
  subject: Joi.string().trim().allow('').max(200),
  description: Joi.string().trim().allow('').max(2000),
  notes: Joi.string().trim().allow('').max(2000),
  
  communicationDate: Joi.date().default(Date.now),
  duration: Joi.number().min(0).optional(),
  
  initiatedBy: Joi.string().required().trim(),
  attendees: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      role: Joi.string().optional()
    })
  ).optional(),
  
  category: Joi.string().valid('Case Discussion', 'Billing', 'Status Update', 'Consultation', 'Document Review', 'Strategy', 'Other').default('Case Discussion'),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Urgent').default('Medium'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  
  relatedCaseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  followUpRequired: Joi.boolean().default(false),
  followUpDate: Joi.date().optional(),
  
  billable: Joi.boolean().default(false),
  billableHours: Joi.number().min(0).default(0)
});

// Validation schema for billing information
const updateBillingSchema = Joi.object({
  clientId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  
  paymentMethod: Joi.object({
    type: Joi.string().required().valid('Credit Card', 'Bank Transfer', 'Check', 'Cash', 'Wire Transfer', 'Retainer', 'Other'),
    isPrimary: Joi.boolean().default(true),
    details: Joi.object().optional()
  }).optional(),
  
  billingCycle: Joi.string().valid('Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Per Matter', 'Hourly', 'Retainer').optional(),
  invoiceDelivery: Joi.string().valid('Email', 'Mail', 'Portal', 'Both').optional(),
  invoiceEmail: Joi.string().email().optional(),
  
  creditLimit: Joi.number().min(0).optional(),
  paymentTerms: Joi.string().valid('Due on Receipt', 'Net 15', 'Net 30', 'Net 60', 'Net 90', 'Custom').optional(),
  customTermsDays: Joi.number().min(1).optional(),
  
  autoBilling: Joi.object({
    enabled: Joi.boolean().default(false),
    dayOfMonth: Joi.number().min(1).max(28).optional(),
    minimumAmount: Joi.number().min(0).optional()
  }).optional(),
  
  notes: Joi.string().trim().allow('').max(1000),
  updatedBy: Joi.string().required().trim()
});

// Validation schema for conflict check
const conflictCheckSchema = Joi.object({
  clientId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  checkType: Joi.string().required().valid('Initial Intake', 'New Matter', 'Periodic Review', 'Merger/Acquisition', 'Other'),
  
  relatedParties: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim(),
      relationship: Joi.string().valid('Opposing Party', 'Co-Party', 'Spouse', 'Business Partner', 'Family Member', 'Employee', 'Other'),
      details: Joi.string().trim().allow('').max(500)
    })
  ).min(1).required(),
  
  opposingParties: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim(),
      entityType: Joi.string().valid('Individual', 'Business', 'Corporation', 'Government'),
      industry: Joi.string().trim().allow('').max(100)
    })
  ).optional(),
  
  relatedMatterId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  matterDescription: Joi.string().trim().allow('').max(1000),
  
  performedBy: Joi.string().required().trim(),
  notes: Joi.string().trim().allow('').max(2000)
});

// Validation schema for feedback submission
const submitFeedbackSchema = Joi.object({
  clientId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  feedbackType: Joi.string().required().valid('Survey', 'NPS', 'Review', 'Complaint', 'Compliment', 'Suggestion', 'Exit Interview', 'Other'),
  
  surveyName: Joi.string().trim().allow('').max(200),
  
  overallSatisfaction: Joi.number().min(0).max(10).optional(),
  npsScore: Joi.number().min(0).max(10).optional(),
  
  ratings: Joi.object({
    communication: Joi.number().min(0).max(10).optional(),
    responsiveness: Joi.number().min(0).max(10).optional(),
    expertise: Joi.number().min(0).max(10).optional(),
    valueForMoney: Joi.number().min(0).max(10).optional(),
    overallExperience: Joi.number().min(0).max(10).optional()
  }).optional(),
  
  comments: Joi.string().trim().allow('').max(2000),
  strengths: Joi.array().items(Joi.string().trim()).optional(),
  areasForImprovement: Joi.array().items(Joi.string().trim()).optional(),
  
  relatedCaseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  
  referralLikelihood: Joi.number().min(0).max(10).optional(),
  wouldUseAgain: Joi.boolean().optional(),
  
  responseMethod: Joi.string().valid('Email', 'Phone', 'Portal', 'In Person', 'Survey Link', 'Other').optional(),
  
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().trim().allow('').max(100)
});

// Validation schema for portal access management
const portalAccessSchema = Joi.object({
  clientId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  action: Joi.string().required().valid('enable', 'disable', 'reset', 'update'),
  
  email: Joi.string().email().optional(),
  sendInvitation: Joi.boolean().default(true),
  
  updatedBy: Joi.string().required().trim()
});

// Validation schema for client update
const updateClientSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).optional(),
  lastName: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().email().optional(),
  phone: Joi.string().trim().allow('').max(20).optional(),
  alternatePhone: Joi.string().trim().allow('').max(20).optional(),
  
  address: Joi.object({
    street: Joi.string().trim().allow('').max(200),
    city: Joi.string().trim().allow('').max(100),
    state: Joi.string().trim().allow('').max(50),
    zipCode: Joi.string().trim().allow('').max(20),
    country: Joi.string().trim().allow('').max(100)
  }).optional(),
  
  clientType: Joi.string().valid('Individual', 'Business', 'Corporation', 'Non-Profit', 'Government', 'Other').optional(),
  clientCategory: Joi.string().valid('VIP', 'Standard', 'Pro Bono', 'Referral', 'Retainer').optional(),
  industryType: Joi.string().trim().allow('').max(100).optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Prospective', 'Former', 'Suspended').optional(),
  
  primaryAttorney: Joi.string().trim().allow('').max(100).optional(),
  
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().allow('').max(2000).optional(),
  
  updatedBy: Joi.string().required().trim()
});

module.exports = {
  createClientSchema,
  clientIntakeSchema,
  logCommunicationSchema,
  updateBillingSchema,
  conflictCheckSchema,
  submitFeedbackSchema,
  portalAccessSchema,
  updateClientSchema
};
