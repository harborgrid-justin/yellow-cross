/**
 * Contract Validation Schemas using Joi
 * Input validation for contract management operations
 */

import Joi from 'joi';

// Validation schema for contract creation
const createContractSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(500),
  description: Joi.string().trim().allow('').max(5000),
  contractType: Joi.string().required().valid('Service Agreement', 'Employment', 'NDA', 'Purchase Order', 'Lease', 'Partnership', 'License', 'Retainer', 'Vendor', 'Client Agreement', 'Other'),
  parties: Joi.array().items(Joi.object({
    partyType: Joi.string().required().valid('Client', 'Vendor', 'Partner', 'Employee', 'Other'),
    name: Joi.string().required().trim().min(2).max(200),
    role: Joi.string().trim().allow('').max(100),
    contactPerson: Joi.string().trim().allow('').max(100),
    email: Joi.string().email().allow('').max(100),
    phone: Joi.string().trim().allow('').max(50),
    address: Joi.string().trim().allow('').max(500),
    entityType: Joi.string().trim().allow('').max(100)
  })).min(2).required(),
  financialTerms: Joi.object({
    value: Joi.number().min(0).optional(),
    currency: Joi.string().trim().default('USD').max(10),
    paymentTerms: Joi.string().trim().allow('').max(1000),
    billingFrequency: Joi.string().valid('One-time', 'Monthly', 'Quarterly', 'Annually', 'Custom').optional()
  }).optional(),
  effectiveDate: Joi.date().required(),
  expirationDate: Joi.date().min(Joi.ref('effectiveDate')).optional(),
  renewal: Joi.object({
    autoRenew: Joi.boolean().default(false),
    renewalTerm: Joi.string().trim().allow('').max(200),
    renewalNoticeDays: Joi.number().min(0).max(365).optional(),
    renewalDate: Joi.date().optional()
  }).optional(),
  termination: Joi.object({
    terminationClause: Joi.string().trim().allow('').max(2000),
    noticePeriod: Joi.string().trim().allow('').max(200),
    earlyTerminationAllowed: Joi.boolean().default(false),
    terminationFee: Joi.number().min(0).optional()
  }).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().allow('').max(50),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().allow('').max(5000),
  createdBy: Joi.string().required().trim()
});

// Validation schema for contract update
const updateContractSchema = Joi.object({
  title: Joi.string().trim().min(3).max(500).optional(),
  description: Joi.string().trim().allow('').max(5000).optional(),
  status: Joi.string().valid('Draft', 'Under Review', 'Negotiating', 'Pending Signature', 'Active', 'Expired', 'Terminated', 'Completed').optional(),
  notes: Joi.string().trim().allow('').max(5000).optional(),
  lastModifiedBy: Joi.string().required().trim()
}).min(2);

// Validation schema for adding version
const addVersionSchema = Joi.object({
  changes: Joi.string().required().trim().min(10).max(2000),
  documentUrl: Joi.string().uri().allow('').max(500),
  createdBy: Joi.string().required().trim()
});

// Validation schema for negotiation
const addNegotiationSchema = Joi.object({
  party: Joi.string().required().trim().min(2).max(200),
  proposedChanges: Joi.string().required().trim().min(10).max(5000),
  status: Joi.string().valid('Pending', 'Accepted', 'Rejected', 'Counter-proposed').default('Pending'),
  notes: Joi.string().trim().allow('').max(2000)
});

// Validation schema for approval
const approveContractSchema = Joi.object({
  userId: Joi.string().required().trim(),
  userName: Joi.string().required().trim(),
  comments: Joi.string().trim().allow('').max(1000)
});

// Validation schema for obligation
const addObligationSchema = Joi.object({
  obligationType: Joi.string().required().valid('Deliverable', 'Payment', 'Performance', 'Reporting', 'Compliance', 'Other'),
  description: Joi.string().required().trim().min(10).max(1000),
  responsibleParty: Joi.string().required().trim().max(200),
  dueDate: Joi.date().required(),
  status: Joi.string().valid('Not Started', 'In Progress', 'Completed', 'Overdue', 'Waived').default('Not Started')
});

// Validation schema for signature
const addSignatureSchema = Joi.object({
  signerName: Joi.string().required().trim().min(2).max(100),
  signerRole: Joi.string().trim().allow('').max(100),
  signerEmail: Joi.string().email().required(),
  signatureMethod: Joi.string().required().valid('Electronic', 'Physical', 'Digital'),
  signatureUrl: Joi.string().uri().allow('').max(500),
  ipAddress: Joi.string().trim().allow('').max(45)
});

export {

  createContractSchema,
  updateContractSchema,
  addVersionSchema,
  addNegotiationSchema,
  approveContractSchema,
  addObligationSchema,
  addSignatureSchema

};
