/**
 * DocumentReview Model - Mongoose Schema for Document Review Platform
 * Tracks document review assignments, progress, and decisions
 */

import mongoose from 'mongoose';

const documentReviewSchema = new mongoose.Schema({
  // Basic Information
  reviewId: {
    type: String,
    required: true,
    unique: true,
    index: true
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
  
  // Document Information
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  evidenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  },
  documentTitle: String,
  documentType: String,
  batesNumber: String,
  
  // Review Assignment
  assignedTo: {
    type: String,
    required: true,
    index: true
  },
  assignedBy: {
    type: String,
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  
  // Review Details
  reviewStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Escalated'],
    default: 'Pending',
    index: true
  },
  reviewedDate: Date,
  
  // Review Decision
  relevance: {
    type: String,
    enum: ['Relevant', 'Not Relevant', 'Potentially Relevant', 'Privileged', 'Needs Second Review']
  },
  privilege: {
    type: String,
    enum: ['None', 'Attorney-Client', 'Work Product', 'Trade Secret', 'Other']
  },
  confidentiality: {
    type: String,
    enum: ['Public', 'Internal', 'Confidential', 'Highly Confidential']
  },
  
  // Coding & Tagging
  issues: [{
    issueCode: String,
    issueDescription: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  responsiveness: {
    type: String,
    enum: ['Responsive', 'Non-Responsive', 'Partially Responsive']
  },
  
  // Production Decision
  produceDocument: {
    type: Boolean,
    default: false
  },
  productionNotes: String,
  redactionRequired: {
    type: Boolean,
    default: false
  },
  redactionAreas: [{
    page: Number,
    coordinates: String,
    reason: String
  }],
  
  // Quality Control
  qcRequired: {
    type: Boolean,
    default: false
  },
  qcStatus: {
    type: String,
    enum: ['Not Required', 'Pending', 'Passed', 'Failed']
  },
  qcReviewedBy: String,
  qcReviewedDate: Date,
  qcNotes: String,
  
  // Comments & Notes
  reviewNotes: String,
  internalNotes: String,
  
  // Time Tracking
  timeSpentMinutes: {
    type: Number,
    default: 0
  },
  
  // Escalation
  escalated: {
    type: Boolean,
    default: false
  },
  escalationReason: String,
  escalatedTo: String,
  escalatedDate: Date,
  
  // Batch Information
  batchId: String,
  batchName: String,
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Archived'],
    default: 'Active',
    index: true
  }
}, {
  timestamps: true
});

// Indexes for performance
documentReviewSchema.index({ caseId: 1, reviewStatus: 1 });
documentReviewSchema.index({ assignedTo: 1, reviewStatus: 1 });
documentReviewSchema.index({ assignedDate: -1 });
documentReviewSchema.index({ batchId: 1 });
documentReviewSchema.index({ relevance: 1, privilege: 1 });
documentReviewSchema.index({ tags: 1 });

// Virtual field for overdue status
documentReviewSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.reviewStatus === 'Completed') return false;
  return new Date() > this.dueDate;
});

// Static method to get reviewer statistics
documentReviewSchema.statics.getReviewerStats = async function(assignedTo, caseId = null) {
  const match = { assignedTo };
  if (caseId) match.caseId = caseId;
  
  return await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$reviewStatus',
        count: { $sum: 1 },
        totalTime: { $sum: '$timeSpentMinutes' }
      }
    }
  ]);
};

// Static method to get batch progress
documentReviewSchema.statics.getBatchProgress = async function(batchId) {
  return await this.aggregate([
    { $match: { batchId } },
    {
      $group: {
        _id: '$reviewStatus',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance method to complete review
documentReviewSchema.methods.completeReview = function(reviewData) {
  this.reviewStatus = 'Completed';
  this.reviewedDate = new Date();
  this.relevance = reviewData.relevance;
  this.privilege = reviewData.privilege;
  this.confidentiality = reviewData.confidentiality;
  this.reviewNotes = reviewData.reviewNotes;
  this.tags = reviewData.tags || [];
  this.produceDocument = reviewData.produceDocument;
  return this.save();
};

export default mongoose.model('DocumentReview', documentReviewSchema);
