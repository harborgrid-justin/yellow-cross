/**
 * ContractClause Model - Mongoose Schema for Contract Clause Library
 * Manages reusable contract clauses with versioning and categorization
 */

const mongoose = require('mongoose');

const contractClauseSchema = new mongoose.Schema({
  // Clause Identification
  clauseId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Clause Classification
  category: {
    type: String,
    required: true,
    enum: [
      'Confidentiality', 'Payment Terms', 'Termination', 'Liability', 
      'Indemnification', 'Intellectual Property', 'Warranty', 'Force Majeure',
      'Dispute Resolution', 'Governing Law', 'Non-Compete', 'Assignment',
      'Amendment', 'Severability', 'Notices', 'General', 'Other'
    ],
    index: true
  },
  subCategory: {
    type: String,
    trim: true
  },
  practiceArea: {
    type: String,
    trim: true,
    index: true
  },
  jurisdiction: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Clause Content
  content: {
    type: String,
    required: true
  },
  contentFormat: {
    type: String,
    enum: ['Plain Text', 'Rich Text', 'HTML', 'Markdown'],
    default: 'Plain Text'
  },
  
  // Clause Variables
  variables: [{
    name: {
      type: String,
      required: true
    },
    label: String,
    type: {
      type: String,
      enum: ['Text', 'Number', 'Date', 'Select', 'Boolean'],
      default: 'Text'
    },
    description: String,
    required: {
      type: Boolean,
      default: false
    },
    defaultValue: String,
    options: [String]
  }],
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  isLatestVersion: {
    type: Boolean,
    default: true,
    index: true
  },
  parentClauseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContractClause'
  },
  versionHistory: [{
    version: Number,
    content: String,
    modifiedBy: String,
    modifiedAt: Date,
    changeDescription: String
  }],
  
  // Usage & Statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedAt: Date,
  popularity: {
    type: Number,
    default: 0
  },
  
  // Risk & Compliance
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  requiresReview: {
    type: Boolean,
    default: false
  },
  complianceNotes: String,
  
  // Approval & Status
  status: {
    type: String,
    enum: ['Draft', 'Under Review', 'Approved', 'Archived'],
    default: 'Draft',
    index: true
  },
  approvedBy: String,
  approvedAt: Date,
  
  // Access Control
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Team', 'Organization'],
    default: 'Team'
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    permission: {
      type: String,
      enum: ['View', 'Use', 'Edit']
    }
  }],
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: String,
  lastModifiedDate: Date,
  
  // Notes
  internalNotes: String,
  legalNotes: String
}, {
  timestamps: true
});

// Indexes
contractClauseSchema.index({ category: 1, practiceArea: 1 });
contractClauseSchema.index({ tags: 1 });
contractClauseSchema.index({ status: 1, isLatestVersion: 1 });

// Static methods
contractClauseSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category, 
    status: 'Approved',
    isLatestVersion: true 
  }).sort({ popularity: -1 });
};

contractClauseSchema.statics.findPopular = function(limit = 10) {
  return this.find({ 
    status: 'Approved',
    isLatestVersion: true 
  })
    .sort({ popularity: -1, usageCount: -1 })
    .limit(limit);
};

// Instance methods
contractClauseSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsedAt = new Date();
  this.popularity = this.usageCount * 0.5 + (this.approvedAt ? 1 : 0);
  return this.save();
};

contractClauseSchema.methods.createNewVersion = function(content, modifiedBy, changeDescription) {
  this.versionHistory.push({
    version: this.version,
    content: this.content,
    modifiedBy: this.modifiedBy || this.createdBy,
    modifiedAt: this.lastModifiedDate || this.createdDate,
    changeDescription
  });
  
  this.content = content;
  this.version += 1;
  this.lastModifiedBy = modifiedBy;
  this.lastModifiedDate = new Date();
  
  return this.save();
};

// Pre-save middleware to auto-generate clause ID
contractClauseSchema.pre('save', async function(next) {
  if (this.isNew && !this.clauseId) {
    const count = await this.constructor.countDocuments();
    this.clauseId = `CLAUSE-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('ContractClause', contractClauseSchema);
