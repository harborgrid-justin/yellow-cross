/**
 * CourtDocket Model - Mongoose Schema for Court & Docket Management
 * Comprehensive data model for court docket tracking and e-filing
 */

import mongoose from 'mongoose';

const courtDocketSchema = new mongoose.Schema({
  // Basic Information
  docketNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  courtCaseNumber: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // Court Information
  courtInfo: {
    courtName: {
      type: String,
      required: true,
      trim: true
    },
    jurisdiction: String,
    courtType: {
      type: String,
      enum: ['Federal', 'State', 'Appellate', 'Supreme', 'District', 'Municipal', 'Bankruptcy', 'Other']
    },
    division: String,
    location: String
  },
  
  // Case Details
  caseType: {
    type: String,
    required: true,
    enum: ['Civil', 'Criminal', 'Bankruptcy', 'Appeals', 'Family', 'Probate', 'Other']
  },
  filingDate: {
    type: Date,
    required: true,
    index: true
  },
  
  // Parties
  parties: {
    plaintiffs: [{
      name: String,
      role: String,
      representedBy: String,
      attorney: String
    }],
    defendants: [{
      name: String,
      role: String,
      representedBy: String,
      attorney: String
    }],
    otherParties: [{
      name: String,
      role: String,
      party: String
    }]
  },
  
  // Judge Information
  judge: {
    name: String,
    chambersPhone: String,
    preferences: String,
    notes: String
  },
  
  // Opposing Counsel
  opposingCounsel: [{
    name: {
      type: String,
      trim: true
    },
    firmName: String,
    email: String,
    phone: String,
    address: String,
    representsParty: String,
    barNumber: String,
    notes: String
  }],
  
  // Docket Entries
  entries: [{
    entryNumber: Number,
    entryDate: Date,
    filedDate: Date,
    documentType: String,
    description: String,
    filedBy: String,
    documentUrl: String,
    pageCount: Number,
    isSealed: Boolean,
    notes: String
  }],
  
  // Hearings & Events
  hearings: [{
    hearingDate: Date,
    hearingType: String,
    location: String,
    judgeAssigned: String,
    purpose: String,
    result: String,
    notes: String
  }],
  
  // Electronic Filing
  eFiling: {
    enabled: {
      type: Boolean,
      default: false
    },
    system: String,
    accountNumber: String,
    filings: [{
      filingId: String,
      filedDate: Date,
      documentType: String,
      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Filed']
      },
      confirmationNumber: String,
      rejectionReason: String
    }]
  },
  
  // Status & Progress
  status: {
    type: String,
    enum: ['Open', 'Pending', 'Active', 'Stayed', 'Closed', 'Dismissed', 'Settled', 'Judgment Entered'],
    default: 'Open',
    index: true
  },
  disposition: {
    type: String,
    trim: true
  },
  dispositionDate: {
    type: Date
  },
  
  // Case Association
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  caseNumber: {
    type: String,
    index: true
  },
  
  // Alert Settings
  alerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['Real-time', 'Daily', 'Weekly'],
      default: 'Daily'
    },
    recipients: [String]
  },
  
  // Court Rules
  applicableRules: [{
    ruleNumber: String,
    ruleTitle: String,
    description: String
  }],
  
  // Deadlines
  upcomingDeadlines: [{
    description: String,
    dueDate: Date,
    status: String
  }],
  
  // Metadata
  lastChecked: {
    type: Date
  },
  checkFrequency: {
    type: String,
    enum: ['Hourly', 'Daily', 'Weekly'],
    default: 'Daily'
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for performance
courtDocketSchema.index({ 'courtInfo.courtName': 1, filingDate: -1 });
courtDocketSchema.index({ caseId: 1 });
courtDocketSchema.index({ status: 1, filingDate: -1 });

// Virtual for entry count
courtDocketSchema.virtual('entryCount').get(function() {
  return this.entries ? this.entries.length : 0;
});

// Virtual for days since filing
courtDocketSchema.virtual('daysSinceFiling').get(function() {
  if (this.filingDate) {
    const diffTime = new Date() - this.filingDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Instance method to add docket entry
courtDocketSchema.methods.addEntry = function(entry) {
  const entryNumber = this.entries.length + 1;
  this.entries.push({
    entryNumber,
    ...entry
  });
  return this.save();
};

// Instance method to add hearing
courtDocketSchema.methods.addHearing = function(hearing) {
  this.hearings.push(hearing);
  return this.save();
};

// Instance method to record check
courtDocketSchema.methods.recordCheck = function() {
  this.lastChecked = new Date();
  return this.save();
};

// Static method to find by court
courtDocketSchema.statics.findByCourt = function(courtName) {
  return this.find({ 'courtInfo.courtName': courtName })
    .sort({ filingDate: -1 })
    .limit(100);
};

// Static method to find active dockets
courtDocketSchema.statics.findActive = function() {
  return this.find({
    status: { $in: ['Open', 'Pending', 'Active'] }
  }).sort({ filingDate: -1 });
};

export default mongoose.model('CourtDocket', courtDocketSchema);
