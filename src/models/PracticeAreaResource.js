/**
 * PracticeAreaResource Model - Mongoose Schema for Practice Area Resources
 * Stores specialized resources organized by practice area
 */

const mongoose = require('mongoose');

const practiceAreaResourceSchema = new mongoose.Schema({
  // Basic Information
  resourceId: {
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
    required: true
  },
  
  // Practice Area Classification
  practiceArea: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  subCategory: {
    type: String,
    trim: true,
    index: true
  },
  
  // Resource Type
  resourceType: {
    type: String,
    required: true,
    enum: ['Form', 'Template', 'Checklist', 'Guide', 'Statute', 'Regulation', 'Court Rule', 'Expert Directory', 'Reference Material', 'Other'],
    index: true
  },
  
  // Content
  content: {
    type: String
  },
  contentType: {
    type: String,
    enum: ['Text', 'Document', 'Link', 'Video', 'Audio', 'Presentation'],
    default: 'Text'
  },
  
  // Files & Links
  attachments: [{
    filename: String,
    fileType: String,
    fileSize: Number,
    url: String,
    description: String
  }],
  externalLinks: [{
    title: String,
    url: String,
    description: String
  }],
  
  // Classification & Organization
  tags: [{
    type: String,
    trim: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  jurisdiction: {
    type: String,
    trim: true,
    index: true
  },
  
  // Expert Information (for Expert Directory type)
  expertInfo: {
    name: String,
    specialty: String,
    credentials: [String],
    contactInfo: {
      email: String,
      phone: String,
      address: String
    },
    bio: String,
    yearsExperience: Number,
    casesHandled: Number
  },
  
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
    enum: ['Public', 'Team Only', 'Practice Area Only', 'Restricted', 'Private'],
    default: 'Practice Area Only',
    index: true
  },
  authorizedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  requiredRole: {
    type: String,
    enum: ['Any', 'Associate', 'Senior Associate', 'Partner', 'Admin']
  },
  
  // Status & Lifecycle
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Under Review', 'Archived', 'Deprecated'],
    default: 'Draft',
    index: true
  },
  publishedDate: Date,
  lastReviewedDate: Date,
  nextReviewDate: Date,
  
  // Usage & Engagement
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  lastAccessed: Date,
  
  // Related Resources
  relatedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PracticeAreaResource'
  }],
  
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
  curator: {
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
practiceAreaResourceSchema.index({ practiceArea: 1, resourceType: 1 });
practiceAreaResourceSchema.index({ status: 1, visibility: 1 });
practiceAreaResourceSchema.index({ jurisdiction: 1 });
practiceAreaResourceSchema.index({ tags: 1 });
practiceAreaResourceSchema.index({ keywords: 1 });
practiceAreaResourceSchema.index({ title: 'text', description: 'text', content: 'text' });

// Instance methods
practiceAreaResourceSchema.methods.recordView = function() {
  this.viewCount += 1;
  this.lastAccessed = Date.now();
};

practiceAreaResourceSchema.methods.recordDownload = function() {
  this.downloadCount += 1;
};

practiceAreaResourceSchema.methods.addRating = function(score) {
  const totalScore = (this.rating.average * this.rating.count) + score;
  this.rating.count += 1;
  this.rating.average = totalScore / this.rating.count;
};

practiceAreaResourceSchema.methods.createVersion = function(content, modifiedBy, changeNotes) {
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

practiceAreaResourceSchema.methods.publish = function() {
  this.status = 'Published';
  this.publishedDate = Date.now();
};

// Static methods
practiceAreaResourceSchema.statics.findByPracticeArea = function(practiceArea) {
  return this.find({ practiceArea, status: 'Published', isLatestVersion: true })
    .sort({ viewCount: -1, createdAt: -1 });
};

practiceAreaResourceSchema.statics.findByType = function(resourceType, practiceArea) {
  const query = { resourceType, status: 'Published', isLatestVersion: true };
  if (practiceArea) query.practiceArea = practiceArea;
  return this.find(query).sort({ rating: -1, viewCount: -1 });
};

practiceAreaResourceSchema.statics.searchResources = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    status: 'Published',
    isLatestVersion: true,
    ...filters
  };
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('PracticeAreaResource', practiceAreaResourceSchema);
