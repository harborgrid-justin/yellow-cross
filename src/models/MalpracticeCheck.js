/**
 * MalpracticeCheck Model - Mongoose Schema for Malpractice Prevention
 * Conflict checking, deadline monitoring, and quality assurance
 */

const mongoose = require('mongoose');

const malpracticeCheckSchema = new mongoose.Schema({
  // Basic Information
  checkNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  checkType: {
    type: String,
    required: true,
    enum: ['Conflict Check', 'Deadline Check', 'Statute of Limitations', 'Quality Review', 'Best Practice Alert', 'Document Review', 'Other'],
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
  
  // Associated Entity
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  caseNumber: String,
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  clientName: String,
  
  // Conflict Check Details
  conflictCheck: {
    checkDate: Date,
    checkedBy: String,
    partyNames: [String],
    opposingParty: String,
    opposingCounsel: String,
    conflictType: {
      type: String,
      enum: ['Direct Conflict', 'Indirect Conflict', 'Potential Conflict', 'No Conflict', 'Waived']
    },
    conflictDetails: String,
    resolutionMethod: String,
    waiverObtained: Boolean,
    waiverDate: Date,
    waiverDocument: String
  },
  
  // Deadline Monitoring
  deadlineMonitoring: {
    deadlineType: {
      type: String,
      enum: ['Filing', 'Response', 'Discovery', 'Motion', 'Appeal', 'Statute of Limitations', 'Other']
    },
    deadlineDate: Date,
    triggerDate: Date,
    calculationMethod: String,
    jurisdictionRules: String,
    reminderSchedule: [Date],
    responsibleAttorney: String,
    backupAttorney: String,
    extensionRequested: Boolean,
    extensionGranted: Boolean,
    newDeadline: Date,
    notes: String
  },
  
  // Statute of Limitations
  statuteLimitations: {
    claimType: String,
    jurisdiction: String,
    incidentDate: Date,
    discoveryDate: Date,
    filingDeadline: Date,
    calculatedDeadline: Date,
    tollingEvents: [{
      event: String,
      date: Date,
      duration: String,
      notes: String
    }],
    statute: String,
    statuteCitation: String,
    exceptions: [String],
    riskLevel: String
  },
  
  // Quality Check
  qualityCheck: {
    checklistType: String,
    checkDate: Date,
    checkedBy: String,
    checklistItems: [{
      item: String,
      category: String,
      status: {
        type: String,
        enum: ['Pass', 'Fail', 'Not Applicable', 'Needs Review']
      },
      notes: String,
      reviewedBy: String,
      reviewDate: Date
    }],
    overallResult: {
      type: String,
      enum: ['Pass', 'Conditional Pass', 'Fail', 'Needs Improvement']
    },
    findings: String,
    recommendations: [String],
    correctiveActions: [String]
  },
  
  // Best Practice Alert
  bestPracticeAlert: {
    alertType: String,
    alertLevel: {
      type: String,
      enum: ['Info', 'Warning', 'Critical']
    },
    alertMessage: String,
    recommendedAction: String,
    references: [String],
    acknowledged: Boolean,
    acknowledgedBy: String,
    acknowledgedDate: Date
  },
  
  // Result & Status
  result: {
    type: String,
    required: true,
    enum: ['Clear', 'Issue Found', 'Conflict Identified', 'Deadline At Risk', 'Action Required', 'Resolved', 'Waived'],
    index: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Review', 'Resolved', 'Escalated', 'Waived', 'Closed', 'Archived'],
    default: 'Pending',
    index: true
  },
  
  // Action Items
  actionItems: [{
    action: String,
    priority: String,
    assignedTo: String,
    dueDate: Date,
    status: String,
    completedDate: Date,
    completedBy: String,
    notes: String
  }],
  
  // Resolution
  resolution: {
    resolutionType: String,
    resolutionDate: Date,
    resolvedBy: String,
    resolutionNotes: String,
    followUpRequired: Boolean,
    followUpDate: Date
  },
  
  // Assignment
  assignedTo: {
    type: String,
    trim: true,
    index: true
  },
  assignedToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: String,
  approvedBy: String,
  
  // Documentation
  documents: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    fileName: String,
    fileType: String,
    uploadedDate: Date,
    uploadedBy: String
  }],
  
  // Notifications
  notifications: [{
    notificationType: String,
    sentTo: String,
    sentDate: Date,
    deliveryStatus: String,
    acknowledged: Boolean
  }],
  
  // Audit Trail
  statusHistory: [{
    status: String,
    result: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Metadata
  checkDate: {
    type: Date,
    required: true,
    index: true
  },
  performedBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedBy: String,
  updatedAt: Date,
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for performance
malpracticeCheckSchema.index({ checkType: 1, result: 1 });
malpracticeCheckSchema.index({ caseNumber: 1 });
malpracticeCheckSchema.index({ assignedTo: 1, status: 1 });
malpracticeCheckSchema.index({ 'deadlineMonitoring.deadlineDate': 1 });
malpracticeCheckSchema.index({ 'statuteLimitations.filingDeadline': 1 });
malpracticeCheckSchema.index({ checkDate: -1 });
malpracticeCheckSchema.index({ severity: 1, status: 1 });

// Static methods
malpracticeCheckSchema.statics.findConflicts = function() {
  return this.find({
    checkType: 'Conflict Check',
    'conflictCheck.conflictType': { $in: ['Direct Conflict', 'Indirect Conflict', 'Potential Conflict'] },
    status: { $nin: ['Resolved', 'Waived', 'Closed'] }
  }).sort({ checkDate: -1 });
};

malpracticeCheckSchema.statics.findUpcomingDeadlines = function(days = 30) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.find({
    checkType: 'Deadline Check',
    'deadlineMonitoring.deadlineDate': { $gte: now, $lte: futureDate },
    status: { $nin: ['Resolved', 'Closed'] }
  }).sort({ 'deadlineMonitoring.deadlineDate': 1 });
};

malpracticeCheckSchema.statics.findCriticalIssues = function() {
  return this.find({
    severity: { $in: ['High', 'Critical'] },
    status: { $nin: ['Resolved', 'Closed', 'Archived'] }
  }).sort({ severity: -1, checkDate: -1 });
};

// Instance methods
malpracticeCheckSchema.methods.resolve = function(resolvedBy, resolutionNotes) {
  this.status = 'Resolved';
  this.resolution = {
    resolutionType: 'Manual Resolution',
    resolutionDate: new Date(),
    resolvedBy,
    resolutionNotes,
    followUpRequired: false
  };
  this.updatedBy = resolvedBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: 'Resolved',
    result: this.result,
    changedBy: resolvedBy,
    changedAt: new Date(),
    notes: resolutionNotes
  });
  
  return this.save();
};

malpracticeCheckSchema.methods.escalate = function(escalatedBy, reason) {
  this.status = 'Escalated';
  this.severity = 'Critical';
  this.updatedBy = escalatedBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: 'Escalated',
    result: this.result,
    changedBy: escalatedBy,
    changedAt: new Date(),
    notes: `Escalated: ${reason}`
  });
  
  return this.save();
};

module.exports = mongoose.model('MalpracticeCheck', malpracticeCheckSchema);
