/**
 * ComplianceItem Model - Mongoose Schema for Compliance & Risk Management
 * Comprehensive data model for ethics, compliance, and risk assessment
 */

import mongoose from 'mongoose';

const complianceItemSchema = new mongoose.Schema({
  // Basic Information
  complianceNumber: {
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
  
  // Compliance Type
  complianceType: {
    type: String,
    required: true,
    enum: ['Ethics', 'Regulatory', 'Risk Assessment', 'Audit', 'Malpractice Prevention', 'Data Privacy', 'Professional Liability', 'Conflict Check'],
    index: true
  },
  
  // Regulatory Body
  regulatoryBody: {
    type: String,
    trim: true,
    enum: ['ABA', 'State Bar', 'Federal Agency', 'Court', 'Internal', 'Other']
  },
  jurisdiction: {
    type: String,
    trim: true
  },
  
  // Status & Priority
  status: {
    type: String,
    enum: ['Active', 'Under Review', 'Compliant', 'Non-Compliant', 'Remediated', 'Closed'],
    default: 'Active',
    index: true
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
    index: true
  },
  
  // Risk Assessment
  riskLevel: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low', 'Minimal'],
    default: 'Medium'
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  riskFactors: [{
    factor: String,
    impact: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low']
    },
    likelihood: {
      type: String,
      enum: ['Very Likely', 'Likely', 'Possible', 'Unlikely']
    },
    mitigation: String
  }],
  
  // Associated Entities
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    index: true
  },
  
  // Deadlines & Dates
  identifiedDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  dueDate: {
    type: Date,
    index: true
  },
  resolvedDate: {
    type: Date
  },
  nextReviewDate: {
    type: Date
  },
  
  // Audit Trail
  auditTrail: [{
    action: String,
    performedBy: String,
    performedAt: {
      type: Date,
      default: Date.now
    },
    details: String,
    previousValue: String,
    newValue: String
  }],
  
  // Requirements & Obligations
  requirements: [{
    requirement: String,
    status: {
      type: String,
      enum: ['Met', 'Not Met', 'In Progress', 'N/A']
    },
    dueDate: Date,
    completedDate: Date,
    evidence: String,
    notes: String
  }],
  
  // Remediation
  remediation: {
    required: {
      type: Boolean,
      default: false
    },
    plan: String,
    startDate: Date,
    completionDate: Date,
    responsibleParty: String,
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'On Hold']
    },
    notes: String
  },
  
  // Documents & Evidence
  documents: [{
    documentId: mongoose.Schema.Types.ObjectId,
    documentName: String,
    documentType: String,
    uploadedAt: Date,
    uploadedBy: String
  }],
  
  // Compliance Reporting
  reportingPeriod: {
    startDate: Date,
    endDate: Date
  },
  reportSubmitted: {
    type: Boolean,
    default: false
  },
  reportSubmissionDate: Date,
  
  // Insurance & Liability
  insuranceInfo: {
    policyNumber: String,
    carrier: String,
    coverageAmount: Number,
    expirationDate: Date,
    claimFiled: Boolean,
    claimNumber: String
  },
  
  // Notifications
  notifications: [{
    recipient: String,
    sentAt: Date,
    type: {
      type: String,
      enum: ['Email', 'SMS', 'In-App']
    },
    status: {
      type: String,
      enum: ['Sent', 'Delivered', 'Failed']
    }
  }],
  
  // Tags & Categories
  tags: [{
    type: String,
    trim: true,
    index: true
  }],
  category: {
    type: String,
    trim: true
  },
  
  // Notes
  notes: {
    type: String,
    trim: true
  },
  
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
  assignedTo: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
complianceItemSchema.index({ complianceType: 1, status: 1 });
complianceItemSchema.index({ priority: 1, dueDate: 1 });
complianceItemSchema.index({ riskLevel: 1, identifiedDate: -1 });
complianceItemSchema.index({ title: 'text', description: 'text' });

// Virtual for days until due
complianceItemSchema.virtual('daysUntilDue').get(function() {
  if (this.dueDate) {
    const diffTime = this.dueDate - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for overdue status
complianceItemSchema.virtual('isOverdue').get(function() {
  if (this.dueDate && this.status !== 'Compliant' && this.status !== 'Closed') {
    return new Date() > this.dueDate;
  }
  return false;
});

// Instance method to add audit trail entry
complianceItemSchema.methods.addAuditEntry = function(action, performedBy, details, previousValue, newValue) {
  this.auditTrail.push({
    action,
    performedBy,
    performedAt: new Date(),
    details,
    previousValue,
    newValue
  });
  return this.save();
};

// Instance method to update risk score
complianceItemSchema.methods.calculateRiskScore = function() {
  // Simple risk calculation based on factors
  if (this.riskFactors && this.riskFactors.length > 0) {
    const impactWeights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    const likelihoodWeights = { 'Very Likely': 4, Likely: 3, Possible: 2, Unlikely: 1 };
    
    let totalScore = 0;
    this.riskFactors.forEach(factor => {
      const impact = impactWeights[factor.impact] || 2;
      const likelihood = likelihoodWeights[factor.likelihood] || 2;
      totalScore += impact * likelihood;
    });
    
    // Normalize to 0-100
    const maxPossible = this.riskFactors.length * 16; // 4 * 4
    this.riskScore = Math.min(100, Math.round((totalScore / maxPossible) * 100));
    
    // Update risk level based on score
    if (this.riskScore >= 75) this.riskLevel = 'Critical';
    else if (this.riskScore >= 50) this.riskLevel = 'High';
    else if (this.riskScore >= 25) this.riskLevel = 'Medium';
    else this.riskLevel = 'Low';
  }
  return this.save();
};

// Static method to find overdue items
complianceItemSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $nin: ['Compliant', 'Closed'] }
  }).sort({ dueDate: 1 });
};

// Static method to find high priority items
complianceItemSchema.statics.findHighPriority = function() {
  return this.find({
    priority: { $in: ['Critical', 'High'] },
    status: { $nin: ['Compliant', 'Closed'] }
  }).sort({ priority: 1, dueDate: 1 });
};

export default mongoose.model('ComplianceItem', complianceItemSchema);
