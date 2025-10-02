/**
 * ContractObligation Model - Mongoose Schema for Contract Obligation Tracking
 * Tracks deliverables, payments, and other contractual obligations for compliance monitoring
 */

const mongoose = require('mongoose');

const contractObligationSchema = new mongoose.Schema({
  // Obligation Identification
  obligationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Contract Reference
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true,
    index: true
  },
  contractNumber: {
    type: String,
    trim: true,
    index: true
  },
  
  // Obligation Details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Obligation Classification
  obligationType: {
    type: String,
    enum: [
      'Deliverable', 'Payment', 'Reporting', 'Audit', 'Insurance', 
      'Confidentiality', 'Data Protection', 'Service Level', 
      'Milestone', 'Notification', 'Renewal Notice', 'Other'
    ],
    required: true,
    index: true
  },
  category: {
    type: String,
    trim: true
  },
  
  // Responsibility
  responsibleParty: {
    type: String,
    required: true,
    enum: ['Client', 'Vendor', 'Internal', 'Third Party'],
    index: true
  },
  responsiblePerson: {
    type: String,
    trim: true
  },
  responsibleTeam: String,
  assignedTo: {
    type: String,
    trim: true
  },
  assignedToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status & Progress
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Overdue', 'Waived', 'Not Applicable'],
    default: 'Pending',
    required: true,
    index: true
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
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
  
  // Timeline
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  startDate: Date,
  completedDate: Date,
  reminderDate: Date,
  
  // Frequency & Recurrence
  frequency: {
    type: String,
    enum: ['One-Time', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual'],
    default: 'One-Time'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    interval: Number,
    unit: {
      type: String,
      enum: ['Days', 'Weeks', 'Months', 'Years']
    },
    endDate: Date,
    nextOccurrence: Date
  },
  
  // Priority & Criticality
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  isCritical: {
    type: Boolean,
    default: false
  },
  
  // Deliverable Details (if applicable)
  deliverableDetails: {
    deliverableType: String,
    quantity: Number,
    unit: String,
    specifications: String,
    acceptanceCriteria: String
  },
  
  // Payment Details (if applicable)
  paymentDetails: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: String,
    invoiceNumber: String,
    paymentReference: String
  },
  
  // Completion & Verification
  completedBy: String,
  verifiedBy: String,
  verificationDate: Date,
  verificationNotes: String,
  evidenceDocumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  
  // Compliance & Penalty
  complianceRequired: {
    type: Boolean,
    default: true
  },
  penaltyForNonCompliance: {
    description: String,
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  // Dependencies
  dependsOn: [{
    obligationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractObligation'
    },
    dependencyType: {
      type: String,
      enum: ['Blocking', 'Related', 'Prerequisite']
    }
  }],
  
  // Alerts & Notifications
  alerts: [{
    alertType: {
      type: String,
      enum: ['Reminder', 'Overdue', 'Escalation', 'Completion']
    },
    alertDate: Date,
    sentTo: [String],
    sentAt: Date,
    acknowledged: Boolean,
    acknowledgedBy: String,
    acknowledgedAt: Date
  }],
  notificationsSent: {
    type: Number,
    default: 0
  },
  lastNotificationDate: Date,
  
  // Escalation
  escalationLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  escalatedTo: String,
  escalatedAt: Date,
  escalationReason: String,
  
  // Comments & Notes
  comments: [{
    commentBy: String,
    commentAt: {
      type: Date,
      default: Date.now
    },
    commentText: String
  }],
  internalNotes: String,
  
  // Attachments
  attachments: [{
    filename: String,
    fileType: String,
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    uploadedBy: String,
    uploadedAt: Date
  }],
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastModifiedBy: String,
  lastModifiedDate: Date,
  
  // Activity Tracking
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  lastActivityBy: String,
  
  // Custom Fields
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
contractObligationSchema.index({ contractId: 1, status: 1 });
contractObligationSchema.index({ status: 1, dueDate: 1 });
contractObligationSchema.index({ responsibleParty: 1, status: 1 });
contractObligationSchema.index({ assignedTo: 1, status: 1 });
contractObligationSchema.index({ priority: 1, dueDate: 1 });

// Virtual fields
contractObligationSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const today = new Date();
  const diffTime = this.dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

contractObligationSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate && this.status !== 'Completed' && this.status !== 'Waived';
});

