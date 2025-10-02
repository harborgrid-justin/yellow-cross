/**
 * LegalMemorandum Model - Mongoose Schema for Legal Memoranda Library
 * Stores and manages legal memos, research notes, and analysis
 */

const mongoose = require('mongoose');

const legalMemorandumSchema = new mongoose.Schema({
  // Basic Information
  memoId: {
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
  subject: {
    type: String,
    required: true,
    trim: true
  },
  
  // Memo Content
  question: {
    type: String,
    required: true
  },
  briefAnswer: {
    type: String,
    required: true
  },
  facts: {
    type: String,
    required: true
  },
  discussion: {
    type: String,
    required: true
  },
  conclusion: {
    type: String,
    required: true
  },
  
  // Classification
  memoType: {
    type: String,
    required: true,
    enum: ['Research Memo', 'Opinion Letter', 'Case Brief', 'Legal Analysis', 'Strategy Memo', 'Client Advice', 'Other'],
    index: true
  },
  practiceArea: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Related Entities
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  matter: {
    type: String,
    trim: true
  },
  
  // Authorship
  author: {
    type: String,
    required: true,
    trim: true
  },
  reviewedBy: [{
    reviewer: String,
    reviewedAt: Date,
    comments: String
  }],
  
  // Citations & References
  citations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citation'
  }],
  referencedCases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseLaw'
  }],
  attachments: [{
    filename: String,
    fileType: String,
    url: String,
    description: String
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
  versionHistory: [{
    versionNumber: Number,
    content: {
      question: String,
      briefAnswer: String,
      facts: String,
      discussion: String,
      conclusion: String
    },
    modifiedBy: String,
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    changeNotes: String
  }],
  
  // Access & Visibility
  confidentiality: {
    type: String,
    enum: ['Privileged', 'Work Product', 'Confidential', 'Internal', 'Public'],
    default: 'Privileged',
    index: true
  },
  visibility: {
    type: String,
    enum: ['Public', 'Team Only', 'Restricted', 'Private'],
    default: 'Team Only',
    index: true
  },
  authorizedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Under Review', 'Approved', 'Final', 'Archived'],
    default: 'Draft',
    index: true
  },
  draftDate: Date,
  finalizedDate: Date,
  
  // Usage & Engagement
  viewCount: {
    type: Number,
    default: 0
  },
  lastViewed: Date,
  citationCount: {
    type: Number,
    default: 0
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
  notes: {
    type: String,
    trim: true
  },
  
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
legalMemorandumSchema.index({ memoType: 1, practiceArea: 1 });
legalMemorandumSchema.index({ status: 1, visibility: 1 });
legalMemorandumSchema.index({ author: 1, createdAt: -1 });
legalMemorandumSchema.index({ tags: 1 });
legalMemorandumSchema.index({ title: 'text', subject: 'text', question: 'text', discussion: 'text' });

// Instance methods
legalMemorandumSchema.methods.incrementView = function() {
  this.viewCount += 1;
  this.lastViewed = Date.now();
};

legalMemorandumSchema.methods.addReview = function(reviewer, comments) {
  this.reviewedBy.push({
    reviewer,
    reviewedAt: Date.now(),
    comments
  });
};

legalMemorandumSchema.methods.createVersion = function(content, modifiedBy, changeNotes) {
  this.versionHistory.push({
    versionNumber: this.version,
    content: {
      question: this.question,
      briefAnswer: this.briefAnswer,
      facts: this.facts,
      discussion: this.discussion,
      conclusion: this.conclusion
    },
    modifiedBy: this.lastModifiedBy,
    modifiedAt: this.updatedAt,
    changeNotes
  });
  
  Object.assign(this, content);
  this.version += 1;
  this.lastModifiedBy = modifiedBy;
};

legalMemorandumSchema.methods.finalize = function() {
  this.status = 'Final';
  this.finalizedDate = Date.now();
};

// Static methods
legalMemorandumSchema.statics.findByPracticeArea = function(practiceArea) {
  return this.find({ practiceArea, status: { $in: ['Approved', 'Final'] }, isLatestVersion: true })
    .sort({ createdAt: -1 });
};

legalMemorandumSchema.statics.searchMemos = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    isLatestVersion: true,
    ...filters
  };
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('LegalMemorandum', legalMemorandumSchema);
