/**
 * ImportExportJob Model - Mongoose Schema for Data Import/Export Operations
 * Manages bulk data transfers with validation and mapping
 */

const mongoose = require('mongoose');

const importExportJobSchema = new mongoose.Schema({
  // Basic Information
  jobNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Job Type
  jobType: {
    type: String,
    enum: ['Import', 'Export'],
    required: true,
    index: true
  },
  
  // Data Type
  dataType: {
    type: String,
    required: true,
    enum: ['Cases', 'Clients', 'Documents', 'Tasks', 'Contacts', 'Billing', 'TimeEntries', 'Custom'],
    index: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Cancelled', 'Paused', 'Validating'],
    default: 'Pending',
    index: true
  },
  
  // File Information
  file: {
    filename: { type: String, required: true },
    originalName: String,
    fileType: {
      type: String,
      enum: ['CSV', 'Excel', 'JSON', 'XML', 'PDF', 'Text'],
      required: true
    },
    fileSize: Number,
    filePath: String,
    mimeType: String,
    encoding: { type: String, default: 'utf-8' },
    delimiter: { type: String, default: ',' }, // for CSV
    hasHeader: { type: Boolean, default: true }
  },
  
  // Configuration
  config: {
    mode: {
      type: String,
      enum: ['Create Only', 'Update Only', 'Create or Update', 'Replace All'],
      default: 'Create or Update'
    },
    batchSize: { type: Number, default: 100 },
    skipErrors: { type: Boolean, default: false },
    stopOnError: { type: Boolean, default: false },
    validateBeforeImport: { type: Boolean, default: true },
    dryRun: { type: Boolean, default: false },
    preserveIds: { type: Boolean, default: false },
    overwriteExisting: { type: Boolean, default: false }
  },
  
  // Field Mapping
  fieldMapping: [{
    sourceField: { type: String, required: true },
    targetField: { type: String, required: true },
    dataType: {
      type: String,
      enum: ['String', 'Number', 'Date', 'Boolean', 'Array', 'Object']
    },
    transformation: String, // e.g., 'uppercase', 'lowercase', 'trim', custom function
    defaultValue: String,
    required: { type: Boolean, default: false },
    validation: String
  }],
  
  // Validation Rules
  validationRules: {
    requiredFields: [String],
    uniqueFields: [String],
    customRules: [{
      field: String,
      rule: String,
      message: String
    }]
  },
  
  // Progress Tracking
  progress: {
    totalRecords: { type: Number, default: 0 },
    processedRecords: { type: Number, default: 0 },
    successfulRecords: { type: Number, default: 0 },
    failedRecords: { type: Number, default: 0 },
    skippedRecords: { type: Number, default: 0 },
    currentRecord: { type: Number, default: 0 },
    percentComplete: { type: Number, default: 0 },
    estimatedTimeRemaining: Number, // milliseconds
    startedAt: Date,
    completedAt: Date,
    processingTime: Number // milliseconds
  },
  
  // Results
  results: {
    successCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    warningCount: { type: Number, default: 0 },
    createdCount: { type: Number, default: 0 },
    updatedCount: { type: Number, default: 0 },
    deletedCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    duplicateCount: { type: Number, default: 0 }
  },
  
  // Error Tracking
  errors: [{
    row: Number,
    recordId: String,
    field: String,
    errorType: String,
    message: String,
    timestamp: Date,
    data: mongoose.Schema.Types.Mixed
  }],
  
  // Warnings
  warnings: [{
    row: Number,
    recordId: String,
    field: String,
    warningType: String,
    message: String,
    timestamp: Date
  }],
  
  // Summary
  summary: {
    message: String,
    details: mongoose.Schema.Types.Mixed,
    recommendations: [String]
  },
  
  // Output (for exports)
  output: {
    filename: String,
    filePath: String,
    fileSize: Number,
    downloadUrl: String,
    expiresAt: Date,
    format: String,
    compression: String
  },
  
  // Filters (for exports)
  filters: {
    dateRange: {
      startDate: Date,
      endDate: Date
    },
    status: [String],
    categories: [String],
    tags: [String],
    customFilters: mongoose.Schema.Types.Mixed
  },
  
  // Export Settings
  exportSettings: {
    includeRelated: { type: Boolean, default: false },
    includeAttachments: { type: Boolean, default: false },
    includeMetadata: { type: Boolean, default: true },
    includeAuditTrail: { type: Boolean, default: false },
    columns: [String],
    sortBy: String,
    sortOrder: { type: String, enum: ['asc', 'desc'], default: 'asc' }
  },
  
  // Scheduling
  scheduling: {
    isScheduled: { type: Boolean, default: false },
    scheduleType: {
      type: String,
      enum: ['Once', 'Daily', 'Weekly', 'Monthly', 'Custom']
    },
    scheduledAt: Date,
    recurringPattern: String,
    nextRunAt: Date,
    lastRunAt: Date
  },
  
  // Notifications
  notifications: {
    notifyOnCompletion: { type: Boolean, default: true },
    notifyOnError: { type: Boolean, default: true },
    notifyEmails: [String],
    webhookUrl: String
  },
  
  // Organization
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  
  // Related Jobs
  parentJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImportExportJob'
  },
  relatedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImportExportJob'
  }],
  
  // Metadata
  tags: [String],
  notes: String,
  metadata: mongoose.Schema.Types.Mixed,
  
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
  lastModifiedAt: Date,
  startedBy: String,
  cancelledBy: String,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
