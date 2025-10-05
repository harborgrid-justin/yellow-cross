/**
 * TaskTemplate Model - Mongoose Schema for Task Templates
 * Reusable task templates for common legal processes
 */

const mongoose = require('mongoose');

const taskTemplateSchema = new mongoose.Schema({
  // Basic Information
  templateId: {
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
  
  // Template Configuration
  category: {
    type: String,
    required: true,
    trim: true
  },
  practiceArea: {
    type: String,
    required: true,
    trim: true
  },
  templateType: {
    type: String,
    enum: ['Single Task', 'Task Group', 'Workflow'],
    default: 'Single Task'
  },
  
  // Task Definition
  taskDefinition: {
    title: {
      type: String,
      required: true
    },
    description: String,
    taskType: {
      type: String,
      enum: ['Legal Research', 'Document Review', 'Court Filing', 'Client Meeting', 'Hearing Preparation', 'Discovery', 'Contract Review', 'Correspondence', 'Administrative', 'Other'],
      default: 'Other'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    estimatedHours: Number,
    defaultAssignee: String,
    tags: [String]
  },
  
  // Multiple Tasks (for Task Group)
  tasks: [{
    title: String,
    description: String,
    taskType: String,
    priority: String,
    estimatedHours: Number,
    order: Number,
    dependsOn: [Number]
  }],
  
  // Checklist Items
  checklist: [{
    item: String,
    isRequired: {
      type: Boolean,
      default: false
    }
  }],
  
  // Variables for customization
  variables: [{
    variableName: String,
    variableType: {
      type: String,
      enum: ['Text', 'Number', 'Date', 'Boolean', 'Select']
    },
    defaultValue: String,
    isRequired: {
      type: Boolean,
      default: false
    },
    selectOptions: [String]
  }],
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Active', 'Inactive', 'Archived'],
    default: 'Active',
    index: true
  },
  
  // Usage & Analytics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedDate: Date,
  averageCompletionTime: Number, // in hours
  
  // Sharing & Permissions
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    sharedAt: Date
  }],
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  customMetadata: mongoose.Schema.Types.Mixed,
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  
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
taskTemplateSchema.index({ status: 1, practiceArea: 1 });
taskTemplateSchema.index({ category: 1, status: 1 });
taskTemplateSchema.index({ isPublic: 1, status: 1 });
taskTemplateSchema.index({ tags: 1 });
taskTemplateSchema.index({ usageCount: -1 });

// Pre-save middleware
taskTemplateSchema.pre('save', function(next) {
  this.lastModifiedAt = new Date();
  next();
});

// Static method: Find templates by practice area
taskTemplateSchema.statics.findByPracticeArea = function(practiceArea) {
  return this.find({ 
    practiceArea, 
    status: 'Active' 
  }).sort({ name: 1 });
};

// Static method: Find templates by category
taskTemplateSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category, 
    status: 'Active' 
  }).sort({ name: 1 });
};

// Static method: Find popular templates
taskTemplateSchema.statics.findPopular = function(limit = 10) {
  return this.find({ 
    status: 'Active' 
  })
  .sort({ usageCount: -1 })
  .limit(limit);
};

// Instance method: Increment usage count
taskTemplateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsedDate = new Date();
  return this.save();
};

// Instance method: Create task from template
taskTemplateSchema.methods.createTask = function(customData = {}) {
  // eslint-disable-next-line no-unused-vars
  const Task = require('./Task');
  
  const taskData = {
    title: customData.title || this.taskDefinition.title,
    description: customData.description || this.taskDefinition.description,
    taskType: customData.taskType || this.taskDefinition.taskType,
    priority: customData.priority || this.taskDefinition.priority,
    estimatedHours: customData.estimatedHours || this.taskDefinition.estimatedHours,
    tags: [...(this.taskDefinition.tags || []), ...(customData.tags || [])],
    fromTemplate: true,
    templateId: this._id,
    templateName: this.name,
    checklist: this.checklist.map(item => ({
      item: item.item,
      completed: false
    })),
    ...customData
  };
  
  return taskData;
};

const TaskTemplate = mongoose.model('TaskTemplate', taskTemplateSchema);

module.exports = TaskTemplate;
