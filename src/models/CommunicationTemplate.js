/**
 * CommunicationTemplate Model - Mongoose Schema for Communication Templates
 * Email templates, letter templates, and standard correspondence
 */

const mongoose = require('mongoose');

const communicationTemplateSchema = new mongoose.Schema({
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
    trim: true,
    maxlength: 200
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Template Type
  templateType: {
    type: String,
    enum: [
      'Email', 'Letter', 'SMS', 'Client Portal Message', 
      'Internal Message', 'Court Document', 'Form Letter', 'Other'
    ],
    required: true,
    index: true
  },
  
  // Template Category
  category: {
    type: String,
    enum: [
      'Client Communication', 'Court Communication', 'Opposing Counsel', 
      'Internal', 'Administrative', 'Marketing', 'Billing', 'Other'
    ],
    required: true,
    index: true
  },
  subCategory: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Practice Area
  practiceArea: {
    type: String,
    trim: true,
    maxlength: 100,
    index: true
  },
  
  // Template Content
  subject: {
    type: String,
    trim: true,
    maxlength: 500
  },
  body: {
    type: String,
    required: true
  },
  bodyFormat: {
    type: String,
    enum: ['Plain Text', 'Rich Text', 'HTML', 'Markdown'],
    default: 'Rich Text'
  },
  
  // Variables & Placeholders
  variables: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Text', 'Number', 'Date', 'Email', 'Phone', 'Address', 'Select', 'Multiline', 'Boolean'],
      default: 'Text'
    },
    description: String,
    defaultValue: String,
    required: {
      type: Boolean,
      default: false
    },
    options: [String],
    validation: {
      pattern: String,
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number
    }
  }],
  
  // Attachments
  defaultAttachments: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentTemplate'
    },
    filename: String,
    description: String,
    required: {
      type: Boolean,
      default: false
    }
  }],
  
  // Template Settings
  settings: {
    requiresApproval: {
      type: Boolean,
      default: false
    },
    approvalRequired: {
      type: Boolean,
      default: false
    },
    isConfidential: {
      type: Boolean,
      default: false
    },
    includeSignature: {
      type: Boolean,
      default: true
    },
    includeDisclaimer: {
      type: Boolean,
      default: false
    },
    disclaimerText: String,
    trackOpens: {
      type: Boolean,
      default: false
    },
    trackClicks: {
      type: Boolean,
      default: false
    }
  },
  
  // Email Specific Settings
  emailSettings: {
    fromName: String,
    fromEmail: String,
    replyTo: String,
    cc: [String],
    bcc: [String],
    priority: {
      type: String,
      enum: ['Low', 'Normal', 'High'],
      default: 'Normal'
    }
  },
  
  // Letter Specific Settings
  letterSettings: {
    letterhead: {
      type: Boolean,
      default: true
    },
    header: String,
    footer: String,
    format: {
      type: String,
      enum: ['Business Letter', 'Legal Letter', 'Formal', 'Informal'],
      default: 'Business Letter'
    },
    includeDate: {
      type: Boolean,
      default: true
    },
    includeAddress: {
      type: Boolean,
      default: true
    }
  },
  
  // Usage & Statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedAt: Date,
  lastUsedBy: String,
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  previousVersionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunicationTemplate'
  },
  versionHistory: [{
    version: Number,
    changes: String,
    modifiedBy: String,
    modifiedAt: Date
  }],
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Archived', 'Deprecated'],
    default: 'Active',
    index: true
  },
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Team', 'Department', 'Organization'],
    default: 'Organization',
    index: true
  },
  
  // Sharing & Permissions
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    permission: {
      type: String,
      enum: ['View', 'Use', 'Edit', 'Full Access'],
      default: 'Use'
    }
  }],
  
  // Organization
  tags: [String],
  keywords: [String],
  
  // Compliance & Legal
  requiresCompliance: {
    type: Boolean,
    default: false
  },
  complianceNotes: String,
  jurisdiction: String,
  effectiveDate: Date,
  expiryDate: Date,
  
  // Ratings & Feedback
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  
  // Favorites
  favoritedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    favoritedAt: {
      type: Date,
      default: Date.now
    }
  }],
  favoriteCount: {
    type: Number,
    default: 0
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
  updatedAt: {
    type: Date,
    default: Date.now
  },
  modifiedBy: String,
  archivedBy: String,
  archivedAt: Date
}, {
  timestamps: true
});

// Indexes for performance
communicationTemplateSchema.index({ templateType: 1, category: 1 });
communicationTemplateSchema.index({ practiceArea: 1, status: 1 });
communicationTemplateSchema.index({ visibility: 1, status: 1 });
communicationTemplateSchema.index({ usageCount: -1 });
communicationTemplateSchema.index({ name: 'text', description: 'text', body: 'text' });

// Static method: Find templates by type
communicationTemplateSchema.statics.findByType = function(templateType, status = 'Active') {
  return this.find({ 
    templateType,
    status
  }).sort({ name: 1 });
};

// Static method: Find templates by category
communicationTemplateSchema.statics.findByCategory = function(category, status = 'Active') {
  return this.find({ 
    category,
    status
  }).sort({ name: 1 });
};

// Static method: Find popular templates
communicationTemplateSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'Active' })
    .sort({ usageCount: -1 })
    .limit(limit);
};

// Static method: Search templates
communicationTemplateSchema.statics.searchTemplates = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    status: 'Active'
  };
  
  if (filters.templateType) searchQuery.templateType = filters.templateType;
  if (filters.category) searchQuery.category = filters.category;
  if (filters.practiceArea) searchQuery.practiceArea = filters.practiceArea;
  if (filters.visibility) searchQuery.visibility = filters.visibility;
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// Instance method: Increment usage
communicationTemplateSchema.methods.incrementUsage = function(usedBy) {
  this.usageCount += 1;
  this.lastUsedAt = new Date();
  this.lastUsedBy = usedBy;
  return this.save();
};

// Instance method: Create new version
communicationTemplateSchema.methods.createNewVersion = async function(updates, modifiedBy) {
  // Mark current as not latest
  this.isLatestVersion = false;
  await this.save();
  
  // Create new version
  const newVersion = new this.constructor({
    ...this.toObject(),
    _id: mongoose.Types.ObjectId(),
    version: this.version + 1,
    previousVersionId: this._id,
    isLatestVersion: true,
    ...updates,
    modifiedBy,
    updatedAt: new Date()
  });
  
  await newVersion.save();
  
  return newVersion;
};

// Instance method: Add to favorites
communicationTemplateSchema.methods.addToFavorites = function(userId, username) {
  const existing = this.favoritedBy.find(f => f.userId && f.userId.equals(userId));
  
  if (!existing) {
    this.favoritedBy.push({
      userId,
      username,
      favoritedAt: new Date()
    });
    this.favoriteCount += 1;
  }
  
  return this.save();
};

// Instance method: Archive template
communicationTemplateSchema.methods.archiveTemplate = function(archivedBy) {
  this.status = 'Archived';
  this.archivedBy = archivedBy;
  this.archivedAt = new Date();
  return this.save();
};

const CommunicationTemplate = mongoose.model('CommunicationTemplate', communicationTemplateSchema);

module.exports = CommunicationTemplate;
