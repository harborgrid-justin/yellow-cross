/**
 * CourtRule Model - Mongoose Schema for Court Rules & Procedures
 * Manages court-specific rules, local rules, and procedural guides
 */

const mongoose = require('mongoose');

const courtRuleSchema = new mongoose.Schema({
  // Rule Identification
  ruleId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ruleNumber: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // Court & Jurisdiction
  courtName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  courtType: {
    type: String,
    required: true,
    enum: ['Federal', 'State', 'District', 'Appeals', 'Supreme', 'Municipal', 'County', 'Other']
  },
  jurisdiction: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  // Rule Classification
  ruleType: {
    type: String,
    required: true,
    enum: ['Civil Procedure', 'Criminal Procedure', 'Appellate Procedure', 'Evidence', 'Local Rule', 'Standing Order', 'Administrative Order', 'Practice Direction', 'Other'],
    index: true
  },
  category: {
    type: String,
    trim: true
  },
  subCategory: String,
  
  // Rule Content
  fullText: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    trim: true
  },
  keyPoints: [String],
  
  // Related Rules
  parentRule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourtRule'
  },
  relatedRules: [{
    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourtRule'
    },
    relationshipType: {
      type: String,
      enum: ['Supersedes', 'Amended By', 'References', 'Related To']
    },
    notes: String
  }],
  
  // Applicability
  practiceAreas: [String],
  applicableCaseTypes: [{
    type: String,
    enum: ['Civil', 'Criminal', 'Family', 'Probate', 'Bankruptcy', 'Appeals', 'All']
  }],
  
  // Procedural Requirements
  filingRequirements: {
    format: String,
    pageLimit: Number,
    fontRequirements: String,
    marginRequirements: String,
    serviceRequirements: String,
    copyRequirements: String
  },
  deadlineRequirements: {
    standardDeadline: String,
    calculationMethod: String,
    businessDaysOnly: Boolean,
    excludedDays: [String]
  },
  
  // Form Requirements
  requiredForms: [{
    formName: String,
    formNumber: String,
    formUrl: String,
    mandatory: Boolean
  }],
  
  // Effective Dates
  effectiveDate: {
    type: Date,
    required: true,
    index: true
  },
  amendmentDate: Date,
  expirationDate: Date,
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Superseded', 'Repealed', 'Proposed', 'Under Review'],
    default: 'Active',
    index: true
  },
  
  // Version Control
  version: {
    type: String,
    default: '1.0'
  },
  previousVersions: [{
    version: String,
    effectiveDate: Date,
    fullText: String,
    archivedAt: Date
  }],
  
  // Citations & References
  officialCitation: String,
  statutoryBasis: String,
  legalReferences: [{
    citationType: String,
    citation: String,
    description: String
  }],
  
  // Judicial Interpretations
  keyDecisions: [{
    caseName: String,
    citation: String,
    year: Number,
    summary: String,
    url: String
  }],
  
  // Practice Notes
  practiceNotes: String,
  commonPitfalls: [String],
  bestPractices: [String],
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  keywords: [String],
  searchableText: String,
  
  // Usage & Popularity
  viewCount: {
    type: Number,
    default: 0
  },
  bookmarkedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookmarkedAt: Date
  }],
  
  // Source Information
  sourceUrl: String,
  sourceDocument: String,
  lastVerifiedDate: Date,
  verifiedBy: String,
  
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
courtRuleSchema.index({ ruleNumber: 1, courtName: 1 });
courtRuleSchema.index({ courtType: 1, jurisdiction: 1, ruleType: 1 });
courtRuleSchema.index({ status: 1, effectiveDate: -1 });
courtRuleSchema.index({ tags: 1 });
courtRuleSchema.index({ keywords: 1 });
courtRuleSchema.index({ title: 'text', summary: 'text', fullText: 'text' });

// Virtual field for is active
courtRuleSchema.virtual('isActive').get(function() {
  if (this.status !== 'Active') return false;
  if (this.expirationDate && this.expirationDate < new Date()) return false;
  return true;
});

// Static method to find by court
courtRuleSchema.statics.findByCourt = function(courtName) {
  return this.find({
    courtName,
    status: 'Active'
  }).sort({ ruleNumber: 1 });
};

// Static method to find by rule type
courtRuleSchema.statics.findByType = function(courtName, ruleType) {
  return this.find({
    courtName,
    ruleType,
    status: 'Active'
  }).sort({ ruleNumber: 1 });
};

// Static method to search rules
courtRuleSchema.statics.searchRules = function(searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm },
    status: 'Active'
  };
  
  if (filters.courtName) query.courtName = filters.courtName;
  if (filters.ruleType) query.ruleType = filters.ruleType;
  if (filters.jurisdiction) query.jurisdiction = filters.jurisdiction;
  
  return this.find(query)
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);
};

// Static method to find popular rules
courtRuleSchema.statics.findPopular = function(courtName, limit = 10) {
  const query = { status: 'Active' };
  if (courtName) query.courtName = courtName;
  
  return this.find(query)
    .sort({ viewCount: -1 })
    .limit(limit);
};

// Instance method to increment view count
courtRuleSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Instance method to bookmark
courtRuleSchema.methods.addBookmark = function(userId) {
  if (!this.bookmarkedBy.some(b => b.userId && b.userId.equals(userId))) {
    this.bookmarkedBy.push({
      userId,
      bookmarkedAt: new Date()
    });
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to update content
courtRuleSchema.methods.updateContent = function(newContent, updatedBy) {
  // Archive current version
  this.previousVersions.push({
    version: this.version,
    effectiveDate: this.effectiveDate,
    fullText: this.fullText,
    archivedAt: new Date()
  });
  
  // Update to new version
  const versionParts = this.version.split('.');
  const majorVersion = parseInt(versionParts[0]);
  const minorVersion = parseInt(versionParts[1] || 0);
  this.version = `${majorVersion}.${minorVersion + 1}`;
  
  this.fullText = newContent.fullText || this.fullText;
  this.summary = newContent.summary || this.summary;
  this.amendmentDate = new Date();
  this.lastModifiedBy = updatedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

module.exports = mongoose.model('CourtRule', courtRuleSchema);
