/**
 * TimeEntry Model - Mongoose Schema for Time Tracking & Billing
 * Comprehensive data model for legal time tracking and billing
 */

const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  // Basic Information
  entryNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Attorney/User Information
  attorneyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attorneyName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Case/Client Information
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  caseNumber: {
    type: String,
    trim: true,
    index: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  clientName: {
    type: String,
    trim: true
  },
  
  // Time Details
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  hours: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  minutes: {
    type: Number,
    default: 0,
    min: 0,
    max: 59
  },
  totalMinutes: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Billing Information
  billable: {
    type: Boolean,
    default: true,
    index: true
  },
  billingRate: {
    type: Number,
    min: 0
  },
  amount: {
    type: Number,
    min: 0
  },
  
  // Description & Categorization
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  taskType: {
    type: String,
    enum: [
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
    ],
    default: 'Other'
  },
  billingCode: {
    type: String,
    trim: true
  },
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Approved', 'Invoiced', 'Paid', 'Written Off'],
    default: 'Draft',
    index: true
  },
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
  
  // Timer Information (for timer-based tracking)
  timerBased: {
    type: Boolean,
    default: false
  },
  timerStarted: {
    type: Date
  },
  timerStopped: {
    type: Date
  },
  timerPaused: {
    type: Boolean,
    default: false
  },
  pausedDuration: {
    type: Number,
    default: 0
  },
  
  // Rounding Rules Applied
  roundingRule: {
    type: String,
    enum: ['None', '6 Minutes', '15 Minutes', '30 Minutes', '1 Hour'],
    default: 'None'
  },
  originalMinutes: {
    type: Number
  },
  
  // Write-off & Adjustments
  writeOff: {
    type: Boolean,
    default: false
  },
  writeOffAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  writeOffReason: {
    type: String,
    trim: true
  },
  writeOffBy: {
    type: String,
    trim: true
  },
  writeOffDate: {
    type: Date
  },
  
  // Discount
  discount: {
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
  
  // Approval Workflow
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
  approvalNotes: {
    type: String,
    trim: true
  },
  
  // Tags & Custom Fields
  tags: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: Map,
    of: String
  },
  
  // Notes & Comments
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
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
  timestamps: false // Using custom timestamps
});

// Indexes for performance
timeEntrySchema.index({ attorneyId: 1, date: -1 });
timeEntrySchema.index({ caseId: 1, date: -1 });
timeEntrySchema.index({ clientId: 1, date: -1 });
timeEntrySchema.index({ status: 1, billable: 1 });
timeEntrySchema.index({ invoiced: 1, status: 1 });
timeEntrySchema.index({ date: -1, createdAt: -1 });

// Virtual for formatted hours
timeEntrySchema.virtual('formattedHours').get(function() {
  const totalHours = Math.floor(this.totalMinutes / 60);
  const mins = this.totalMinutes % 60;
  return `${totalHours}h ${mins}m`;
});

// Virtual for net amount (after write-offs and discounts)
timeEntrySchema.virtual('netAmount').get(function() {
  if (!this.amount) return 0;
  return this.amount - this.writeOffAmount - this.discountAmount;
});

// Instance method to calculate amount
timeEntrySchema.methods.calculateAmount = function() {
  if (!this.billable || !this.billingRate) {
    this.amount = 0;
    return this.amount;
  }
  
  const hoursDecimal = this.totalMinutes / 60;
  this.amount = hoursDecimal * this.billingRate;
  return this.amount;
};

// Instance method to apply rounding
timeEntrySchema.methods.applyRounding = function(rule) {
  if (!rule || rule === 'None') return this.totalMinutes;
  
  this.originalMinutes = this.totalMinutes;
  let roundingIncrement = 1;
  
  switch(rule) {
    case '6 Minutes':
      roundingIncrement = 6;
      break;
    case '15 Minutes':
      roundingIncrement = 15;
      break;
    case '30 Minutes':
      roundingIncrement = 30;
      break;
    case '1 Hour':
      roundingIncrement = 60;
      break;
  }
  
  this.totalMinutes = Math.ceil(this.totalMinutes / roundingIncrement) * roundingIncrement;
  this.roundingRule = rule;
  
  return this.totalMinutes;
};

// Instance method to submit for approval
timeEntrySchema.methods.submit = function(username) {
  this.status = this.requiresApproval ? 'Submitted' : 'Approved';
  this.submittedBy = username;
  this.submittedAt = new Date();
  
  if (!this.requiresApproval) {
    this.approvedBy = username;
    this.approvedAt = new Date();
  }
};

// Instance method to approve
timeEntrySchema.methods.approve = function(username, notes) {
  this.status = 'Approved';
  this.approvedBy = username;
  this.approvedAt = new Date();
  if (notes) this.approvalNotes = notes;
};

// Instance method to write off
timeEntrySchema.methods.applyWriteOff = function(amount, reason, username) {
  this.writeOff = true;
  this.writeOffAmount = amount;
  this.writeOffReason = reason;
  this.writeOffBy = username;
  this.writeOffDate = new Date();
  this.status = 'Written Off';
};

// Pre-save middleware
timeEntrySchema.pre('save', function(next) {
  // Calculate total minutes from hours and minutes if not set
  if (!this.totalMinutes) {
    this.totalMinutes = (this.hours * 60) + (this.minutes || 0);
  }
  
  // Calculate amount if billable rate is set
  if (this.billable && this.billingRate && !this.amount) {
    this.calculateAmount();
  }
  
  // Update lastModifiedAt
  this.lastModifiedAt = new Date();
  
  next();
});

// Static method to get billable summary
timeEntrySchema.statics.getBillableSummary = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: null,
        totalBillableMinutes: {
          $sum: { $cond: ['$billable', '$totalMinutes', 0] }
        },
        totalNonBillableMinutes: {
          $sum: { $cond: ['$billable', 0, '$totalMinutes'] }
        },
        totalBillableAmount: {
          $sum: { $cond: ['$billable', '$amount', 0] }
        },
        totalEntries: { $sum: 1 },
        billableEntries: {
          $sum: { $cond: ['$billable', 1, 0] }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalBillableMinutes: 0,
    totalNonBillableMinutes: 0,
    totalBillableAmount: 0,
    totalEntries: 0,
    billableEntries: 0
  };
};

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
