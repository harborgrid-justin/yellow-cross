/**
 * BillingRate Model - Mongoose Schema for Rate Management
 * Comprehensive data model for attorney rates, flat fees, and contingency arrangements
 */

const mongoose = require('mongoose');

const billingRateSchema = new mongoose.Schema({
  // Basic Information
  rateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Rate Type
  rateType: {
    type: String,
    required: true,
    enum: ['Hourly', 'Flat Fee', 'Contingency', 'Blended', 'Custom'],
    index: true
  },
  
  // Attorney/User Information
  attorneyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  attorneyName: {
    type: String,
    trim: true
  },
  
  // Hourly Rate Details
  hourlyRate: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR']
  },
  
  // Flat Fee Details
  flatFeeAmount: {
    type: Number,
    min: 0
  },
  flatFeeIncludes: {
    type: String,
    trim: true
  },
  flatFeeExcludes: {
    type: String,
    trim: true
  },
  
  // Contingency Fee Details
  contingencyPercent: {
    type: Number,
    min: 0,
    max: 100
  },
  contingencyTiers: [{
    threshold: Number,
    percentage: Number,
    description: String
  }],
  
  // Blended Rate Details (combination of different rates)
  blendedRates: [{
    taskType: String,
    rate: Number,
    description: String
  }],
  
  // Rate Schedule (time-based variations)
  rateSchedule: [{
    effectiveDate: Date,
    expirationDate: Date,
    rate: Number,
    description: String
  }],
  
  // Client/Case Specific
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    index: true
  },
  clientName: {
    type: String,
    trim: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: {
    type: String,
    trim: true
  },
  
  // Practice Area
  practiceArea: {
    type: String,
    trim: true,
    index: true
  },
  matterType: {
    type: String,
    trim: true
  },
  
  // Discount/Markup
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  discountReason: {
    type: String,
    trim: true
  },
  markup: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Rate Variations
  overtimeRate: {
    type: Number,
    min: 0
  },
  rushRate: {
    type: Number,
    min: 0
  },
  weekendRate: {
    type: Number,
    min: 0
  },
  holidayRate: {
    type: Number,
    min: 0
  },
  
  // Minimums & Caps
  minimumCharge: {
    type: Number,
    min: 0
  },
  maximumCharge: {
    type: Number,
    min: 0
  },
  minimumHours: {
    type: Number,
    min: 0
  },
  
  // Billing Increments
  billingIncrement: {
    type: Number,
    enum: [1, 6, 10, 15, 30, 60],
    default: 6,
    description: 'Billing increment in minutes'
  },
  roundingRule: {
    type: String,
    enum: ['Up', 'Down', 'Nearest'],
    default: 'Up'
  },
  
  // Retainer Information
  requiresRetainer: {
    type: Boolean,
    default: false
  },
  retainerAmount: {
    type: Number,
    min: 0
  },
  retainerType: {
    type: String,
    enum: ['Advance Fee', 'Security Deposit', 'Evergreen', 'Flat Fee']
  },
  
  // Payment Terms
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  lateFeesPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Status & Validity
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive', 'Pending', 'Expired'],
    default: 'Active',
    index: true
  },
  effectiveDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expirationDate: {
    type: Date
  },
  
  // Approval & Authorization
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
  
  // History & Changes
  rateHistory: [{
    effectiveDate: Date,
    oldRate: Number,
    newRate: Number,
    rateType: String,
    changedBy: String,
    changeReason: String,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Usage Statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedDate: {
    type: Date
  },
  totalBilled: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Tags & Categories
  tags: [{
    type: String,
    trim: true
  }],
  
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
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
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
  }
}, {
  timestamps: false
});

// Indexes
billingRateSchema.index({ attorneyId: 1, status: 1 });
billingRateSchema.index({ clientId: 1, status: 1 });
billingRateSchema.index({ caseId: 1, status: 1 });
billingRateSchema.index({ practiceArea: 1, status: 1 });
billingRateSchema.index({ rateType: 1, status: 1 });
billingRateSchema.index({ effectiveDate: 1, expirationDate: 1 });

// Virtual for formatted rate
billingRateSchema.virtual('formattedRate').get(function() {
  switch(this.rateType) {
    case 'Hourly':
      return `${this.currency} ${this.hourlyRate}/hour`;
    case 'Flat Fee':
      return `${this.currency} ${this.flatFeeAmount} flat`;
    case 'Contingency':
      return `${this.contingencyPercent}% contingency`;
    default:
      return 'Custom rate';
  }
});

