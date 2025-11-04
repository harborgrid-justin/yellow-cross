/**
 * Case Timeline Event Model - Mongoose Schema for Case Timeline Management
 * Tracks all events, milestones, and important dates in case lifecycle
 */

import mongoose from 'mongoose';

const caseTimelineEventSchema = new mongoose.Schema({
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
  
  // Event Details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'Case Created',
      'Status Change',
      'Assignment',
      'Court Hearing',
      'Filing',
      'Deadline',
      'Meeting',
      'Phone Call',
      'Email',
      'Document Filed',
      'Payment Received',
      'Milestone',
      'Note Added',
      'Case Closed',
      'Custom'
    ]
  },
  
  // Timing
  eventDate: {
    type: Date,
    required: true,
    index: true
  },
  isDeadline: {
    type: Boolean,
    default: false
  },
  deadlineStatus: {
    type: String,
    enum: ['Upcoming', 'Today', 'Overdue', 'Completed', 'N/A'],
    default: 'N/A'
  },
  
  // Categorization
  category: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  
  // Attribution
  createdBy: {
    type: String,
    trim: true
  },
  participants: [{
    name: String,
    role: String
  }],
  
  // Details
  location: {
    type: String,
    trim: true
  },
  outcome: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Completion
  completed: {
    type: Boolean,
    default: false
  },
  completedDate: Date,
  completedBy: String,
  
  // Related items
  relatedDocuments: [{
    documentId: mongoose.Schema.Types.ObjectId,
    documentName: String,
    documentUrl: String
  }],
  relatedNotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseNote'
  }],
  
  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for performance
caseTimelineEventSchema.index({ caseId: 1, eventDate: -1 });
caseTimelineEventSchema.index({ caseNumber: 1, eventType: 1 });
caseTimelineEventSchema.index({ eventDate: 1, isDeadline: 1 });
caseTimelineEventSchema.index({ deadlineStatus: 1, eventDate: 1 });

// Virtual for days until deadline
caseTimelineEventSchema.virtual('daysUntilDeadline').get(function() {
  if (!this.isDeadline || this.completed) return null;
  return Math.ceil((this.eventDate - Date.now()) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update deadline status
caseTimelineEventSchema.pre('save', function(next) {
  if (this.isDeadline && !this.completed) {
    const daysUntil = Math.ceil((this.eventDate - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) {
      this.deadlineStatus = 'Overdue';
    } else if (daysUntil === 0) {
      this.deadlineStatus = 'Today';
    } else {
      this.deadlineStatus = 'Upcoming';
    }
  } else if (this.completed) {
    this.deadlineStatus = 'Completed';
  }
  next();
});

// Static methods
caseTimelineEventSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ eventDate: -1 });
};

caseTimelineEventSchema.statics.findUpcomingDeadlines = function(caseId, days = 30) {
  const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return this.find({
    caseId,
    isDeadline: true,
    completed: false,
    eventDate: { $gte: Date.now(), $lte: futureDate }
  }).sort({ eventDate: 1 });
};

caseTimelineEventSchema.statics.findByDateRange = function(caseId, startDate, endDate) {
  return this.find({
    caseId,
    eventDate: { $gte: startDate, $lte: endDate }
  }).sort({ eventDate: 1 });
};

// Instance methods
caseTimelineEventSchema.methods.markCompleted = function(completedBy) {
  this.completed = true;
  this.completedDate = Date.now();
  this.completedBy = completedBy;
  this.deadlineStatus = 'Completed';
};

export default mongoose.model('CaseTimelineEvent', caseTimelineEventSchema);
