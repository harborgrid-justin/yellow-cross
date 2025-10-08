/**
 * Contract Model - Mongoose Schema for Contract Management
 * Comprehensive data model for contract lifecycle management
 */

import mongoose from 'mongoose';

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
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Contract Type
  contractType: {
    type: String,
    required: true,
    enum: ['Service Agreement', 'Employment', 'NDA', 'Purchase Order', 'Lease', 'Partnership', 'License', 'Retainer', 'Vendor', 'Client Agreement', 'Other'],
    index: true
  },
  
  // Parties
  parties: [{
    partyType: {
      type: String,
      enum: ['Client', 'Vendor', 'Partner', 'Employee', 'Other'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: String,
    contactPerson: String,
    email: String,
    phone: String,
    address: String,
    entityType: String
  }],
  
  // Financial Terms
  financialTerms: {
    value: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentTerms: String,
    paymentSchedule: [{
      dueDate: Date,
      amount: Number,
      description: String,
      status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue', 'Waived'],
        default: 'Pending'
      }
    }],
    billingFrequency: {
      type: String,
      enum: ['One-time', 'Monthly', 'Quarterly', 'Annually', 'Custom']
    }
  },
  
  // Dates
  effectiveDate: {
    type: Date,
    required: true,
    index: true
  },
  expirationDate: {
    type: Date
  },
  signedDate: {
    type: Date
  },
  
  // Contract Lifecycle
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Under Review', 'Negotiating', 'Pending Signature', 'Active', 'Expired', 'Terminated', 'Completed'],
    default: 'Draft',
    index: true
  },
  
  // Renewal Terms
  renewal: {
    autoRenew: {
      type: Boolean,
      default: false
    },
    renewalTerm: String,
    renewalNoticeDays: Number,
    renewalDate: Date,
    renewalReminders: [{
      daysBefore: Number,
      sent: Boolean,
      sentDate: Date
    }]
  },
  
  // Termination
  termination: {
    terminationClause: String,
    noticePeriod: String,
    earlyTerminationAllowed: Boolean,
    terminationFee: Number
  },
  
  // Review & Approval Workflow
  workflow: {
    currentStage: {
      type: String,
      enum: ['Drafting', 'Legal Review', 'Business Review', 'Negotiation', 'Approval', 'Signature', 'Complete'],
      default: 'Drafting'
    },
    reviewers: [{
      userId: String,
      name: String,
      role: String,
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Changes Requested'],
        default: 'Pending'
      },
      reviewDate: Date,
      comments: String
    }],
    approvers: [{
      userId: String,
      name: String,
      role: String,
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
      },
      approvalDate: Date,
      comments: String
    }]
  },
  
  // Version Control
  versions: [{
    versionNumber: {
      type: String,
      required: true
    },
    createdDate: Date,
    createdBy: String,
    changes: String,
    documentUrl: String,
    isCurrent: {
      type: Boolean,
      default: false
    }
  }],
  currentVersion: {
    type: String
  },
  
  // Negotiation History
  negotiations: [{
    date: Date,
    party: String,
    proposedChanges: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Counter-proposed']
    },
    notes: String
  }],
  
  // Obligations & Deliverables
  obligations: [{
    obligationType: {
      type: String,
      enum: ['Deliverable', 'Payment', 'Performance', 'Reporting', 'Compliance', 'Other']
    },
    description: String,
    responsibleParty: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Overdue', 'Waived'],
      default: 'Not Started'
    },
    completedDate: Date
  }],
  
  // Compliance & Risk
  compliance: {
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    complianceItems: [{
      requirement: String,
      status: {
        type: String,
        enum: ['Compliant', 'Non-Compliant', 'In Progress'],
        default: 'In Progress'
      },
      dueDate: Date
    }],
    regulatoryRequirements: [String]
  },
  
  // Documents & Attachments
  documents: [{
    documentType: String,
    filename: String,
    url: String,
    uploadedDate: Date,
    uploadedBy: String
  }],
  
  // Signatures
  signatures: [{
    signerName: String,
    signerRole: String,
    signerEmail: String,
    signedDate: Date,
    signatureMethod: {
      type: String,
      enum: ['Electronic', 'Physical', 'Digital']
    },
    signatureUrl: String,
    ipAddress: String
  }],
  
  // Case Association
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: String,
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
contractSchema.index({ status: 1, effectiveDate: -1 });
contractSchema.index({ expirationDate: 1 });
contractSchema.index({ 'parties.name': 1 });
contractSchema.index({ contractType: 1, status: 1 });

// Virtual for days until expiration
contractSchema.virtual('daysUntilExpiration').get(function() {
  if (this.expirationDate) {
    const diffTime = this.expirationDate - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for is expiring soon
contractSchema.virtual('isExpiringSoon').get(function() {
  const days = this.daysUntilExpiration;
  return days !== null && days > 0 && days <= 30;
});

// Virtual for is expired
contractSchema.virtual('isExpired').get(function() {
  return this.expirationDate && this.expirationDate < new Date() && this.status === 'Active';
});

// Instance method to add version
contractSchema.methods.addVersion = function(versionData) {
  // Mark all previous versions as not current
  this.versions.forEach(v => v.isCurrent = false);
  
  const versionNumber = `${this.versions.length + 1}.0`;
  this.versions.push({
    versionNumber,
    createdDate: new Date(),
    isCurrent: true,
    ...versionData
  });
  this.currentVersion = versionNumber;
  
  return this.save();
};

// Instance method to add negotiation
contractSchema.methods.addNegotiation = function(negotiationData) {
  this.negotiations.push({
    date: new Date(),
    ...negotiationData
  });
  return this.save();
};

// Instance method to approve
contractSchema.methods.approve = function(userId, userName, comments) {
  const approver = this.workflow.approvers.find(a => a.userId === userId);
  if (approver) {
    approver.status = 'Approved';
    approver.approvalDate = new Date();
    approver.comments = comments;
  }
  
  // Check if all approved
  const allApproved = this.workflow.approvers.every(a => a.status === 'Approved');
  if (allApproved) {
    this.workflow.currentStage = 'Signature';
  }
  
  return this.save();
};

// Static method to find expiring soon
contractSchema.statics.findExpiringSoon = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    expirationDate: { $gte: new Date(), $lte: futureDate },
    status: 'Active'
  }).sort({ expirationDate: 1 });
};

// Static method to find by party
contractSchema.statics.findByParty = function(partyName) {
  return this.find({ 'parties.name': partyName })
    .sort({ effectiveDate: -1 });
};

export default mongoose.model('Contract', contractSchema);
