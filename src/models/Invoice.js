/**
 * Invoice Model - Mongoose Schema for Invoice Generation & Management
 * Comprehensive data model for legal billing invoices
 */

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  // Basic Information
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Client Information
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    trim: true
  },
  
  // Billing Address
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Case Information (optional - can be for multiple cases)
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  caseNumber: {
    type: String,
    trim: true
  },
  
  // Invoice Details
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  periodStart: {
    type: Date
  },
  periodEnd: {
    type: Date
  },
  
  // Line Items - Time Entries
  timeEntries: [{
    entryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeEntry'
    },
    date: Date,
    attorneyName: String,
    description: String,
    hours: Number,
    rate: Number,
    amount: Number
  }],
  
  // Line Items - Expenses
  expenses: [{
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense'
    },
    date: Date,
    description: String,
    category: String,
    amount: Number
  }],
  
  // Financial Summary
  subtotalTime: {
    type: Number,
    default: 0,
    min: 0
  },
  subtotalExpenses: {
    type: Number,
    default: 0,
    min: 0
  },
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  taxPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  amountDue: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Currency
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR']
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Sent', 'Viewed', 'Partial', 'Paid', 'Overdue', 'Cancelled', 'Refunded'],
    default: 'Draft',
    index: true
  },
  
  // Payment Information
  paymentTerms: {
    type: String,
    default: 'Net 30',
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Bank Transfer', 'Check', 'Cash', 'Online Payment', 'Other'],
    trim: true
  },
  paymentReference: {
    type: String,
    trim: true
  },
  
  // Payment History
  payments: [{
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    paymentDate: Date,
    amount: Number,
    method: String,
    reference: String,
    notes: String
  }],
  
  // Template & Customization
  template: {
    type: String,
    default: 'Standard',
    enum: ['Standard', 'Detailed', 'Summary', 'Custom']
  },
  customMessage: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  // Communication
  sentDate: {
    type: Date
  },
  sentBy: {
    type: String,
    trim: true
  },
  sentVia: {
    type: String,
    enum: ['Email', 'Mail', 'Hand Delivered', 'Portal', 'Other']
  },
  viewedDate: {
    type: Date
  },
  remindersSent: [{
    sentDate: Date,
    sentBy: String,
    method: String
  }],
  
  // File Attachments
  pdfUrl: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    url: String,
    fileSize: Number
  }],
  
  // Retainer/Trust Account
  fromTrustAccount: {
    type: Boolean,
    default: false
  },
  trustAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrustAccount'
  },
  
  // Tags & Categories
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  
  // Recurring Invoice
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringSchedule: {
    frequency: {
      type: String,
      enum: ['Weekly', 'Biweekly', 'Monthly', 'Quarterly', 'Annually']
    },
    nextInvoiceDate: Date,
    endDate: Date
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },
  cancelledBy: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: false
});

// Indexes
invoiceSchema.index({ clientId: 1, invoiceDate: -1 });
invoiceSchema.index({ status: 1, dueDate: 1 });
invoiceSchema.index({ dueDate: 1, status: 1 });
invoiceSchema.index({ caseId: 1, invoiceDate: -1 });

// Virtual for days overdue
invoiceSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'Paid' || !this.dueDate) return 0;
  const today = new Date();
  const diffTime = today - this.dueDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for payment status
invoiceSchema.virtual('paymentStatus').get(function() {
  if (this.amountPaid === 0) return 'Unpaid';
  if (this.amountPaid >= this.totalAmount) return 'Paid in Full';
  return 'Partially Paid';
});

