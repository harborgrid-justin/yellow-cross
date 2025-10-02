/**
 * Backup Model - Mongoose Schema for Data Backup & Recovery
 * Comprehensive data model for backup management and disaster recovery
 */

const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  // Backup ID
  backupNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Backup Information
  backupName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Backup Type
  backupType: {
    type: String,
    enum: ['Full', 'Incremental', 'Differential', 'Transaction Log'],
    required: true,
    default: 'Full',
    index: true
  },
  
  // Scope
  scope: {
    type: String,
    enum: ['System', 'Database', 'Collection', 'Documents', 'Users', 'Configuration'],
    required: true,
    default: 'Database',
    index: true
  },
  collections: [{
    type: String,
    trim: true
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Failed', 'Cancelled', 'Verifying', 'Verified'],
    required: true,
    default: 'Pending',
    index: true
  },
  
  // Scheduling
  scheduledAt: {
    type: Date,
    index: true
  },
  isScheduled: {
    type: Boolean,
    default: false,
    index: true
  },
  scheduleFrequency: {
    type: String,
    enum: ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Custom', null],
    default: null
  },
  scheduleConfig: {
    hour: Number,
    dayOfWeek: Number,
    dayOfMonth: Number,
    cronExpression: String
  },
  
  // Execution Details
  startedAt: {
    type: Date,
    index: true
  },
  completedAt: {
    type: Date,
    index: true
  },
  duration: {
    type: Number // in seconds
  },
  
  // Storage Information
  storagePath: {
    type: String,
    trim: true
  },
  storageLocation: {
    type: String,
    enum: ['Local', 'S3', 'Azure', 'Google Cloud', 'Network Drive', 'Other'],
    default: 'Local'
  },
  storageUrl: {
    type: String,
    trim: true
  },
  
  // Size Information
  size: {
    type: Number, // in bytes
    default: 0
  },
  sizeFormatted: {
    type: String,
    trim: true
  },
  compressedSize: {
    type: Number,
    default: 0
  },
  compressionRatio: {
    type: Number,
    default: 0
  },
  
  // Backup Statistics
  recordCount: {
    type: Number,
    default: 0
  },
  collectionStats: [{
    collection: String,
    count: Number,
    size: Number
  }],
  
  // Encryption
  encrypted: {
    type: Boolean,
    default: true
  },
  encryptionAlgorithm: {
    type: String,
    default: 'AES-256'
  },
  encryptionKeyId: {
    type: String,
    trim: true
  },
  
  // Compression
  compressed: {
    type: Boolean,
    default: true
  },
  compressionAlgorithm: {
    type: String,
    default: 'gzip'
  },
  
  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: String,
    trim: true
  },
  verificationResult: {
    type: String,
    trim: true
  },
  checksum: {
    type: String,
    trim: true
  },
  
  // Point-in-Time Recovery
  snapshotTimestamp: {
    type: Date,
    required: true,
    index: true
  },
  previousBackupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Backup'
  },
  nextBackupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Backup'
  },
  
  // Retention
  retentionPolicy: {
    type: String,
    enum: ['7 Days', '30 Days', '90 Days', '1 Year', '7 Years', 'Indefinite'],
    default: '90 Days'
  },
  expiresAt: {
    type: Date,
    index: true
  },
  
  // Restore History
  restoreHistory: [{
    restoredAt: {
      type: Date,
      default: Date.now
    },
    restoredBy: String,
    restoreType: {
      type: String,
      enum: ['Full', 'Partial', 'Point-in-Time']
    },
    targetLocation: String,
    success: Boolean,
    duration: Number,
    notes: String
  }],
  
  // Error Handling
  error: {
    type: String,
    trim: true
  },
  errorDetails: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  
  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Audit Fields
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  updatedBy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
backupSchema.index({ backupType: 1, status: 1 });
backupSchema.index({ snapshotTimestamp: -1 });
backupSchema.index({ isScheduled: 1, scheduledAt: 1 });
backupSchema.index({ expiresAt: 1 });

// Generate backup number
const generateBackupNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BKP-${timestamp}-${random}`;
};

// Helper function to format file size
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Pre-save middleware
backupSchema.pre('save', function(next) {
  if (this.isNew && !this.backupNumber) {
    this.backupNumber = generateBackupNumber();
  }
  
  // Format size
  if (this.isModified('size')) {
    this.sizeFormatted = formatSize(this.size);
  }
  
  // Calculate compression ratio
  if (this.compressed && this.compressedSize > 0 && this.size > 0) {
    this.compressionRatio = parseFloat(((1 - this.compressedSize / this.size) * 100).toFixed(2));
  }
  
  // Set expiration date based on retention policy
  if (this.isNew && !this.expiresAt) {
    const retentionDays = {
      '7 Days': 7,
      '30 Days': 30,
      '90 Days': 90,
      '1 Year': 365,
      '7 Years': 2555,
      'Indefinite': null
    };
    
    const days = retentionDays[this.retentionPolicy];
    if (days) {
      this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
  }
  
  // Calculate duration if completed
  if (this.status === 'Completed' && this.startedAt && this.completedAt) {
    this.duration = Math.floor((this.completedAt - this.startedAt) / 1000);
  }
  
  this.updatedAt = new Date();
  next();
});

// Instance method to start backup
backupSchema.methods.startBackup = async function() {
  this.status = 'In Progress';
  this.startedAt = new Date();
  return this.save();
};

// Instance method to complete backup
backupSchema.methods.completeBackup = async function(size, recordCount) {
  this.status = 'Completed';
  this.completedAt = new Date();
  this.size = size;
  this.recordCount = recordCount;
  return this.save();
};

// Instance method to fail backup
backupSchema.methods.failBackup = async function(error) {
  this.status = 'Failed';
  this.completedAt = new Date();
  this.error = error;
  this.retryCount += 1;
  return this.save();
};

// Instance method to verify backup
backupSchema.methods.verifyBackup = async function(verifiedBy, result) {
  this.verified = true;
  this.verifiedAt = new Date();
  this.verifiedBy = verifiedBy;
  this.verificationResult = result;
  this.status = 'Verified';
  return this.save();
};

// Instance method to record restore
backupSchema.methods.recordRestore = async function(restoredBy, restoreType, targetLocation, success, duration, notes) {
  this.restoreHistory.push({
    restoredAt: new Date(),
    restoredBy,
    restoreType,
    targetLocation,
    success,
    duration,
    notes
  });
  return this.save();
};

// Static method to get latest backup
backupSchema.statics.getLatest = async function(backupType = 'Full') {
  return this.findOne({
    backupType,
    status: 'Completed'
  }).sort({ snapshotTimestamp: -1 });
};

// Static method to cleanup expired backups
backupSchema.statics.cleanupExpired = async function() {
  const now = new Date();
  return this.find({
    expiresAt: { $lte: now },
    retentionPolicy: { $ne: 'Indefinite' }
  });
};

module.exports = mongoose.model('Backup', backupSchema);
