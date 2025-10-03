/**
 * Contract Model - Mongoose Schema for Contract Management System
 * Comprehensive data model for contract lifecycle management, tracking, and compliance
 */

const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  // Basic Information
  contractNumber: {
    type: String,
    required: true,
    unique: true,
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
  
  // Contract Classification
  contractType: {
    type: String,
    required: true,
    enum: [
      'Service Agreement', 'Employment Contract', 'Non-Disclosure Agreement', 
      'Purchase Agreement', 'Lease Agreement', 'Partnership Agreement', 
      'Consulting Agreement', 'License Agreement', 'Master Service Agreement',
      'Statement of Work', 'Amendment', 'Other'
    ],
    index: true
  },
  category: {
    type: String,
    trim: true
  },
  practiceArea: {
    type: String,
    trim: true,
    index: true
  },
  jurisdiction: {
    type: String,
    trim: true
  },
  governingLaw: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Parties Information
  parties: [{
    partyType: {
      type: String,
      enum: ['Client', 'Vendor', 'Supplier', 'Partner', 'Customer', 'Service Provider', 'Other'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    entityType: {
      type: String,
      enum: ['Individual', 'Corporation', 'LLC', 'Partnership', 'Government', 'Non-Profit', 'Other']
    },
    contactPerson: String,
    email: String,
    phone: String,
    address: String,
    signatureRequired: {
      type: Boolean,
      default: true
    },
    signedDate: Date,
    signedBy: String
  }],
  
  // Contract Status & Lifecycle
  status: {
    type: String,
    required: true,
    enum: [
      'Draft', 'Under Review', 'In Negotiation', 'Awaiting Approval', 
      'Awaiting Signature', 'Executed', 'Active', 'Expired', 
      'Terminated', 'Renewed', 'Archived'
    ],
    default: 'Draft',
    index: true
  },
  lifecycleStage: {
    type: String,
    enum: ['Pre-Execution', 'Execution', 'Post-Execution', 'Renewal', 'Termination'],
    default: 'Pre-Execution',
    index: true
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Dates & Timeline
  createdDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  effectiveDate: {
    type: Date,
    index: true
  },
  executionDate: Date,
  expirationDate: {
    type: Date,
    index: true
  },
  terminationDate: Date,
  noticePeriodDays: {
    type: Number,
    default: 30
  },
  
  // Financial Terms
  contractValue: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  billingFrequency: {
    type: String,
    enum: ['One-Time', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Custom']
  },
  
  // Renewal Management
  autoRenewal: {
    type: Boolean,
    default: false
  },
  renewalTermLength: {
    value: Number,
    unit: {
      type: String,
      enum: ['Days', 'Months', 'Years']
    }
  },
  renewalNoticeDate: Date,
  renewalStatus: {
    type: String,
    enum: ['Not Applicable', 'Pending Review', 'Approved', 'Declined', 'Renewed'],
    default: 'Not Applicable'
  },
  renewalHistory: [{
    renewedDate: Date,
    renewedBy: String,
    previousExpirationDate: Date,
    newExpirationDate: Date,
    terms: String
  }],
  
  // Template Information
  fromTemplate: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentTemplate'
  },
  templateName: String,
  
  // Document Management
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  documentPath: String,
  versionNumber: {
    type: Number,
    default: 1
  },
  versions: [{
    versionNumber: Number,
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    createdBy: String,
    createdAt: Date,
    changes: String
  }],
  
  // Assignment & Ownership
  assignedTo: {
    type: String,
    trim: true,
    index: true
  },
  assignedToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contractOwner: {
    type: String,
    trim: true
  },
  department: String,
  team: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    role: {
      type: String,
      enum: ['Owner', 'Manager', 'Reviewer', 'Approver', 'Viewer']
    },
    assignedAt: Date
  }],
  
  // Review & Approval Workflow
  requiresApproval: {
    type: Boolean,
    default: true
  },
  approvalStatus: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Approved', 'Rejected', 'Conditional'],
    default: 'Not Started'
  },
  approvers: [{
    username: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Conditional']
    },
    reviewedAt: Date,
    comments: String,
    conditions: String
  }],
  approvalWorkflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow'
  },
  
  // Compliance & Obligations
  obligations: [{
    obligationType: {
      type: String,
      enum: ['Deliverable', 'Payment', 'Reporting', 'Audit', 'Insurance', 'Confidentiality', 'Other'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    responsibleParty: String,
    dueDate: Date,
    frequency: {
      type: String,
      enum: ['One-Time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual']
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Overdue', 'Not Applicable'],
      default: 'Pending'
    },
    completedDate: Date,
    completedBy: String,
    notes: String
  }],
  complianceStatus: {
    type: String,
    enum: ['Compliant', 'At Risk', 'Non-Compliant', 'Under Review'],
    default: 'Compliant',
    index: true
  },
  lastComplianceCheck: Date,
  
  // Negotiation Tracking
  negotiationStatus: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Stalled'],
    default: 'Not Started'
  },
  negotiationRounds: {
    type: Number,
    default: 0
  },
  keyTermsNegotiated: [{
    term: String,
    originalValue: String,
    negotiatedValue: String,
    negotiatedBy: String,
    negotiatedDate: Date
  }],
  
  // Risk Assessment
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  riskFactors: [{
    factor: String,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    mitigation: String,
    identifiedBy: String,
    identifiedDate: Date
  }],
  
  // Amendments & Changes
  amendments: [{
    amendmentNumber: Number,
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    description: String,
    effectiveDate: Date,
    createdBy: String,
    createdAt: Date
  }],
  
  // Related Entities
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
  relatedContracts: [{
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract'
    },
    contractNumber: String,
    relationshipType: {
      type: String,
      enum: ['Parent', 'Child', 'Amendment', 'Related', 'Supersedes', 'Superseded By']
    }
  }],
  
  // Clauses & Terms
  keyTerms: [{
    term: String,
    value: String,
    category: String
  }],
  clauseIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContractClause'
  }],
  
  // Alerts & Notifications
  alerts: [{
    alertType: {
      type: String,
      enum: ['Expiration', 'Renewal', 'Obligation Due', 'Compliance', 'Review', 'Approval']
    },
    message: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['Active', 'Acknowledged', 'Resolved']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Collaboration & Activity
  commentCount: {
    type: Number,
    default: 0
  },
  attachmentCount: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  lastActivityBy: String,
  
  // Access Control
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Team Only', 'Department'],
    default: 'Team Only'
  },
  confidential: {
    type: Boolean,
    default: false
  },
  
  // Archive & Retention
  archived: {
    type: Boolean,
    default: false,
    index: true
  },
  archivedDate: Date,
  archivedBy: String,
  retentionDate: Date,
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  lastModifiedDate: Date,
  
  // Custom Fields
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Notes & Comments
  internalNotes: String
}, {
  timestamps: true
});

