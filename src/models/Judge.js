/**
 * Judge Model - Mongoose Schema for Judge Information
 * Manages judge profiles, preferences, ruling history, and courtroom procedures
 */

const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema({
  // Judge Identification
  judgeId: {
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
  honorific: {
    type: String,
    enum: ['Judge', 'Justice', 'Magistrate Judge', 'Chief Judge', 'Chief Justice', 'Associate Justice'],
    default: 'Judge'
  },
  
  // Court Assignment
  court: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  courtType: {
    type: String,
    required: true,
    enum: ['Federal', 'State', 'District', 'Appeals', 'Supreme', 'Municipal', 'County', 'Administrative', 'Other']
  },
  jurisdiction: {
    type: String,
    required: true,
    trim: true
  },
  division: String,
  courtroom: String,
  
  // Judicial Information
  appointmentType: {
    type: String,
    enum: ['Appointed', 'Elected', 'Nominated and Confirmed', 'Temporary', 'Retired/Senior Status']
  },
  appointedBy: String,
  appointmentDate: Date,
  commissionDate: Date,
  seniorStatusDate: Date,
  terminationDate: Date,
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Senior Status', 'Retired', 'Deceased', 'Inactive'],
    default: 'Active',
    index: true
  },
  
  // Education & Background
  lawSchool: String,
  lawSchoolGraduationYear: Number,
  undergraduateSchool: String,
  education: [{
    institution: String,
    degree: String,
    graduationYear: Number
  }],
  
  // Prior Experience
  priorExperience: [{
    position: String,
    organization: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  
  // Judicial Biography
  biography: String,
  careerHighlights: [String],
  notableDecisions: [{
    caseName: String,
    citation: String,
    year: Number,
    description: String,
    significance: String
  }],
  
  // Judicial Preferences
  preferences: {
    communicationStyle: {
      type: String,
      enum: ['Formal', 'Informal', 'Strict', 'Flexible', 'Unknown']
    },
    briefingPreferences: String,
    oralArgumentStyle: String,
    
    // Procedural Preferences
    motionPractice: String,
    discoveryApproach: String,
    settlementEncouragement: {
      type: String,
      enum: ['Highly Encourages', 'Encourages', 'Neutral', 'Discourages', 'Unknown']
    },
    
    // Courtroom Procedures
    courtroomDecorum: String,
    punctuality: {
      type: String,
      enum: ['Very Strict', 'Strict', 'Moderate', 'Flexible', 'Unknown']
    },
    technologyUsage: String,
    
    // Document Preferences
    preferredCitationFormat: String,
    pageLimitEnforcement: {
      type: String,
      enum: ['Strict', 'Moderate', 'Flexible', 'Unknown']
    },
    formattingRequirements: String
  },
  
  // Ruling History & Statistics
  rulingHistory: {
    totalCases: {
      type: Number,
      default: 0
    },
    civilCases: {
      type: Number,
      default: 0
    },
    criminalCases: {
      type: Number,
      default: 0
    },
    
    // Motion Statistics
    motionsGranted: {
      type: Number,
      default: 0
    },
    motionsDenied: {
      type: Number,
      default: 0
    },
    motionsGrantedInPart: {
      type: Number,
      default: 0
    },
    
    // Trial Statistics
    trialsCompleted: {
      type: Number,
      default: 0
    },
    averageTrialLength: Number,
    
    // Settlement
    settlementRate: Number,
    
    // Appeals
    appealedDecisions: {
      type: Number,
      default: 0
    },
    affirmedOnAppeal: {
      type: Number,
      default: 0
    },
    reversedOnAppeal: {
      type: Number,
      default: 0
    },
    
    // Timing
    averageTimeToDecision: Number,
    averageTimeToTrial: Number
  },
  
  // Case Types & Practice Areas
  caseTypes: [{
    type: String,
    trim: true
  }],
  practiceAreasHandled: [String],
  
  // Important Cases Handled
  cases: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    caseNumber: String,
    caseTitle: String,
    caseType: String,
    filingDate: Date,
    dispositionDate: Date,
    disposition: String,
    notes: String
  }],
  
  // Courtroom Procedures
  courtroomProcedures: {
    motionHearingSchedule: String,
    statusConferenceSchedule: String,
    trialSchedule: String,
    specialProcedures: [String],
    localRules: [String]
  },
  
  // Law Clerks & Staff
  lawClerks: [{
    name: String,
    email: String,
    startDate: Date,
    endDate: Date,
    current: Boolean
  }],
  courtStaff: [{
    name: String,
    role: String,
    email: String,
    phone: String
  }],
  
  // Contact Information (Public)
  chambers: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    phone: String,
    fax: String,
    email: String
  },
  
  // Professional Affiliations
  professionalAffiliations: [{
    organization: String,
    position: String,
    startDate: Date,
    endDate: Date
  }],
  
  // Publications & Speeches
  publications: [{
    title: String,
    publicationDate: Date,
    publisher: String,
    url: String
  }],
  speeches: [{
    title: String,
    event: String,
    date: Date,
    description: String
  }],
  
  // Ratings & Feedback
  ratings: {
    preparednessRating: Number,
    fairnessRating: Number,
    temperamentRating: Number,
    overallRating: Number,
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  
  // Notes & Observations
  practiceNotes: String,
  strategicNotes: String,
  commonRulings: [String],
  
  // External Links
  courtWebsiteUrl: String,
  biographyUrl: String,
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  customFields: mongoose.Schema.Types.Mixed,
  
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
judgeSchema.index({ lastName: 1, firstName: 1 });
judgeSchema.index({ court: 1, status: 1 });
judgeSchema.index({ courtType: 1, jurisdiction: 1 });
judgeSchema.index({ tags: 1 });
judgeSchema.index({ 'cases.caseNumber': 1 });

// Virtual field for full name
judgeSchema.virtual('fullName').get(function() {
  let name = `${this.honorific} ${this.firstName} ${this.lastName}`;
  if (this.suffix) name += `, ${this.suffix}`;
  return name;
});

// Virtual field for appeal reversal rate
judgeSchema.virtual('reversalRate').get(function() {
  const total = this.rulingHistory.affirmedOnAppeal + this.rulingHistory.reversedOnAppeal;
  if (total === 0) return 0;
  return (this.rulingHistory.reversedOnAppeal / total * 100).toFixed(2);
});

// Virtual field for motion grant rate
judgeSchema.virtual('motionGrantRate').get(function() {
  const total = this.rulingHistory.motionsGranted + this.rulingHistory.motionsDenied + this.rulingHistory.motionsGrantedInPart;
  if (total === 0) return 0;
  return (this.rulingHistory.motionsGranted / total * 100).toFixed(2);
});

// Static method to find by court
judgeSchema.statics.findByCourt = function(court) {
  return this.find({
    court,
    status: { $in: ['Active', 'Senior Status'] }
  }).sort({ lastName: 1, firstName: 1 });
};

// Static method to search judges
judgeSchema.statics.searchJudges = function(searchTerm) {
  return this.find({
    $or: [
      { firstName: new RegExp(searchTerm, 'i') },
      { lastName: new RegExp(searchTerm, 'i') },
      { court: new RegExp(searchTerm, 'i') }
    ],
    status: { $in: ['Active', 'Senior Status'] }
  }).sort({ lastName: 1, firstName: 1 });
};

// Static method to find by jurisdiction
judgeSchema.statics.findByJurisdiction = function(jurisdiction) {
  return this.find({
    jurisdiction,
    status: { $in: ['Active', 'Senior Status'] }
  }).sort({ court: 1, lastName: 1 });
};

// Instance method to add case
judgeSchema.methods.addCase = function(caseData) {
  this.cases.push(caseData);
  
  // Update statistics
  this.rulingHistory.totalCases += 1;
  if (caseData.caseType === 'Civil') {
    this.rulingHistory.civilCases += 1;
  } else if (caseData.caseType === 'Criminal') {
    this.rulingHistory.criminalCases += 1;
  }
  
  return this.save();
};

// Instance method to record ruling
judgeSchema.methods.recordRuling = function(rulingData) {
  const { type, result } = rulingData;
  
  if (type === 'motion') {
    if (result === 'granted') this.rulingHistory.motionsGranted += 1;
    else if (result === 'denied') this.rulingHistory.motionsDenied += 1;
    else if (result === 'granted_in_part') this.rulingHistory.motionsGrantedInPart += 1;
  } else if (type === 'trial') {
    this.rulingHistory.trialsCompleted += 1;
  } else if (type === 'appeal') {
    this.rulingHistory.appealedDecisions += 1;
    if (result === 'affirmed') this.rulingHistory.affirmedOnAppeal += 1;
    else if (result === 'reversed') this.rulingHistory.reversedOnAppeal += 1;
  }
  
  this.lastModifiedAt = new Date();
  return this.save();
};

// Instance method to add rating
judgeSchema.methods.addRating = function(ratings) {
  const count = this.ratings.reviewCount;
  
  // Calculate new weighted averages
  if (ratings.preparednessRating) {
    this.ratings.preparednessRating = ((this.ratings.preparednessRating * count) + ratings.preparednessRating) / (count + 1);
  }
  if (ratings.fairnessRating) {
    this.ratings.fairnessRating = ((this.ratings.fairnessRating * count) + ratings.fairnessRating) / (count + 1);
  }
  if (ratings.temperamentRating) {
    this.ratings.temperamentRating = ((this.ratings.temperamentRating * count) + ratings.temperamentRating) / (count + 1);
  }
  if (ratings.overallRating) {
    this.ratings.overallRating = ((this.ratings.overallRating * count) + ratings.overallRating) / (count + 1);
  }
  
  this.ratings.reviewCount += 1;
  
  return this.save();
};

module.exports = mongoose.model('Judge', judgeSchema);
