/**
 * CommunicationTemplate Model - Mongoose Schema for Communication Templates
 * Data model for email templates and standard correspondence
 */

const mongoose = require('mongoose');

const communicationTemplateSchema = new mongoose.Schema({
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
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Template Content
  subject: {
    type: String,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  
  // Template Type
  templateType: {
    type: String,
    required: true,
    enum: ['Email', 'Letter', 'SMS', 'Notice', 'Agreement', 'Invoice', 'General'],
    index: true
  },
  
  // Category & Usage
  category: {
    type: String,
    trim: true,
    index: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedAt: Date,
  
  // Variables & Placeholders
  variables: [{
    name: String,
    description: String,
    defaultValue: String,
    required: Boolean
  }],
  
  // Formatting
  format: {
    type: String,
    enum: ['Plain Text', 'HTML', 'Markdown', 'Rich Text'],
    default: 'HTML'
  },
  
  // Attachments
  defaultAttachments: [{
    fileName: String,
    fileType: String,
    url: String
  }],
  
  // Access Control
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Shared'],
    default: 'Private'
  },
  sharedWith: [{
    userId: String,
    role: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Archived'],
    default: 'Active',
    index: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    index: true
  },
  lastModifiedBy: String,
  tags: [String],
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  versionHistory: [{
    version: Number,
    body: String,
    modifiedBy: String,
    modifiedAt: Date,
    changeNotes: String
  }]
}, {
  timestamps: true
});

// Indexes
communicationTemplateSchema.index({ templateType: 1, category: 1 });
communicationTemplateSchema.index({ status: 1, createdBy: 1 });
communicationTemplateSchema.index({ tags: 1 });

// Methods
communicationTemplateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsedAt = new Date();
  return this.save();
};

communicationTemplateSchema.methods.createVersion = function(modifiedBy, changeNotes) {
  this.versionHistory.push({
    version: this.version,
    body: this.body,
    modifiedBy,
    modifiedAt: new Date(),
    changeNotes
  });
  this.version += 1;
  return this.save();
};

communicationTemplateSchema.methods.render = function(variables) {
  let renderedSubject = this.subject;
  let renderedBody = this.body;
  
  // Replace variables in template
  Object.keys(variables).forEach(key => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    renderedSubject = renderedSubject.replace(placeholder, variables[key]);
    renderedBody = renderedBody.replace(placeholder, variables[key]);
  });
  
  return {
    subject: renderedSubject,
    body: renderedBody
  };
};

// Static methods
communicationTemplateSchema.statics.findByType = function(templateType) {
  return this.find({ templateType, status: 'Active' }).sort({ usageCount: -1 });
};

communicationTemplateSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'Active' })
    .sort({ usageCount: -1 })
    .limit(limit);
};

const CommunicationTemplate = mongoose.model('CommunicationTemplate', communicationTemplateSchema);

module.exports = CommunicationTemplate;
