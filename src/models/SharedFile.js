/**
 * SharedFile Model - Mongoose Schema for File Sharing
 * Tracks shared files with access controls and download tracking
 */

const mongoose = require('mongoose');

const sharedFileSchema = new mongoose.Schema({
  // File Identification
  fileId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  shareId: {
    type: String,
    unique: true,
    index: true
  },
  
  // File Information
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  mimeType: String,
  fileSize: {
    type: Number,
    required: true
  },
  fileExtension: String,
  
  // Storage
  storagePath: {
    type: String,
    required: true
  },
  storageProvider: {
    type: String,
    enum: ['Local', 'S3', 'Azure', 'Google Cloud', 'Other'],
    default: 'Local'
  },
  checksum: String,
  
  // Sharing Details
  shareType: {
    type: String,
    enum: ['Internal', 'External', 'Client', 'Public Link', 'Private'],
    default: 'Internal',
    index: true
  },
  shareLink: String,
  sharePassword: String,
  requiresPassword: {
    type: Boolean,
    default: false
  },
  
  // Owner Information
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Access Control
  accessControl: {
    type: String,
    enum: ['Private', 'Team', 'Organization', 'Public', 'Custom'],
    default: 'Team',
    index: true
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    email: String,
    permission: {
      type: String,
      enum: ['View', 'Download', 'Edit', 'Full Access'],
      default: 'View'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }],
  
  // Team/Group Sharing
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  teamName: String,
  
  // Case/Matter Association
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: {
    type: String,
    index: true
  },
  
  // Document Association
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  
  // Expiration & Time Limits
  expiresAt: {
    type: Date,
    index: true
  },
  isExpired: {
    type: Boolean,
    default: false
  },
  maxDownloads: Number,
  downloadCount: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Revoked', 'Deleted'],
    default: 'Active',
    index: true
  },
  
  // Download Tracking
  downloads: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    ipAddress: String,
    userAgent: String,
    downloadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastDownloadedAt: Date,
  
  // View Tracking
  views: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    ipAddress: String,
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  lastViewedAt: Date,
  
  // Notifications
  notifyOnDownload: {
    type: Boolean,
    default: false
  },
  notifyOnView: {
    type: Boolean,
    default: false
  },
  notifyOnExpiry: {
    type: Boolean,
    default: true
  },
  
  // Security
  isEncrypted: {
    type: Boolean,
    default: false
  },
  isVirusScanned: {
    type: Boolean,
    default: false
  },
  virusScanStatus: {
    type: String,
    enum: ['Pending', 'Clean', 'Infected', 'Failed'],
    default: 'Pending'
  },
  isConfidential: {
    type: Boolean,
    default: false
  },
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  previousVersionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SharedFile'
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  tags: [String],
  category: String,
  
  // Comments & Collaboration
  comments: [{
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    comment: String,
    commentedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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
  deletedBy: String,
  deletedAt: Date,
  revokedBy: String,
  revokedAt: Date
}, {
  timestamps: true
});

// Indexes for performance
sharedFileSchema.index({ ownerId: 1, createdAt: -1 });
sharedFileSchema.index({ caseId: 1, createdAt: -1 });
sharedFileSchema.index({ status: 1, expiresAt: 1 });
sharedFileSchema.index({ 'sharedWith.userId': 1 });
sharedFileSchema.index({ shareType: 1, status: 1 });

// Pre-save hook to check expiration
sharedFileSchema.pre('save', function(next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.isExpired = true;
    this.status = 'Expired';
  }
  
  if (this.maxDownloads && this.downloadCount >= this.maxDownloads) {
    this.status = 'Expired';
  }
  
  next();
});

// Static method: Find files by user (owned or shared)
sharedFileSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { ownerId: userId },
      { 'sharedWith.userId': userId }
    ],
    status: 'Active'
  }).sort({ createdAt: -1 });
};

// Static method: Find files by case
sharedFileSchema.statics.findByCase = function(caseId) {
  return this.find({ 
    caseId,
    status: 'Active'
  }).sort({ createdAt: -1 });
};

// Static method: Find expiring files
sharedFileSchema.statics.findExpiring = function(days = 7) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    expiresAt: { $gte: now, $lte: futureDate },
    status: 'Active'
  }).sort({ expiresAt: 1 });
};

// Instance method: Track download
sharedFileSchema.methods.trackDownload = function(userId, username, ipAddress, userAgent) {
  this.downloads.push({
    userId,
    username,
    ipAddress,
    userAgent,
    downloadedAt: new Date()
  });
  
  this.downloadCount += 1;
  this.lastDownloadedAt = new Date();
  
  // Check if max downloads reached
  if (this.maxDownloads && this.downloadCount >= this.maxDownloads) {
    this.status = 'Expired';
  }
  
  return this.save();
};

// Instance method: Track view
sharedFileSchema.methods.trackView = function(userId, username, ipAddress) {
  this.views.push({
    userId,
    username,
    ipAddress,
    viewedAt: new Date()
  });
  
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  
  return this.save();
};

// Instance method: Revoke access
sharedFileSchema.methods.revokeAccess = function(revokedBy) {
  this.status = 'Revoked';
  this.revokedBy = revokedBy;
  this.revokedAt = new Date();
  return this.save();
};

const SharedFile = mongoose.model('SharedFile', sharedFileSchema);

module.exports = SharedFile;
