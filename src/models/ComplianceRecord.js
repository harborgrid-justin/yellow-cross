/**
 * ComplianceRecord Model - Mongoose Schema for Ethics & Compliance Tracking
 * Tracks ethical obligations, CLE requirements, and compliance monitoring
 */

const mongoose = require('mongoose');

const complianceRecordSchema = new mongoose.Schema({
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
    enum: ['Ethics Rule', 'CLE Requirement', 'Ethics Alert', 'Violation Report', 'Compliance Monitoring', 'Professional Conduct', 'Other'],
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
  
  // Ethics Rules
  ethicsRule: {
    ruleNumber: String,
    ruleName: String,
    jurisdiction: String,
    category: String,
    description: String,
    effectiveDate: Date,
    complianceDeadline: Date
  },
  
  // CLE Tracking
  cleTracking: {
    courseName: String,
    provider: String,
    courseType: {
      type: String,
      enum: ['Ethics', 'Legal', 'Professional Development', 'Technology', 'Other']
    },
    credits: Number,
    completedDate: Date,
    expirationDate: Date,
    certificateNumber: String
  },
  
  // Status & Priority
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Pending', 'Completed', 'Violated', 'Under Review', 'Resolved', 'Archived'],
    default: 'Active',
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
  responsibleParty: String,
  
  // Compliance Details
  complianceCategory: {
    type: String,
    enum: ['Professional Conduct', 'Client Relations', 'Confidentiality', 'Conflict of Interest', 'Trust Accounting', 'Advertising', 'Fee Agreements', 'Record Keeping', 'Other']
  },
  jurisdiction: String,
  regulatoryBody: String,
  
  // Dates & Deadlines
  effectiveDate: Date,
  dueDate: {
    type: Date,
    index: true
  },
  completedDate: Date,
  reviewDate: Date,
  nextReviewDate: Date,
  
  // Violation Tracking
  violationDetails: {
    violationType: String,
    severity: String,
    reportedDate: Date,
    reportedBy: String,
    investigationStatus: String,
    findings: String,
    remediation: String,
    resolutionDate: Date
  },
  
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
  
  // Notes & Comments
  notes: String,
  internalNotes: String,
  
  // Alert Settings
  alertEnabled: {
    type: Boolean,
    default: true
  },
  alertFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Before Deadline', 'None'],
    default: 'Before Deadline'
  },
  alertRecipients: [String],
  
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
complianceRecordSchema.index({ recordType: 1, status: 1 });
complianceRecordSchema.index({ assignedTo: 1, status: 1 });
complianceRecordSchema.index({ dueDate: 1, status: 1 });
complianceRecordSchema.index({ jurisdiction: 1, recordType: 1 });
complianceRecordSchema.index({ createdAt: -1 });

// Static methods
complianceRecordSchema.statics.findByStatus = function(status) {
  return this.find({ status, archived: { $ne: true } })
    .sort({ priority: -1, dueDate: 1 });
};

complianceRecordSchema.statics.findByAssignee = function(assignedTo) {
  return this.find({ assignedTo, status: { $in: ['Active', 'Pending', 'Under Review'] } })
    .sort({ priority: -1, dueDate: 1 });
};

complianceRecordSchema.statics.findUpcomingDeadlines = function(days = 30) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.find({
    dueDate: { $gte: now, $lte: futureDate },
    status: { $in: ['Active', 'Pending'] }
  }).sort({ dueDate: 1 });
};

complianceRecordSchema.statics.getCLECredits = function(assignedTo, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        assignedTo,
        recordType: 'CLE Requirement',
        status: 'Completed',
        'cleTracking.completedDate': { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$cleTracking.courseType',
        totalCredits: { $sum: '$cleTracking.credits' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance methods
complianceRecordSchema.methods.complete = function(completedBy, notes) {
  this.status = 'Completed';
  this.completedDate = new Date();
  this.updatedBy = completedBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: 'Completed',
    changedBy: completedBy,
    changedAt: new Date(),
    notes
  });
  
  return this.save();
};

complianceRecordSchema.methods.reportViolation = function(violationData, reportedBy) {
  this.status = 'Violated';
  this.violationDetails = {
    ...violationData,
    reportedDate: new Date(),
    reportedBy,
    investigationStatus: 'Open'
  };
  this.updatedBy = reportedBy;
  this.updatedAt = new Date();
  
  this.statusHistory.push({
    status: 'Violated',
    changedBy: reportedBy,
    changedAt: new Date(),
    notes: `Violation reported: ${violationData.violationType}`
  });
  
  return this.save();
};

module.exports = mongoose.model('ComplianceRecord', complianceRecordSchema);
