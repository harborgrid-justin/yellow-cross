/**
 * Document Model - Mongoose Schema for Document Management System
 * Comprehensive data model for legal document management
 */

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  // Basic Information
  documentNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  filename: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // File Details
  fileType: {
    type: String,
    required: true,
    trim: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  
  // Storage Information
  storagePath: {
    type: String,
    trim: true
  },
  cloudUrl: {
    type: String,
    trim: true
  },
  checksum: {
    type: String,
    trim: true
  },
  
  // Organization & Classification
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'
  },
  folderPath: {
    type: String,
    trim: true,
    default: '/'
  },
  category: {
    type: String,
    trim: true,
    enum: ['Pleadings', 'Contracts', 'Evidence', 'Correspondence', 'Research', 'Court Filings', 'Discovery', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  isLatestVersion: {
    type: Boolean,
    default: true,
    index: true
  },
  parentVersionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  versionHistory: [{
    versionNumber: Number,
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    createdBy: String,
    createdAt: Date,
    changeDescription: String
  }],
  
  // Metadata
  customMetadata: {
    type: Map,
    of: String
  },
  extractedText: {
    type: String
  },
  pageCount: {
    type: Number
  },
  
  // Relations
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: {
    type: String,
    index: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  relatedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  
  // Access Control & Security
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Team Only', 'Client Visible'],
    default: 'Team Only'
  },
  permissions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    role: {
      type: String,
      enum: ['Owner', 'Editor', 'Viewer', 'Reviewer']
    },
    grantedBy: String,
    grantedAt: Date
  }],
  encrypted: {
    type: Boolean,
    default: false
  },
  encryptionKey: {
    type: String
  },
  watermarked: {
    type: Boolean,
    default: false
  },
  accessLog: [{
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String
  }],
  
  // Collaboration
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedBy: {
    type: String
  },
  lockedAt: {
    type: Date
  },
  checkoutBy: {
    type: String
  },
  checkoutAt: {
    type: Date
  },
  
  // Status & Flags
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Archived', 'Deleted'],
    default: 'Active',
    index: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  
  // Template Information (if document is a template)
  isTemplate: {
    type: Boolean,
    default: false,
    index: true
  },
  templateCategory: {
    type: String,
    enum: ['Legal Document', 'Contract', 'Pleading', 'Motion', 'Brief', 'Form', 'Letter', 'Other']
  },
  templateVariables: [{
    name: String,
    type: String,
    description: String,
    required: Boolean,
    defaultValue: String
  }],
  practiceArea: {
    type: String,
    trim: true
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
    type: String,
    trim: true
  },
  lastModifiedAt: {
    type: Date
  },
  lastAccessedAt: {
    type: Date
  },
  archivedBy: {
    type: String
  },
  archivedAt: {
    type: Date
  },
  deletedBy: {
    type: String
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
documentSchema.index({ filename: 'text', title: 'text', description: 'text', extractedText: 'text' });
documentSchema.index({ caseId: 1, status: 1 });
documentSchema.index({ category: 1, status: 1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ createdBy: 1, createdAt: -1 });
documentSchema.index({ folderPath: 1 });
documentSchema.index({ isTemplate: 1, templateCategory: 1 });

// Virtual field for file size in human-readable format
documentSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual field for days since creation
documentSchema.virtual('daysSinceCreation').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Static method to find documents by case
documentSchema.statics.findByCase = function(caseId) {
  return this.find({ caseId, status: { $ne: 'Deleted' } })
    .sort({ createdAt: -1 });
};

// Static method to find documents by category
documentSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'Active', isLatestVersion: true })
    .sort({ createdAt: -1 });
};

// Static method to find templates
documentSchema.statics.findTemplates = function(filters = {}) {
  const query = { isTemplate: true, status: 'Active', isLatestVersion: true };
  if (filters.templateCategory) {
    query.templateCategory = filters.templateCategory;
  }
  if (filters.practiceArea) {
    query.practiceArea = filters.practiceArea;
  }
  return this.find(query).sort({ title: 1 });
};

// Static method to search documents
documentSchema.statics.searchDocuments = function(searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm },
    status: { $ne: 'Deleted' },
    isLatestVersion: true
  };
  
  if (filters.caseId) query.caseId = filters.caseId;
  if (filters.category) query.category = filters.category;
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  if (filters.createdBy) query.createdBy = filters.createdBy;
  if (filters.dateFrom || filters.dateTo) {
    query.createdAt = {};
    if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
  }
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// Instance method to create new version
documentSchema.methods.createNewVersion = async function(newFileData, createdBy, changeDescription) {
  // Mark current document as not latest version
  this.isLatestVersion = false;
  await this.save();
  
  // Create new version document
  const newVersion = new this.constructor({
    ...newFileData,
    documentNumber: this.documentNumber,
    version: this.version + 1,
    parentVersionId: this._id,
    isLatestVersion: true,
    versionHistory: [
      ...this.versionHistory,
      {
        versionNumber: this.version,
        documentId: this._id,
        createdBy: this.createdBy,
        createdAt: this.createdAt,
        changeDescription: this.description
      }
    ],
    createdBy,
    createdAt: new Date()
  });
  
  // Add change description to version history
  if (changeDescription) {
    newVersion.versionHistory[newVersion.versionHistory.length - 1].changeDescription = changeDescription;
  }
  
  await newVersion.save();
  return newVersion;
};

// Instance method to log access
documentSchema.methods.logAccess = function(userId, username, action, ipAddress) {
  this.accessLog.push({
    userId,
    username,
    action,
    timestamp: new Date(),
    ipAddress
  });
  this.lastAccessedAt = new Date();
  return this.save();
};

// Instance method to grant permission
documentSchema.methods.grantPermission = function(userId, username, role, grantedBy) {
  // Remove existing permission for this user if any
  this.permissions = this.permissions.filter(p => p.userId?.toString() !== userId);
  
  // Add new permission
  this.permissions.push({
    userId,
    username,
    role,
    grantedBy,
    grantedAt: new Date()
  });
  
  this.lastModifiedBy = grantedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to archive document
documentSchema.methods.archiveDocument = function(archivedBy) {
  this.status = 'Archived';
  this.archivedBy = archivedBy;
  this.archivedAt = new Date();
  this.lastModifiedBy = archivedBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Pre-save middleware to update lastModifiedAt
documentSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Document', documentSchema);