// Indexes for performance
contractSchema.index({ status: 1, expirationDate: 1 });
contractSchema.index({ assignedTo: 1, status: 1 });
contractSchema.index({ contractType: 1, practiceArea: 1 });
contractSchema.index({ effectiveDate: -1 });
contractSchema.index({ tags: 1 });
contractSchema.index({ 'parties.name': 1 });

// Virtual fields
contractSchema.virtual('daysUntilExpiration').get(function() {
  if (!this.expirationDate) return null;
  const today = new Date();
  const diffTime = this.expirationDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

contractSchema.virtual('isExpiringSoon').get(function() {
  const daysUntil = this.daysUntilExpiration;
  return daysUntil !== null && daysUntil >= 0 && daysUntil <= 90;
});

contractSchema.virtual('isActive').get(function() {
  return this.status === 'Active' || this.status === 'Executed';
});

contractSchema.virtual('contractAge').get(function() {
  if (!this.effectiveDate) return null;
  const today = new Date();
  const diffTime = today - this.effectiveDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Static methods
contractSchema.statics.findByStatus = function(status) {
  return this.find({ status, archived: false }).sort({ createdDate: -1 });
};

contractSchema.statics.findExpiringSoon = function(days = 90) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: { $in: ['Active', 'Executed'] },
    expirationDate: {
      $gte: new Date(),
      $lte: futureDate
    },
    archived: false
  }).sort({ expirationDate: 1 });
};

contractSchema.statics.findByParty = function(partyName) {
  return this.find({
    'parties.name': { $regex: partyName, $options: 'i' },
    archived: false
  }).sort({ createdDate: -1 });
};

contractSchema.statics.getAnalytics = function(filters = {}) {
  const matchStage = { archived: false, ...filters };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$contractValue.amount' },
        avgValue: { $avg: '$contractValue.amount' }
      }
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        totalValue: { $round: ['$totalValue', 2] },
        avgValue: { $round: ['$avgValue', 2] }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Instance methods
contractSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.statusHistory.push({
    status: this.status,
    changedBy: updatedBy,
    changedAt: new Date(),
    notes
  });
  
  this.status = newStatus;
  this.lastModifiedBy = updatedBy;
  this.lastModifiedDate = new Date();
  this.lastActivityDate = new Date();
  this.lastActivityBy = updatedBy;
  
  return this.save();
};