// Instance method to calculate totals
invoiceSchema.methods.calculateTotals = function() {
  // Calculate time entries subtotal
  this.subtotalTime = this.timeEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  
  // Calculate expenses subtotal
  this.subtotalExpenses = this.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  
  // Calculate subtotal
  this.subtotal = this.subtotalTime + this.subtotalExpenses;
  
  // Apply discount
  this.discountAmount = (this.subtotal * this.discountPercent) / 100;
  
  // Calculate tax
  const afterDiscount = this.subtotal - this.discountAmount;
  this.taxAmount = (afterDiscount * this.taxPercent) / 100;
  
  // Calculate total
  this.totalAmount = afterDiscount + this.taxAmount;
  
  // Calculate amount due
  this.amountDue = this.totalAmount - this.amountPaid;
  
  return this.totalAmount;
};

// Instance method to mark as sent
invoiceSchema.methods.markAsSent = function(username, method = 'Email') {
  this.status = 'Sent';
  this.sentDate = new Date();
  this.sentBy = username;
  this.sentVia = method;
};

// Instance method to record payment
invoiceSchema.methods.recordPayment = function(paymentId, amount, method, reference, notes) {
  this.payments.push({
    paymentId,
    paymentDate: new Date(),
    amount,
    method,
    reference,
    notes
  });
  
  this.amountPaid += amount;
  this.amountDue = this.totalAmount - this.amountPaid;
  
  if (this.amountPaid >= this.totalAmount) {
    this.status = 'Paid';
  } else if (this.amountPaid > 0) {
    this.status = 'Partial';
  }
};

// Instance method to mark as viewed
invoiceSchema.methods.markAsViewed = function() {
  if (this.status === 'Sent' && !this.viewedDate) {
    this.status = 'Viewed';
    this.viewedDate = new Date();
  }
};

// Instance method to send reminder
invoiceSchema.methods.sendReminder = function(username, method = 'Email') {
  this.remindersSent.push({
    sentDate: new Date(),
    sentBy: username,
    method
  });
};

// Instance method to cancel
invoiceSchema.methods.cancel = function(username, reason) {
  this.status = 'Cancelled';
  this.cancelledBy = username;
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
};

// Pre-save middleware
invoiceSchema.pre('save', function(next) {
  // Update lastModifiedAt
  this.lastModifiedAt = new Date();
  
  // Check if overdue
  if (['Sent', 'Viewed', 'Partial'].includes(this.status)) {
    const today = new Date();
    if (this.dueDate < today && this.amountDue > 0) {
      this.status = 'Overdue';
    }
  }
  
  next();
});

// Static method to get aging report
invoiceSchema.statics.getAgingReport = async function(filters = {}) {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  const sixtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  
  const pipeline = [
    { 
      $match: { 
        status: { $in: ['Sent', 'Viewed', 'Partial', 'Overdue'] },
        amountDue: { $gt: 0 },
        ...filters
      } 
    },
    {
      $project: {
        invoiceNumber: 1,
        clientName: 1,
        totalAmount: 1,
        amountDue: 1,
        dueDate: 1,
        current: {
          $cond: [{ $gte: ['$dueDate', new Date()] }, '$amountDue', 0]
        },
        days30: {
          $cond: [
            { $and: [
              { $lt: ['$dueDate', new Date()] },
              { $gte: ['$dueDate', thirtyDaysAgo] }
            ]},
            '$amountDue',
            0
          ]
        },
        days60: {
          $cond: [
            { $and: [
              { $lt: ['$dueDate', thirtyDaysAgo] },
              { $gte: ['$dueDate', sixtyDaysAgo] }
            ]},
            '$amountDue',
            0
          ]
        },
        days90plus: {
          $cond: [{ $lt: ['$dueDate', sixtyDaysAgo] }, '$amountDue', 0]
        }
      }
    },
    {
      $group: {
        _id: null,
        totalOutstanding: { $sum: '$amountDue' },
        current: { $sum: '$current' },
        days30: { $sum: '$days30' },
        days60: { $sum: '$days60' },
        days90plus: { $sum: '$days90plus' },
        invoiceCount: { $sum: 1 }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalOutstanding: 0,
    current: 0,
    days30: 0,
    days60: 0,
    days90plus: 0,
    invoiceCount: 0
  };
};

module.exports = mongoose.model('Invoice', invoiceSchema);