importExportJobSchema.index({ jobType: 1, status: 1 });
importExportJobSchema.index({ dataType: 1, status: 1 });
importExportJobSchema.index({ createdBy: 1, status: 1 });
importExportJobSchema.index({ 'progress.startedAt': -1 });
importExportJobSchema.index({ 'scheduling.nextRunAt': 1 });

// Virtual: Is Complete
importExportJobSchema.virtual('isComplete').get(function() {
  return ['Completed', 'Failed', 'Cancelled'].includes(this.status);
});

// Virtual: Success Rate
importExportJobSchema.virtual('successRate').get(function() {
  if (this.progress.totalRecords === 0) return 0;
  return Math.round((this.progress.successfulRecords / this.progress.totalRecords) * 100);
});

// Virtual: Duration (formatted)
importExportJobSchema.virtual('duration').get(function() {
  if (!this.progress.startedAt) return null;
  const endTime = this.progress.completedAt || new Date();
  const duration = endTime - this.progress.startedAt;
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
});

// Virtual: Records Per Second
importExportJobSchema.virtual('recordsPerSecond').get(function() {
  if (!this.progress.processingTime || this.progress.processingTime === 0) return 0;
  return Math.round((this.progress.processedRecords / (this.progress.processingTime / 1000)) * 100) / 100;
});

// Static method: Find active jobs
importExportJobSchema.statics.findActive = function() {
  return this.find({
    status: { $in: ['Pending', 'Processing', 'Validating'] }
  }).sort({ createdAt: -1 });
};

// Static method: Find jobs by type
importExportJobSchema.statics.findByType = function(jobType, dataType = null) {
  const query = { jobType };
  if (dataType) query.dataType = dataType;
  return this.find(query).sort({ createdAt: -1 });
};

// Static method: Get job statistics
importExportJobSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: {
          jobType: '$jobType',
          status: '$status'
        },
        count: { $sum: 1 },
        totalRecords: { $sum: '$progress.totalRecords' },
        successfulRecords: { $sum: '$progress.successfulRecords' },
        failedRecords: { $sum: '$progress.failedRecords' }
      }
    }
  ]);
  return stats;
};

// Instance method: Start job
importExportJobSchema.methods.start = async function(startedBy) {
  this.status = 'Processing';
  this.progress.startedAt = new Date();
  this.startedBy = startedBy;
  await this.save();
};

// Instance method: Update progress
importExportJobSchema.methods.updateProgress = async function(progressData) {
  const { processedRecords, successfulRecords, failedRecords, skippedRecords } = progressData;
  
  this.progress.processedRecords = processedRecords || this.progress.processedRecords;
  this.progress.successfulRecords = successfulRecords || this.progress.successfulRecords;
  this.progress.failedRecords = failedRecords || this.progress.failedRecords;
  this.progress.skippedRecords = skippedRecords || this.progress.skippedRecords;
  
  if (this.progress.totalRecords > 0) {
    this.progress.percentComplete = Math.round(
      (this.progress.processedRecords / this.progress.totalRecords) * 100
    );
  }
  
  // Calculate estimated time remaining
  if (this.progress.startedAt && this.progress.processedRecords > 0) {
    const elapsed = new Date() - this.progress.startedAt;
    const rate = this.progress.processedRecords / elapsed;
    const remaining = this.progress.totalRecords - this.progress.processedRecords;
    this.progress.estimatedTimeRemaining = Math.round(remaining / rate);
  }
  
  await this.save();
};

// Instance method: Complete job
importExportJobSchema.methods.complete = async function(success = true) {
  this.status = success ? 'Completed' : 'Failed';
  this.progress.completedAt = new Date();
  this.progress.percentComplete = 100;
  
  if (this.progress.startedAt) {
    this.progress.processingTime = this.progress.completedAt - this.progress.startedAt;
  }
  
  // Update results summary
  this.results.successCount = this.progress.successfulRecords;
  this.results.errorCount = this.progress.failedRecords;
  this.results.skippedCount = this.progress.skippedRecords;
  
  await this.save();
};

// Instance method: Cancel job
importExportJobSchema.methods.cancel = async function(cancelledBy, reason = '') {
  this.status = 'Cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  this.cancelReason = reason;
  await this.save();
};

// Instance method: Add error
importExportJobSchema.methods.addError = async function(errorData) {
  this.errors.push({
    ...errorData,
    timestamp: new Date()
  });
  this.results.errorCount = this.errors.length;
  
  // Limit stored errors to last 1000
  if (this.errors.length > 1000) {
    this.errors = this.errors.slice(-1000);
  }
  
  await this.save();
};

// Instance method: Add warning
importExportJobSchema.methods.addWarning = async function(warningData) {
  this.warnings.push({
    ...warningData,
    timestamp: new Date()
  });
  this.results.warningCount = this.warnings.length;
  
  // Limit stored warnings to last 1000
  if (this.warnings.length > 1000) {
    this.warnings = this.warnings.slice(-1000);
  }
  
  await this.save();
};

// Pre-save middleware
importExportJobSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

const ImportExportJob = mongoose.model('ImportExportJob', importExportJobSchema);

module.exports = ImportExportJob;
