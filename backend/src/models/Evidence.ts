/**
 * Evidence Model - Mongoose Schema for Evidence Collection & Preservation
 * Comprehensive data model for digital evidence management with chain of custody
 */

import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  // Basic Information
  evidenceNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
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
  
  // Evidence Details
  evidenceType: {
    type: String,
    required: true,
    enum: ['Email', 'Document', 'Database', 'System Files', 'Social Media', 'Audio', 'Video', 'Image', 'Mobile Device', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  sourceSystem: {
    type: String,
    trim: true
  },
  
  // Collection Information
  collectionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  collectionMethod: {
    type: String,
    enum: ['Forensic Imaging', 'Live Collection', 'Network Capture', 'Cloud Export', 'Manual Collection', 'Other']
  },
  custodian: {
    type: String,
    required: true
  },
  custodianEmail: {
    type: String
  },
  custodianDepartment: {
    type: String
  },
  
  // Storage & Location
  storagePath: {
    type: String
  },
  storageLocation: {
    type: String
  },
  fileSize: {
    type: Number // in bytes
  },
  checksum: {
    type: String // MD5 or SHA-256 hash
  },
  
  // Chain of Custody
  chainOfCustody: [{
    action: {
      type: String,
      required: true,
      enum: ['Collected', 'Transferred', 'Processed', 'Reviewed', 'Produced', 'Archived', 'Deleted']
    },
    performedBy: {
      type: String,
      required: true
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    location: String,
    notes: String,
    signature: String
  }],
  
  // Preservation Status
  preservationStatus: {
    type: String,
    enum: ['Collected', 'Preserved', 'Verified', 'Processed', 'Ready for Review'],
    default: 'Collected'
  },
  preservationDate: {
    type: Date,
    default: Date.now
  },
  verificationDate: Date,
  verifiedBy: String,
  
  // Processing Information
  processed: {
    type: Boolean,
    default: false
  },
  processingDate: Date,
  processedBy: String,
  extractedText: String,
  metadata: {
    type: Map,
    of: String
  },
  
  // Legal Hold
  legalHoldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalHold'
  },
  onLegalHold: {
    type: Boolean,
    default: false,
    index: true
  },
  legalHoldDate: Date,
  
  // Tagging & Classification
  tags: [{
    type: String,
    trim: true
  }],
  relevance: {
    type: String,
    enum: ['Relevant', 'Potentially Relevant', 'Not Relevant', 'Privileged', 'Pending Review'],
    default: 'Pending Review'
  },
  confidentialityLevel: {
    type: String,
    enum: ['Public', 'Internal', 'Confidential', 'Highly Confidential'],
    default: 'Internal'
  },
  
  // Production Information
  producedInSet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Production'
  },
  batesNumber: String,
  productionDate: Date,
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Deleted', 'Expired'],
    default: 'Active',
    index: true
  },
  
  // Audit & Metadata
  collectedBy: {
    type: String,
    required: true
  },
  notes: String,
  retentionDate: Date
}, {
  timestamps: true
});

// Indexes for performance
evidenceSchema.index({ caseId: 1, status: 1 });
evidenceSchema.index({ custodian: 1 });
evidenceSchema.index({ collectionDate: -1 });
evidenceSchema.index({ evidenceType: 1, relevance: 1 });
evidenceSchema.index({ onLegalHold: 1, status: 1 });
evidenceSchema.index({ tags: 1 });

// Virtual field for evidence age
evidenceSchema.virtual('evidenceAge').get(function() {
  const now = new Date();
  const collected = this.collectionDate;
  const diffTime = Math.abs(now - collected);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Static method to find evidence by case
evidenceSchema.statics.findByCaseId = function(caseId, status = 'Active') {
  return this.find({ caseId, status }).sort({ collectionDate: -1 });
};

// Static method to find evidence by custodian
evidenceSchema.statics.findByCustodian = function(custodian) {
  return this.find({ custodian, status: 'Active' }).sort({ collectionDate: -1 });
};

// Instance method to add chain of custody entry
evidenceSchema.methods.addCustodyEntry = function(action, performedBy, notes = '') {
  this.chainOfCustody.push({
    action,
    performedBy,
    performedAt: new Date(),
    notes
  });
  return this.save();
};

// Instance method to place on legal hold
evidenceSchema.methods.placeLegalHold = function(legalHoldId, placedBy) {
  this.onLegalHold = true;
  this.legalHoldId = legalHoldId;
  this.legalHoldDate = new Date();
  this.chainOfCustody.push({
    action: 'Legal Hold Applied',
    performedBy: placedBy,
    performedAt: new Date(),
    notes: `Legal Hold ID: ${legalHoldId}`
  });
  return this.save();
};

export default mongoose.model('Evidence', evidenceSchema);
