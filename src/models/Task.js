/**
 * Task Model - Mongoose Schema for Task & Workflow Management System
 * Comprehensive data model for legal task and workflow management
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // Basic Information
  taskNumber: {
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
  
  // Task Classification
  taskType: {
    type: String,
    required: true,
    enum: ['Legal Research', 'Document Review', 'Court Filing', 'Client Meeting', 'Hearing Preparation', 'Discovery', 'Contract Review', 'Correspondence', 'Administrative', 'Other'],
    default: 'Other'
  },
  category: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Status & Progress
  status: {
    type: String,
    required: true,
    enum: ['Not Started', 'In Progress', 'On Hold', 'Pending Review', 'Completed', 'Cancelled'],
    default: 'Not Started',
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
  
  // Assignment & Distribution
  assignedTo: {
    type: String,
    trim: true,
    index: true
  },
  assignedToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedBy: {
    type: String,
    trim: true
  },
  team: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
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
  createdDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  dueDate: {
    type: Date,
    index: true
  },
  startDate: Date,
  completedDate: Date,
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  
  // Dependencies
  dependsOn: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    taskNumber: String,
    dependencyType: {
      type: String,
      enum: ['Finish-to-Start', 'Start-to-Start', 'Finish-to-Finish', 'Start-to-Finish'],
      default: 'Finish-to-Start'
    }
  }],
  blockedBy: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    taskNumber: String,
    reason: String
  }],
  isBlocking: {
    type: Boolean,
    default: false
  },
  
  // Relations
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: {
    type: String,
    trim: true,
    index: true
  },
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow'
  },
  workflowName: String,
  parentTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  subtasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  
  // Template Information
  fromTemplate: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskTemplate'
  },
  templateName: String,
  
  // SLA & Urgency
  slaEnabled: {
    type: Boolean,
    default: false
  },
  slaDueDate: Date,
  slaStatus: {
    type: String,
    enum: ['On Track', 'At Risk', 'Breached', 'Not Applicable'],
    default: 'Not Applicable'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  escalationLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  // Collaboration & Comments
  commentCount: {
    type: Number,
    default: 0
  },
  attachmentCount: {
    type: Number,
    default: 0
  },
  lastActivityDate: Date,
  
  // Checklist Items
  checklist: [{
    item: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedBy: String,
    completedAt: Date
  }],
  
  // Notifications & Reminders
  reminders: [{
    reminderDate: Date,
    reminderType: {
      type: String,
      enum: ['Email', 'Push', 'SMS']
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  notifyOnCompletion: {
    type: Boolean,
    default: true
  },
  notificationRecipients: [String],
  
  // Recurring Tasks
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Yearly']
    },
    interval: Number,
    endDate: Date,
    nextOccurrence: Date
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  lastModifiedAt: Date,
  completedBy: String,
  cancelledBy: String,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes for performance optimization
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ caseNumber: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ workflowId: 1 });
taskSchema.index({ createdDate: -1 });

// Virtual field: Days until due
taskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diff = Math.floor((due - now) / (1000 * 60 * 60 * 24));
  return diff;
});

// Virtual field: Is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'Completed' || this.status === 'Cancelled') return false;
  return new Date() > new Date(this.dueDate);
});

// Virtual field: Duration in days
taskSchema.virtual('duration').get(function() {
  if (!this.completedDate || !this.startDate) return null;
  const start = new Date(this.startDate);
  const end = new Date(this.completedDate);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update lastModifiedAt
taskSchema.pre('save', function(next) {
  this.lastModifiedAt = new Date();
  next();
});

// Static method: Find tasks by status
taskSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ priority: -1, dueDate: 1 });
};

// Static method: Find tasks by assignee
taskSchema.statics.findByAssignee = function(assignedTo) {
  return this.find({ 
    assignedTo, 
    status: { $nin: ['Completed', 'Cancelled'] } 
  }).sort({ priority: -1, dueDate: 1 });
};

// Static method: Find overdue tasks
taskSchema.statics.findOverdue = function() {
  const now = new Date();
  return this.find({
    dueDate: { $lt: now },
    status: { $nin: ['Completed', 'Cancelled'] }
  }).sort({ dueDate: 1 });
};

// Static method: Get analytics
taskSchema.statics.getAnalytics = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        inProgressTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
        },
        overdueTasks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ['$dueDate', new Date()] },
                  { $nin: ['$status', ['Completed', 'Cancelled']] }
                ]
              },
              1,
              0
            ]
          }
        },
        avgCompletionPercentage: { $avg: '$completionPercentage' },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum: '$actualHours' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    avgCompletionPercentage: 0,
    totalEstimatedHours: 0,
    totalActualHours: 0
  };
};

// Instance method: Assign task
taskSchema.methods.assignTask = function(assignedTo, assignedBy, reason = '') {
  // Update assignment history
  this.assignmentHistory.push({
    assignedTo,
    assignedBy,
    assignedAt: new Date(),
    reason
  });
  
  // Update current assignment
  this.assignedTo = assignedTo;
  this.assignedBy = assignedBy;
  this.lastModifiedBy = assignedBy;
  this.lastActivityDate = new Date();
  
  return this.save();
};

// Instance method: Update progress
taskSchema.methods.updateProgress = function(percentage, updatedBy) {
  this.completionPercentage = Math.min(100, Math.max(0, percentage));
  this.lastModifiedBy = updatedBy;
  this.lastActivityDate = new Date();
  
  // Auto-update status based on percentage
  if (percentage === 0 && this.status === 'Not Started') {
    // Keep as Not Started
  } else if (percentage > 0 && percentage < 100) {
    this.status = 'In Progress';
  } else if (percentage === 100) {
    this.status = 'Completed';
    this.completedDate = new Date();
    this.completedBy = updatedBy;
  }
  
  return this.save();
};

// Instance method: Complete task
taskSchema.methods.completeTask = function(completedBy, notes = '') {
  this.status = 'Completed';
  this.completionPercentage = 100;
  this.completedDate = new Date();
  this.completedBy = completedBy;
  this.lastModifiedBy = completedBy;
  this.lastActivityDate = new Date();
  
  // Add to status history
  this.statusHistory.push({
    status: 'Completed',
    changedBy: completedBy,
    changedAt: new Date(),
    notes
  });
  
  return this.save();
};

// Instance method: Add dependency
taskSchema.methods.addDependency = function(taskId, taskNumber, dependencyType = 'Finish-to-Start') {
  this.dependsOn.push({
    taskId,
    taskNumber,
    dependencyType
  });
  
  return this.save();
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
