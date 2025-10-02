/**
 * RiskAssessment Model - Mongoose Schema for Risk Assessment Tools
 * Identifies, scores, and monitors case and firm-level risks
 */

const mongoose = require('mongoose');

const riskAssessmentSchema = new mongoose.Schema({
  // Basic Information
  assessmentNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  assessmentType: {
    type: String,
    required: true,
    enum: ['Case Risk', 'Client Risk', 'Financial Risk', 'Reputational Risk', 'Operational Risk', 'Legal Risk', 'Compliance Risk', 'Other'],
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
  
  // Risk Identification
  riskFactors: [{
    factor: String,
    category: String,
    description: String,
    likelihood: {
      type: String,
      enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High']
    },
    impact: {
      type: String,
      enum: ['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic']
    },
    score: Number
  }],
  
  // Risk Scoring
  overallRiskScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
    index: true
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Critical'],
    index: true
  },
  riskCategory: {
    type: String,
    enum: ['Financial', 'Legal', 'Operational', 'Reputational', 'Strategic', 'Compliance', 'Market', 'Other']
  },
  
  // Mitigation Strategies
  mitigationStrategies: [{
    strategy: String,
    description: String,
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Implemented', 'Deferred', 'Not Applicable']
    },
    implementedBy: String,
    implementedDate: Date,
    effectiveness: String,
    cost: Number,
    notes: String
  }],
  
  // Risk Monitoring
  monitoringFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'As Needed'],
    default: 'Monthly'
  },
  lastReviewDate: {
    type: Date,
    index: true
  },
  nextReviewDate: {
    type: Date,
    index: true
  },
  reviewHistory: [{
    reviewDate: Date,
    reviewedBy: String,
    previousScore: Number,
    currentScore: Number,
    findings: String,
    recommendations: String,
    actionItems: [String]
  }],
  
  // Status & Priority
  status: {
    type: String,
    required: true,
    enum: ['Open', 'Under Review', 'Mitigated', 'Accepted', 'Transferred', 'Closed', 'Archived'],
    default: 'Open',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
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
  riskOwner: String,
  assessmentTeam: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    role: String
  }],
  
  // Financial Impact
  estimatedFinancialImpact: {
    minimum: Number,
    maximum: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    probability: String
  },
  actualFinancialImpact: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    date: Date
  },
  
  // Response & Action Items
  responseActions: [{
    action: String,
    actionType: {
      type: String,
      enum: ['Avoid', 'Reduce', 'Transfer', 'Accept', 'Monitor']
    },
    assignedTo: String,
    dueDate: Date,
    status: String,
    completedDate: Date,
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
    uploadedBy: String
  }],
  
  // Audit Trail
  statusHistory: [{
    status: String,
    riskScore: Number,
    riskLevel: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Metadata
  assessmentDate: {
    type: Date,
    required: true,
    index: true
  },
  assessedBy: {
    type: String,
    required: true,
    trim: true
  },
  approvedBy: String,
  approvalDate: Date,
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
riskAssessmentSchema.index({ assessmentType: 1, riskLevel: 1 });
riskAssessmentSchema.index({ caseNumber: 1 });
riskAssessmentSchema.index({ assignedTo: 1, status: 1 });
riskAssessmentSchema.index({ overallRiskScore: -1 });
riskAssessmentSchema.index({ nextReviewDate: 1, status: 1 });
riskAssessmentSchema.index({ createdAt: -1 });

// Static methods
riskAssessmentSchema.statics.findByRiskLevel = function(riskLevel) {
  return this.find({ riskLevel, status: { $in: ['Open', 'Under Review'] } })
    .sort({ overallRiskScore: -1, assessmentDate: -1 });
};

riskAssessmentSchema.statics.findHighRisks = function() {
  return this.find({
    riskLevel: { $in: ['High', 'Critical'] },
    status: { $in: ['Open', 'Under Review'] }
  }).sort({ overallRiskScore: -1 });
};

riskAssessmentSchema.statics.getRiskAnalytics = function(filters = {}) {
  const match = { ...filters };
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$riskLevel',
        count: { $sum: 1 },
        avgScore: { $avg: '$overallRiskScore' },
        totalEstimatedImpact: { $sum: '$estimatedFinancialImpact.maximum' }
      }
    },
    { $sort: { avgScore: -1 } }
  ]);
};

// Instance methods
riskAssessmentSchema.methods.updateRiskScore = function(newScore, updatedBy, notes) {
  const oldScore = this.overallRiskScore;
  this.overallRiskScore = newScore;
  
  // Update risk level based on score
  if (newScore >= 80) this.riskLevel = 'Critical';
  else if (newScore >= 60) this.riskLevel = 'High';
  else if (newScore >= 40) this.riskLevel = 'Medium';
  else if (newScore >= 20) this.riskLevel = 'Low';
  else this.riskLevel = 'Very Low';
  
  this.updatedBy = updatedBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: this.status,
    riskScore: newScore,
    riskLevel: this.riskLevel,
    changedBy: updatedBy,
    changedAt: new Date(),
    notes: notes || `Risk score updated from ${oldScore} to ${newScore}`
  });
  
  return this.save();
};

riskAssessmentSchema.methods.addReview = function(reviewData) {
  this.reviewHistory.push({
    reviewDate: new Date(),
    previousScore: this.overallRiskScore,
    ...reviewData
  });
  
  this.lastReviewDate = new Date();
  
  // Calculate next review date based on frequency
  const daysMap = {
    'Daily': 1,
    'Weekly': 7,
    'Monthly': 30,
    'Quarterly': 90,
    'Annually': 365,
    'As Needed': 30
  };
  
  const days = daysMap[this.monitoringFrequency] || 30;
  this.nextReviewDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  
  return this.save();
};

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);
