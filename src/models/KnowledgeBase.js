/**
 * KnowledgeBase Model - Mongoose Schema for Internal Knowledge Base
 * Stores firm knowledge, best practices, and institutional knowledge
 */

const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  // Basic Information
  articleId: {
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
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    trim: true
  },
  
  // Classification
  category: {
    type: String,
    required: true,
    enum: ['Best Practice', 'Procedure', 'Template', 'Case Study', 'Legal Analysis', 'Training', 'Policy', 'Other'],
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
    content: String,
    modifiedBy: String,
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    changeNotes: String
  }],
  
  // Access & Visibility
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
  authorizedTeams: [{
    type: String,
    trim: true
  }],
  
  // Engagement Metrics
  viewCount: {
    type: Number,
    default: 0
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  lastViewed: Date,
  
  // Related Content
  relatedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeBase'
  }],
  attachments: [{
    filename: String,
    fileType: String,
    url: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived', 'Under Review'],
    default: 'Draft',
    index: true
  },
  publishedDate: Date,
  reviewDate: Date,
  
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
knowledgeBaseSchema.index({ category: 1, practiceArea: 1 });
knowledgeBaseSchema.index({ status: 1, visibility: 1 });
knowledgeBaseSchema.index({ tags: 1 });
knowledgeBaseSchema.index({ title: 'text', content: 'text', summary: 'text' });

// Instance methods
knowledgeBaseSchema.methods.incrementView = function() {
  this.viewCount += 1;
  this.lastViewed = Date.now();
};

knowledgeBaseSchema.methods.markHelpful = function() {
  this.helpfulCount += 1;
};

knowledgeBaseSchema.methods.createVersion = function(content, modifiedBy, changeNotes) {
  this.versionHistory.push({
    versionNumber: this.version,
    content: this.content,
    modifiedBy: this.lastModifiedBy,
    modifiedAt: this.updatedAt,
    changeNotes
  });
  
  this.content = content;
  this.version += 1;
  this.lastModifiedBy = modifiedBy;
};

knowledgeBaseSchema.methods.publish = function() {
  this.status = 'Published';
  this.publishedDate = Date.now();
};

// Static methods
knowledgeBaseSchema.statics.findByPracticeArea = function(practiceArea) {
  return this.find({ practiceArea, status: 'Published', isLatestVersion: true })
    .sort({ viewCount: -1, createdAt: -1 });
};

knowledgeBaseSchema.statics.searchArticles = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    status: 'Published',
    isLatestVersion: true,
    ...filters
  };
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