contractObligationSchema.virtual('isDueSoon').get(function() {
  const daysUntil = this.daysUntilDue;
  return daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;
});

// Static methods
contractObligationSchema.statics.findByContract = function(contractId) {
  return this.find({ contractId })
    .sort({ dueDate: 1, priority: -1 });
};

contractObligationSchema.statics.findOverdue = function() {
  return this.find({
    status: { $in: ['Pending', 'In Progress'] },
    dueDate: { $lt: new Date() }
  }).sort({ dueDate: 1 });
};

contractObligationSchema.statics.findDueSoon = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: { $in: ['Pending', 'In Progress'] },
    dueDate: {
      $gte: new Date(),
      $lte: futureDate
    }
  }).sort({ dueDate: 1 });
};

contractObligationSchema.statics.getComplianceReport = function(contractId = null) {
  const matchStage = contractId ? { contractId: mongoose.Types.ObjectId(contractId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        critical: {
          $sum: { $cond: [{ $eq: ['$isCritical', true] }, 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Instance methods
contractObligationSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.statusHistory.push({
    status: this.status,
    changedBy: updatedBy,
    changedAt: new Date(),
    notes
  });
  
  this.status = newStatus;
  this.lastModifiedBy = updatedBy;
  this.lastModifiedDate = new Date();
  this.lastActivityDate = new Date();
  this.lastActivityBy = updatedBy;
  
  if (newStatus === 'Completed') {
    this.completedDate = new Date();
    this.completionPercentage = 100;
  }
  
  return this.save();
};

contractObligationSchema.methods.markComplete = function(completedBy, verifiedBy = null, notes = '') {
  this.status = 'Completed';
  this.completedDate = new Date();
  this.completedBy = completedBy;
  this.completionPercentage = 100;
  
  if (verifiedBy) {
    this.verifiedBy = verifiedBy;
    this.verificationDate = new Date();
    this.verificationNotes = notes;
  }
  
  this.lastModifiedBy = completedBy;
  this.lastModifiedDate = new Date();
  this.lastActivityDate = new Date();
  this.lastActivityBy = completedBy;
  
  return this.save();
};

contractObligationSchema.methods.addComment = function(commentBy, commentText) {
  this.comments.push({
    commentBy,
    commentText
  });
  this.lastActivityDate = new Date();
  this.lastActivityBy = commentBy;
  return this.save();
};

contractObligationSchema.methods.escalate = function(escalatedTo, reason) {
  this.escalationLevel += 1;
  this.escalatedTo = escalatedTo;
  this.escalatedAt = new Date();
  this.escalationReason = reason;
  
  this.alerts.push({
    alertType: 'Escalation',
    alertDate: new Date(),
    sentTo: [escalatedTo]
  });
  
  return this.save();
};

contractObligationSchema.methods.sendReminder = function(recipients = []) {
  this.alerts.push({
    alertType: 'Reminder',
    alertDate: new Date(),
    sentTo: recipients,
    sentAt: new Date()
  });
  
  this.notificationsSent += 1;
  this.lastNotificationDate = new Date();
  
  return this.save();
};

// Pre-save middleware to auto-generate obligation ID
contractObligationSchema.pre('save', async function(next) {
  if (this.isNew && !this.obligationId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.obligationId = `OBL-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  
  // Auto-mark as overdue if past due date
  if (this.dueDate && this.dueDate < new Date() && 
      this.status !== 'Completed' && this.status !== 'Waived' && 
      this.status !== 'Overdue') {
    this.status = 'Overdue';
  }
  
  next();
});

module.exports = mongoose.model('ContractObligation', contractObligationSchema);
