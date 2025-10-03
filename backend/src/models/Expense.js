/**
 * Expense Model - Mongoose Schema for Case Expense Tracking
 * Tracks case-related expenses and reimbursements
 */

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  // Expense Information
  expenseNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
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
  
  // Client Information
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    index: true
  },
  clientNumber: {
    type: String,
    trim: true
  },
  
  // Expense Details
  date: {
    type: Date,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Travel', 'Filing Fees', 'Court Costs', 'Document Production', 'Expert Witness', 
           'Research', 'Postage', 'Courier', 'Copying', 'Phone', 'Other'],
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Amount Information
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  unitCost: {
    type: Number,
    min: 0
  },
  
  // Billing Information
  billable: {
    type: Boolean,
    required: true,
    default: true
  },
  markupPercent: {
    type: Number,
    default: 0,
    min: 0
  },
  billedAmount: {
    type: Number,
    min: 0
  },
  
  // Reimbursement
  reimbursable: {
    type: Boolean,
    default: false
  },
  reimbursedTo: {
    type: String,
    trim: true
  },
  reimbursementStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Reimbursed', 'Denied'],
    default: 'Pending'
  },
  reimbursementDate: Date,
  
  // Invoicing
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
  invoiced: {
    type: Boolean,
    default: false
  },
  invoiceDate: Date,
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Cash', 'Check', 'Firm Account', 'Client Account', 'Other']
  },
  paidBy: {
    type: String,
    trim: true
  },
  receiptNumber: {
    type: String,
    trim: true
  },
  
  // Attachments
  receipts: [{
    filename: String,
    fileUrl: String,
    fileSize: Number,
    uploadedAt: Date
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Approved', 'Invoiced', 'Paid', 'Rejected'],
    default: 'Draft',
    index: true
  },
  approvedBy: {
    type: String,
    trim: true
  },
  approvedDate: Date,
  rejectionReason: {
    type: String,
    trim: true
  },
  
  // Metadata
  submittedBy: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  
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
expenseSchema.index({ caseId: 1, date: -1 });
expenseSchema.index({ clientId: 1, date: -1 });
expenseSchema.index({ status: 1, date: -1 });
expenseSchema.index({ category: 1 });

// Calculate billed amount before save
expenseSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('markupPercent')) {
    this.billedAmount = this.amount * (1 + this.markupPercent / 100);
  }
  next();
});

// Instance method to approve expense
expenseSchema.methods.approve = function(approvedBy) {
  this.status = 'Approved';
  this.approvedBy = approvedBy;
  this.approvedDate = new Date();
  return this.save();
};

// Static method to get expense summary
expenseSchema.statics.getSummary = async function(filters) {
  const match = {};
  if (filters.caseId) match.caseId = filters.caseId;
  if (filters.clientId) match.clientId = filters.clientId;
  if (filters.startDate && filters.endDate) {
    match.date = { $gte: filters.startDate, $lte: filters.endDate };
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        billableAmount: {
          $sum: {
            $cond: ['$billable', '$billedAmount', 0]
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

module.exports = mongoose.model('Expense', expenseSchema);
