/**
 * DocumentTemplate Model - Mongoose Schema for Document Template Library
 * Manages legal document templates with customization and automation
 */

import mongoose from 'mongoose';

const documentTemplateSchema = new mongoose.Schema({
  // Template Identification
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
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Template Classification
  category: {
    type: String,
    required: true,
    enum: ['Legal Document', 'Contract', 'Pleading', 'Motion', 'Brief', 'Form', 'Letter', 'Agreement', 'Discovery', 'Other'],
    index: true
  },
  subCategory: {
    type: String,
    trim: true
  },
  practiceArea: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  jurisdiction: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Template Content
  content: {
    type: String,
    required: true
  },
  contentFormat: {
    type: String,
    enum: ['Plain Text', 'Rich Text', 'HTML', 'Markdown', 'JSON'],
    default: 'Plain Text'
  },
  
  // Template Variables & Fields
  variables: [{
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Text', 'Number', 'Date', 'Email', 'Phone', 'Address', 'Select', 'Multiline', 'Boolean'],
      default: 'Text'
    },
    description: String,
    required: {
      type: Boolean,
      default: false
    },
    defaultValue: String,
    options: [String], // For Select type
    placeholder: String,
    validation: {
      pattern: String,
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number
    }
  }],
  
  // Conditional Logic
  conditionalSections: [{
    sectionId: String,
    condition: String, // Expression to evaluate
    content: String
  }],
  
  // Template Metadata
  version: {
    type: Number,
    default: 1
  },
  isLatestVersion: {
    type: Boolean,
    default: true,
    index: true
  },
  parentTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentTemplate'
  },
  
  // Usage & Statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedAt: {
    type: Date
  },
  popularity: {
    type: Number,
    default: 0
  },
  
  // Sharing & Access
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Team', 'Organization'],
    default: 'Team',
    index: true
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    permission: {
      type: String,
      enum: ['View', 'Use', 'Edit']
    },
    sharedAt: Date
  }],
  
  // Template Settings
  allowCustomization: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  
  // File Output Options
  outputFormats: [{
    type: String,
    enum: ['PDF', 'DOCX', 'TXT', 'HTML', 'RTF']
  }],
  defaultOutputFormat: {
    type: String,
    enum: ['PDF', 'DOCX', 'TXT', 'HTML', 'RTF'],
    default: 'PDF'
  },
  
  // Template Source
  sourceDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Deprecated', 'Archived'],
    default: 'Draft',
    index: true
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastModifiedBy: {
    type: String
  },
  lastModifiedAt: {
    type: Date
  },
  approvedBy: {
    type: String
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
documentTemplateSchema.index({ name: 'text', title: 'text', description: 'text' });
documentTemplateSchema.index({ category: 1, practiceArea: 1 });
documentTemplateSchema.index({ status: 1, visibility: 1 });
documentTemplateSchema.index({ popularity: -1 });
documentTemplateSchema.index({ tags: 1 });

// Virtual field for variable count
documentTemplateSchema.virtual('variableCount').get(function() {
  return this.variables ? this.variables.length : 0;
});

// Static method to find templates by practice area
documentTemplateSchema.statics.findByPracticeArea = function(practiceArea) {
  return this.find({
    practiceArea,
    status: 'Active',
    isLatestVersion: true
  }).sort({ popularity: -1, name: 1 });
};

// Static method to find popular templates
documentTemplateSchema.statics.findPopular = function(limit = 10) {
  return this.find({
    status: 'Active',
    isLatestVersion: true
  })
    .sort({ popularity: -1, usageCount: -1 })
    .limit(limit);
};

// Static method to search templates
documentTemplateSchema.statics.searchTemplates = function(searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm },
    status: 'Active',
    isLatestVersion: true
  };
  
  if (filters.category) query.category = filters.category;
  if (filters.practiceArea) query.practiceArea = filters.practiceArea;
  if (filters.visibility) query.visibility = filters.visibility;
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// Instance method to increment usage
documentTemplateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.popularity = this.usageCount; // Simple popularity calculation
  this.lastUsedAt = new Date();
  return this.save();
};

// Instance method to create new version
documentTemplateSchema.methods.createNewVersion = async function(updates, updatedBy) {
  // Mark current as not latest
  this.isLatestVersion = false;
  await this.save();
  
  // Create new version
  const newVersion = new this.constructor({
    ...this.toObject(),
    _id: mongoose.Types.ObjectId(),
    version: this.version + 1,
    parentTemplateId: this._id,
    isLatestVersion: true,
    ...updates,
    lastModifiedBy: updatedBy,
    lastModifiedAt: new Date()
  });
  
  delete newVersion.id; // Remove virtual id field
  await newVersion.save();
  return newVersion;
};

// Instance method to share template
documentTemplateSchema.methods.shareTemplate = function(userId, username, permission, sharedBy) {
  // Remove existing share for this user if any
  this.sharedWith = this.sharedWith.filter(s => s.userId?.toString() !== userId);
  
  // Add new share
  this.sharedWith.push({
    userId,
    username,
    permission,
    sharedAt: new Date()
  });
  
  this.lastModifiedBy = sharedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Pre-save middleware
documentTemplateSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

export default mongoose.model('DocumentTemplate', documentTemplateSchema);
