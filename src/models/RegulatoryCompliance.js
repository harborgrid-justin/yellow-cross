/**
 * RegulatoryCompliance Model - Mongoose Schema for Regulatory Compliance
 * ABA, State Bar, Trust Accounting, and Advertising Compliance
 */

const mongoose = require('mongoose');

const regulatoryComplianceSchema = new mongoose.Schema({
  // Basic Information
  complianceNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  complianceType: {
    type: String,
    required: true,
    enum: ['ABA Rules', 'State Bar Rules', 'Trust Accounting', 'Advertising Compliance', 'Fee Agreement', 'Record Keeping', 'Professional Conduct', 'Other'],
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
  
  // Jurisdiction & Regulatory Body
  jurisdiction: {
    type: String,
    required: true,
    index: true
  },
  regulatoryBody: {
    type: String,
    required: true,
    enum: ['ABA', 'State Bar', 'Federal Court', 'State Court', 'Ethics Committee', 'Bar Association', 'Professional Conduct Board', 'Other']
  },
  
  // ABA Compliance
  abaCompliance: {
    modelRule: String,
    ruleNumber: String,
    ruleTitle: String,
    ruleDescription: String,
    applicability: String,
    complianceRequirements: [String],
    effectiveDate: Date,
    lastUpdated: Date,
    comments: [String]
  },
  
  // State Bar Rules
  stateBarRules: {
    state: String,
    ruleNumber: String,
    ruleTitle: String,
    ruleCategory: String,
    requirements: [String],
    effectiveDate: Date,
    complianceDeadline: Date,
    renewalFrequency: String,
    lastRenewal: Date,
    nextRenewal: Date,
    filingRequired: Boolean,
    filingStatus: String
  },
  
  // Trust Accounting
  trustAccounting: {
    accountType: {
      type: String,
      enum: ['IOLTA', 'Client Trust', 'Operating', 'Other']
    },
    accountNumber: String,
    bank: String,
    reconciliationFrequency: String,
    lastReconciliation: Date,
    nextReconciliation: Date,
    auditRequired: Boolean,
    lastAudit: Date,
    nextAudit: Date,
    complianceStatus: String,
    findings: [String],
    correctiveActions: [String]
  },
  
  // Advertising Compliance
  advertisingCompliance: {
    advertisingType: {
      type: String,
      enum: ['Website', 'Social Media', 'Television', 'Radio', 'Print', 'Direct Mail', 'Other']
    },
    submissionRequired: Boolean,
    submittedDate: Date,
    approvalRequired: Boolean,
    approvalStatus: String,
    approvalDate: Date,
    expirationDate: Date,
    disclaimers: [String],
    restrictions: [String],
    complianceChecklist: [{
      item: String,
      status: Boolean,
      notes: String
    }]
  },
  
  // Fee Agreement Compliance
  feeAgreement: {
    agreementType: {
      type: String,
      enum: ['Hourly', 'Flat Fee', 'Contingency', 'Retainer', 'Hybrid', 'Other']
    },
    disclosureRequired: Boolean,
    disclosureProvided: Boolean,
    clientSignature: Boolean,
    signatureDate: Date,
    retainerAmount: Number,
    feeSchedule: String,
    billingFrequency: String,
    complianceChecks: [String]
  },
  
  // Record Keeping
  recordKeeping: {
    retentionPeriod: String,
    retentionDeadline: Date,
    storageLocation: String,
    storageMethod: String,
    accessControls: [String],
    backupFrequency: String,
    lastBackup: Date,
    complianceStatus: String
  },
  
  // Compliance Status
  status: {
    type: String,
    required: true,
    enum: ['Compliant', 'Non-Compliant', 'Pending', 'Under Review', 'Action Required', 'Grace Period', 'Archived'],
    default: 'Pending',
    index: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  
  // Requirements & Obligations
  requirements: [{
    requirement: String,
    description: String,
    dueDate: Date,
    status: String,
    completedDate: Date,
    completedBy: String,
    notes: String
  }],
  
  // Filings & Submissions
  filings: [{
    filingType: String,
    filingDate: Date,
    filedBy: String,
    confirmationNumber: String,
    status: String,
    dueDate: Date,
    submissionMethod: String,
    documents: [String]
  }],
  
  // Regulatory Updates
  regulatoryUpdates: [{
    updateDate: Date,
    updateType: String,
    updateDescription: String,
    effectiveDate: Date,
    impactAssessment: String,
    actionRequired: Boolean,
    actionTaken: String,
    actionDate: Date
  }],
  
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
  responsibleParty: String,
  complianceOfficer: String,
  
  // Dates & Deadlines
  effectiveDate: Date,
  complianceDeadline: {
    type: Date,
    index: true
  },
  renewalDate: Date,
  expirationDate: Date,
  reviewDate: Date,
  nextReviewDate: Date,
  
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
  
  // Metadata
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
regulatoryComplianceSchema.index({ complianceType: 1, status: 1 });
regulatoryComplianceSchema.index({ jurisdiction: 1, regulatoryBody: 1 });
regulatoryComplianceSchema.index({ assignedTo: 1, status: 1 });
regulatoryComplianceSchema.index({ complianceDeadline: 1 });
regulatoryComplianceSchema.index({ 'stateBarRules.nextRenewal': 1 });
regulatoryComplianceSchema.index({ createdAt: -1 });

// Static methods
regulatoryComplianceSchema.statics.findByJurisdiction = function(jurisdiction) {
  return this.find({ 
    jurisdiction, 
    status: { $nin: ['Compliant', 'Archived'] } 
  }).sort({ severity: -1, complianceDeadline: 1 });
};

regulatoryComplianceSchema.statics.findUpcomingRenewals = function(days = 60) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.find({
    $or: [
      { renewalDate: { $gte: now, $lte: futureDate } },
      { 'stateBarRules.nextRenewal': { $gte: now, $lte: futureDate } }
    ],
    status: { $nin: ['Archived'] }
  }).sort({ renewalDate: 1 });
};

regulatoryComplianceSchema.statics.findNonCompliant = function() {
  return this.find({
    status: { $in: ['Non-Compliant', 'Action Required'] }
  }).sort({ severity: -1, complianceDeadline: 1 });
};

// Instance methods
regulatoryComplianceSchema.methods.markCompliant = function(completedBy, notes) {
  this.status = 'Compliant';
  this.updatedBy = completedBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: 'Compliant',
    changedBy: completedBy,
    changedAt: new Date(),
    notes
  });
  
  return this.save();
};

regulatoryComplianceSchema.methods.scheduleRenewal = function(renewalDate) {
  if (this.stateBarRules) {
    this.stateBarRules.nextRenewal = renewalDate;
  } else {
    this.renewalDate = renewalDate;
  }
  
  this.updatedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('RegulatoryCompliance', regulatoryComplianceSchema);
