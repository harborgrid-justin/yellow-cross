/**
 * OpposingCounsel Model - Mongoose Schema for Opposing Counsel Database
 * Tracks opposing counsel, law firms, and interaction history
 */

const mongoose = require('mongoose');

const opposingCounselSchema = new mongoose.Schema({
  // Counsel Identification
  counselId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  middleName: {
    type: String,
    trim: true
  },
  suffix: String,
  title: String,
  
  // Professional Information
  barNumber: {
    type: String,
    trim: true,
    index: true
  },
  barAdmissions: [{
    jurisdiction: String,
    barNumber: String,
    admissionDate: Date,
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended', 'Disbarred']
    }
  }],
  
  // Firm Information
  firmName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LawFirm'
  },
  position: String,
  department: String,
  
  // Contact Information
  primaryEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  secondaryEmail: String,
  officePhone: String,
  mobilePhone: String,
  fax: String,
  
  // Address
  officeAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    }
  },
  
  // Practice Information
  practiceAreas: [{
    type: String,
    trim: true
  }],
  specializations: [String],
  yearsOfExperience: Number,
  
  // Professional Profile
  biography: String,
  education: [{
    institution: String,
    degree: String,
    graduationYear: Number
  }],
  publications: [{
    title: String,
    publicationDate: Date,
    publisher: String,
    url: String
  }],
  awards: [{
    award: String,
    year: Number,
    organization: String
  }],
  
  // Case History
  cases: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    caseNumber: String,
    caseTitle: String,
    role: {
      type: String,
      enum: ['Lead Counsel', 'Co-Counsel', 'Associate', 'Of Counsel']
    },
    startDate: Date,
    endDate: Date,
    outcome: String,
    notes: String
  }],
  totalCasesAgainst: {
    type: Number,
    default: 0
  },
  activeCases: {
    type: Number,
    default: 0
  },
  
  // Communication History
  communications: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['Email', 'Phone Call', 'Letter', 'Meeting', 'Court Appearance', 'Deposition', 'Other']
    },
    subject: String,
    summary: String,
    outcome: String,
    recordedBy: String,
    caseNumber: String
  }],
  
  // Behavioral Notes
  negotiationStyle: {
    type: String,
    enum: ['Collaborative', 'Competitive', 'Accommodating', 'Avoiding', 'Compromising', 'Unknown']
  },
  communicationPreference: {
    type: String,
    enum: ['Email', 'Phone', 'Written Letter', 'In Person', 'No Preference']
  },
  responsiveness: {
    type: String,
    enum: ['Very Responsive', 'Responsive', 'Average', 'Slow', 'Very Slow', 'Unknown']
  },
  professionalismRating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  
  // Strategy & Tactics
  commonTactics: [String],
  strengths: [String],
  weaknesses: [String],
  successfulStrategies: [String],
  
  // Statistics
  stats: {
    casesWon: {
      type: Number,
      default: 0
    },
    casesLost: {
      type: Number,
      default: 0
    },
    casesSettled: {
      type: Number,
      default: 0
    },
    averageSettlementAmount: Number,
    averageCaseDuration: Number
  },
  
  // Professional Conduct
  disciplinaryActions: [{
    date: Date,
    jurisdiction: String,
    action: String,
    description: String,
    status: String
  }],
  
  // Conflict Check
  conflictCheckStatus: {
    type: String,
    enum: ['Cleared', 'Potential Conflict', 'Conflict Exists', 'Not Checked'],
    default: 'Not Checked'
  },
  conflictNotes: String,
  
  // Social & Professional Links
  linkedInUrl: String,
  firmWebsiteUrl: String,
  martindaleListing: String,
  stateBarUrl: String,
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  customFields: mongoose.Schema.Types.Mixed,
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Retired', 'Deceased'],
    default: 'Active',
    index: true
  },
  
  // Tracking
  lastContactDate: Date,
  lastCaseDate: Date,
  
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
opposingCounselSchema.index({ lastName: 1, firstName: 1 });
opposingCounselSchema.index({ firmName: 1, status: 1 });
opposingCounselSchema.index({ primaryEmail: 1 });
opposingCounselSchema.index({ barNumber: 1 });
opposingCounselSchema.index({ practiceAreas: 1 });
opposingCounselSchema.index({ tags: 1 });
opposingCounselSchema.index({ 'cases.caseNumber': 1 });

// Virtual field for full name
opposingCounselSchema.virtual('fullName').get(function() {
  let name = `${this.firstName} ${this.lastName}`;
  if (this.suffix) name += `, ${this.suffix}`;
  return name;
});

// Virtual field for communication count
opposingCounselSchema.virtual('communicationCount').get(function() {
  return this.communications ? this.communications.length : 0;
});

// Virtual field for win rate
opposingCounselSchema.virtual('winRate').get(function() {
  const total = this.stats.casesWon + this.stats.casesLost;
  if (total === 0) return 0;
  return (this.stats.casesWon / total * 100).toFixed(2);
});

// Static method to search counsel
opposingCounselSchema.statics.searchCounsel = function(searchTerm) {
  return this.find({
    $or: [
      { firstName: new RegExp(searchTerm, 'i') },
      { lastName: new RegExp(searchTerm, 'i') },
      { firmName: new RegExp(searchTerm, 'i') },
      { primaryEmail: new RegExp(searchTerm, 'i') }
    ],
    status: 'Active'
  }).sort({ lastName: 1, firstName: 1 });
};

// Static method to find by firm
opposingCounselSchema.statics.findByFirm = function(firmName) {
  return this.find({
    firmName: new RegExp(firmName, 'i'),
    status: 'Active'
  }).sort({ lastName: 1, firstName: 1 });
};

// Static method to find by practice area
opposingCounselSchema.statics.findByPracticeArea = function(practiceArea) {
  return this.find({
    practiceAreas: practiceArea,
    status: 'Active'
  }).sort({ lastName: 1, firstName: 1 });
};

// Instance method to add case
opposingCounselSchema.methods.addCase = function(caseData) {
  this.cases.push({
    ...caseData,
    startDate: caseData.startDate || new Date()
  });
  this.activeCases += 1;
  this.totalCasesAgainst += 1;
  this.lastCaseDate = new Date();
  
  return this.save();
};

// Instance method to add communication
opposingCounselSchema.methods.addCommunication = function(communicationData, recordedBy) {
  this.communications.push({
    ...communicationData,
    recordedBy,
    date: communicationData.date || new Date()
  });
  this.lastContactDate = new Date();
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to update case outcome
opposingCounselSchema.methods.updateCaseOutcome = function(caseId, outcome) {
  const caseIndex = this.cases.findIndex(c => c.caseId && c.caseId.equals(caseId));
  
  if (caseIndex !== -1) {
    this.cases[caseIndex].outcome = outcome;
    this.cases[caseIndex].endDate = new Date();
    this.activeCases = Math.max(0, this.activeCases - 1);
    
    // Update statistics
    if (outcome === 'Won') this.stats.casesWon += 1;
    else if (outcome === 'Lost') this.stats.casesLost += 1;
    else if (outcome === 'Settled') this.stats.casesSettled += 1;
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

module.exports = mongoose.model('OpposingCounsel', opposingCounselSchema);
