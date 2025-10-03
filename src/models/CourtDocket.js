/**
 * CourtDocket Model - Mongoose Schema for Court Docket Tracking
 * Manages court dockets, filings, and case status updates
 */

const mongoose = require('mongoose');

const courtDocketSchema = new mongoose.Schema({
  // Docket Identification
  docketNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  caseNumber: {
    type: String,
    required: true,
    index: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  
  // Court Information
  courtName: {
    type: String,
    required: true,
    trim: true
  },
  courtType: {
    type: String,
    required: true,
    enum: ['Federal', 'State', 'District', 'Appeals', 'Supreme', 'Municipal', 'County', 'Other']
  },
  jurisdiction: {
    type: String,
    required: true,
    trim: true
  },
  divisionNumber: {
    type: String,
    trim: true
  },
  
  // Case Information
  caseTitle: {
    type: String,
    required: true,
    trim: true
  },
  caseType: {
    type: String,
    required: true,
    enum: ['Civil', 'Criminal', 'Family', 'Probate', 'Bankruptcy', 'Appeals', 'Small Claims', 'Other']
  },
  natureOfSuit: {
    type: String,
    trim: true
  },
  
  // Parties
  plaintiff: {
    type: String,
    required: true,
    trim: true
  },
  defendant: {
    type: String,
    required: true,
    trim: true
  },
  additionalParties: [{
    name: String,
    role: String,
    partyType: {
      type: String,
      enum: ['Plaintiff', 'Defendant', 'Intervenor', 'Amicus', 'Third Party', 'Other']
    }
  }],
  
  // Status & Progress
  docketStatus: {
    type: String,
    required: true,
    enum: ['Open', 'Active', 'Pending', 'Stayed', 'Closed', 'Dismissed', 'Settled', 'Judgment Entered'],
    default: 'Open',
    index: true
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Docket Entries
  entries: [{
    entryNumber: {
      type: Number,
      required: true
    },
    filingDate: {
      type: Date,
      required: true
    },
    docketText: {
      type: String,
      required: true
    },
    documentType: String,
    filedBy: String,
    documentUrl: String,
    pageCount: Number,
    isSealed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Important Dates
  filingDate: {
    type: Date,
    required: true
  },
  nextHearingDate: Date,
  trialDate: Date,
  dispositionDate: Date,
  judgmentDate: Date,
  
  // Judge & Court Assignment
  assignedJudge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Judge'
  },
  judgeName: String,
  magistrateJudge: String,
  courtroom: String,
  
  // Tracking & Monitoring
  isMonitored: {
    type: Boolean,
    default: false,
    index: true
  },
  monitoringUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    addedDate: Date
  }],
  lastCheckedDate: Date,
  lastUpdatedDate: Date,
  
  // Alerts & Notifications
  alertsEnabled: {
    type: Boolean,
    default: true
  },
  alertRecipients: [String],
  
  // Historical Data
  historicalDockets: [{
    retrievedDate: Date,
    entryCount: Number,
    snapshot: mongoose.Schema.Types.Mixed
  }],
  
  // Metadata
  source: {
    type: String,
    enum: ['PACER', 'State System', 'Manual Entry', 'Import', 'API'],
    default: 'Manual Entry'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: String,
  
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
  lastModifiedBy: String,
  lastModifiedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courtDocketSchema.index({ docketNumber: 1 });
courtDocketSchema.index({ caseNumber: 1 });
courtDocketSchema.index({ courtName: 1, docketStatus: 1 });
courtDocketSchema.index({ isMonitored: 1, docketStatus: 1 });
courtDocketSchema.index({ 'entries.filingDate': -1 });
courtDocketSchema.index({ tags: 1 });

// Virtual field for entry count
courtDocketSchema.virtual('entryCount').get(function() {
  return this.entries ? this.entries.length : 0;
});

// Virtual field for days since filing
courtDocketSchema.virtual('daysSinceFiling').get(function() {
  if (!this.filingDate) return null;
  const diff = Date.now() - this.filingDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Static method to find by case
courtDocketSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.findOne({ caseNumber }).sort({ createdAt: -1 });
};

// Static method to find monitored dockets
courtDocketSchema.statics.findMonitored = function(userId) {
  return this.find({
    isMonitored: true,
    'monitoringUsers.userId': userId,
    docketStatus: { $nin: ['Closed', 'Dismissed', 'Settled'] }
  }).sort({ lastUpdatedDate: -1 });
};

// Static method to get recent entries
courtDocketSchema.statics.getRecentEntries = function(days = 7) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    'entries.filingDate': { $gte: cutoffDate }
  }).sort({ 'entries.filingDate': -1 });
};

// Instance method to add docket entry
courtDocketSchema.methods.addEntry = function(entryData, addedBy) {
  const entryNumber = this.entries.length > 0 
    ? Math.max(...this.entries.map(e => e.entryNumber)) + 1 
    : 1;
  
  this.entries.push({
    entryNumber,
    ...entryData,
    createdAt: new Date()
  });
  
  this.lastUpdatedDate = new Date();
  this.lastModifiedBy = addedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to update status
courtDocketSchema.methods.updateStatus = function(newStatus, changedBy, notes) {
  this.statusHistory.push({
    status: this.docketStatus,
    changedBy,
    changedAt: new Date(),
    notes: `Changed from ${this.docketStatus} to ${newStatus}. ${notes || ''}`
  });
  
  this.docketStatus = newStatus;
  this.lastModifiedBy = changedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to enable monitoring
courtDocketSchema.methods.enableMonitoring = function(userId, username) {
  if (!this.monitoringUsers.some(u => u.userId && u.userId.equals(userId))) {
    this.monitoringUsers.push({
      userId,
      username,
      addedDate: new Date()
    });
  }
  
  this.isMonitored = true;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

module.exports = mongoose.model('CourtDocket', courtDocketSchema);
