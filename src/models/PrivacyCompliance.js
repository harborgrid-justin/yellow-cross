/**
 * PrivacyCompliance Model - Mongoose Schema for Data Privacy Compliance
 * GDPR, CCPA, and data privacy management
 */

const mongoose = require('mongoose');

const privacyComplianceSchema = new mongoose.Schema({
  // Basic Information
  privacyNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  complianceType: {
    type: String,
    required: true,
    enum: ['GDPR', 'CCPA', 'HIPAA', 'Data Subject Request', 'Privacy Policy', 'Consent Management', 'Data Breach', 'Privacy Assessment', 'Other'],
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
  
  // Data Subject Information
  dataSubject: {
    subjectType: {
      type: String,
      enum: ['Client', 'Employee', 'Vendor', 'Third Party', 'Other']
    },
    subjectId: String,
    subjectName: String,
    email: String,
    phone: String,
    jurisdiction: String,
    residenceCountry: String,
    residenceState: String
  },
  
  // GDPR Compliance
  gdprCompliance: {
    lawfulBasis: {
      type: String,
      enum: ['Consent', 'Contract', 'Legal Obligation', 'Vital Interests', 'Public Interest', 'Legitimate Interest']
    },
    dataCategories: [{
      category: String,
      description: String,
      sensitivity: String,
      retentionPeriod: String
    }],
    processingActivities: [String],
    dataProcessors: [String],
    internationalTransfer: Boolean,
    transferMechanism: String,
    dataProtectionOfficer: String,
    privacyImpactAssessment: Boolean,
    assessmentDate: Date,
    assessmentOutcome: String
  },
  
  // CCPA Compliance
  ccpaCompliance: {
    businessPurpose: [String],
    categories: [String],
    sources: [String],
    disclosedToThirdParties: Boolean,
    thirdParties: [String],
    sold: Boolean,
    optOutProvided: Boolean,
    optOutDate: Date,
    verificationMethod: String
  },
  
  // Data Subject Request
  dataSubjectRequest: {
    requestType: {
      type: String,
      enum: ['Access', 'Rectification', 'Erasure', 'Restriction', 'Portability', 'Object', 'Opt-Out', 'Do Not Sell', 'Other']
    },
    requestDate: Date,
    requestMethod: String,
    requestDetails: String,
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Failed', 'Additional Info Needed']
    },
    verificationMethod: String,
    verificationDate: Date,
    responseDeadline: Date,
    responseDate: Date,
    responseMethod: String,
    responseDetails: String,
    actionTaken: String,
    dataProvided: Boolean,
    dataDeleted: Boolean,
    extensionRequested: Boolean,
    extensionReason: String
  },
  
  // Consent Management
  consentManagement: {
    consentType: {
      type: String,
      enum: ['Marketing', 'Processing', 'Third Party Sharing', 'Cookies', 'Tracking', 'Other']
    },
    consentStatus: {
      type: String,
      enum: ['Granted', 'Denied', 'Withdrawn', 'Pending', 'Expired']
    },
    consentDate: Date,
    withdrawalDate: Date,
    consentMethod: String,
    consentPurpose: [String],
    consentScope: String,
    granular: Boolean,
    expirationDate: Date,
    renewalRequired: Boolean,
    renewalDate: Date
  },
  
  // Privacy Policy
  privacyPolicy: {
    policyVersion: String,
    effectiveDate: Date,
    lastUpdated: Date,
    acknowledgmentRequired: Boolean,
    acknowledgmentDate: Date,
    acknowledgedBy: String,
    changes: [String],
    notificationSent: Boolean,
    notificationDate: Date
  },
  
  // Data Breach
  dataBreach: {
    breachDate: Date,
    discoveryDate: Date,
    breachType: String,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    affectedRecords: Number,
    affectedIndividuals: Number,
    dataTypes: [String],
    breachCause: String,
    containmentActions: [String],
    notificationRequired: Boolean,
    authorityNotified: Boolean,
    authorityNotificationDate: Date,
    individualsNotified: Boolean,
    individualNotificationDate: Date,
    remediation: String,
    preventiveMeasures: [String]
  },
  
  // Status & Priority
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Completed', 'Overdue', 'Rejected', 'Escalated', 'Closed', 'Archived'],
    default: 'Pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
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
  dataProtectionOfficer: String,
  privacyOfficer: String,
  
  // Compliance Requirements
  requirements: [{
    requirement: String,
    description: String,
    dueDate: Date,
    status: String,
    completedDate: Date,
    completedBy: String,
    notes: String
  }],
  
  // Documentation
  documents: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    fileName: String,
    fileType: String,
    uploadedDate: Date,
    uploadedBy: String,
    category: String
  }],
  
  // Audit Trail
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Notifications
  notifications: [{
    notificationType: String,
    sentTo: String,
    sentDate: Date,
    deliveryStatus: String,
    acknowledged: Boolean
  }],
  
  // Metadata
  submittedDate: {
    type: Date,
    index: true
  },
  completedDate: Date,
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
privacyComplianceSchema.index({ complianceType: 1, status: 1 });
privacyComplianceSchema.index({ 'dataSubject.subjectId': 1 });
privacyComplianceSchema.index({ 'dataSubjectRequest.requestType': 1 });
privacyComplianceSchema.index({ 'dataSubjectRequest.responseDeadline': 1 });
privacyComplianceSchema.index({ assignedTo: 1, status: 1 });
privacyComplianceSchema.index({ submittedDate: -1 });

