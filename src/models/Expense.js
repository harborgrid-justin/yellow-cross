/**
 * Expense Model - Mongoose Schema for Expense Tracking
 * Comprehensive data model for case-related expenses and reimbursements
 */

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  // Basic Information
  expenseNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Case/Client Information
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: {
    type: String,
    trim: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    index: true
  },
  clientName: {
    type: String,
    trim: true
  },
  
  // Expense Details
  date: {
    type: Date,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
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
    ],
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // Financial Details
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
  
  // Billable Status
  billable: {
    type: Boolean,
    default: true,
    index: true
  },
  billableAmount: {
    type: Number,
    min: 0
  },
  markup: {
    type: Number,
    default: 0,
    min: 0
  },
  markupAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Payment & Reimbursement
  paidBy: {
    type: String,
    required: true,
    trim: true
  },
  reimbursable: {
    type: Boolean,
    default: false
  },
  reimbursed: {
    type: Boolean,
    default: false
  },
  reimbursementDate: {
    type: Date
  },
  reimbursementMethod: {
    type: String,
    enum: ['Check', 'Direct Deposit', 'Cash', 'Credit', 'Other']
  },
  
  // Invoice Status
  invoiced: {
    type: Boolean,
    default: false,
    index: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
  
  // Receipt Information
  hasReceipt: {
    type: Boolean,
    default: false
  },
  receiptUrl: {
    type: String,
    trim: true
  },
  receiptFilename: {
    type: String,
    trim: true
  },
  receiptNumber: {
    type: String,
    trim: true
  },
  
  // Vendor Information
  vendor: {
    type: String,
    trim: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  vendorInvoiceNumber: {
    type: String,
    trim: true
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: [
      'Credit Card',
      'Debit Card',
      'Cash',
      'Check',
      'Bank Transfer',
      'Petty Cash',
      'Firm Account',
      'Personal',
      'Other'
    ]
  },
  
  // Tax Information
  taxable: {
    type: Boolean,
    default: false
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Status & Approval
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Submitted', 'Approved', 'Rejected', 'Invoiced', 'Paid'],
    default: 'Draft',
    index: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: String,
    trim: true
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: String,
    trim: true
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  
  // Distance/Mileage (for travel expenses)
  distance: {
    type: Number,
    min: 0
  },
  distanceUnit: {
    type: String,
    enum: ['miles', 'kilometers']
  },
  mileageRate: {
    type: Number,
    min: 0
  },
  
  // Notes
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
  submittedBy: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date
  }
}, {
  timestamps: false
});

// Indexes
expenseSchema.index({ caseId: 1, date: -1 });
expenseSchema.index({ clientId: 1, date: -1 });
expenseSchema.index({ paidBy: 1, date: -1 });
expenseSchema.index({ status: 1, billable: 1 });
expenseSchema.index({ invoiced: 1, status: 1 });
expenseSchema.index({ reimbursable: 1, reimbursed: 1 });

// Virtual for total billable amount
expenseSchema.virtual('totalBillableAmount').get(function() {
  if (!this.billable) return 0;
  return (this.billableAmount || this.amount) + this.markupAmount;
});

// Instance method to calculate billable amount with markup
expenseSchema.methods.calculateBillableAmount = function() {
  if (!this.billable) {
    this.billableAmount = 0;
    this.markupAmount = 0;
    return 0;
  }
  
  this.billableAmount = this.amount;
  
  if (this.markup > 0) {
    this.markupAmount = (this.amount * this.markup) / 100;
  }
  
  return this.billableAmount + this.markupAmount;
};

// Instance method to submit for approval
expenseSchema.methods.submit = function(username) {
  this.status = this.requiresApproval ? 'Submitted' : 'Approved';
  this.submittedBy = username;
  this.submittedAt = new Date();
  
  if (!this.requiresApproval) {
    this.approvedBy = username;
    this.approvedAt = new Date();
  }
};

// Instance method to approve
expenseSchema.methods.approve = function(username) {
  this.status = 'Approved';
  this.approvedBy = username;
  this.approvedAt = new Date();
};

// Instance method to reject
expenseSchema.methods.reject = function(username, reason) {
  this.status = 'Rejected';
  this.rejectedBy = username;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
};

// Instance method to mark as reimbursed
expenseSchema.methods.markAsReimbursed = function(method, date) {
  this.reimbursed = true;
  this.reimbursementDate = date || new Date();
  this.reimbursementMethod = method;
};

// Instance method to calculate mileage expense
expenseSchema.methods.calculateMileageExpense = function() {
  if (!this.distance || !this.mileageRate) return 0;
  this.amount = this.distance * this.mileageRate;
  return this.amount;
};

// Pre-save middleware
expenseSchema.pre('save', function(next) {
  // Update lastModifiedAt
  this.lastModifiedAt = new Date();
  
  // Calculate billable amount if not set
  if (this.billable && !this.billableAmount) {
    this.calculateBillableAmount();
  }
  
  next();
});

// Static method to get expense summary
expenseSchema.statics.getExpenseSummary = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        billableAmount: {
          $sum: { $cond: ['$billable', { $add: ['$amount', '$markupAmount'] }, 0] }
        },
        expenseCount: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ];
  
  const result = await this.aggregate(pipeline);
  return result;
};

// Static method to get reimbursement report
expenseSchema.statics.getReimbursementReport = async function(paidBy) {
  const pipeline = [
    {
      $match: {
        paidBy,
        reimbursable: true,
        reimbursed: false,
        status: { $in: ['Approved', 'Invoiced', 'Paid'] }
      }
    },
    {
      $group: {
        _id: null,
        totalReimbursable: { $sum: '$amount' },
        expenseCount: { $sum: 1 },
        oldestExpenseDate: { $min: '$date' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalReimbursable: 0,
    expenseCount: 0,
    oldestExpenseDate: null
  };
};

module.exports = mongoose.model('Expense', expenseSchema);