// Instance method to get effective rate for a date
billingRateSchema.methods.getEffectiveRate = function(date = new Date()) {
  // Check if rate is active
  if (this.status !== 'Active') {
    return null;
  }
  
  // Check if date is within effective range
  if (this.expirationDate && date > this.expirationDate) {
    return null;
  }
  
  if (date < this.effectiveDate) {
    return null;
  }
  
  // Check rate schedule
  if (this.rateSchedule && this.rateSchedule.length > 0) {
    const scheduledRate = this.rateSchedule.find(schedule => {
      return date >= schedule.effectiveDate && 
             (!schedule.expirationDate || date <= schedule.expirationDate);
    });
    
    if (scheduledRate) {
      return scheduledRate.rate;
    }
  }
  
  // Return base rate
  switch(this.rateType) {
    case 'Hourly':
      return this.hourlyRate;
    case 'Flat Fee':
      return this.flatFeeAmount;
    case 'Contingency':
      return this.contingencyPercent;
    default:
      return null;
  }
};

// Instance method to calculate contingency fee
billingRateSchema.methods.calculateContingencyFee = function(settlementAmount) {
  if (this.rateType !== 'Contingency') {
    return 0;
  }
  
  // Check if tiered contingency
  if (this.contingencyTiers && this.contingencyTiers.length > 0) {
    let totalFee = 0;
    let remainingAmount = settlementAmount;
    
    // Sort tiers by threshold
    const sortedTiers = this.contingencyTiers.sort((a, b) => a.threshold - b.threshold);
    
    for (let i = 0; i < sortedTiers.length; i++) {
      const tier = sortedTiers[i];
      const nextThreshold = sortedTiers[i + 1] ? sortedTiers[i + 1].threshold : Infinity;
      
      if (settlementAmount > tier.threshold) {
        const tierAmount = Math.min(remainingAmount, nextThreshold - tier.threshold);
        totalFee += (tierAmount * tier.percentage) / 100;
        remainingAmount -= tierAmount;
      }
      
      if (remainingAmount <= 0) break;
    }
    
    return totalFee;
  }
  
  // Simple percentage calculation
  return (settlementAmount * this.contingencyPercent) / 100;
};

// Instance method to apply discount
billingRateSchema.methods.applyDiscount = function(amount) {
  if (!this.discount || this.discount === 0) {
    return amount;
  }
  
  const discountAmount = (amount * this.discount) / 100;
  return amount - discountAmount;
};

// Instance method to record usage
billingRateSchema.methods.recordUsage = function(billedAmount) {
  this.usageCount++;
  this.lastUsedDate = new Date();
  this.totalBilled += billedAmount;
};

// Instance method to update rate
billingRateSchema.methods.updateRate = function(newRate, changeReason, username) {
  const oldRate = this.getEffectiveRate();
  
  this.rateHistory.push({
    effectiveDate: new Date(),
    oldRate,
    newRate,
    rateType: this.rateType,
    changedBy: username,
    changeReason
  });
  
  switch(this.rateType) {
    case 'Hourly':
      this.hourlyRate = newRate;
      break;
    case 'Flat Fee':
      this.flatFeeAmount = newRate;
      break;
    case 'Contingency':
      this.contingencyPercent = newRate;
      break;
  }
};

// Pre-save middleware
billingRateSchema.pre('save', function(next) {
  // Update lastModifiedAt
  this.lastModifiedAt = new Date();
  
  // Check if expired
  if (this.expirationDate && new Date() > this.expirationDate) {
    this.status = 'Expired';
  }
  
  next();
});

// Static method to get active rates for attorney
billingRateSchema.statics.getAttorneyRates = async function(attorneyId, practiceArea) {
  const query = {
    attorneyId,
    status: 'Active',
    effectiveDate: { $lte: new Date() },
    $or: [
      { expirationDate: { $exists: false } },
      { expirationDate: { $gte: new Date() } }
    ]
  };
  
  if (practiceArea) {
    query.practiceArea = practiceArea;
  }
  
  return await this.find(query).sort({ effectiveDate: -1 });
};

module.exports = mongoose.model('BillingRate', billingRateSchema);
