/**
 * LiabilityInsurance Model - Mongoose Schema for Professional Liability Management
 * Insurance tracking, claims management, and incident reporting
 */

const mongoose = require('mongoose');

const liabilityInsuranceSchema = new mongoose.Schema({
  // Basic Information
  recordNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  recordType: {
    type: String,
    required: true,
    enum: ['Insurance Policy', 'Claim', 'Incident Report', 'Coverage Verification', 'Policy Renewal', 'Other'],
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
  
  // Insurance Policy Details
  insurancePolicy: {
    policyNumber: {
      type: String,
      index: true
    },
    policyType: {
      type: String,
      enum: ['Professional Liability', 'Malpractice', 'E&O', 'Cyber Liability', 'General Liability', 'Directors & Officers', 'Other']
    },
    carrier: String,
    carrierContact: {
      name: String,
      phone: String,
      email: String,
      address: String
    },
    agent: {
      name: String,
      phone: String,
      email: String
    },
    effectiveDate: Date,
    expirationDate: {
      type: Date,
      index: true
    },
    renewalDate: Date,
    policyStatus: {
      type: String,
      enum: ['Active', 'Expired', 'Pending Renewal', 'Cancelled', 'Under Review']
    },
    coverageAmount: Number,
    deductible: Number,
    premium: {
      amount: Number,
      frequency: String,
      dueDate: Date,
      lastPayment: Date,
      nextPayment: Date
    },
    coverageDetails: {
      perClaim: Number,
      aggregate: Number,
      retroactiveDate: Date,
      extendedReporting: Boolean,
      extendedReportingPeriod: String
    },
    endorsements: [{
      endorsementType: String,
      description: String,
      effectiveDate: Date
    }],
    exclusions: [String]
  },
  
  // Claims Management
  claim: {
    claimNumber: {
      type: String,
      index: true
    },
    claimType: {
      type: String,
      enum: ['Professional Negligence', 'Breach of Duty', 'Conflict of Interest', 'Missed Deadline', 'Error or Omission', 'Breach of Contract', 'Other']
    },
    claimStatus: {
      type: String,
      enum: ['Reported', 'Under Investigation', 'Reserved', 'In Litigation', 'Settled', 'Closed', 'Denied']
    },
    incidentDate: Date,
    reportedDate: Date,
    discoveryDate: Date,
    claimantInformation: {
      name: String,
      type: String,
      contact: String,
      attorney: String,
      attorneyContact: String
    },
    caseInformation: {
      caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
      },
      caseNumber: String,
      caseType: String,
      court: String,
      judge: String
    },
    description: String,
    allegations: [String],
    damages: {
      claimedAmount: Number,
      estimatedReserve: Number,
      paidAmount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    defense: {
      defenseCounsel: String,
      defenseCounselContact: String,
      strategy: String,
      defenseReserve: Number
    },
    settlement: {
      settlementAmount: Number,
      settlementDate: Date,
      settlementTerms: String,
      approvedBy: String,
      confidential: Boolean
    }
  },
  
  // Incident Report
  incidentReport: {
    incidentType: String,
    incidentDate: Date,
    reportedDate: Date,
    reportedBy: String,
    location: String,
    involvedPersons: [{
      name: String,
      role: String,
      contact: String
    }],
    description: String,
    circumstances: String,
    potentialLiability: Boolean,
    estimatedExposure: Number,
    immediateActions: [String],
    witnesses: [{
      name: String,
      contact: String,
      statement: String
    }],
    investigationRequired: Boolean,
    investigationStatus: String,
    findings: String,
    recommendations: [String],
    preventiveMeasures: [String]
  },
  
  // Coverage Verification
  coverageVerification: {
    verificationDate: Date,
    verifiedBy: String,
    verificationPurpose: String,
    coverageConfirmed: Boolean,
    coverageAmount: Number,
    applicableDeductible: Number,
    exclusionsApplicable: [String],
    notes: String
  },
  
  // Status & Priority
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Pending', 'Under Review', 'Approved', 'Denied', 'Closed', 'Archived'],
    default: 'Active',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  
  // Financial Information
  financialImpact: {
    estimatedCost: Number,
    actualCost: Number,
    insurancePayout: Number,
    outOfPocketCost: Number,
    legalFees: Number,
    settlementCost: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  // Assignment & Responsibility
  assignedTo: {
    type: String,
    trim: true,
    index: true
  },
  assignedToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  riskManager: String,
  responsibleAttorney: String,
  managingPartner: String,
  
  // Important Dates
  reportingDeadline: Date,
  responseDeadline: Date,
  nextReviewDate: {
    type: Date,
    index: true
  },
  closedDate: Date,
  
  // Documentation
  documents: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    fileName: String,
    fileType: String,
    category: String,
    uploadedDate: Date,
    uploadedBy: String,
    confidential: Boolean
  }],
  
  // Communications
  communications: [{
    communicationType: String,
    date: Date,
    from: String,
    to: String,
    subject: String,
    summary: String,
    actionRequired: Boolean
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
liabilityInsuranceSchema.index({ recordType: 1, status: 1 });
liabilityInsuranceSchema.index({ 'insurancePolicy.policyNumber': 1 });
liabilityInsuranceSchema.index({ 'insurancePolicy.expirationDate': 1 });
liabilityInsuranceSchema.index({ 'claim.claimNumber': 1 });
liabilityInsuranceSchema.index({ 'claim.claimStatus': 1 });
liabilityInsuranceSchema.index({ assignedTo: 1, status: 1 });
liabilityInsuranceSchema.index({ nextReviewDate: 1 });
liabilityInsuranceSchema.index({ createdAt: -1 });

// Static methods
liabilityInsuranceSchema.statics.findActivePolicies = function() {
  return this.find({
    recordType: 'Insurance Policy',
    'insurancePolicy.policyStatus': 'Active'
  }).sort({ 'insurancePolicy.expirationDate': 1 });
};

liabilityInsuranceSchema.statics.findExpiringPolicies = function(days = 60) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.find({
    recordType: 'Insurance Policy',
    'insurancePolicy.policyStatus': 'Active',
    'insurancePolicy.expirationDate': { $gte: now, $lte: futureDate }
  }).sort({ 'insurancePolicy.expirationDate': 1 });
};

liabilityInsuranceSchema.statics.findOpenClaims = function() {
  return this.find({
    recordType: 'Claim',
    'claim.claimStatus': { $in: ['Reported', 'Under Investigation', 'Reserved', 'In Litigation'] }
  }).sort({ 'claim.reportedDate': -1 });
};

liabilityInsuranceSchema.statics.getClaimsAnalytics = function(startDate, endDate) {
  const match = { recordType: 'Claim' };
  
  if (startDate || endDate) {
    match['claim.reportedDate'] = {};
    if (startDate) match['claim.reportedDate'].$gte = startDate;
    if (endDate) match['claim.reportedDate'].$lte = endDate;
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$claim.claimStatus',
        count: { $sum: 1 },
        totalClaimed: { $sum: '$claim.damages.claimedAmount' },
        totalPaid: { $sum: '$claim.damages.paidAmount' },
        avgReserve: { $avg: '$claim.damages.estimatedReserve' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Instance methods
liabilityInsuranceSchema.methods.reportClaim = function(claimData, reportedBy) {
  this.recordType = 'Claim';
  this.claim = {
    ...claimData,
    reportedDate: new Date(),
    claimStatus: 'Reported'
  };
  this.status = 'Under Review';
  this.updatedBy = reportedBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: 'Under Review',
    changedBy: reportedBy,
    changedAt: new Date(),
    notes: `Claim reported: ${claimData.claimType}`
  });
  
  return this.save();
};

liabilityInsuranceSchema.methods.settleClaim = function(settlementData, settledBy) {
  if (this.claim) {
    this.claim.claimStatus = 'Settled';
    this.claim.settlement = {
      ...settlementData,
      settlementDate: new Date(),
      approvedBy: settledBy
    };
  }
  
  this.status = 'Closed';
  this.closedDate = new Date();
  this.updatedBy = settledBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: 'Closed',
    changedBy: settledBy,
    changedAt: new Date(),
    notes: `Claim settled for ${settlementData.settlementAmount}`
  });
  
  return this.save();
};

liabilityInsuranceSchema.methods.renewPolicy = function(renewalData, renewedBy) {
  if (this.insurancePolicy) {
    this.insurancePolicy.effectiveDate = renewalData.effectiveDate;
    this.insurancePolicy.expirationDate = renewalData.expirationDate;
    this.insurancePolicy.renewalDate = new Date();
    this.insurancePolicy.policyStatus = 'Active';
    this.insurancePolicy.premium = renewalData.premium || this.insurancePolicy.premium;
  }
  
  this.updatedBy = renewedBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: 'Active',
    changedBy: renewedBy,
    changedAt: new Date(),
    notes: 'Policy renewed'
  });
  
  return this.save();
};

module.exports = mongoose.model('LiabilityInsurance', liabilityInsuranceSchema);
