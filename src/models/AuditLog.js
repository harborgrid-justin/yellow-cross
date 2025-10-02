/**
 * AuditLog Model - Mongoose Schema for Audit Trail & Logging
 * Comprehensive activity logging for compliance and security
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // Basic Information
  logId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  logType: {
    type: String,
    required: true,
    enum: ['User Action', 'System Event', 'Data Access', 'Data Modification', 'Authentication', 'Authorization', 'Security Event', 'Compliance Event', 'Error', 'Other'],
    index: true
  },
  eventType: {
    type: String,
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
  userRole: String,
  userEmail: String,
  
  // Action Details
  action: {
    type: String,
    required: true
  },
  actionCategory: {
    type: String,
    enum: ['Create', 'Read', 'Update', 'Delete', 'Login', 'Logout', 'Export', 'Import', 'Share', 'Download', 'Upload', 'Search', 'Other']
  },
  description: {
    type: String,
    trim: true
  },
  
  // Resource Information
  resourceType: {
    type: String,
    index: true
  },
  resourceId: {
    type: String,
    index: true
  },
  resourceName: String,
  
  // Changes Tracking
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    fields: [String]
  },
  
  // Request Information
  requestInfo: {
    method: String,
    endpoint: String,
    queryParams: mongoose.Schema.Types.Mixed,
    bodyParams: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed,
    statusCode: Number,
    responseTime: Number
  },
  
  // Session Information
  sessionId: String,
  ipAddress: {
    type: String,
    index: true
  },
  userAgent: String,
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  },
  location: {
    country: String,
    region: String,
    city: String
  },
  
  // Security Information
  securityContext: {
    authenticationMethod: String,
    authenticationStatus: String,
    permissionLevel: String,
    accessAttempt: Boolean,
    accessGranted: Boolean,
    failureReason: String
  },
  
  // Severity & Priority
  severity: {
    type: String,
    enum: ['Info', 'Low', 'Medium', 'High', 'Critical'],
    default: 'Info',
    index: true
  },
  
  // Status & Result
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Warning', 'Error', 'In Progress', 'Completed'],
    default: 'Success',
    index: true
  },
  resultCode: String,
  resultMessage: String,
  
  // Error Information
  errorDetails: {
    errorType: String,
    errorCode: String,
    errorMessage: String,
    stackTrace: String,
    errorContext: mongoose.Schema.Types.Mixed
  },
  
  // Compliance Information
  complianceCategory: {
    type: String,
    enum: ['Data Privacy', 'Security', 'Regulatory', 'Financial', 'Legal', 'Other']
  },
  retentionPeriod: {
    type: Number,
    default: 2555 // 7 years in days (typical legal retention)
  },
  retentionDate: Date,
  
  // Alert & Notification
  alertTriggered: {
    type: Boolean,
    default: false
  },
  alertLevel: String,
  alertRecipients: [String],
  alertSent: Boolean,
  alertSentDate: Date,
  
  // Metadata
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  source: {
    type: String,
    default: 'System'
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: false, // We use custom timestamp field
  capped: { size: 104857600, max: 1000000 } // Optional: 100MB cap, 1M documents max
});

// Indexes for performance
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ logType: 1, timestamp: -1 });
auditLogSchema.index({ eventType: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ username: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1, timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, severity: 1 });
auditLogSchema.index({ 'securityContext.accessGranted': 1, timestamp: -1 });
auditLogSchema.index({ retentionDate: 1 }); // For cleanup jobs

// Compound indexes for common queries
auditLogSchema.index({ logType: 1, status: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, actionCategory: 1, timestamp: -1 });

// Static methods
auditLogSchema.statics.logUserAction = async function(data) {
  const logId = `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const retentionDate = new Date();
  retentionDate.setDate(retentionDate.getDate() + (data.retentionPeriod || 2555));
  
  const log = new this({
    logId,
    logType: 'User Action',
    timestamp: new Date(),
    retentionDate,
    ...data
  });
  
  return await log.save();
};

auditLogSchema.statics.logDataAccess = async function(userId, username, resourceType, resourceId, action = 'Read') {
  return await this.logUserAction({
    userId,
    username,
    eventType: 'Data Access',
    action,
    actionCategory: 'Read',
    resourceType,
    resourceId,
    description: `User ${username} accessed ${resourceType} ${resourceId}`
  });
};

auditLogSchema.statics.logSecurityEvent = async function(data) {
  return await this.logUserAction({
    logType: 'Security Event',
    severity: 'High',
    alertTriggered: true,
    ...data
  });
};

auditLogSchema.statics.getUserActivity = function(userId, startDate, endDate) {
  const query = { userId };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }
  
  return this.find(query).sort({ timestamp: -1 });
};

auditLogSchema.statics.getResourceHistory = function(resourceType, resourceId) {
  return this.find({ resourceType, resourceId })
    .sort({ timestamp: -1 });
};

auditLogSchema.statics.getSecurityEvents = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    logType: 'Security Event',
    timestamp: { $gte: startDate }
  }).sort({ timestamp: -1 });
};

auditLogSchema.statics.getFailedLogins = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    eventType: 'Login Attempt',
    status: 'Failed',
    timestamp: { $gte: startDate }
  }).sort({ timestamp: -1 });
};

auditLogSchema.statics.getAuditReport = function(filters = {}, startDate, endDate) {
  const match = { ...filters };
  
  if (startDate || endDate) {
    match.timestamp = {};
    if (startDate) match.timestamp.$gte = startDate;
    if (endDate) match.timestamp.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          logType: '$logType',
          status: '$status'
        },
        count: { $sum: 1 },
        users: { $addToSet: '$username' }
      }
    },
    {
      $project: {
        logType: '$_id.logType',
        status: '$_id.status',
        count: 1,
        uniqueUsers: { $size: '$users' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Instance methods
auditLogSchema.methods.triggerAlert = function(alertLevel, recipients) {
  this.alertTriggered = true;
  this.alertLevel = alertLevel || 'Medium';
  this.alertRecipients = recipients || [];
  this.alertSent = false;
  
  return this.save();
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