contractSchema.methods.addObligation = function(obligation) {
  this.obligations.push(obligation);
  this.lastActivityDate = new Date();
  return this.save();
};

contractSchema.methods.updateObligation = function(obligationId, updates) {
  const obligation = this.obligations.id(obligationId);
  if (obligation) {
    Object.assign(obligation, updates);
    this.lastActivityDate = new Date();
    return this.save();
  }
  throw new Error('Obligation not found');
};

contractSchema.methods.addAmendment = function(amendment) {
  const amendmentNumber = this.amendments.length + 1;
  this.amendments.push({
    amendmentNumber,
    ...amendment,
    createdAt: new Date()
  });
  this.lastActivityDate = new Date();
  return this.save();
};

contractSchema.methods.renew = function(newExpirationDate, renewedBy, terms = '') {
  this.renewalHistory.push({
    renewedDate: new Date(),
    renewedBy,
    previousExpirationDate: this.expirationDate,
    newExpirationDate,
    terms
  });
  
  this.expirationDate = newExpirationDate;
  this.status = 'Renewed';
  this.renewalStatus = 'Renewed';
  this.lastModifiedBy = renewedBy;
  this.lastModifiedDate = new Date();
  this.lastActivityDate = new Date();
  this.lastActivityBy = renewedBy;
  
  return this.save();
};

contractSchema.methods.checkCompliance = function() {
  const overdueObligations = this.obligations.filter(
    ob => ob.status !== 'Completed' && ob.dueDate && ob.dueDate < new Date()
  );
  
  if (overdueObligations.length > 0) {
    this.complianceStatus = 'Non-Compliant';
  } else {
    const upcomingObligations = this.obligations.filter(
      ob => ob.status === 'Pending' && ob.dueDate && 
      ob.dueDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );
    
    if (upcomingObligations.length > 0) {
      this.complianceStatus = 'At Risk';
    } else {
      this.complianceStatus = 'Compliant';
    }
  }
  
  this.lastComplianceCheck = new Date();
  return this.save();
};

contractSchema.methods.archiveContract = function(archivedBy, retentionDays = 2555) {
  this.archived = true;
  this.archivedDate = new Date();
  this.archivedBy = archivedBy;
  
  const retentionDate = new Date();
  retentionDate.setDate(retentionDate.getDate() + retentionDays);
  this.retentionDate = retentionDate;
  
  return this.save();
};

// Pre-save middleware to auto-generate contract number
contractSchema.pre('save', async function(next) {
  if (this.isNew && !this.contractNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.contractNumber = `CONT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Contract', contractSchema);
