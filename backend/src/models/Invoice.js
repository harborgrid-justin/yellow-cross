/**
 * Invoice Model - Mongoose Schema for Billing and Invoicing
 * Manages client invoices for time entries and expenses
 */

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  // Invoice Information
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
  clientNumber: {
    type: String,
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Case/Matter Information
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: {
    type: String,
    trim: true
  },
  caseName: {
    type: String,
    trim: true
  },
  
  // Invoice Dates
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  periodStart: Date,
  periodEnd: Date,
  
  // Line Items
  timeEntries: [{
    timeEntryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeEntry'
    },
    date: Date,
    description: String,
    hours: Number,
    rate: Number,
    amount: Number
  }],
  expenses: [{
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense'
    },
    date: Date,
    description: String,
    amount: Number
  }],
  
  // Amounts
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  timeTotal: {
    type: Number,
    default: 0
  },
  expenseTotal: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Payment Information
  amountPaid: {
    type: Number,
    default: 0
  },
  amountDue: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid', 'Overdue', 'Written Off'],
    default: 'Unpaid',
    index: true
  },
  payments: [{
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    date: Date,
    amount: Number,
    method: String,
    reference: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Viewed', 'Paid', 'Overdue', 'Cancelled', 'Written Off'],
    default: 'Draft',
    index: true
  },
  sentDate: Date,
  viewedDate: Date,
  paidDate: Date,
  
  // Terms and Notes
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  notes: {
    type: String,
    trim: true
  },
  internalNotes: {
    type: String,
    trim: true
  },
  
  // Reminders
  remindersSent: [{
    date: Date,
    type: String,
    sentBy: String
  }],
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  approvedBy: String,
  approvedDate: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
invoiceSchema.index({ clientId: 1, invoiceDate: -1 });
invoiceSchema.index({ status: 1, dueDate: 1 });
invoiceSchema.index({ paymentStatus: 1 });

// Calculate totals before save
invoiceSchema.pre('save', function(next) {
  // Calculate time total
  this.timeTotal = this.timeEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  
  // Calculate expense total
  this.expenseTotal = this.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  
  // Calculate subtotal
  this.subtotal = this.timeTotal + this.expenseTotal;
  
  // Apply discount
  let discountAmount = 0;
  if (this.discountPercent > 0) {
    discountAmount = (this.subtotal * this.discountPercent) / 100;
    this.discountAmount = discountAmount;
  }
  
  // Calculate tax
  let taxAmount = 0;
  if (this.taxRate > 0) {
    taxAmount = ((this.subtotal - discountAmount) * this.taxRate) / 100;
    this.taxAmount = taxAmount;
  }
  
  // Calculate total
  this.total = this.subtotal - discountAmount + taxAmount;
  
  // Calculate amount due
  this.amountDue = this.total - this.amountPaid;
  
  // Update payment status
  if (this.amountPaid >= this.total) {
    this.paymentStatus = 'Paid';
    if (!this.paidDate) {
      this.paidDate = new Date();
    }
  } else if (this.amountPaid > 0) {
    this.paymentStatus = 'Partial';
  } else if (this.status === 'Sent' && this.dueDate < new Date()) {
    this.paymentStatus = 'Overdue';
  }
  
  next();
});

// Instance method to add payment
invoiceSchema.methods.addPayment = function(payment, modifiedBy) {
  this.payments.push(payment);
  this.amountPaid += payment.amount;
  this.lastModifiedBy = modifiedBy;
  return this.save();
};

// Instance method to send invoice
invoiceSchema.methods.send = function(sentBy) {
  this.status = 'Sent';
  this.sentDate = new Date();
  this.lastModifiedBy = sentBy;
  return this.save();
};

// Static method to get overdue invoices
invoiceSchema.statics.getOverdueInvoices = function() {
  return this.find({
    status: 'Sent',
    dueDate: { $lt: new Date() },
    paymentStatus: { $ne: 'Paid' }
  }).sort({ dueDate: 1 });
};

module.exports = mongoose.model('Invoice', invoiceSchema);
