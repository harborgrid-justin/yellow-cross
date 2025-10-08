/**
 * Case Model - Mongoose Schema for Case Management System
 * Comprehensive data model for legal case management
 */

import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  // Basic Information
  caseNumber: {
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
  
  // Client Information
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  
  // Case Classification
  matterType: {
    type: String,
    required: true,
    enum: ['Civil', 'Criminal', 'Corporate', 'Family', 'Immigration', 'Real Estate', 'Intellectual Property', 'Tax', 'Employment', 'Other']
  },
  practiceArea: {
    type: String,
    required: true
  },
  caseType: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Status & Progress
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'On Hold', 'Pending Review', 'Closed', 'Archived'],
    default: 'Open',
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
  
  // Assignment & Distribution
  assignedTo: {
    type: String,
    trim: true
  },
  assignedAttorney: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  team: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    assignedAt: Date
  }],
  assignmentHistory: [{
    assignedTo: String,
    assignedBy: String,
    assignedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  
  // Dates & Timeline
  filingDate: Date,
  openedDate: {
    type: Date,
    default: Date.now
  },
  closedDate: Date,
  dueDate: Date,
  nextHearingDate: Date,
  
  // Financial
  estimatedValue: {
    type: Number,
    min: 0
  },
  billingStatus: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Overdue'],
    default: 'Not Started'
  },
  
  // Outcome & Resolution
  outcome: {
    type: String,
    trim: true
  },
  resolution: {
    type: String,
    trim: true
  },
  
  // Archive & Closure
  archived: {
    type: Boolean,
    default: false,
    index: true
  },
  archivedDate: Date,
  archivedBy: String,
  retentionDate: Date,
  canReopen: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  createdBy: {
    type: String,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  
  // Additional custom fields
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
caseSchema.index({ status: 1, priority: 1 });
caseSchema.index({ assignedTo: 1, status: 1 });
caseSchema.index({ matterType: 1, practiceArea: 1 });
caseSchema.index({ openedDate: -1 });
caseSchema.index({ tags: 1 });

// Virtual for case duration
caseSchema.virtual('duration').get(function() {
  if (this.closedDate && this.openedDate) {
    return Math.floor((this.closedDate - this.openedDate) / (1000 * 60 * 60 * 24));
  }
  return Math.floor((Date.now() - this.openedDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update status history
caseSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: Date.now(),
      changedBy: this.lastModifiedBy
    });
  }
  next();
});

// Static methods
caseSchema.statics.findByStatus = function(status) {
  return this.find({ status, archived: false }).sort({ priority: -1, openedDate: -1 });
};

caseSchema.statics.findByAssignee = function(assignedTo) {
  return this.find({ assignedTo, archived: false, status: { $ne: 'Closed' } }).sort({ priority: -1, dueDate: 1 });
};

caseSchema.statics.getAnalytics = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: null,
        totalCases: { $sum: 1 },
        openCases: {
          $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] }
        },
        inProgressCases: {
          $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
        },
        closedCases: {
          $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] }
        },
        avgDuration: {
          $avg: {
            $cond: [
              { $and: ['$closedDate', '$openedDate'] },
              { $divide: [{ $subtract: ['$closedDate', '$openedDate'] }, 1000 * 60 * 60 * 24] },
              null
            ]
          }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalCases: 0,
    openCases: 0,
    inProgressCases: 0,
    closedCases: 0,
    avgDuration: 0
  };
};

// Instance methods
caseSchema.methods.assignCase = function(assignedTo, assignedBy, reason) {
  this.assignmentHistory.push({
    assignedTo,
    assignedBy,
    assignedAt: Date.now(),
    reason
  });
  this.assignedTo = assignedTo;
  this.lastModifiedBy = assignedBy;
};

caseSchema.methods.closeCase = function(closedBy, outcome, resolution) {
  this.status = 'Closed';
  this.closedDate = Date.now();
  this.outcome = outcome;
  this.resolution = resolution;
  this.lastModifiedBy = closedBy;
};

caseSchema.methods.archiveCase = function(archivedBy, retentionDays = 2555) {
  this.archived = true;
  this.archivedDate = Date.now();
  this.archivedBy = archivedBy;
  this.retentionDate = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000);
};

export default mongoose.model('Case', caseSchema);
