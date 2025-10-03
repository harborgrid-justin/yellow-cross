/**
 * AuditLog Model - Mongoose Schema for Security Audit Trails
 * Comprehensive data model for tamper-proof audit logging
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const auditLogSchema = new mongoose.Schema({
  // Log Entry ID
  logNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Event Information
  eventType: {
    type: String,
    required: true,
    enum: [
      'Login', 'Logout', 'Login Failed', 'Password Change', 'Password Reset',
      'User Created', 'User Updated', 'User Deleted', 'User Suspended',
      'Role Assigned', 'Role Revoked', 'Permission Changed',
      'Data Access', 'Data Create', 'Data Update', 'Data Delete',
      'File Upload', 'File Download', 'File Delete',
      'Security Alert', 'IP Block', 'Session Terminated',
      'MFA Enabled', 'MFA Disabled', 'Backup Created', 'Backup Restored',
      'Configuration Change', 'System Event', 'API Access', 'Other'
    ],
    index: true
  },
  eventCategory: {
    type: String,
    enum: ['Authentication', 'Authorization', 'Data Access', 'Configuration', 'Security', 'System'],
    required: true,
    index: true
  },
  
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  username: {
    type: String,
    trim: true,
    index: true
  },
  userRole: {
    type: String,
    trim: true
  },
  
  // Action Details
  action: {
    type: String,
    required: true,
    trim: true
  },
  resource: {
    type: String,
    trim: true,
    index: true
  },
  resourceId: {
    type: String,
    trim: true
  },
  
  // Request Information
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    trim: true
  },
  endpoint: {
    type: String,
    trim: true
  },
  
  // Result
  success: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  },
  statusCode: {
    type: Number
  },
  errorMessage: {
    type: String,
    trim: true
  },
  
  // Changes
  changesBefore: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  changesAfter: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  changedFields: [{
    type: String
  }],
  
  // Network Information
  ipAddress: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  deviceInfo: {
    type: String,
    trim: true
  },
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Session Information
  sessionId: {
    type: String,
    trim: true,
    index: true
  },
  
  // Additional Details
  description: {
    type: String,
    trim: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Security & Integrity
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low',
    index: true
  },
  checksum: {
    type: String,
    required: true
  },
  previousChecksum: {
    type: String
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  
  // Retention
  retentionDate: {
    type: Date,
    index: true
  },
  archived: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: false // We use our own timestamp field
});

// Compound indexes for common queries
auditLogSchema.index({ eventType: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });
auditLogSchema.index({ success: 1, severity: 1, timestamp: -1 });
auditLogSchema.index({ eventCategory: 1, timestamp: -1 });

// Generate log number
const generateLogNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LOG-${timestamp}-${random}`;
};

// Calculate checksum for tamper-proof logs
const calculateChecksum = (data, previousChecksum = '') => {
  const content = JSON.stringify({
    eventType: data.eventType,
    userId: data.userId,
    action: data.action,
    resource: data.resource,
    timestamp: data.timestamp,
    ipAddress: data.ipAddress,
    previousChecksum
  });
  
  return crypto.createHash('sha256').update(content).digest('hex');
};

// Pre-save middleware to generate checksum
auditLogSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate log number
    if (!this.logNumber) {
      this.logNumber = generateLogNumber();
    }
    
    // Get previous log's checksum for chaining
    const previousLog = await this.constructor.findOne()
      .sort({ timestamp: -1 })
      .select('checksum')
      .lean();
    
    this.previousChecksum = previousLog ? previousLog.checksum : '';
    
    // Calculate checksum
    this.checksum = calculateChecksum(this, this.previousChecksum);
    
    // Set retention date (default 7 years for legal compliance)
    if (!this.retentionDate) {
      this.retentionDate = new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000);
    }
  }
  
  next();
});

// Prevent updates and deletes (tamper-proof)
auditLogSchema.pre('findOneAndUpdate', function(next) {
  next(new Error('Audit logs cannot be modified'));
});

auditLogSchema.pre('findOneAndDelete', function(next) {
  next(new Error('Audit logs cannot be deleted'));
});

auditLogSchema.pre('deleteOne', function(next) {
  next(new Error('Audit logs cannot be deleted'));
});

auditLogSchema.pre('deleteMany', function(next) {
  next(new Error('Audit logs cannot be deleted'));
});

// Static method to create audit log
auditLogSchema.statics.createLog = async function(logData) {
  const log = new this(logData);
  return await log.save();
};

// Static method to verify log chain integrity
auditLogSchema.statics.verifyIntegrity = async function(startDate, endDate) {
  const logs = await this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ timestamp: 1 });
  
  let previousChecksum = '';
  const results = [];
  
  for (const log of logs) {
    const expectedChecksum = calculateChecksum(log, previousChecksum);
    const isValid = log.checksum === expectedChecksum && log.previousChecksum === previousChecksum;
    
    results.push({
      logNumber: log.logNumber,
      timestamp: log.timestamp,
      isValid,
      expectedChecksum,
      actualChecksum: log.checksum
    });
    
    if (!isValid) {
      console.error(`Integrity violation detected for log ${log.logNumber}`);
    }
    
    previousChecksum = log.checksum;
  }
  
  return results;
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
