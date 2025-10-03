/**
 * Payment Model - Mongoose Schema for Payment Processing
 * Comprehensive data model for payment tracking and processing
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Basic Information
  paymentNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Invoice & Client Information
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    index: true
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
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
  
  // Payment Details
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR']
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    required: true,
    enum: [
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
    ]
  },
  
  // Payment Reference
  referenceNumber: {
    type: String,
    trim: true,
    index: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  checkNumber: {
    type: String,
    trim: true
  },
  
  // Credit Card Details (encrypted/tokenized in production)
  cardType: {
    type: String,
    enum: ['Visa', 'MasterCard', 'American Express', 'Discover', 'Other']
  },
  cardLast4: {
    type: String,
    trim: true
  },
  
  // Bank Details
  bankName: {
    type: String,
    trim: true
  },
  accountLast4: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  
  // Payment Gateway
  gateway: {
    type: String,
    enum: ['Stripe', 'PayPal', 'Square', 'Authorize.Net', 'Manual', 'Other']
  },
  gatewayTransactionId: {
    type: String,
    trim: true
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Receipt
  receiptNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  receiptUrl: {
    type: String,
    trim: true
  },
  receiptSent: {
    type: Boolean,
    default: false
  },
  receiptSentDate: {
    type: Date
  },
  
  // Allocation (for partial payments or multiple invoices)
  allocation: [{
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice'
    },
    invoiceNumber: String,
    amount: Number
  }],
  
  // Refund Information
  refunded: {
    type: Boolean,
    default: false
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  refundDate: {
    type: Date
  },
  refundReason: {
    type: String,
    trim: true
  },
  refundedBy: {
    type: String,
    trim: true
  },
  refundTransactionId: {
    type: String,
    trim: true
  },
  
  // Payment Plan
  isPaymentPlan: {
    type: Boolean,
    default: false
  },
  paymentPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentPlan'
  },
  installmentNumber: {
    type: Number,
    min: 1
  },
  
  // Trust Account
  fromTrustAccount: {
    type: Boolean,
    default: false
  },
  trustAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrustAccount'
  },
  
  // Notes & Description
  description: {
    type: String,
    trim: true,
    maxlength: 1000
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
  
  // Processing Details
  processingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  netAmount: {
    type: Number,
    min: 0
  },
  
  // Reconciliation
  reconciled: {
    type: Boolean,
    default: false
  },
  reconciledDate: {
    type: Date
  },
  reconciledBy: {
    type: String,
    trim: true
  },
  bankStatementDate: {
    type: Date
  },
  
  // Tags
  tags: [{
    type: String,
    trim: true
  }],
  
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
  processedBy: {
    type: String,
    trim: true
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: false
});

// Indexes
paymentSchema.index({ clientId: 1, paymentDate: -1 });
paymentSchema.index({ invoiceId: 1, paymentDate: -1 });
paymentSchema.index({ status: 1, paymentDate: -1 });
paymentSchema.index({ paymentMethod: 1, paymentDate: -1 });
paymentSchema.index({ reconciled: 1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

// Instance method to complete payment
paymentSchema.methods.complete = function(transactionId, username) {
  this.status = 'Completed';
  this.transactionId = transactionId;
  this.processedBy = username;
  this.processedAt = new Date();
  
  // Calculate net amount after processing fee
  this.netAmount = this.amount - this.processingFee;
};

// Instance method to fail payment
paymentSchema.methods.fail = function(reason) {
  this.status = 'Failed';
  this.notes = reason;
};

// Instance method to refund
paymentSchema.methods.refund = function(amount, reason, username, refundTransactionId) {
  this.refunded = true;
  this.refundAmount = amount;
  this.refundDate = new Date();
  this.refundReason = reason;
  this.refundedBy = username;
  this.refundTransactionId = refundTransactionId;
  this.status = 'Refunded';
};

// Instance method to send receipt
paymentSchema.methods.sendReceipt = function() {
  this.receiptSent = true;
  this.receiptSentDate = new Date();
};

// Instance method to reconcile
paymentSchema.methods.reconcile = function(username, bankStatementDate) {
  this.reconciled = true;
  this.reconciledDate = new Date();
  this.reconciledBy = username;
  if (bankStatementDate) {
    this.bankStatementDate = bankStatementDate;
  }
};

// Pre-save middleware
paymentSchema.pre('save', function(next) {
  // Update lastModifiedAt
  this.lastModifiedAt = new Date();
  
  // Calculate net amount if not set
  if (!this.netAmount) {
    this.netAmount = this.amount - (this.processingFee || 0);
  }
  
  next();
});

// Static method to get payment summary
paymentSchema.statics.getPaymentSummary = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: '$paymentMethod',
        totalAmount: { $sum: '$amount' },
        totalProcessingFees: { $sum: '$processingFee' },
        totalNetAmount: { $sum: '$netAmount' },
        paymentCount: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ];
  
  const result = await this.aggregate(pipeline);
  return result;
};

// Static method to get revenue report
paymentSchema.statics.getRevenueReport = async function(startDate, endDate, groupBy = 'month') {
  let dateFormat;
  switch(groupBy) {
    case 'day':
      dateFormat = '%Y-%m-%d';
      break;
    case 'week':
      dateFormat = '%Y-W%U';
      break;
    case 'year':
      dateFormat = '%Y';
      break;
    default: // month
      dateFormat = '%Y-%m';
  }
  
  const pipeline = [
    {
      $match: {
        paymentDate: { $gte: startDate, $lte: endDate },
        status: 'Completed'
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$paymentDate' } },
        totalRevenue: { $sum: '$netAmount' },
        paymentCount: { $sum: 1 },
        avgPayment: { $avg: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ];
  
  const result = await this.aggregate(pipeline);
  return result;
};

module.exports = mongoose.model('Payment', paymentSchema);
