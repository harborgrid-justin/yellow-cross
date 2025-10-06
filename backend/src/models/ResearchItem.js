/**
 * ResearchItem Model - Mongoose Schema for Legal Research Management
 * Comprehensive data model for legal research and knowledge management
 */

const mongoose = require('mongoose');

const researchItemSchema = new mongoose.Schema({
  // Basic Information
  researchNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  summary: {
    type: String,
    trim: true
  },
  
  // Research Type
  itemType: {
    type: String,
    required: true,
    enum: ['Case Law', 'Statute', 'Regulation', 'Legal Memo', 'Article', 'Practice Guide', 'Form', 'Other'],
    index: true
  },
  
  // Citation Information
  citation: {
    full: {
      type: String,
      trim: true
    },
    shortForm: String,
    parallelCitations: [String]
  },
  
  // Jurisdiction & Court
  jurisdiction: {
    type: String,
    trim: true,
    index: true
  },
  court: {
    type: String,
    trim: true
  },
  
  // Date Information
  decisionDate: {
    type: Date,
    index: true
  },
  filedDate: {
    type: Date
  },
  
  // Content
  fullText: {
    type: String
  },
  excerpt: {
    type: String,
    trim: true
  },
  keyPoints: [{
    type: String,
    trim: true
  }],
  
  // Legal Topic Classification
  practiceArea: {
    type: String,
    required: true,
    index: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  legalIssues: [{
    type: String,
    trim: true
  }],
  
  // Case Law Specific
  caseDetails: {
    parties: {
      plaintiff: String,
      defendant: String
    },
    caseNumber: String,
    judgeNames: [String],
    disposition: String,
    outcome: String
  },
  
  // Citations (References)
  citedBy: [{
    citation: String,
    title: String,
    year: Number
  }],
  cites: [{
    citation: String,
    title: String,
    year: Number
  }],
  
  // Relevance & Analysis
  relevance: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  precedentialValue: {
    type: String,
    enum: ['Binding', 'Persuasive', 'Not Precedential'],
    default: 'Persuasive'
  },
  analysis: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Integration with External Sources
  externalLinks: [{
    source: {
      type: String,
      enum: ['Westlaw', 'LexisNexis', 'Google Scholar', 'Court Website', 'Other']
    },
    url: String,
    documentId: String
  }],
  
  // Association with Cases
  relatedCases: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    caseNumber: String,
    relationship: String
  }],
  
  // Bookmarks & Highlights
  bookmarks: [{
    userId: String,
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  highlights: [{
    text: String,
    page: Number,
    userId: String,
    color: String,
    notes: String
  }],
  
  // Collaboration
  sharedWith: [{
    userId: String,
    sharedAt: Date,
    permission: {
      type: String,
      enum: ['View', 'Edit'],
      default: 'View'
    }
  }],
  
  // Search & Discovery
  tags: [{
    type: String,
    trim: true,
    index: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Superseded', 'Invalid'],
    default: 'Active',
    index: true
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
  lastAccessedAt: {
    type: Date
  },
  accessCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
researchItemSchema.index({ practiceArea: 1, itemType: 1 });
researchItemSchema.index({ 'topics': 1 });
researchItemSchema.index({ decisionDate: -1 });
researchItemSchema.index({ title: 'text', summary: 'text', fullText: 'text' });

// Virtual for age (years since decision)
researchItemSchema.virtual('age').get(function() {
  if (this.decisionDate) {
    const years = (new Date() - this.decisionDate) / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(years);
  }
  return null;
});

// Instance method to record access
researchItemSchema.methods.recordAccess = function() {
  this.lastAccessedAt = new Date();
  this.accessCount += 1;
  return this.save();
};

// Instance method to add bookmark
researchItemSchema.methods.addBookmark = function(userId, notes) {
  this.bookmarks.push({
    userId,
    addedAt: new Date(),
    notes
  });
  return this.save();
};

// Static method to find by practice area
researchItemSchema.statics.findByPracticeArea = function(practiceArea) {
  return this.find({ practiceArea, status: 'Active' })
    .sort({ decisionDate: -1 })
    .limit(100);
};

// Static method to search
researchItemSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query }, status: 'Active' },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('ResearchItem', researchItemSchema);
