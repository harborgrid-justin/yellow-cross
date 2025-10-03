/**
 * LegalHold Model - Mongoose Schema for Legal Hold Management
 * Manages legal hold notifications and custodian compliance
 */

const mongoose = require('mongoose');

const legalHoldSchema = new mongoose.Schema({
  // Basic Information
  holdNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  holdName: {
    type: String,
    required: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  caseNumber: {
    type: String,
    required: true,
    index: true
  },
  
  // Hold Details
  description: {
    type: String,
    required: true
  },
  legalBasis: {
    type: String,
    required: true
  },
  scope: {
    type: String,
    required: true
  },
  
  // Dates
  issuedDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  effectiveDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  releaseDate: Date,
  
  // Data Preservation Requirements
  dataTypes: [{
    type: String,
    enum: ['Email', 'Documents', 'Database', 'Social Media', 'Text Messages', 'Voice Mail', 'Calendar', 'Instant Messages', 'Other']
  }],
  dataSources: [String],
  preservationInstructions: String,
  
  // Custodians
  custodians: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    department: String,
    title: String,
    notificationSent: {
      type: Boolean,
      default: false
    },
    notificationDate: Date,
    acknowledged: {
      type: Boolean,
      default: false
    },
    acknowledgmentDate: Date,
    acknowledgmentMethod: {
      type: String,
      enum: ['Email', 'In Person', 'Phone', 'System']
    },
    remindersSent: {
      type: Number,
      default: 0
    },
    lastReminderDate: Date,
    interviewCompleted: {
      type: Boolean,
      default: false
    },
    interviewDate: Date,
    interviewNotes: String,
    complianceStatus: {
      type: String,
      enum: ['Pending', 'Compliant', 'Non-Compliant', 'Partial', 'Escalated'],
      default: 'Pending'
    },
    notes: String
  }],
  
  // Notification Details
  notificationTemplate: String,
  notificationContent: String,
  notificationMethod: {
    type: String,
    enum: ['Email', 'In Person', 'Mail', 'System'],
    default: 'Email'
  },
  
  // Compliance Tracking
  totalCustodians: {
    type: Number,
    default: 0
  },
  acknowledgedCustodians: {
    type: Number,
    default: 0
  },
  complianceRate: {
    type: Number,
    default: 0
  },
  
  // Reminder Schedule
  reminderFrequency: {
    type: String,
    enum: ['None', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly'],
    default: 'Monthly'
  },
  nextReminderDate: Date,
  
  // Evidence Collection
  evidenceCollected: [{
    evidenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evidence'
    },
    custodian: String,
    collectionDate: Date
  }],
  totalEvidenceItems: {
    type: Number,
    default: 0
  },
  
  // Hold Status
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Released', 'Partially Released', 'Expired'],
    default: 'Draft',
    index: true
  },
  
  // Release Information
  releaseReason: String,
  releasedBy: String,
  releaseNotificationSent: {
    type: Boolean,
    default: false
  },
  releaseNotificationDate: Date,
  
  // Audit Trail
  auditLog: [{
    action: String,
    performedBy: String,
    performedAt: {
      type: Date,
      default: Date.now
    },
    details: String
  }],
  
  // Created By
  createdBy: {
    type: String,
    required: true
  },
  approvedBy: String,
  approvalDate: Date,
  
  // Notes
  notes: String,
  internalNotes: String
}, {
  timestamps: true
});

// Indexes for performance
legalHoldSchema.index({ caseId: 1, status: 1 });
legalHoldSchema.index({ issuedDate: -1 });
legalHoldSchema.index({ 'custodians.email': 1 });
legalHoldSchema.index({ 'custodians.complianceStatus': 1 });

// Pre-save hook to update counts
legalHoldSchema.pre('save', function(next) {
  if (this.custodians) {
    this.totalCustodians = this.custodians.length;
    this.acknowledgedCustodians = this.custodians.filter(c => c.acknowledged).length;
    this.complianceRate = this.totalCustodians > 0 
      ? Math.round((this.acknowledgedCustodians / this.totalCustodians) * 100)
      : 0;
  }
  next();
});

// Static method to find active holds
legalHoldSchema.statics.findActiveHolds = function(caseId = null) {
  const query = { status: 'Active' };
  if (caseId) query.caseId = caseId;
  return this.find(query).sort({ issuedDate: -1 });
};

// Static method to find holds by custodian
legalHoldSchema.statics.findByCustodian = function(email) {
  return this.find({ 
    'custodians.email': email,
    status: { $in: ['Active', 'Partially Released'] }
  }).sort({ issuedDate: -1 });
};

// Instance method to notify custodian
legalHoldSchema.methods.notifyCustodian = function(custodianEmail) {
  const custodian = this.custodians.find(c => c.email === custodianEmail);
  if (custodian) {
    custodian.notificationSent = true;
    custodian.notificationDate = new Date();
    
    this.auditLog.push({
      action: 'Notification Sent',
      performedBy: 'System',
      performedAt: new Date(),
      details: `Notification sent to ${custodianEmail}`
    });
  }
  return this.save();
};

// Instance method to acknowledge hold
legalHoldSchema.methods.acknowledgeCustodian = function(custodianEmail, method = 'Email') {
  const custodian = this.custodians.find(c => c.email === custodianEmail);
  if (custodian) {
    custodian.acknowledged = true;
    custodian.acknowledgmentDate = new Date();
    custodian.acknowledgmentMethod = method;
    custodian.complianceStatus = 'Compliant';
    
    this.auditLog.push({
      action: 'Hold Acknowledged',
      performedBy: custodianEmail,
      performedAt: new Date(),
      details: `Hold acknowledged via ${method}`
    });
  }
  return this.save();
};

// Instance method to release hold
legalHoldSchema.methods.releaseHold = function(releasedBy, reason) {
  this.status = 'Released';
  this.releaseDate = new Date();
  this.releasedBy = releasedBy;
  this.releaseReason = reason;
  
  this.auditLog.push({
    action: 'Hold Released',
    performedBy: releasedBy,
    performedAt: new Date(),
    details: reason
  });
  
  return this.save();
};

module.exports = mongoose.model('LegalHold', legalHoldSchema);
