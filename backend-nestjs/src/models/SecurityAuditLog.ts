/**
 * SecurityAuditLog Model - Mongoose Schema for Security Monitoring
 * Comprehensive audit trail for security events and system activities
 */

import mongoose from 'mongoose';

const securityAuditLogSchema = new mongoose.Schema({
  // Event Information
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'Login', 'Logout', 'Failed Login', 'Password Change', 'Password Reset',
      'User Created', 'User Updated', 'User Deleted', 'User Suspended',
      'Permission Changed', 'Role Changed', 'MFA Enabled', 'MFA Disabled',
      'Session Created', 'Session Ended', 'Access Denied', 'Unauthorized Access',
      'Data Access', 'Data Modified', 'Data Deleted', 'Data Exported',
      'Security Alert', 'Suspicious Activity', 'Compliance Violation',
      'System Config Changed', 'Backup Created', 'Backup Restored'
    ],
    index: true
  },
  severity: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low', 'Info'],
    default: 'Info',
    index: true
  },
  
  // Actor Information
  userId: {
    type: String,
    index: true
  },
  username: String,
  userRole: String,
  
  // Session & Location
  sessionId: String,
  ipAddress: {
    type: String,
    index: true
  },
  userAgent: String,
  location: {
    country: String,
    region: String,
    city: String
  },
  
  // Action Details
  action: {
    type: String,
    required: true
  },
  resource: String,
  resourceId: String,
  resourceType: String,
  
  // Changes
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  
  // Result
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Blocked', 'Pending'],
    default: 'Success'
  },
  statusMessage: String,
  errorMessage: String,
  
  // Risk Assessment
  riskScore: {
    type: Number,
    min: 0,
    max: 100
  },
  riskFactors: [String],
  
  // Context
  context: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  metadata: {
    type: Map,
    of: String
  },
  
  // Correlation
  correlationId: String,
  parentEventId: String,
  relatedEvents: [String],
  
  // Response
  responded: {
    type: Boolean,
    default: false
  },
  responseAction: String,
  respondedBy: String,
  respondedAt: Date,
  responseNotes: String
}, {
  timestamps: true
});

// Indexes
securityAuditLogSchema.index({ eventType: 1, createdAt: -1 });
securityAuditLogSchema.index({ userId: 1, createdAt: -1 });
securityAuditLogSchema.index({ severity: 1, status: 1 });
securityAuditLogSchema.index({ ipAddress: 1, createdAt: -1 });
securityAuditLogSchema.index({ createdAt: -1 });

// Methods
securityAuditLogSchema.methods.markAsResponded = function(respondedBy, action, notes) {
  this.responded = true;
  this.respondedBy = respondedBy;
  this.responseAction = action;
  this.responseNotes = notes;
  this.respondedAt = new Date();
  return this.save();
};

securityAuditLogSchema.methods.calculateRiskScore = function() {
  let score = 0;
  
  // Event type risk
  const highRiskEvents = ['Failed Login', 'Unauthorized Access', 'Data Deleted', 'Security Alert'];
  if (highRiskEvents.includes(this.eventType)) {
    score += 30;
  }
  
  // Severity risk
  const severityScores = { 'Critical': 40, 'High': 30, 'Medium': 20, 'Low': 10, 'Info': 0 };
  score += severityScores[this.severity] || 0;
  
  // Failed status
  if (this.status === 'Failed' || this.status === 'Blocked') {
    score += 20;
  }
  
  // Risk factors
  score += this.riskFactors.length * 5;
  
  this.riskScore = Math.min(score, 100);
  return this.riskScore;
};

// Static methods
securityAuditLogSchema.statics.findByUser = function(userId, limit = 100) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

securityAuditLogSchema.statics.findByEventType = function(eventType, limit = 100) {
  return this.find({ eventType })
    .sort({ createdAt: -1 })
    .limit(limit);
};

securityAuditLogSchema.statics.findHighRisk = function(limit = 50) {
  return this.find({
    $or: [
      { severity: { $in: ['Critical', 'High'] } },
      { riskScore: { $gte: 70 } }
    ],
    responded: false
  })
    .sort({ riskScore: -1, createdAt: -1 })
    .limit(limit);
};

securityAuditLogSchema.statics.findSuspiciousActivity = function(ipAddress, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    ipAddress,
    createdAt: { $gte: since },
    $or: [
      { eventType: 'Failed Login' },
      { status: 'Failed' },
      { status: 'Blocked' }
    ]
  }).sort({ createdAt: -1 });
};

const SecurityAuditLog = mongoose.model('SecurityAuditLog', securityAuditLogSchema);

export default SecurityAuditLog;
