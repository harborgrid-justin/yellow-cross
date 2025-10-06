/**
 * Report Model - Mongoose Schema for Reporting & Analytics
 * Comprehensive data model for custom reports and analytics
 */

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Basic Information
  reportNumber: {
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
  
  // Report Type
  reportType: {
    type: String,
    required: true,
    enum: ['Case Analytics', 'Financial', 'Attorney Performance', 'Client Analytics', 'Practice Area', 'Custom', 'Predictive', 'Executive Dashboard'],
    index: true
  },
  
  // Report Configuration
  dateRange: {
    startDate: Date,
    endDate: Date
  },
  filters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  metrics: [{
    name: String,
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    trend: {
      type: String,
      enum: ['Increasing', 'Decreasing', 'Stable', 'N/A']
    }
  }],
  
  // Data & Results
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  summary: {
    type: mongoose.Schema.Types.Mixed
  },
  charts: [{
    type: String,
    enum: ['Bar', 'Line', 'Pie', 'Area', 'Scatter'],
    title: String,
    data: mongoose.Schema.Types.Mixed
  }],
  
  // Schedule & Automation
  schedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']
    },
    nextRunDate: Date,
    lastRunDate: Date,
    recipients: [String]
  },
  
  // Access Control
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Shared'],
    default: 'Private'
  },
  sharedWith: [{
    userId: String,
    role: String,
    accessLevel: {
      type: String,
      enum: ['View', 'Edit', 'Admin']
    }
  }],
  
  // Metadata
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: String,
  tags: [String],
  category: String,
  isFavorite: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Scheduled', 'Archived'],
    default: 'Draft'
  }
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ reportType: 1, createdBy: 1 });
reportSchema.index({ 'dateRange.startDate': 1, 'dateRange.endDate': 1 });
reportSchema.index({ tags: 1 });
reportSchema.index({ status: 1 });

// Methods
reportSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

reportSchema.methods.scheduleNextRun = function() {
  if (!this.schedule.enabled || !this.schedule.frequency) {
    return;
  }
  
  const now = new Date();
  const nextRun = new Date(now);
  
  switch (this.schedule.frequency) {
    case 'Daily':
      nextRun.setDate(nextRun.getDate() + 1);
      break;
    case 'Weekly':
      nextRun.setDate(nextRun.getDate() + 7);
      break;
    case 'Monthly':
      nextRun.setMonth(nextRun.getMonth() + 1);
      break;
    case 'Quarterly':
      nextRun.setMonth(nextRun.getMonth() + 3);
      break;
    case 'Yearly':
      nextRun.setFullYear(nextRun.getFullYear() + 1);
      break;
  }
  
  this.schedule.nextRunDate = nextRun;
  this.schedule.lastRunDate = now;
};

// Static methods
reportSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { createdBy: userId },
      { 'sharedWith.userId': userId },
      { visibility: 'Public' }
    ]
  }).sort({ createdAt: -1 });
};

reportSchema.statics.findFavorites = function(userId) {
  return this.find({
    createdBy: userId,
    isFavorite: true
  }).sort({ createdAt: -1 });
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
