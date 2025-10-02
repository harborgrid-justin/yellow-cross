/**
 * Deadline Model - Mongoose Schema for Deadline Management
 * Manages legal deadlines, statute of limitations, and critical dates
 */

const mongoose = require('mongoose');

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
  
  // Deadline Details
  deadlineType: {
    type: String,
    required: true,
    enum: [
      'Filing Deadline',
      'Response Deadline',
      'Discovery Deadline',
      'Motion Deadline',
      'Appeal Deadline',
      'Statute of Limitations',
      'Court-Ordered',
      'Internal Deadline',
      'Custom'
    ]
  },
  
  // Timing
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  dueTime: {
    type: String,
    trim: true
  },
  calculatedDate: {
    type: Date
  },
  triggerDate: {
    type: Date
  },
  
  // Calculation Details
  calculationMethod: {
    type: String,
    enum: ['Manual', 'Court Rules', 'Statute', 'Custom Formula']
  },
  calculationNotes: {
    type: String,
    trim: true
  },
  courtRule: {
    type: String,
    trim: true
  },
  statuteReference: {
    type: String,
    trim: true
  },
  
  // Status & Priority
  status: {
    type: String,
    required: true,
    enum: ['Upcoming', 'Today', 'Overdue', 'Completed', 'Cancelled', 'Extended'],
    default: 'Upcoming',
    index: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'High',
    index: true
  },
  
  // Relations
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
  
  // Assignment
  assignedTo: {
    type: String,
    required: true,
    trim: true
  },
  responsibleAttorney: {
    type: String,
    trim: true
  },
  
  // Reminders
  reminders: [{
    daysBeforeDue: {
      type: Number,
      required: true
    },
    reminderDate: Date,
    reminderType: {
      type: String,
      enum: ['Email', 'SMS', 'Push', 'In-App']
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    recipients: [String]
  }],
  
  // Completion
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  completedDate: Date,
  completedBy: String,
  completionNotes: {
    type: String,
    trim: true
  },
  
  // Extension
  extended: {
    type: Boolean,
    default: false
  },
  originalDueDate: Date,
  extensionGrantedDate: Date,
  extensionReason: {
    type: String,
    trim: true
  },
  extensionGrantedBy: String,
  
  // Dependencies
  relatedDeadlines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deadline'
  }],
  blockedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deadline'
  }],
  
  // Documents & Tasks
  relatedDocuments: [{
    documentId: mongoose.Schema.Types.ObjectId,
    documentName: String
  }],
  relatedTasks: [{
    taskId: mongoose.Schema.Types.ObjectId,
    taskName: String
  }],
  
  // Metadata
  tags: [String],
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  lastModifiedAt: Date,
  cancelledBy: String,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes
deadlineSchema.index({ dueDate: 1, status: 1 });
deadlineSchema.index({ caseId: 1, dueDate: 1 });
deadlineSchema.index({ assignedTo: 1, status: 1, dueDate: 1 });
deadlineSchema.index({ priority: 1, status: 1 });
deadlineSchema.index({ completed: 1, dueDate: 1 });

// Virtual for days until deadline
deadlineSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is overdue
deadlineSchema.virtual('isOverdue').get(function() {
  if (this.completed || this.status === 'Completed') return false;
  const now = new Date();
  return new Date(this.dueDate) < now;
});

// Static method: Find upcoming deadlines
deadlineSchema.statics.findUpcoming = function(days = 30, filters = {}) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    dueDate: { $gte: now, $lte: futureDate },
    status: { $in: ['Upcoming', 'Today'] },
    completed: false,
    ...filters
  }).sort({ dueDate: 1, priority: -1 });
};

// Static method: Find overdue deadlines
deadlineSchema.statics.findOverdue = function(filters = {}) {
  const now = new Date();
  
  return this.find({
    dueDate: { $lt: now },
    status: { $in: ['Upcoming', 'Today', 'Overdue'] },
    completed: false,
    ...filters
  }).sort({ dueDate: 1, priority: -1 });
};

// Static method: Find deadlines by case
deadlineSchema.statics.findByCaseId = function(caseId, includeCompleted = false) {
  const query = { caseId };
  if (!includeCompleted) {
    query.completed = false;
  }
  return this.find(query).sort({ dueDate: 1 });
};

// Static method: Find deadlines by attorney
deadlineSchema.statics.findByAttorney = function(attorneyName, includeCompleted = false) {
  const query = { assignedTo: attorneyName };
  if (!includeCompleted) {
    query.completed = false;
  }
  return this.find(query).sort({ dueDate: 1, priority: -1 });
};

// Static method: Calculate deadline from trigger date
deadlineSchema.statics.calculateDeadline = function(triggerDate, daysToAdd, courtRules = {}) {
  const deadline = new Date(triggerDate);
  let remainingDays = daysToAdd;
  
  // Add business days, skipping weekends and holidays
  while (remainingDays > 0) {
    deadline.setDate(deadline.getDate() + 1);
    const dayOfWeek = deadline.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Check if it's a holiday (if provided)
      const isHoliday = courtRules.holidays && 
        courtRules.holidays.some(h => {
          const holidayDate = new Date(h);
          return holidayDate.toDateString() === deadline.toDateString();
        });
      
      if (!isHoliday) {
        remainingDays--;
      }
    }
  }
  
  return deadline;
};

// Instance method: Mark as completed
deadlineSchema.methods.markCompleted = function(completedBy, notes) {
  this.completed = true;
  this.status = 'Completed';
  this.completedDate = new Date();
  this.completedBy = completedBy;
  this.completionNotes = notes;
  this.lastModifiedBy = completedBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Instance method: Extend deadline
deadlineSchema.methods.extendDeadline = function(newDueDate, reason, grantedBy) {
  if (!this.extended) {
    this.originalDueDate = this.dueDate;
  }
  this.extended = true;
  this.dueDate = new Date(newDueDate);
  this.status = 'Extended';
  this.extensionGrantedDate = new Date();
  this.extensionReason = reason;
  this.extensionGrantedBy = grantedBy;
  this.lastModifiedBy = grantedBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Instance method: Cancel deadline
deadlineSchema.methods.cancelDeadline = function(cancelledBy, reason) {
  this.status = 'Cancelled';
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  this.lastModifiedBy = cancelledBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Pre-save middleware to update status based on date
deadlineSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  
  // Auto-update status based on due date
  if (!this.completed && this.status !== 'Cancelled') {
    const now = new Date();
    const due = new Date(this.dueDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    
    if (dueDay < today) {
      this.status = 'Overdue';
    } else if (dueDay.getTime() === today.getTime()) {
      this.status = 'Today';
    } else {
      this.status = 'Upcoming';
    }
  }
  
  next();
});

const Deadline = mongoose.model('Deadline', deadlineSchema);

module.exports = Deadline;
