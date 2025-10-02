/**
 * Client Model - Mongoose Schema for Client Relationship Management
 * Comprehensive data model for client management
 */

const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Basic Information
  clientNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  
  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  
  // Client Classification
  clientType: {
    type: String,
    enum: ['Individual', 'Business', 'Corporation', 'Non-Profit', 'Government', 'Other'],
    default: 'Individual'
  },
  clientCategory: {
    type: String,
    enum: ['VIP', 'Standard', 'Pro Bono', 'Referral', 'Retainer'],
    default: 'Standard'
  },
  industryType: {
    type: String,
    trim: true
  },
  
  // Status & Lifecycle
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Prospective', 'Former', 'Suspended'],
    default: 'Prospective'
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: { type: Date, default: Date.now },
    reason: String
  }],
  
  // Relationship Information
  primaryAttorney: {
    type: String,
    trim: true
  },
  assignedAttorneyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralSource: {
    type: String,
    trim: true
  },
  referredBy: {
    type: String,
    trim: true
  },
  
  // Important Dates
  intakeDate: {
    type: Date,
    default: Date.now
  },
  firstContactDate: {
    type: Date
  },
  lastContactDate: {
    type: Date
  },
  onboardingCompletedDate: {
    type: Date
  },
  
  // Financial Information Reference
  billingPreferences: {
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Bank Transfer', 'Check', 'Cash', 'Wire Transfer', 'Retainer'],
      default: 'Credit Card'
    },
    billingCycle: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Per Matter', 'Retainer', 'Hourly'],
      default: 'Per Matter'
    },
    creditLimit: {
      type: Number,
      default: 0
    },
    creditStatus: {
      type: String,
      enum: ['Good', 'Warning', 'Hold', 'Collections'],
      default: 'Good'
    }
  },
  
  // Portal Access
  portalAccess: {
    enabled: { type: Boolean, default: false },
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    credentialsSetup: { type: Boolean, default: false }
  },
  
  // Custom Fields
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Tags for categorization
  tags: [{
    type: String,
    trim: true
  }],
  
  // Notes and Metadata
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  
  // Conflict Check Data
  conflictCheckStatus: {
    status: {
      type: String,
      enum: ['Pending', 'Clear', 'Conflict', 'Waived'],
      default: 'Pending'
    },
    lastCheckedDate: Date,
    checkedBy: String
  },
  
  // Analytics Metrics
  metrics: {
    totalMatters: { type: Number, default: 0 },
    activeMatters: { type: Number, default: 0 },
    closedMatters: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 },
    lifetimeValue: { type: Number, default: 0 },
    satisfactionScore: { type: Number, min: 0, max: 10 },
    npsScore: { type: Number, min: -100, max: 100 }
  }
}, {
  timestamps: true
});

// Virtual for full name
clientSchema.virtual('fullNameDisplay').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for client duration (days since intake)
clientSchema.virtual('clientDuration').get(function() {
  if (!this.intakeDate) return null;
  const now = new Date();
  const diffTime = Math.abs(now - this.intakeDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Index for search
clientSchema.index({ firstName: 'text', lastName: 'text', email: 'text', clientNumber: 'text' });

// Index for queries
clientSchema.index({ status: 1, clientType: 1 });
clientSchema.index({ primaryAttorney: 1 });
clientSchema.index({ createdAt: -1 });

// Pre-save hook to set fullName
clientSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

// Method to update status
clientSchema.methods.updateStatus = function(newStatus, changedBy, reason) {
  this.statusHistory.push({
    status: this.status,
    changedBy,
    changedAt: new Date(),
    reason
  });
  this.status = newStatus;
};

// Method to log contact
clientSchema.methods.updateLastContact = function() {
  this.lastContactDate = new Date();
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
