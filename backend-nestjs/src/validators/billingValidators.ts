/**
 * Billing Validation Schemas using Joi
 * Input validation for time and billing operations
 */

import Joi from 'joi';

// Validation schema for time entry creation
const createTimeEntrySchema = Joi.object({
  userId: Joi.string().required().trim().min(1).max(100),
  userName: Joi.string().required().trim().min(1).max(100),
  userRole: Joi.string().valid('Attorney', 'Paralegal', 'Associate', 'Partner', 'Legal Assistant', 'Other').default('Attorney'),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().allow('').max(100),
  caseName: Joi.string().trim().allow('').max(200),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientNumber: Joi.string().trim().allow('').max(100),
  date: Joi.date().required(),
  startTime: Joi.date().optional(),
  endTime: Joi.date().optional(),
  duration: Joi.number().required().min(0).max(1440), // max 24 hours in minutes
  activityCode: Joi.string().trim().allow('').max(50),
  activityType: Joi.string().required().valid(
    'Research', 'Document Review', 'Court Appearance', 'Client Meeting', 'Phone Call', 
    'Email', 'Drafting', 'Travel', 'Administrative', 'Consultation', 'Other'
  ),
  description: Joi.string().required().trim().min(1).max(1000),
  billable: Joi.boolean().default(true),
  billableStatus: Joi.string().valid('Billable', 'Non-Billable', 'No Charge', 'Write-Off', 'Write-Down').default('Billable'),
  hourlyRate: Joi.number().required().min(0).max(100000),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().allow('').max(1000),
  createdBy: Joi.string().required().trim().min(1).max(100)
});

// Validation schema for time entry update
const updateTimeEntrySchema = Joi.object({
  date: Joi.date(),
  duration: Joi.number().min(0).max(1440),
  activityType: Joi.string().valid(
    'Research', 'Document Review', 'Court Appearance', 'Client Meeting', 'Phone Call', 
    'Email', 'Drafting', 'Travel', 'Administrative', 'Consultation', 'Other'
  ),
  description: Joi.string().trim().min(1).max(1000),
  billable: Joi.boolean(),
  billableStatus: Joi.string().valid('Billable', 'Non-Billable', 'No Charge', 'Write-Off', 'Write-Down'),
  hourlyRate: Joi.number().min(0).max(100000),
  notes: Joi.string().trim().allow('').max(1000),
  lastModifiedBy: Joi.string().required().trim().min(1).max(100)
});

// Validation schema for time entry approval
const approveTimeEntrySchema = Joi.object({
  approvedBy: Joi.string().required().trim().min(1).max(100)
});

// Validation schema for write-off
const writeOffSchema = Joi.object({
  amount: Joi.number().required().min(0),
  reason: Joi.string().required().trim().min(1).max(500),
  modifiedBy: Joi.string().required().trim().min(1).max(100)
});

// Validation schema for expense creation
const createExpenseSchema = Joi.object({
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().allow('').max(100),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientNumber: Joi.string().trim().allow('').max(100),
  date: Joi.date().required(),
  category: Joi.string().required().valid(
    'Travel', 'Filing Fees', 'Court Costs', 'Document Production', 'Expert Witness', 
    'Research', 'Postage', 'Courier', 'Copying', 'Phone', 'Other'
  ),
  subcategory: Joi.string().trim().allow('').max(100),
  description: Joi.string().required().trim().min(1).max(1000),
  amount: Joi.number().required().min(0),
  quantity: Joi.number().min(0).default(1),
  unitCost: Joi.number().min(0).optional(),
  billable: Joi.boolean().default(true),
  markupPercent: Joi.number().min(0).max(100).default(0),
  reimbursable: Joi.boolean().default(false),
  reimbursedTo: Joi.string().trim().allow('').max(100),
  paymentMethod: Joi.string().valid('Credit Card', 'Cash', 'Check', 'Firm Account', 'Client Account', 'Other'),
  paidBy: Joi.string().trim().allow('').max(100),
  receiptNumber: Joi.string().trim().allow('').max(100),
  notes: Joi.string().trim().allow('').max(1000),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  submittedBy: Joi.string().required().trim().min(1).max(100),
  createdBy: Joi.string().required().trim().min(1).max(100)
});

// Validation schema for invoice creation
const createInvoiceSchema = Joi.object({
  clientId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  clientNumber: Joi.string().trim().allow('').max(100),
  clientName: Joi.string().required().trim().min(1).max(200),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().allow('').max(100),
  caseName: Joi.string().trim().allow('').max(200),
  invoiceDate: Joi.date().default(Date.now),
  dueDate: Joi.date().required(),
  periodStart: Joi.date().optional(),
  periodEnd: Joi.date().optional(),
  timeEntryIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
  expenseIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
  discountPercent: Joi.number().min(0).max(100).default(0),
  taxRate: Joi.number().min(0).max(100).default(0),
  paymentTerms: Joi.string().trim().allow('').max(100).default('Net 30'),
  notes: Joi.string().trim().allow('').max(2000),
  internalNotes: Joi.string().trim().allow('').max(2000),
  createdBy: Joi.string().required().trim().min(1).max(100)
});

// Validation schema for payment
const addPaymentSchema = Joi.object({
  date: Joi.date().required(),
  amount: Joi.number().required().min(0),
  method: Joi.string().required().valid('Credit Card', 'Check', 'Wire Transfer', 'ACH', 'Cash', 'Other'),
  reference: Joi.string().trim().allow('').max(100),
  notes: Joi.string().trim().allow('').max(500),
  modifiedBy: Joi.string().required().trim().min(1).max(100)
});

// Validation schema for rate management
const rateSchema = Joi.object({
  userId: Joi.string().required().trim().min(1).max(100),
  userRole: Joi.string().required().valid('Attorney', 'Paralegal', 'Associate', 'Partner', 'Legal Assistant', 'Other'),
  standardRate: Joi.number().required().min(0).max(100000),
  specialRates: Joi.array().items(
    Joi.object({
      clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
      rate: Joi.number().required().min(0).max(100000),
      effectiveDate: Joi.date().required()
    })
  ).optional(),
  effectiveDate: Joi.date().required(),
  updatedBy: Joi.string().required().trim().min(1).max(100)
});

// Validation schema for search/filter
const timeEntriesFilterSchema = Joi.object({
  userId: Joi.string().trim().max(100),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  startDate: Joi.date(),
  endDate: Joi.date(),
  billable: Joi.boolean(),
  status: Joi.string().valid('Draft', 'Submitted', 'Approved', 'Invoiced', 'Paid', 'Rejected'),
  invoiced: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// Validation schema for sending invoice
const sendInvoiceSchema = Joi.object({
  sentBy: Joi.string().required().trim().min(1).max(100),
  sendMethod: Joi.string().valid('Email', 'Mail', 'Portal').default('Email'),
  recipientEmail: Joi.string().email().optional(),
  notes: Joi.string().trim().allow('').max(500)
});

// Validation schema for approving expense
const approveExpenseSchema = Joi.object({
  approvedBy: Joi.string().required().trim().min(1).max(100),
  notes: Joi.string().trim().allow('').max(500)
});

export {

  createTimeEntrySchema,
  updateTimeEntrySchema,
  approveTimeEntrySchema,
  writeOffSchema,
  createExpenseSchema,
  createInvoiceSchema,
  addPaymentSchema,
  rateSchema,
  timeEntriesFilterSchema,
  sendInvoiceSchema,
  approveExpenseSchema

};
