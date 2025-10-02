/**
 * LegalUpdate Model - Mongoose Schema for Legal Updates & Alerts
 * Tracks changes in law, regulations, and sends alerts
 */

const mongoose = require('mongoose');

const legalUpdateSchema = new mongoose.Schema({
  // Basic Information
  updateId: {
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
  summary: {
    type: String,
    required: true
  },
  fullText: {
    type: String
  },
  
  // Update Type
  updateType: {
    type: String,
    required: true,
    enum: ['Legislative', 'Regulatory', 'Case Law', 'Court Rule', 'Administrative', 'Industry Alert', 'Practice Alert', 'Other'],
    index: true
  },
  
  // Source Information
  source: {
    type: String,
    required: true,
    trim: true
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  officialDocument: {
    type: String,
    trim: true
  },
  
  // Classification
  practiceArea: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  jurisdiction: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  
  // Impact Assessment
  impactLevel: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
    default: 'Medium',
    index: true
  },
  urgency: {
    type: String,
    enum: ['Immediate', 'High', 'Normal', 'Low'],
    default: 'Normal',
    index: true
  },
  affectedAreas: [{
    type: String,
    trim: true
  }],
  
  // Important Dates
  effectiveDate: {
    type: Date,
    index: true
  },
  publishedDate: {
    type: Date,
    required: true,
    index: true
  },
  expirationDate: Date,
  deadlineDate: Date,
  
  // Alert Configuration
  alertSent: {
    type: Boolean,
    default: false,
    index: true
  },
  alertSentAt: Date,
  alertRecipients: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: String,
    notifiedAt: Date,
    readAt: Date
  }],
  
  // Follow-up Actions
  requiresAction: {
    type: Boolean,
    default: false
  },
  actionItems: [{
    description: String,
    assignedTo: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    completedAt: Date
  }],
  
  // Related Content
  relatedCases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  }],
  relatedCaseLaw: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseLaw'
  }],
  relatedMemos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalMemorandum'
  }],
  attachments: [{
    filename: String,
    fileType: String,
    url: String,
    description: String
  }],
  
  // Subscription Management
  subscribedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Status & Lifecycle
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived', 'Superseded'],
    default: 'Published',
    index: true
  },
  supersededBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalUpdate'
  },
  
  // Engagement Metrics
  viewCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  lastViewed: Date,
  
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
legalUpdateSchema.index({ updateType: 1, practiceArea: 1 });
legalUpdateSchema.index({ jurisdiction: 1, status: 1 });
legalUpdateSchema.index({ impactLevel: 1, urgency: 1 });
legalUpdateSchema.index({ publishedDate: -1 });
legalUpdateSchema.index({ effectiveDate: 1 });
legalUpdateSchema.index({ topics: 1 });
legalUpdateSchema.index({ tags: 1 });
legalUpdateSchema.index({ title: 'text', summary: 'text', fullText: 'text' });

// Instance methods
legalUpdateSchema.methods.sendAlert = async function(recipients) {
  this.alertRecipients = recipients.map(r => ({
    userId: r.userId,
    email: r.email,
    notifiedAt: Date.now()
  }));
  
  this.alertSent = true;
  this.alertSentAt = Date.now();
};

legalUpdateSchema.methods.markAsRead = function(userId) {
  const recipient = this.alertRecipients.find(r => r.userId && r.userId.toString() === userId.toString());
  if (recipient) {
    recipient.readAt = Date.now();
  }
};

legalUpdateSchema.methods.addActionItem = function(description, assignedTo, dueDate) {
  this.actionItems.push({
    description,
    assignedTo,
    dueDate,
    status: 'Pending'
  });
  this.requiresAction = true;
};

legalUpdateSchema.methods.recordView = function() {
  this.viewCount += 1;
  this.lastViewed = Date.now();
};

legalUpdateSchema.methods.recordShare = function() {
  this.shareCount += 1;
};

// Static methods
legalUpdateSchema.statics.findByPracticeArea = function(practiceArea, filters = {}) {
  return this.find({ practiceArea, status: 'Published', ...filters })
    .sort({ publishedDate: -1, impactLevel: -1 });
};

legalUpdateSchema.statics.findByJurisdiction = function(jurisdiction) {
  return this.find({ jurisdiction, status: 'Published' })
    .sort({ publishedDate: -1 });
};

legalUpdateSchema.statics.findUrgentUpdates = function() {
  return this.find({
    status: 'Published',
    urgency: { $in: ['Immediate', 'High'] },
    impactLevel: { $in: ['Critical', 'High'] }
  }).sort({ urgency: 1, publishedDate: -1 });
};

legalUpdateSchema.statics.searchUpdates = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    status: 'Published',
    ...filters
  };
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('LegalUpdate', legalUpdateSchema);
