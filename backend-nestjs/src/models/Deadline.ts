/**
 * Deadline Model - Mongoose Schema for Deadline Management
 * Comprehensive data model for legal deadlines and statute of limitations
 */

import mongoose from 'mongoose';

const deadlineSchema = new mongoose.Schema({
  // Basic Information
  deadlineNumber: {
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
  
  // Deadline Type
  deadlineType: {
    type: String,
    required: true,
    enum: ['Filing', 'Response', 'Discovery', 'Motion', 'Appeal', 'Statute of Limitations', 'Other'],
    index: true
  },
  
  // Date Information
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  triggerDate: {
    type: Date
  },
  calculationMethod: {
    type: String,
    enum: ['Calendar Days', 'Business Days', 'Court Days'],
    default: 'Calendar Days'
  },
  daysAllowed: {
    type: Number
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Completed', 'Missed', 'Extended', 'Waived'],
    default: 'Pending',
    index: true
  },
  completedDate: {
    type: Date
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  
  // Case/Matter Association
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  caseNumber: {
    type: String,
    index: true
  },
  
  // Court Rules
  courtRule: {
    jurisdiction: String,
    court: String,
    ruleNumber: String,
    ruleDescription: String
  },
  
  // Assignment
  assignedTo: {
    type: String,
    trim: true,
    index: true
  },
  responsibleAttorney: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Alerts & Reminders
  alerts: [{
    alertType: {
      type: String,
      enum: ['Email', 'SMS', 'Push', 'System'],
      default: 'Email'
    },
    daysBefore: Number,
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    recipient: String
  }],
  
  // Extensions
  extensions: [{
    requestedDate: Date,
    grantedDate: Date,
    newDueDate: Date,
    reason: String,
    approvedBy: String,
    status: {
      type: String,
      enum: ['Requested', 'Granted', 'Denied'],
      default: 'Requested'
    }
  }],
  
  // Dependencies
  dependencies: [{
    dependsOn: mongoose.Schema.Types.ObjectId,
    dependencyType: String
  }],
  
  // Completion Information
  completionNotes: {
    type: String,
    trim: true
  },
  completedBy: {
    type: String,
    trim: true
  },
  filingConfirmation: {
    confirmationNumber: String,
    filedDate: Date,
    filingMethod: String
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
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for performance
deadlineSchema.index({ dueDate: 1, status: 1 });
deadlineSchema.index({ caseId: 1, dueDate: 1 });
deadlineSchema.index({ assignedTo: 1, dueDate: 1 });

// Virtual for days until due
deadlineSchema.virtual('daysUntilDue').get(function() {
  if (this.dueDate) {
    const today = new Date();
    const diffTime = this.dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for is overdue
deadlineSchema.virtual('isOverdue').get(function() {
  return this.dueDate < new Date() && this.status !== 'Completed' && this.status !== 'Missed';
});

// Virtual for is critical
deadlineSchema.virtual('isCritical').get(function() {
  const daysUntil = this.daysUntilDue;
  return daysUntil !== null && daysUntil <= 3 && this.status === 'Pending';
});

// Instance method to mark as completed
deadlineSchema.methods.markCompleted = function(completedBy, notes) {
  this.status = 'Completed';
  this.completedDate = new Date();
  this.completedBy = completedBy;
  if (notes) {
    this.completionNotes = notes;
  }
  this.lastModifiedBy = completedBy;
  return this.save();
};

// Instance method to request extension
deadlineSchema.methods.requestExtension = function(newDueDate, reason, requestedBy) {
  this.extensions.push({
    requestedDate: new Date(),
    newDueDate,
    reason,
    status: 'Requested'
  });
  this.lastModifiedBy = requestedBy;
  return this.save();
};

// Static method to find overdue deadlines
deadlineSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $in: ['Pending', 'In Progress'] }
  }).sort({ dueDate: 1 });
};

// Static method to find upcoming deadlines
deadlineSchema.statics.findUpcoming = function(days = 7) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    dueDate: { $gte: today, $lte: futureDate },
    status: { $in: ['Pending', 'In Progress'] }
  }).sort({ dueDate: 1 });
};

// Static method to find by case
deadlineSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ dueDate: 1 });
};

export default mongoose.model('Deadline', deadlineSchema);
