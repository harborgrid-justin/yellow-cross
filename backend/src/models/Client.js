/**
 * Client Model - Mongoose Schema for Client Relationship Management
 * Comprehensive data model for client management in law firms
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
  middleName: {
    type: String,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Individual', 'Business', 'Non-Profit', 'Government', 'Other'],
    default: 'Individual'
  },
  companyName: {
    type: String,
    trim: true
  },
  
  // Contact Information
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  fax: {
    type: String,
    trim: true
  },
  
  // Address
  address: {
    street: String,
    suite: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  
  // Client Status
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive', 'Prospect', 'Former', 'Blacklisted'],
    default: 'Prospect',
    index: true
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  
  // Client Classification
  category: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['Referral', 'Website', 'Advertisement', 'Social Media', 'Walk-in', 'Existing Client', 'Other'],
    trim: true
  },
  referredBy: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Relationship Information
  assignedAttorney: {
    type: String,
    trim: true
  },
  assignedParalegal: {
    type: String,
    trim: true
  },
  relationshipManager: {
    type: String,
    trim: true
  },
  clientSince: {
    type: Date,
    default: Date.now
  },
  lastContactDate: {
    type: Date
  },
  nextFollowUpDate: {
    type: Date
  },
  
  // Billing Information
  billingPreference: {
    type: String,
    enum: ['Email', 'Mail', 'Portal', 'Both'],
    default: 'Email'
  },
  paymentTerms: {
    type: String,
    enum: ['Due on Receipt', 'Net 15', 'Net 30', 'Net 60', 'Custom'],
    default: 'Net 30'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Check', 'Wire Transfer', 'ACH', 'Cash', 'Other']
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  creditStatus: {
    type: String,
    enum: ['Good', 'Hold', 'Bad'],
    default: 'Good'
  },
  retainerBalance: {
    type: Number,
    default: 0
  },
  outstandingBalance: {
    type: Number,
    default: 0
  },
  totalBilled: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  
  // Portal Access
  portalAccess: {
    enabled: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      trim: true,
      sparse: true,
      unique: true
    },
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0
    }
  },
  
  // Communication Preferences
  communicationPreferences: {
    email: { type: Boolean, default: true },
    phone: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    mail: { type: Boolean, default: true }
  },
  
  // Conflict Check
  conflictCheckStatus: {
    type: String,
    enum: ['Pending', 'Clear', 'Conflict Detected', 'Waived'],
    default: 'Pending'
  },
  conflictCheckDate: Date,
  conflictCheckBy: String,
  conflictNotes: String,
  
  // Satisfaction & Feedback
  satisfactionScore: {
    type: Number,
    min: 1,
    max: 10
  },
  lastFeedbackDate: Date,
  feedbackCount: {
    type: Number,
    default: 0
  },
  
  // Client Lifetime Value
  lifetimeValue: {
    type: Number,
    default: 0
  },
  averageCaseValue: {
    type: Number,
    default: 0
  },
  totalCases: {
    type: Number,
    default: 0
  },
  activeCases: {
    type: Number,
    default: 0
  },
  
  // Notes and Custom Fields
  notes: {
    type: String,
    trim: true
  },
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  archivedDate: Date,
  archivedBy: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
clientSchema.index({ lastName: 1, firstName: 1 });
clientSchema.index({ companyName: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ status: 1, createdAt: -1 });
clientSchema.index({ assignedAttorney: 1 });
clientSchema.index({ tags: 1 });

// Virtual for full name
clientSchema.virtual('fullName').get(function() {
  if (this.type === 'Business') {
    return this.companyName || `${this.firstName} ${this.lastName}`;
  }
  return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
});

// Instance method to update status with history
clientSchema.methods.updateStatus = function(newStatus, changedBy, reason) {
  this.statusHistory.push({
    status: this.status,
    changedBy,
    changedAt: new Date(),
    reason
  });
  this.status = newStatus;
  this.lastModifiedBy = changedBy;
  return this.save();
};

// Instance method to check for conflicts
clientSchema.methods.runConflictCheck = function(checkedBy) {
  this.conflictCheckStatus = 'Clear'; // Simplified - would integrate with actual conflict checking system
  this.conflictCheckDate = new Date();
  this.conflictCheckBy = checkedBy;
  return this.save();
};

// Instance method to record communication
clientSchema.methods.recordCommunication = function() {
  this.lastContactDate = new Date();
  return this.save();
};

// Instance method to calculate lifetime value
clientSchema.methods.calculateLifetimeValue = function() {
  this.lifetimeValue = this.totalPaid;
  if (this.totalCases > 0) {
    this.averageCaseValue = this.totalPaid / this.totalCases;
  }
  return this.save();
};

// Static method to get active clients
clientSchema.statics.getActiveClients = function() {
  return this.find({ status: 'Active' }).sort({ lastName: 1, firstName: 1 });
};

// Static method to search clients
clientSchema.statics.searchClients = function(searchTerm) {
  const searchRegex = new RegExp(searchTerm, 'i');
  return this.find({
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { companyName: searchRegex },
      { email: searchRegex },
      { clientNumber: searchRegex }
    ]
  }).limit(50);
};

// Static method for client analytics
clientSchema.statics.getAnalytics = async function() {
  const totalClients = await this.countDocuments();
  const activeClients = await this.countDocuments({ status: 'Active' });
  const prospectClients = await this.countDocuments({ status: 'Prospect' });
  
  const lifetimeValueStats = await this.aggregate([
    { $match: { status: 'Active' } },
    {
      $group: {
        _id: null,
        totalLifetimeValue: { $sum: '$lifetimeValue' },
        averageLifetimeValue: { $avg: '$lifetimeValue' }
      }
    }
  ]);
  
  return {
    totalClients,
    activeClients,
    prospectClients,
    formerClients: await this.countDocuments({ status: 'Former' }),
    lifetimeValue: lifetimeValueStats[0] || { totalLifetimeValue: 0, averageLifetimeValue: 0 }
  };
};

// Pre-save middleware
clientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set display name if not set
  if (!this.displayName) {
    this.displayName = this.type === 'Business' ? this.companyName : `${this.firstName} ${this.lastName}`;
  }
  
  next();
});

module.exports = mongoose.model('Client', clientSchema);
