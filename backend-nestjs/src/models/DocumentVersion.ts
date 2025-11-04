/**
 * DocumentVersion Model - Mongoose Schema for Document Version Tracking
 * Tracks document versions with comparison and rollback capabilities
 */

import mongoose from 'mongoose';

const documentVersionSchema = new mongoose.Schema({
  // Version Identification
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    index: true
  },
  documentNumber: {
    type: String,
    required: true,
    index: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  
  // Version Metadata
  changeType: {
    type: String,
    enum: ['Minor Edit', 'Major Revision', 'Content Update', 'Format Change', 'Correction', 'Review Update'],
    default: 'Minor Edit'
  },
  changeDescription: {
    type: String,
    trim: true
  },
  changeSummary: {
    type: String,
    trim: true
  },
  
  // File Information (snapshot at this version)
  filename: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  checksum: {
    type: String
  },
  storagePath: {
    type: String
  },
  
  // Comparison Data
  previousVersionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentVersion'
  },
  changesFromPrevious: {
    addedLines: Number,
    removedLines: Number,
    modifiedSections: [String],
    totalChanges: Number
  },
  
  // Content Changes (for text documents)
  contentDiff: {
    type: String  // Stores diff in unified diff format
  },
  
  // Annotations & Comments
  annotations: [{
    text: String,
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reviewComments: [{
    comment: String,
    reviewedBy: String,
    reviewedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Approved', 'Rejected', 'Needs Revision']
    }
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isCurrent: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Audit Information
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  restoredFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentVersion'
  }
}, {
  timestamps: true
});

// Compound indexes
documentVersionSchema.index({ documentId: 1, versionNumber: 1 }, { unique: true });
documentVersionSchema.index({ documentNumber: 1, versionNumber: -1 });
documentVersionSchema.index({ documentId: 1, createdAt: -1 });

// Static method to get version history for a document
documentVersionSchema.statics.getVersionHistory = function(documentId) {
  return this.find({ documentId })
    .sort({ versionNumber: -1 })
    .populate('previousVersionId', 'versionNumber filename createdBy createdAt');
};

// Static method to compare two versions
documentVersionSchema.statics.compareVersions = async function(version1Id, version2Id) {
  const [v1, v2] = await Promise.all([
    this.findById(version1Id),
    this.findById(version2Id)
  ]);
  
  if (!v1 || !v2) {
    throw new Error('One or both versions not found');
  }
  
  return {
    version1: {
      versionNumber: v1.versionNumber,
      filename: v1.filename,
      fileSize: v1.fileSize,
      createdBy: v1.createdBy,
      createdAt: v1.createdAt
    },
    version2: {
      versionNumber: v2.versionNumber,
      filename: v2.filename,
      fileSize: v2.fileSize,
      createdBy: v2.createdBy,
      createdAt: v2.createdAt
    },
    differences: {
      fileSize: v2.fileSize - v1.fileSize,
      daysApart: Math.ceil((v2.createdAt - v1.createdAt) / (1000 * 60 * 60 * 24)),
      contentDiff: v2.contentDiff
    }
  };
};

// Instance method to add annotation
documentVersionSchema.methods.addAnnotation = function(text, createdBy) {
  this.annotations.push({
    text,
    createdBy,
    createdAt: new Date()
  });
  return this.save();
};

// Instance method to add review comment
documentVersionSchema.methods.addReviewComment = function(comment, reviewedBy, status) {
  this.reviewComments.push({
    comment,
    reviewedBy,
    status,
    reviewedAt: new Date()
  });
  return this.save();
};

export default mongoose.model('DocumentVersion', documentVersionSchema);
