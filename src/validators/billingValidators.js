/**
 * Billing Validation Schemas using Joi
 * Input validation for time & billing management operations
 */

const Joi = require('joi');

// Validation schema for time entry creation
const createTimeEntrySchema = Joi.object({
  attorneyId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  attorneyName: Joi.string().required().trim().min(2).max(200),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientName: Joi.string().trim().optional(),
  date: Joi.date().required().max('now'),
  startTime: Joi.date().optional(),
  endTime: Joi.date().optional().greater(Joi.ref('startTime')),
  hours: Joi.number().required().min(0).max(24),
  minutes: Joi.number().min(0).max(59).default(0),
  billable: Joi.boolean().default(true),
  billingRate: Joi.number().min(0).optional(),
  description: Joi.string().required().trim().min(5).max(2000),
  taskType: Joi.string().valid(
    'Legal Research',
    'Court Appearance',
    'Client Meeting',
    'Document Review',
    'Document Drafting',
    'Email/Correspondence',
    'Phone Call',
    'Travel',
    'Administrative',
    'Other'
  ).default('Other'),
  billingCode: Joi.string().trim().optional(),
  timerBased: Joi.boolean().default(false),
  roundingRule: Joi.string().valid('None', '6 Minutes', '15 Minutes', '30 Minutes', '1 Hour').default('None'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  internalNotes: Joi.string().trim().max(2000).allow(''),
  createdBy: Joi.string().required().trim()
});

// Validation schema for bulk time entry
const bulkTimeEntrySchema = Joi.object({
  entries: Joi.array().items(createTimeEntrySchema).min(1).max(100).required(),
  applyRounding: Joi.boolean().default(false),
  roundingRule: Joi.string().valid('None', '6 Minutes', '15 Minutes', '30 Minutes', '1 Hour').optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for time entry update
const updateTimeEntrySchema = Joi.object({
  hours: Joi.number().min(0).max(24).optional(),
  minutes: Joi.number().min(0).max(59).optional(),
  description: Joi.string().trim().min(5).max(2000).optional(),
  taskType: Joi.string().valid(
    'Legal Research',
    'Court Appearance',
    'Client Meeting',
    'Document Review',
    'Document Drafting',
    'Email/Correspondence',
    'Phone Call',
    'Travel',
    'Administrative',
    'Other'
  ).optional(),
  billable: Joi.boolean().optional(),
  billingRate: Joi.number().min(0).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  internalNotes: Joi.string().trim().max(2000).allow(''),
  lastModifiedBy: Joi.string().required().trim()
});

// Validation schema for invoice creation
const createInvoiceSchema = Joi.object({
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  clientName: Joi.string().required().trim().min(2).max(200),
  clientEmail: Joi.string().email().trim().optional(),
  billingAddress: Joi.object({
    street: Joi.string().trim().allow(''),
    city: Joi.string().trim().allow(''),
    state: Joi.string().trim().allow(''),
    zipCode: Joi.string().trim().allow(''),
    country: Joi.string().trim().allow('')
  }).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  invoiceDate: Joi.date().default(() => new Date()),
  dueDate: Joi.date().required().greater(Joi.ref('invoiceDate')),
  periodStart: Joi.date().optional(),
  periodEnd: Joi.date().optional().greater(Joi.ref('periodStart')),
  timeEntryIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
  expenseIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(),
  discountPercent: Joi.number().min(0).max(100).default(0),
  taxPercent: Joi.number().min(0).max(100).default(0),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR').default('USD'),
  paymentTerms: Joi.string().trim().default('Net 30'),
  template: Joi.string().valid('Standard', 'Detailed', 'Summary', 'Custom').default('Standard'),
  customMessage: Joi.string().trim().max(2000).allow(''),
  notes: Joi.string().trim().max(2000).allow(''),
  internalNotes: Joi.string().trim().max(2000).allow(''),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for payment processing
const createPaymentSchema = Joi.object({
  invoiceId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  invoiceNumber: Joi.string().trim().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  clientName: Joi.string().required().trim().min(2).max(200),
  paymentDate: Joi.date().default(() => new Date()),
  amount: Joi.number().required().min(0),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR').default('USD'),
  paymentMethod: Joi.string().required().valid(
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'ACH',
    'Wire Transfer',
    'Check',
    'Cash',
    'Online Payment',
    'PayPal',
    'Stripe',
    'Trust Account',
    'Other'
  ),
  referenceNumber: Joi.string().trim().optional(),
  transactionId: Joi.string().trim().optional(),
  checkNumber: Joi.string().trim().optional(),
  cardType: Joi.string().valid('Visa', 'MasterCard', 'American Express', 'Discover', 'Other').optional(),
  cardLast4: Joi.string().trim().length(4).optional(),
  gateway: Joi.string().valid('Stripe', 'PayPal', 'Square', 'Authorize.Net', 'Manual', 'Other').optional(),
  description: Joi.string().trim().max(1000).allow(''),
  notes: Joi.string().trim().max(2000).allow(''),
  fromTrustAccount: Joi.boolean().default(false),
  trustAccountId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for expense tracking
const createExpenseSchema = Joi.object({
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientName: Joi.string().trim().optional(),
  date: Joi.date().required().max('now'),
  description: Joi.string().required().trim().min(3).max(1000),
  category: Joi.string().required().valid(
    'Court Fees',
    'Filing Fees',
    'Service of Process',
    'Expert Witness',
    'Deposition',
    'Research',
    'Travel',
    'Meals',
    'Accommodation',
    'Photocopying',
    'Postage',
    'Courier',
    'Long Distance',
    'Office Supplies',
    'Technology',
    'Other'
  ),
  subcategory: Joi.string().trim().optional(),
  amount: Joi.number().required().min(0),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR').default('USD'),
  billable: Joi.boolean().default(true),
  markup: Joi.number().min(0).default(0),
  paidBy: Joi.string().required().trim(),
  reimbursable: Joi.boolean().default(false),
  paymentMethod: Joi.string().valid(
    'Credit Card',
    'Debit Card',
    'Cash',
    'Check',
    'Bank Transfer',
    'Petty Cash',
    'Firm Account',
    'Personal',
    'Other'
  ).optional(),
  vendor: Joi.string().trim().optional(),
  receiptUrl: Joi.string().uri().trim().optional(),
  receiptFilename: Joi.string().trim().optional(),
  distance: Joi.number().min(0).optional(),
  distanceUnit: Joi.string().valid('miles', 'kilometers').optional(),
  mileageRate: Joi.number().min(0).optional(),
  notes: Joi.string().trim().max(2000).allow(''),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for trust account creation
const createTrustAccountSchema = Joi.object({
  accountName: Joi.string().required().trim().min(3).max(200),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  clientName: Joi.string().required().trim().min(2).max(200),
  bankName: Joi.string().required().trim().min(2).max(200),
  bankAccountNumber: Joi.string().required().trim(),
  bankRoutingNumber: Joi.string().trim().optional(),
  bankAddress: Joi.object({
    street: Joi.string().trim().allow(''),
    city: Joi.string().trim().allow(''),
    state: Joi.string().trim().allow(''),
    zipCode: Joi.string().trim().allow('')
  }).optional(),
  accountType: Joi.string().valid('IOLTA', 'Client Trust', 'Pooled Trust', 'Individual Trust').default('Client Trust'),
  minimumBalance: Joi.number().min(0).default(0),
  notes: Joi.string().trim().max(2000).allow(''),
  createdBy: Joi.string().required().trim()
});

// Validation schema for trust account transaction
const trustAccountTransactionSchema = Joi.object({
  type: Joi.string().required().valid('Deposit', 'Withdrawal', 'Transfer In', 'Transfer Out', 'Interest', 'Fee', 'Adjustment'),
  amount: Joi.number().required(),
  description: Joi.string().required().trim().min(3).max(500),
  reference: Joi.string().trim().optional(),
  checkNumber: Joi.string().trim().optional(),
  relatedCaseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  relatedInvoiceId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  performedBy: Joi.string().required().trim()
});

// Validation schema for trust account reconciliation
const trustAccountReconciliationSchema = Joi.object({
  bankBalance: Joi.number().required(),
  notes: Joi.string().trim().max(2000).allow(''),
  reconciledBy: Joi.string().required().trim()
});

// Validation schema for billing rate creation
const createBillingRateSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().max(1000).allow(''),
  rateType: Joi.string().required().valid('Hourly', 'Flat Fee', 'Contingency', 'Blended', 'Custom'),
  attorneyId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  attorneyName: Joi.string().trim().optional(),
  hourlyRate: Joi.number().min(0).when('rateType', { is: 'Hourly', then: Joi.required() }),
  flatFeeAmount: Joi.number().min(0).when('rateType', { is: 'Flat Fee', then: Joi.required() }),
  contingencyPercent: Joi.number().min(0).max(100).when('rateType', { is: 'Contingency', then: Joi.required() }),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR').default('USD'),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientName: Joi.string().trim().optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  practiceArea: Joi.string().trim().optional(),
  discount: Joi.number().min(0).max(100).default(0),
  billingIncrement: Joi.number().valid(1, 6, 10, 15, 30, 60).default(6),
  roundingRule: Joi.string().valid('Up', 'Down', 'Nearest').default('Up'),
  requiresRetainer: Joi.boolean().default(false),
  retainerAmount: Joi.number().min(0).optional(),
  paymentTerms: Joi.string().trim().default('Net 30'),
  effectiveDate: Joi.date().default(() => new Date()),
  expirationDate: Joi.date().optional().greater(Joi.ref('effectiveDate')),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().max(2000).allow(''),
  createdBy: Joi.string().required().trim()
});

// Validation schema for financial reporting query
const financialReportQuerySchema = Joi.object({
  reportType: Joi.string().required().valid(
    'Revenue',
    'AR Aging',
    'Profitability',
    'Collection',
    'Budget',
    'Time Summary',
    'Expense Summary',
    'Billing Summary'
  ),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  groupBy: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  attorneyId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  practiceArea: Joi.string().trim().optional(),
  includeDetails: Joi.boolean().default(false)
});

// Validation schema for billable hours query
const billableHoursQuerySchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  attorneyId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  billable: Joi.boolean().optional(),
  status: Joi.string().valid('Draft', 'Submitted', 'Approved', 'Invoiced', 'Paid', 'Written Off').optional(),
  groupBy: Joi.string().valid('attorney', 'client', 'case', 'taskType', 'date').default('attorney')
});

module.exports = {
  createTimeEntrySchema,
  bulkTimeEntrySchema,
  updateTimeEntrySchema,
  createInvoiceSchema,
  createPaymentSchema,
  createExpenseSchema,
  createTrustAccountSchema,
  trustAccountTransactionSchema,
  trustAccountReconciliationSchema,
  createBillingRateSchema,
  financialReportQuerySchema,
  billableHoursQuerySchema
};
