/**
 * SecurityAlert Model - Mongoose Schema for Security Monitoring & Alerts
 * Comprehensive data model for threat detection and incident response
 */

const mongoose = require('mongoose');

const securityAlertSchema = new mongoose.Schema({
  // Alert ID
  alertNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Alert Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Alert Type
  alertType: {
    type: String,
    required: true,
    enum: [
      'Threat Detection',
      'Intrusion Detection',
      'Anomaly Detection',
      'Brute Force Attack',
      'Unauthorized Access',
      'Data Breach',
      'Malware Detection',
      'Suspicious Activity',
      'Policy Violation',
      'Configuration Change',
      'Failed Login',
      'Account Lockout',
      'Privilege Escalation',
      'Data Exfiltration',
      'DDoS Attack',
      'SQL Injection',
      'XSS Attack',
      'CSRF Attack',
      'Session Hijacking',
      'Other'
    ],
    index: true
  },
  
  // Severity
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['New', 'Investigating', 'Confirmed', 'False Positive', 'Resolved', 'Ignored'],
    default: 'New',
    index: true
  },
  
  // Source Information
  sourceIP: {
    type: String,
    trim: true,
    index: true
  },
  sourceLocation: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  userAgent: {
    type: String,
    trim: true
  },
  
  // Target Information
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  targetUsername: {
    type: String,
    trim: true
  },
  targetResource: {
    type: String,
    trim: true
  },
  targetEndpoint: {
    type: String,
    trim: true
  },
  
  // Detection Details
  detectedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  detectionMethod: {
    type: String,
    enum: ['Rule-Based', 'ML-Based', 'Signature-Based', 'Behavior-Based', 'Heuristic', 'Manual'],
    default: 'Rule-Based'
  },
  detectionRule: {
    type: String,
    trim: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  
  // Evidence
  evidence: [{
    type: {
      type: String,
      enum: ['Log Entry', 'Network Traffic', 'File', 'Screenshot', 'Memory Dump', 'Other']
    },
    description: String,
    reference: String,
    timestamp: Date,
    data: mongoose.Schema.Types.Mixed
  }],
  
  // Related Events
  relatedAlerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SecurityAlert'
  }],
  relatedAuditLogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuditLog'
  }],
  
  // Pattern Analysis
  pattern: {
    type: String,
    trim: true
  },
  frequency: {
    type: Number,
    default: 1
  },
  firstOccurrence: {
    type: Date,
    default: Date.now
  },
  lastOccurrence: {
    type: Date,
    default: Date.now
  },
  occurrences: [{
    timestamp: Date,
    details: mongoose.Schema.Types.Mixed
  }],
  
  // Risk Assessment
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  impactLevel: {
    type: String,
    enum: ['Negligible', 'Minor', 'Moderate', 'Significant', 'Severe'],
    default: 'Minor'
  },
  affectedSystems: [{
    type: String,
    trim: true
  }],
  affectedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Response Actions
  autoResponseActions: [{
    action: {
      type: String,
      enum: ['Block IP', 'Lock Account', 'Terminate Session', 'Send Alert', 'Log Event', 'Quarantine', 'None']
    },
    executedAt: Date,
    success: Boolean,
    details: String
  }],
  
  // Investigation
  investigatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  investigatedAt: {
    type: Date
  },
  investigationNotes: [{
    note: String,
    author: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Resolution
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date,
    index: true
  },
  resolution: {
    type: String,
    trim: true
  },
  resolutionActions: [{
    action: String,
    performedBy: String,
    performedAt: Date,
    result: String
  }],
  
  // Notification
  notificationsSent: [{
    recipient: String,
    channel: {
      type: String,
      enum: ['Email', 'SMS', 'In-App', 'Slack', 'Webhook', 'Other']
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    success: Boolean
  }],
  escalated: {
    type: Boolean,
    default: false
  },
  escalatedTo: [{
    type: String,
    trim: true
  }],
  escalatedAt: {
    type: Date
  },
  
  // Compliance & Reporting
  requiresCompliance: {
    type: Boolean,
    default: false
  },
  complianceReports: [{
    framework: String,
    reportId: String,
    reportedAt: Date
  }],
  
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
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
securityAlertSchema.index({ alertType: 1, severity: 1 });
securityAlertSchema.index({ status: 1, severity: 1 });
securityAlertSchema.index({ detectedAt: -1 });
securityAlertSchema.index({ sourceIP: 1, detectedAt: -1 });

// Generate alert number
const generateAlertNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ALERT-${timestamp}-${random}`;
};

// Pre-save middleware
securityAlertSchema.pre('save', function(next) {
  if (this.isNew && !this.alertNumber) {
    this.alertNumber = generateAlertNumber();
  }
  
  // Update last occurrence
  if (this.isModified('frequency')) {
    this.lastOccurrence = new Date();
  }
  
  this.updatedAt = new Date();
  next();
});

// Instance method to add investigation note
securityAlertSchema.methods.addInvestigationNote = async function(note, author) {
  this.investigationNotes.push({
    note,
    author,
    timestamp: new Date()
  });
  
  if (this.status === 'New') {
    this.status = 'Investigating';
    this.investigatedBy = author;
    this.investigatedAt = new Date();
  }
  
  return this.save();
};

// Instance method to resolve alert
securityAlertSchema.methods.resolve = async function(resolvedBy, resolution, actions = []) {
  this.status = 'Resolved';
  this.resolvedBy = resolvedBy;
  this.resolvedAt = new Date();
  this.resolution = resolution;
  this.resolutionActions = actions;
  return this.save();
};

// Instance method to mark as false positive
securityAlertSchema.methods.markFalsePositive = async function(markedBy, reason) {
  this.status = 'False Positive';
  this.resolvedBy = markedBy;
  this.resolvedAt = new Date();
  this.resolution = `False Positive: ${reason}`;
  return this.save();
};

// Instance method to escalate
securityAlertSchema.methods.escalate = async function(escalatedTo) {
  this.escalated = true;
  this.escalatedTo = escalatedTo;
  this.escalatedAt = new Date();
  return this.save();
};

// Instance method to send notification
securityAlertSchema.methods.sendNotification = async function(recipient, channel, success = true) {
  this.notificationsSent.push({
    recipient,
    channel,
    sentAt: new Date(),
    success
  });
  return this.save();
};

// Instance method to add evidence
securityAlertSchema.methods.addEvidence = async function(type, description, reference, data) {
  this.evidence.push({
    type,
    description,
    reference,
    timestamp: new Date(),
    data
  });
  return this.save();
};

// Static method to get active alerts
securityAlertSchema.statics.getActiveAlerts = async function(severity = null) {
  const query = {
    status: { $in: ['New', 'Investigating', 'Confirmed'] }
  };
  
  if (severity) {
    query.severity = severity;
  }
  
  return this.find(query).sort({ detectedAt: -1 });
};

// Static method to get statistics
securityAlertSchema.statics.getStatistics = async function(startDate, endDate) {
  const match = {
    detectedAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          alertType: '$alertType',
          severity: '$severity',
          status: '$status'
        },
        count: { $sum: 1 },
        avgRiskScore: { $avg: '$riskScore' }
      }
    }
  ]);
  
  return stats;
};

module.exports = mongoose.model('SecurityAlert', securityAlertSchema);
