/**
 * Workflow Model - Mongoose Schema for Workflow Automation
 * Comprehensive data model for automated legal workflows
 */

import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema({
  // Basic Information
  workflowNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Workflow Configuration
  workflowType: {
    type: String,
    required: true,
    enum: ['Case Workflow', 'Document Workflow', 'Approval Workflow', 'Onboarding', 'Discovery', 'Contract Review', 'Litigation', 'Custom'],
    default: 'Custom'
  },
  category: {
    type: String,
    trim: true
  },
  practiceArea: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Active', 'Inactive', 'Archived'],
    default: 'Draft',
    index: true
  },
  
  // Workflow Steps
  steps: [{
    stepNumber: Number,
    stepName: String,
    stepDescription: String,
    stepType: {
      type: String,
      enum: ['Task', 'Approval', 'Notification', 'Condition', 'Delay', 'Action']
    },
    assignTo: String,
    estimatedDuration: Number, // in hours
    isRequired: {
      type: Boolean,
      default: true
    },
    dependencies: [{
      stepNumber: Number,
      condition: String
    }],
    taskTemplate: {
      title: String,
      description: String,
      taskType: String,
      priority: String
    },
    automatedActions: [{
      actionType: String,
      actionConfig: mongoose.Schema.Types.Mixed
    }]
  }],
  
  // Triggers
  triggers: [{
    triggerType: {
      type: String,
      enum: ['Manual', 'Case Created', 'Status Change', 'Date Based', 'Document Upload', 'Approval Complete', 'Custom Event']
    },
    triggerConditions: mongoose.Schema.Types.Mixed,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Conditional Logic
  conditions: [{
    conditionName: String,
    conditionLogic: String,
    trueAction: mongoose.Schema.Types.Mixed,
    falseAction: mongoose.Schema.Types.Mixed
  }],
  
  // Notifications
  notificationSettings: {
    notifyOnStart: {
      type: Boolean,
      default: true
    },
    notifyOnComplete: {
      type: Boolean,
      default: true
    },
    notifyOnDelay: {
      type: Boolean,
      default: true
    },
    recipients: [String]
  },
  
  // Template & Reusability
  isTemplate: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  allowCustomization: {
    type: Boolean,
    default: true
  },
  
  // Usage & Analytics
  usageCount: {
    type: Number,
    default: 0
  },
  activeInstances: {
    type: Number,
    default: 0
  },
  completedInstances: {
    type: Number,
    default: 0
  },
  averageCompletionTime: Number, // in hours
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  parentVersionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow'
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  customMetadata: mongoose.Schema.Types.Mixed,
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: String,
  lastModifiedAt: Date,
  archivedBy: String,
  archivedAt: Date
}, {
  timestamps: true
});

// Indexes for performance optimization
workflowSchema.index({ status: 1, workflowType: 1 });
workflowSchema.index({ isTemplate: 1, status: 1 });
workflowSchema.index({ practiceArea: 1 });
workflowSchema.index({ tags: 1 });
workflowSchema.index({ createdAt: -1 });

// Pre-save middleware
workflowSchema.pre('save', function(next) {
  this.lastModifiedAt = new Date();
  next();
});

// Static method: Find active workflows
workflowSchema.statics.findActive = function() {
  return this.find({ status: 'Active' }).sort({ name: 1 });
};

// Static method: Find workflow templates
workflowSchema.statics.findTemplates = function(filters = {}) {
  return this.find({ 
    isTemplate: true, 
    status: { $ne: 'Archived' },
    ...filters 
  }).sort({ name: 1 });
};

// Instance method: Activate workflow
workflowSchema.methods.activate = function(activatedBy) {
  this.status = 'Active';
  this.lastModifiedBy = activatedBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Instance method: Archive workflow
workflowSchema.methods.archive = function(archivedBy) {
  this.status = 'Archived';
  this.archivedBy = archivedBy;
  this.archivedAt = new Date();
  this.lastModifiedBy = archivedBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Instance method: Increment usage count
workflowSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

const Workflow = mongoose.model('Workflow', workflowSchema);

export default Workflow;
