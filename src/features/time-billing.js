/**
 * Feature 4: Time & Billing Management
 * 8 Sub-Features: Time Tracking & Entry, Billable Hours, Invoice Generation,
 * Payment Processing, Expense Tracking, Trust Accounting, Rate Management, Financial Reporting
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const TimeEntry = require('../models/TimeEntry');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const TrustAccount = require('../models/TrustAccount');
const BillingRate = require('../models/BillingRate');
const { isConnected } = require('../config/database');
const {
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
} = require('../validators/billingValidators');

// Helper function to generate entry number
const generateEntryNumber = (prefix) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Time Tracking & Entry
router.post('/time-entry', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Time Tracking & Entry',
        description: 'Manual and automatic time tracking',
        endpoint: '/api/billing/time-entry',
        capabilities: [
          'Manual time entry',
          'Timer-based tracking',
          'Activity logging',
          'Time rounding rules',
          'Bulk time entry'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    // Validate request data
    const validatedData = validateRequest(createTimeEntrySchema, req.body);

    // Generate entry number
    const entryNumber = generateEntryNumber('TIME');

    // Calculate total minutes
    const totalMinutes = (validatedData.hours * 60) + (validatedData.minutes || 0);

    // Create time entry
    const timeEntry = new TimeEntry({
      entryNumber,
      ...validatedData,
      totalMinutes
    });

    // Apply rounding if specified
    if (validatedData.roundingRule && validatedData.roundingRule !== 'None') {
      timeEntry.applyRounding(validatedData.roundingRule);
    }

    // Calculate amount if billing rate provided
    if (validatedData.billable && validatedData.billingRate) {
      timeEntry.calculateAmount();
    }

    await timeEntry.save();

    res.status(201).json({
      success: true,
      message: 'Time entry created successfully',
      data: {
        entryNumber: timeEntry.entryNumber,
        date: timeEntry.date,
        attorneyName: timeEntry.attorneyName,
        hours: timeEntry.hours,
        minutes: timeEntry.minutes,
        totalMinutes: timeEntry.totalMinutes,
        formattedHours: timeEntry.formattedHours,
        billable: timeEntry.billable,
        amount: timeEntry.amount,
        description: timeEntry.description,
        status: timeEntry.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create time entry',
      error: error.message
    });
  }
});

// Get time entries with filtering
router.get('/time-entry', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Time Tracking & Entry',
        description: 'Retrieve time entries',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const { attorneyId, caseId, clientId, startDate, endDate, billable, status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (attorneyId) filter.attorneyId = attorneyId;
    if (caseId) filter.caseId = caseId;
    if (clientId) filter.clientId = clientId;
    if (billable !== undefined) filter.billable = billable === 'true';
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const timeEntries = await TimeEntry.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await TimeEntry.countDocuments(filter);

    res.json({
      success: true,
      data: timeEntries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve time entries',
      error: error.message
    });
  }
});

// Update time entry
router.put('/time-entry/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Time Tracking & Entry',
        description: 'Update time entry',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(updateTimeEntrySchema, req.body);
    const timeEntry = await TimeEntry.findById(req.params.id);

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    // Check if already invoiced
    if (timeEntry.invoiced) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update invoiced time entry'
      });
    }

    // Update fields
    Object.assign(timeEntry, validatedData);

    // Recalculate total minutes if hours or minutes changed
    if (validatedData.hours !== undefined || validatedData.minutes !== undefined) {
      timeEntry.totalMinutes = (timeEntry.hours * 60) + (timeEntry.minutes || 0);
    }

    // Recalculate amount if billing rate changed
    if (validatedData.billingRate !== undefined) {
      timeEntry.calculateAmount();
    }

    await timeEntry.save();

    res.json({
      success: true,
      message: 'Time entry updated successfully',
      data: timeEntry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update time entry',
      error: error.message
    });
  }
});

// Bulk time entry
router.post('/time-entry/bulk', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Bulk Time Entry',
        description: 'Create multiple time entries at once',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(bulkTimeEntrySchema, req.body);
    const createdEntries = [];
    const errors = [];

    for (const entryData of validatedData.entries) {
      try {
        const entryNumber = generateEntryNumber('TIME');
        const totalMinutes = (entryData.hours * 60) + (entryData.minutes || 0);

        const timeEntry = new TimeEntry({
          entryNumber,
          ...entryData,
          totalMinutes
        });

        if (validatedData.applyRounding && validatedData.roundingRule) {
          timeEntry.applyRounding(validatedData.roundingRule);
        }

        if (entryData.billable && entryData.billingRate) {
          timeEntry.calculateAmount();
        }

        await timeEntry.save();
        createdEntries.push(timeEntry.entryNumber);
      } catch (error) {
        errors.push({
          entry: entryData,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdEntries.length} time entries`,
      data: {
        created: createdEntries,
        failed: errors.length,
        errors
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create bulk time entries',
      error: error.message
    });
  }
});

// Sub-Feature 2: Billable Hours Management
router.get('/billable-hours', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Billable Hours Management',
        description: 'Track billable vs non-billable hours',
        endpoint: '/api/billing/billable-hours',
        capabilities: [
          'Billable/non-billable tracking',
          'Utilization reports',
          'Hour categorization',
          'Billing codes',
          'Write-offs management'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(billableHoursQuerySchema, req.query);
    
    const filter = {
      date: {
        $gte: validatedData.startDate,
        $lte: validatedData.endDate
      }
    };

    if (validatedData.attorneyId) filter.attorneyId = validatedData.attorneyId;
    if (validatedData.clientId) filter.clientId = validatedData.clientId;
    if (validatedData.caseId) filter.caseId = validatedData.caseId;
    if (validatedData.billable !== undefined) filter.billable = validatedData.billable;
    if (validatedData.status) filter.status = validatedData.status;

    // Get summary
    const summary = await TimeEntry.getBillableSummary(filter);

    // Get breakdown by group
    let groupField;
    switch(validatedData.groupBy) {
      case 'attorney':
        groupField = '$attorneyName';
        break;
      case 'client':
        groupField = '$clientName';
        break;
      case 'case':
        groupField = '$caseNumber';
        break;
      case 'taskType':
        groupField = '$taskType';
        break;
      case 'date':
        groupField = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
        break;
      default:
        groupField = '$attorneyName';
    }

    const breakdown = await TimeEntry.aggregate([
      { $match: filter },
      {
        $group: {
          _id: groupField,
          billableMinutes: {
            $sum: { $cond: ['$billable', '$totalMinutes', 0] }
          },
          nonBillableMinutes: {
            $sum: { $cond: ['$billable', 0, '$totalMinutes'] }
          },
          billableAmount: {
            $sum: { $cond: ['$billable', '$amount', 0] }
          },
          entryCount: { $sum: 1 }
        }
      },
      { $sort: { billableAmount: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          ...summary,
          billableHours: Math.floor(summary.totalBillableMinutes / 60),
          nonBillableHours: Math.floor(summary.totalNonBillableMinutes / 60),
          utilizationRate: summary.totalBillableMinutes / (summary.totalBillableMinutes + summary.totalNonBillableMinutes) * 100
        },
        breakdown: breakdown.map(item => ({
          ...item,
          billableHours: Math.floor(item.billableMinutes / 60),
          nonBillableHours: Math.floor(item.nonBillableMinutes / 60)
        }))
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve billable hours',
      error: error.message
    });
  }
});

// Sub-Feature 3: Invoice Generation
router.post('/invoices', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Invoice Generation',
        description: 'Create professional invoices and statements',
        endpoint: '/api/billing/invoices',
        capabilities: [
          'Automated invoicing',
          'Custom invoice templates',
          'Multi-currency support',
          'Batch invoicing',
          'Invoice preview'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(createInvoiceSchema, req.body);

    // Generate invoice number
    const invoiceNumber = generateEntryNumber('INV');

    // Fetch time entries if provided
    const timeEntries = [];
    if (validatedData.timeEntryIds && validatedData.timeEntryIds.length > 0) {
      const entries = await TimeEntry.find({
        _id: { $in: validatedData.timeEntryIds },
        invoiced: false,
        status: 'Approved'
      });

      for (const entry of entries) {
        timeEntries.push({
          entryId: entry._id,
          date: entry.date,
          attorneyName: entry.attorneyName,
          description: entry.description,
          hours: entry.totalMinutes / 60,
          rate: entry.billingRate,
          amount: entry.amount
        });

        // Mark as invoiced
        entry.invoiced = true;
        entry.invoiceNumber = invoiceNumber;
        await entry.save();
      }
    }

    // Fetch expenses if provided
    const expenses = [];
    if (validatedData.expenseIds && validatedData.expenseIds.length > 0) {
      const expenseRecords = await Expense.find({
        _id: { $in: validatedData.expenseIds },
        invoiced: false,
        status: 'Approved'
      });

      for (const expense of expenseRecords) {
        expenses.push({
          expenseId: expense._id,
          date: expense.date,
          description: expense.description,
          category: expense.category,
          amount: expense.calculateBillableAmount()
        });

        // Mark as invoiced
        expense.invoiced = true;
        expense.invoiceNumber = invoiceNumber;
        await expense.save();
      }
    }

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      ...validatedData,
      timeEntries,
      expenses
    });

    // Calculate totals
    invoice.calculateTotals();

    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: {
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        subtotal: invoice.subtotal,
        totalAmount: invoice.totalAmount,
        amountDue: invoice.amountDue,
        status: invoice.status,
        timeEntriesCount: timeEntries.length,
        expensesCount: expenses.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
});

// Get invoices
router.get('/invoices', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Invoice Generation',
        description: 'Retrieve invoices',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const { clientId, status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (clientId) filter.clientId = clientId;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.invoiceDate = {};
      if (startDate) filter.invoiceDate.$gte = new Date(startDate);
      if (endDate) filter.invoiceDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const invoices = await Invoice.find(filter)
      .sort({ invoiceDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve invoices',
      error: error.message
    });
  }
});

// Get single invoice
router.get('/invoices/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Invoice Generation',
        description: 'Retrieve single invoice',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve invoice',
      error: error.message
    });
  }
});

// Send invoice
router.post('/invoices/:id/send', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Invoice Generation',
        description: 'Send invoice to client',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const { username, method } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    invoice.markAsSent(username, method);
    await invoice.save();

    res.json({
      success: true,
      message: 'Invoice sent successfully',
      data: {
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        sentDate: invoice.sentDate
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to send invoice',
      error: error.message
    });
  }
});

// Sub-Feature 4: Payment Processing
router.post('/payments', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Payment Processing',
        description: 'Accept payments, payment plans, and receipts',
        endpoint: '/api/billing/payments',
        capabilities: [
          'Online payments',
          'Payment plans',
          'Receipt generation',
          'Payment tracking',
          'Multiple payment methods'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(createPaymentSchema, req.body);

    // Generate payment number
    const paymentNumber = generateEntryNumber('PAY');

    // Generate receipt number
    const receiptNumber = generateEntryNumber('REC');

    // Create payment
    const payment = new Payment({
      paymentNumber,
      receiptNumber,
      ...validatedData
    });

    // If invoice is provided, update invoice
    if (validatedData.invoiceId) {
      const invoice = await Invoice.findById(validatedData.invoiceId);
      
      if (invoice) {
        invoice.recordPayment(
          payment._id,
          validatedData.amount,
          validatedData.paymentMethod,
          validatedData.referenceNumber,
          validatedData.notes
        );
        await invoice.save();

        payment.invoiceNumber = invoice.invoiceNumber;
      }
    }

    // Complete payment
    payment.complete(validatedData.transactionId, validatedData.createdBy);

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        paymentNumber: payment.paymentNumber,
        receiptNumber: payment.receiptNumber,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        paymentDate: payment.paymentDate
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
});

// Get payments
router.get('/payments', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Payment Processing',
        description: 'Retrieve payments',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const { clientId, invoiceId, status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (clientId) filter.clientId = clientId;
    if (invoiceId) filter.invoiceId = invoiceId;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const payments = await Payment.find(filter)
      .sort({ paymentDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Payment.countDocuments(filter);

    res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve payments',
      error: error.message
    });
  }
});

// Sub-Feature 5: Expense Tracking
router.post('/expenses', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Expense Tracking',
        description: 'Track case-related expenses and reimbursements',
        endpoint: '/api/billing/expenses',
        capabilities: [
          'Expense entry',
          'Receipt management',
          'Reimbursement tracking',
          'Expense categorization',
          'Billable expenses'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(createExpenseSchema, req.body);

    // Generate expense number
    const expenseNumber = generateEntryNumber('EXP');

    // Create expense
    const expense = new Expense({
      expenseNumber,
      ...validatedData
    });

    // Calculate billable amount with markup
    if (validatedData.billable) {
      expense.calculateBillableAmount();
    }

    // Calculate mileage if applicable
    if (validatedData.distance && validatedData.mileageRate) {
      expense.calculateMileageExpense();
    }

    await expense.save();

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: {
        expenseNumber: expense.expenseNumber,
        date: expense.date,
        category: expense.category,
        amount: expense.amount,
        billable: expense.billable,
        billableAmount: expense.totalBillableAmount,
        status: expense.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message
    });
  }
});

// Get expenses
router.get('/expenses', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Expense Tracking',
        description: 'Retrieve expenses',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const { caseId, clientId, category, billable, status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (caseId) filter.caseId = caseId;
    if (clientId) filter.clientId = clientId;
    if (category) filter.category = category;
    if (billable !== undefined) filter.billable = billable === 'true';
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve expenses',
      error: error.message
    });
  }
});

// Get expense summary
router.get('/expenses/summary', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Expense Tracking',
        description: 'Get expense summary',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const filter = {};
    if (req.query.caseId) filter.caseId = req.query.caseId;
    if (req.query.clientId) filter.clientId = req.query.clientId;

    const summary = await Expense.getExpenseSummary(filter);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve expense summary',
      error: error.message
    });
  }
});

// Sub-Feature 6: Trust Accounting
router.post('/trust-accounts', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Trust Accounting',
        description: 'IOLTA compliance and trust account management',
        endpoint: '/api/billing/trust-accounts',
        capabilities: [
          'IOLTA compliance',
          'Trust ledgers',
          'Three-way reconciliation',
          'Client trust accounts',
          'Audit trails'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(createTrustAccountSchema, req.body);

    // Generate account number
    const accountNumber = generateEntryNumber('TRS');

    // Create trust account
    const trustAccount = new TrustAccount({
      accountNumber,
      ...validatedData
    });

    await trustAccount.save();

    res.status(201).json({
      success: true,
      message: 'Trust account created successfully',
      data: {
        accountNumber: trustAccount.accountNumber,
        accountName: trustAccount.accountName,
        clientName: trustAccount.clientName,
        accountType: trustAccount.accountType,
        currentBalance: trustAccount.currentBalance,
        status: trustAccount.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create trust account',
      error: error.message
    });
  }
});

// Get trust accounts
router.get('/trust-accounts', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Trust Accounting',
        description: 'IOLTA compliance and trust account management',
        endpoint: '/api/billing/trust-accounts',
        capabilities: [
          'IOLTA compliance',
          'Trust ledgers',
          'Three-way reconciliation',
          'Client trust accounts',
          'Audit trails'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    const { clientId, accountType, status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (clientId) filter.clientId = clientId;
    if (accountType) filter.accountType = accountType;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const accounts = await TrustAccount.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await TrustAccount.countDocuments(filter);

    res.json({
      success: true,
      data: accounts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve trust accounts',
      error: error.message
    });
  }
});

// Add trust account transaction
router.post('/trust-accounts/:id/transaction', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Trust Accounting',
        description: 'Add transaction to trust account',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(trustAccountTransactionSchema, req.body);
    const trustAccount = await TrustAccount.findById(req.params.id);

    if (!trustAccount) {
      return res.status(404).json({
        success: false,
        message: 'Trust account not found'
      });
    }

    const transactionNumber = trustAccount.addTransaction(
      validatedData.type,
      validatedData.amount,
      validatedData.description,
      validatedData.performedBy,
      validatedData.reference
    );

    await trustAccount.save();

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: {
        transactionNumber,
        accountNumber: trustAccount.accountNumber,
        currentBalance: trustAccount.currentBalance,
        formattedBalance: trustAccount.formattedBalance
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add transaction',
      error: error.message
    });
  }
});

// Reconcile trust account
router.post('/trust-accounts/:id/reconcile', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Trust Accounting',
        description: 'Reconcile trust account',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(trustAccountReconciliationSchema, req.body);
    const trustAccount = await TrustAccount.findById(req.params.id);

    if (!trustAccount) {
      return res.status(404).json({
        success: false,
        message: 'Trust account not found'
      });
    }

    const isBalanced = trustAccount.reconcile(
      validatedData.bankBalance,
      validatedData.reconciledBy,
      validatedData.notes
    );

    await trustAccount.save();

    res.json({
      success: true,
      message: isBalanced ? 'Account reconciled successfully' : 'Account reconciled with discrepancies',
      data: {
        accountNumber: trustAccount.accountNumber,
        isBalanced,
        clientLedgerBalance: trustAccount.lastReconciledBalance,
        bankBalance: validatedData.bankBalance,
        difference: validatedData.bankBalance - trustAccount.lastReconciledBalance,
        reconciledDate: trustAccount.lastReconciledDate
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to reconcile account',
      error: error.message
    });
  }
});

// Get IOLTA summary
router.get('/trust-accounts/iolta/summary', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Trust Accounting',
        description: 'Get IOLTA summary',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const summary = await TrustAccount.getIOLTASummary();

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve IOLTA summary',
      error: error.message
    });
  }
});

// Sub-Feature 7: Rate Management
router.post('/rates', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Rate Management',
        description: 'Hourly rates, flat fees, and contingency fees',
        endpoint: '/api/billing/rates',
        capabilities: [
          'Attorney hourly rates',
          'Flat fee structures',
          'Contingency arrangements',
          'Rate schedules',
          'Custom billing rates'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(createBillingRateSchema, req.body);

    // Generate rate ID
    const rateId = generateEntryNumber('RATE');

    // Create billing rate
    const billingRate = new BillingRate({
      rateId,
      ...validatedData
    });

    await billingRate.save();

    res.status(201).json({
      success: true,
      message: 'Billing rate created successfully',
      data: {
        rateId: billingRate.rateId,
        name: billingRate.name,
        rateType: billingRate.rateType,
        formattedRate: billingRate.formattedRate,
        effectiveDate: billingRate.effectiveDate,
        status: billingRate.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create billing rate',
      error: error.message
    });
  }
});

// Get billing rates
router.get('/rates', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Rate Management',
        description: 'Retrieve billing rates',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const { attorneyId, clientId, rateType, practiceArea, status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (attorneyId) filter.attorneyId = attorneyId;
    if (clientId) filter.clientId = clientId;
    if (rateType) filter.rateType = rateType;
    if (practiceArea) filter.practiceArea = practiceArea;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const rates = await BillingRate.find(filter)
      .sort({ effectiveDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await BillingRate.countDocuments(filter);

    res.json({
      success: true,
      data: rates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve billing rates',
      error: error.message
    });
  }
});

// Update billing rate
router.put('/rates/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Rate Management',
        description: 'Update billing rate',
        note: 'Database not connected. This is a stub response.'
      });
    }

    const billingRate = await BillingRate.findById(req.params.id);

    if (!billingRate) {
      return res.status(404).json({
        success: false,
        message: 'Billing rate not found'
      });
    }

    const { newRate, changeReason, username } = req.body;

    if (newRate) {
      billingRate.updateRate(newRate, changeReason, username);
    }

    // Update other fields
    Object.assign(billingRate, req.body);

    await billingRate.save();

    res.json({
      success: true,
      message: 'Billing rate updated successfully',
      data: billingRate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update billing rate',
      error: error.message
    });
  }
});

// Sub-Feature 8: Financial Reporting
router.get('/reports', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Financial Reporting',
        description: 'Revenue reports, accounts receivable, profitability',
        endpoint: '/api/billing/reports',
        capabilities: [
          'Revenue reports',
          'AR aging',
          'Profitability analysis',
          'Collection reports',
          'Budget tracking'
        ],
        note: 'Database not connected. This is a stub response.'
      });
    }

    const validatedData = validateRequest(financialReportQuerySchema, req.query);

    let reportData;

    switch(validatedData.reportType) {
      case 'Revenue':
        reportData = await Payment.getRevenueReport(
          validatedData.startDate,
          validatedData.endDate,
          validatedData.groupBy
        );
        break;

      case 'AR Aging':
        const filter = {};
        if (validatedData.clientId) filter.clientId = validatedData.clientId;
        reportData = await Invoice.getAgingReport(filter);
        break;

      case 'Time Summary':
        const timeFilter = {
          date: {
            $gte: validatedData.startDate,
            $lte: validatedData.endDate
          }
        };
        if (validatedData.attorneyId) timeFilter.attorneyId = validatedData.attorneyId;
        if (validatedData.caseId) timeFilter.caseId = validatedData.caseId;
        reportData = await TimeEntry.getBillableSummary(timeFilter);
        break;

      case 'Expense Summary':
        const expenseFilter = {};
        if (validatedData.caseId) expenseFilter.caseId = validatedData.caseId;
        if (validatedData.clientId) expenseFilter.clientId = validatedData.clientId;
        reportData = await Expense.getExpenseSummary(expenseFilter);
        break;

      default:
        reportData = { message: 'Report type not yet implemented' };
    }

    res.json({
      success: true,
      reportType: validatedData.reportType,
      period: {
        startDate: validatedData.startDate,
        endDate: validatedData.endDate
      },
      data: reportData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
});

// Billing overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Time & Billing Management',
    subFeatures: [
      'Time Tracking & Entry',
      'Billable Hours Management',
      'Invoice Generation',
      'Payment Processing',
      'Expense Tracking',
      'Trust Accounting',
      'Rate Management',
      'Financial Reporting'
    ],
    implementation: 'Full business logic and database integration',
    dbConnected: isConnected()
  });
});

module.exports = router;
