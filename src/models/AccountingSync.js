/**
 * AccountingSync Model - Mongoose Schema for Accounting Software Integration
 * Manages QuickBooks and Xero synchronization
 */

const mongoose = require('mongoose');

const accountingSyncSchema = new mongoose.Schema({
  // Basic Information
  syncNumber: {
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
  
  // Provider
  provider: {
    type: String,
    required: true,
    enum: ['QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'Sage', 'FreshBooks', 'Other'],
    index: true
  },
  
  // Integration Reference
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Integration',
    required: true,
    index: true
  },
  
  // Sync Type
  syncType: {
    type: String,
    required: true,
    enum: ['Invoices', 'Payments', 'Expenses', 'Clients', 'Chart of Accounts', 'Time Entries', 'Full Sync'],
    index: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Failed', 'Paused', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  
  // Sync Direction
  direction: {
    type: String,
    enum: ['Push to Accounting', 'Pull from Accounting', 'Bidirectional'],
    required: true
  },
  
  // Configuration
  config: {
    autoSync: { type: Boolean, default: false },
    syncFrequency: {
      type: String,
      enum: ['Real-time', 'Every 15 Minutes', 'Hourly', 'Daily', 'Weekly', 'Manual'],
      default: 'Manual'
    },
    syncWindow: {
      startDate: Date,
      endDate: Date
    },
    onlyModifiedRecords: { type: Boolean, default: true },
    handleDuplicates: {
      type: String,
      enum: ['Skip', 'Update', 'Create New', 'Merge'],
      default: 'Skip'
    },
    validateBeforeSync: { type: Boolean, default: true }
  },
  
  // Mapping Configuration
  mapping: {
    // Invoice Mapping
    invoiceSettings: {
      invoicePrefix: String,
      invoiceNumberFormat: String,
      defaultTerms: String,
      defaultAccount: String,
      taxHandling: {
        type: String,
        enum: ['Include Tax', 'Exclude Tax', 'Calculate Automatically']
      }
    },
    
    // Payment Mapping
    paymentSettings: {
      defaultPaymentAccount: String,
      defaultDepositAccount: String,
      autoReconcile: { type: Boolean, default: false }
    },
    
    // Client Mapping
    clientSettings: {
      syncClientType: {
        type: String,
        enum: ['Customer', 'Vendor', 'Both']
      },
      customFieldMapping: mongoose.Schema.Types.Mixed
    },
    
    // Chart of Accounts Mapping
    accountMapping: [{
      lawFirmAccount: String,
      accountingAccount: String,
      accountingAccountId: String,
      accountType: String
    }],
    
    // Tax Mapping
    taxMapping: [{
      lawFirmTaxRate: String,
      accountingTaxRate: String,
      accountingTaxRateId: String
    }],
    
    // Custom Field Mapping
    customMapping: mongoose.Schema.Types.Mixed
  },
  
  // Progress Tracking
  progress: {
    totalRecords: { type: Number, default: 0 },
    processedRecords: { type: Number, default: 0 },
    syncedRecords: { type: Number, default: 0 },
    failedRecords: { type: Number, default: 0 },
    skippedRecords: { type: Number, default: 0 },
    percentComplete: { type: Number, default: 0 },
    currentPhase: String, // e.g., 'Fetching Data', 'Validating', 'Syncing', 'Completing'
    startedAt: Date,
    completedAt: Date
  },
  
  // Results by Entity Type
  results: {
    invoices: {
      total: { type: Number, default: 0 },
      synced: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      skipped: { type: Number, default: 0 }
    },
    payments: {
      total: { type: Number, default: 0 },
      synced: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      skipped: { type: Number, default: 0 }
    },
    clients: {
      total: { type: Number, default: 0 },
      synced: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      skipped: { type: Number, default: 0 }
    },
    expenses: {
      total: { type: Number, default: 0 },
      synced: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      skipped: { type: Number, default: 0 }
    },
    timeEntries: {
      total: { type: Number, default: 0 },
      synced: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      skipped: { type: Number, default: 0 }
    }
  },
  
  // Errors & Issues
  errors: [{
    entityType: String, // 'Invoice', 'Payment', 'Client', etc.
    entityId: String,
    errorCode: String,
    errorMessage: String,
    errorDetails: mongoose.Schema.Types.Mixed,
    timestamp: Date,
    resolved: { type: Boolean, default: false },
    resolution: String
  }],
  
  // Synced Items Tracking
  syncedItems: [{
    entityType: String,
    localId: String,
    localReference: String,
    remoteId: String,
    remoteReference: String,
    syncedAt: Date,
    lastModified: Date,
    status: String
  }],
  
  // Reconciliation
  reconciliation: {
    isReconciled: { type: Boolean, default: false },
    reconciledAt: Date,
    reconciledBy: String,
    discrepancies: [{
      type: String,
      description: String,
      localValue: mongoose.Schema.Types.Mixed,
      remoteValue: mongoose.Schema.Types.Mixed,
      resolved: Boolean
    }]
  },
  
  // Summary
  summary: {
    totalAmountSynced: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    message: String,
    recommendations: [String],
    warnings: [String]
  },
  
  // Scheduling
  scheduling: {
    isScheduled: { type: Boolean, default: false },
    nextSyncAt: Date,
    lastSyncAt: Date,
    syncCount: { type: Number, default: 0 }
  },
  
  // Notifications
  notifications: {
    notifyOnCompletion: { type: Boolean, default: true },
    notifyOnError: { type: Boolean, default: true },
    notifyEmails: [String]
  },
  
  // Organization
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  
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
  cancelledAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
accountingSyncSchema.index({ provider: 1, status: 1 });
accountingSyncSchema.index({ syncType: 1, status: 1 });
accountingSyncSchema.index({ integrationId: 1, status: 1 });
accountingSyncSchema.index({ 'scheduling.nextSyncAt': 1 });
accountingSyncSchema.index({ 'progress.startedAt': -1 });

// Virtual: Success Rate
accountingSyncSchema.virtual('successRate').get(function() {
  if (this.progress.totalRecords === 0) return 0;
  return Math.round((this.progress.syncedRecords / this.progress.totalRecords) * 100);
});

// Virtual: Is Complete
accountingSyncSchema.virtual('isComplete').get(function() {
  return ['Completed', 'Failed', 'Cancelled'].includes(this.status);
});

// Virtual: Duration
accountingSyncSchema.virtual('duration').get(function() {
  if (!this.progress.startedAt) return null;
  const endTime = this.progress.completedAt || new Date();
  const duration = endTime - this.progress.startedAt;
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
});

// Virtual: Total Records Synced
accountingSyncSchema.virtual('totalRecordsSynced').get(function() {
  return this.results.invoices.synced + 
         this.results.payments.synced + 
         this.results.clients.synced + 
         this.results.expenses.synced + 
         this.results.timeEntries.synced;
});

// Static method: Find active syncs
accountingSyncSchema.statics.findActive = function() {
  return this.find({
    status: { $in: ['Pending', 'In Progress'] }
  }).sort({ createdAt: -1 });
};

// Static method: Find scheduled syncs
accountingSyncSchema.statics.findScheduled = function() {
  return this.find({
    'scheduling.isScheduled': true,
    'scheduling.nextSyncAt': { $lte: new Date() },
    status: { $nin: ['In Progress'] }
  });
};

// Static method: Get sync statistics by provider
accountingSyncSchema.statics.getStatisticsByProvider = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$provider',
        totalSyncs: { $sum: 1 },
        successfulSyncs: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        failedSyncs: {
          $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] }
        },
        totalRecordsSynced: { $sum: '$progress.syncedRecords' },
        totalAmountSynced: { $sum: '$summary.totalAmountSynced' }
      }
    }
  ]);
  return stats;
};

