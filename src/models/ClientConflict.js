/**
 * ClientConflict Model - Mongoose Schema for Conflict of Interest Checks
 * Tracks conflict checks and related parties for ethics compliance
 */

const mongoose = require('mongoose');

const clientConflictSchema = new mongoose.Schema({
  // Reference to Client
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  clientNumber: {
    type: String,
    required: true,
    index: true
  },
  
  // Check Information
  checkDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  checkType: {
    type: String,
    required: true,
    enum: ['Initial Intake', 'New Matter', 'Periodic Review', 'Merger/Acquisition', 'Other']
  },
  
  // Check Details
  relatedParties: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    relationship: {
      type: String,
      enum: ['Opposing Party', 'Co-Party', 'Spouse', 'Business Partner', 'Family Member', 'Employee', 'Other']
    },
    details: String
  }],
  
  opposingParties: [{
    name: String,
    entityType: {
      type: String,
      enum: ['Individual', 'Business', 'Corporation', 'Government']
    },
    industry: String
  }],
  
  // Conflict Results
  conflictStatus: {
    type: String,
    required: true,
    enum: ['Clear', 'Potential Conflict', 'Confirmed Conflict', 'Waived', 'Under Review'],
    default: 'Under Review'
  },
  conflictDetails: [{
    conflictType: {
      type: String,
      enum: ['Direct Conflict', 'Adverse Party', 'Related Party', 'Business Conflict', 'Personal Conflict', 'Other']
    },
    description: String,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    relatedCaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    relatedCaseNumber: String,
    relatedClientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    },
    relatedClientNumber: String
  }],
  
  // Resolution
  resolution: {
    type: String,
    enum: ['No Action Required', 'Client Notified', 'Waiver Obtained', 'Engagement Declined', 'Chinese Wall', 'Other']
  },
  resolutionDate: Date,
  resolutionNotes: {
    type: String,
    trim: true
  },
  
  // Waiver Information
  waiver: {
    obtained: {
      type: Boolean,
      default: false
    },
    waiverDate: Date,
    waiverType: {
      type: String,
      enum: ['Written', 'Verbal', 'Electronic']
    },
    waiverDocumentUrl: String,
    signedBy: String,
    witnessedBy: String
  },
  
  // Ethics Compliance
  ethicsReview: {
    required: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    reviewedBy: String,
    reviewDate: Date,
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Denied', 'Conditional']
    }
  },
  
  // Related Matter
  relatedMatterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  relatedMatterNumber: {
    type: String
  },
  matterDescription: {
    type: String,
    trim: true
  },
  
  // Automated Check Results
  automatedCheck: {
    performed: {
      type: Boolean,
      default: false
    },
    algorithm: String,
    matchScore: Number,
    potentialMatches: [{
      clientId: mongoose.Schema.Types.ObjectId,
      clientName: String,
      matchScore: Number,
      matchReason: String
    }]
  },
  
  // Follow-up
  requiresFollowUp: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['Open', 'Resolved', 'Monitoring', 'Closed'],
    default: 'Open'
  },
  
  // Metadata
  performedBy: {
    type: String,
    required: true,
    trim: true
  },
  performedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  },
  lastReviewedBy: {
    type: String,
    trim: true
  },
  lastReviewedDate: Date
}, {
  timestamps: true
});

// Indexes for queries
clientConflictSchema.index({ clientId: 1, checkDate: -1 });
clientConflictSchema.index({ conflictStatus: 1 });
clientConflictSchema.index({ status: 1 });
clientConflictSchema.index({ 'relatedParties.name': 'text' });

// Method to add conflict detail
clientConflictSchema.methods.addConflict = function(conflictDetail) {
  this.conflictDetails.push(conflictDetail);
  if (this.conflictStatus === 'Clear') {
    this.conflictStatus = 'Potential Conflict';
  }
};

// Method to resolve conflict
clientConflictSchema.methods.resolve = function(resolution, notes, resolvedBy) {
  this.resolution = resolution;
  this.resolutionDate = new Date();
  this.resolutionNotes = notes;
  this.status = 'Resolved';
  this.lastReviewedBy = resolvedBy;
  this.lastReviewedDate = new Date();
};

const ClientConflict = mongoose.model('ClientConflict', clientConflictSchema);

module.exports = ClientConflict;
