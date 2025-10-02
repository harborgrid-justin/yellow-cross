/**
 * Report Model - Mongoose Schema for Reporting & Analytics System
 * Data model for custom reports, report templates, and cached analytics
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
  
  // Report Type and Category
  reportType: {
    type: String,
    required: true,
    enum: ['Case Analytics', 'Financial', 'Attorney Performance', 'Client Analytics', 'Practice Area', 'Custom', 'Predictive', 'Executive'],
    index: true
  },
  category: {
    type: String,
    trim: true
  },
  
  // Report Configuration
  dataSource: {
    type: String,
    enum: ['Cases', 'Tasks', 'Documents', 'Clients', 'Financial', 'Mixed'],
    default: 'Mixed'
  },
  filters: {
    dateFrom: Date,
    dateTo: Date,
    status: [String],
    practiceArea: [String],
    attorney: [String],
    client: [String],
    customFilters: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  
  // Metrics and Fields
  metrics: [{
    name: String,
    aggregationType: {
      type: String,
      enum: ['sum', 'avg', 'count', 'min', 'max', 'median', 'percentage']
    },
    field: String
  }],
  groupBy: [String],
  sortBy: {
    field: String,
    order: {
      type: String,
      enum: ['asc', 'desc'],
      default: 'desc'
    }
  },
  
  // Visualization
  visualizationType: {
    type: String,
    enum: ['Table', 'Bar Chart', 'Line Chart', 'Pie Chart', 'Area Chart', 'Scatter Plot', 'Heatmap', 'Gauge', 'Mixed'],
    default: 'Table'
  },
  
  // Scheduling
  isScheduled: {
    type: Boolean,
    default: false
  },
  scheduleConfig: {
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']
    },
    time: String,
    recipients: [String],
    format: {
      type: String,
      enum: ['PDF', 'Excel', 'CSV', 'HTML'],
      default: 'PDF'
    }
  },
  
  // Template Information
  isTemplate: {
    type: Boolean,
    default: false
  },
  fromTemplate: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  
  // Cached Results
  lastGenerated: Date,
  cachedData: {
    type: mongoose.Schema.Types.Mixed
  },
  cacheExpiry: Date,
  
  // Access Control
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Team', 'Executive'],
    default: 'Team'
  },
  sharedWith: [String],
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Archived'],
    default: 'Active'
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
  generationCount: {
    type: Number,
    default: 0
  },
  
  // Tags for organization
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
reportSchema.index({ reportType: 1, status: 1 });
reportSchema.index({ createdBy: 1, status: 1 });
reportSchema.index({ isTemplate: 1 });
reportSchema.index({ 'filters.dateFrom': 1, 'filters.dateTo': 1 });
reportSchema.index({ tags: 1 });

// Virtual for cache validity
reportSchema.virtual('isCacheValid').get(function() {
  if (!this.cachedData || !this.cacheExpiry) return false;
  return new Date() < this.cacheExpiry;
});

// Static methods
reportSchema.statics.findActiveReports = function(reportType = null) {
  const query = { status: 'Active' };
  if (reportType) query.reportType = reportType;
  return this.find(query).sort({ createdAt: -1 });
};

reportSchema.statics.findTemplates = function() {
  return this.find({ isTemplate: true, status: 'Active' }).sort({ title: 1 });
};

reportSchema.statics.findScheduledReports = function() {
  return this.find({ 
    isScheduled: true, 
    status: 'Active' 
  }).sort({ 'scheduleConfig.frequency': 1 });
};

// Instance methods
reportSchema.methods.generateReport = async function() {
  this.lastGenerated = Date.now();
  this.generationCount += 1;
  // Cache for 1 hour by default
  this.cacheExpiry = new Date(Date.now() + 60 * 60 * 1000);
};

reportSchema.methods.clearCache = function() {
  this.cachedData = null;
  this.cacheExpiry = null;
};

module.exports = mongoose.model('Report', reportSchema);