// Instance method: Start sync
accountingSyncSchema.methods.start = async function(startedBy) {
  this.status = 'In Progress';
  this.progress.startedAt = new Date();
  this.startedBy = startedBy;
  this.scheduling.lastSyncAt = new Date();
  this.scheduling.syncCount += 1;
  await this.save();
};

// Instance method: Update progress
accountingSyncSchema.methods.updateProgress = async function(progressData) {
  const { processedRecords, syncedRecords, failedRecords, skippedRecords, currentPhase } = progressData;
  
  if (processedRecords !== undefined) this.progress.processedRecords = processedRecords;
  if (syncedRecords !== undefined) this.progress.syncedRecords = syncedRecords;
  if (failedRecords !== undefined) this.progress.failedRecords = failedRecords;
  if (skippedRecords !== undefined) this.progress.skippedRecords = skippedRecords;
  if (currentPhase) this.progress.currentPhase = currentPhase;
  
  if (this.progress.totalRecords > 0) {
    this.progress.percentComplete = Math.round(
      (this.progress.processedRecords / this.progress.totalRecords) * 100
    );
  }
  
  await this.save();
};

// Instance method: Complete sync
accountingSyncSchema.methods.complete = async function(success = true) {
  this.status = success ? 'Completed' : 'Failed';
  this.progress.completedAt = new Date();
  this.progress.percentComplete = 100;
  
  // Calculate next sync time if scheduled
  if (this.config.autoSync && this.scheduling.isScheduled) {
    const nextSync = new Date();
    switch (this.config.syncFrequency) {
      case 'Every 15 Minutes':
        nextSync.setMinutes(nextSync.getMinutes() + 15);
        break;
      case 'Hourly':
        nextSync.setHours(nextSync.getHours() + 1);
        break;
      case 'Daily':
        nextSync.setDate(nextSync.getDate() + 1);
        break;
      case 'Weekly':
        nextSync.setDate(nextSync.getDate() + 7);
        break;
    }
    this.scheduling.nextSyncAt = nextSync;
  }
  
  await this.save();
};

// Instance method: Add error
accountingSyncSchema.methods.addError = async function(errorData) {
  this.errors.push({
    ...errorData,
    timestamp: new Date()
  });
  this.progress.failedRecords += 1;
  
  // Limit stored errors to last 500
  if (this.errors.length > 500) {
    this.errors = this.errors.slice(-500);
  }
  
  await this.save();
};

// Instance method: Track synced item
accountingSyncSchema.methods.trackSyncedItem = async function(itemData) {
  const { entityType, localId, localReference, remoteId, remoteReference, status } = itemData;
  
  this.syncedItems.push({
    entityType,
    localId,
    localReference,
    remoteId,
    remoteReference,
    syncedAt: new Date(),
    lastModified: new Date(),
    status
  });
  
  // Update entity-specific results
  const entityKey = entityType.toLowerCase() + 's';
  if (this.results[entityKey]) {
    this.results[entityKey].synced += 1;
  }
  
  await this.save();
};

// Instance method: Cancel sync
accountingSyncSchema.methods.cancel = async function(cancelledBy) {
  this.status = 'Cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  await this.save();
};

// Pre-save middleware
accountingSyncSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

const AccountingSync = mongoose.model('AccountingSync', accountingSyncSchema);

module.exports = AccountingSync;