// Static methods
privacyComplianceSchema.statics.findPendingRequests = function() {
  return this.find({
    status: { $in: ['Pending', 'In Progress'] },
    complianceType: 'Data Subject Request'
  }).sort({ 'dataSubjectRequest.responseDeadline': 1 });
};

privacyComplianceSchema.statics.findOverdueRequests = function() {
  const now = new Date();
  return this.find({
    status: { $nin: ['Completed', 'Closed', 'Archived'] },
    'dataSubjectRequest.responseDeadline': { $lt: now }
  }).sort({ 'dataSubjectRequest.responseDeadline': 1 });
};

privacyComplianceSchema.statics.findByDataSubject = function(subjectId) {
  return this.find({ 'dataSubject.subjectId': subjectId })
    .sort({ createdAt: -1 });
};

privacyComplianceSchema.statics.getComplianceMetrics = function(startDate, endDate) {
  const match = {};
  
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = startDate;
    if (endDate) match.createdAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$complianceType',
        count: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $in: ['$status', ['Pending', 'In Progress']] }, 1, 0] }
        },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        overdue: {
          $sum: { $cond: [{ $eq: ['$status', 'Overdue'] }, 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Instance methods
privacyComplianceSchema.methods.processRequest = function(processedBy, actionTaken, notes) {
  this.status = 'Completed';
  this.completedDate = new Date();
  this.updatedBy = processedBy;
  this.updatedAt = new Date();
  
  if (this.dataSubjectRequest) {
    this.dataSubjectRequest.responseDate = new Date();
    this.dataSubjectRequest.actionTaken = actionTaken;
  }
  
  this.statusHistory.push({
    status: 'Completed',
    changedBy: processedBy,
    changedAt: new Date(),
    notes
  });
  
  return this.save();
};

privacyComplianceSchema.methods.grantConsent = function(consentData) {
  this.consentManagement = {
    ...consentData,
    consentStatus: 'Granted',
    consentDate: new Date()
  };
  
  this.updatedAt = new Date();
  return this.save();
};

privacyComplianceSchema.methods.withdrawConsent = function(withdrawnBy, reason) {
  if (this.consentManagement) {
    this.consentManagement.consentStatus = 'Withdrawn';
    this.consentManagement.withdrawalDate = new Date();
  }
  
  this.updatedBy = withdrawnBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: this.status,
    changedBy: withdrawnBy,
    changedAt: new Date(),
    notes: `Consent withdrawn: ${reason}`
  });
  
  return this.save();
};

module.exports = mongoose.model('PrivacyCompliance', privacyComplianceSchema);
