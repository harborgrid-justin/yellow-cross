/**
 * CourtDocument Model - Mongoose Schema for Court Document Retrieval
 * Manages court documents, orders, filings, and retrieval tracking
 */

const mongoose = require('mongoose');

const courtDocumentSchema = new mongoose.Schema({
  // Document Identification
  documentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  courtSystemId: String,
  pacerDocumentId: String,
  
  // Court & Case Information
  courtName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  caseNumber: {
    type: String,
    required: true,
    index: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  docketNumber: String,
  docketEntryNumber: Number,
  
  // Document Details
  documentTitle: {
    type: String,
    required: true,
    trim: true
  },
  documentType: {
    type: String,
    required: true,
    enum: [
      'Motion',
      'Order',
      'Brief',
      'Pleading',
      'Notice',
      'Declaration',
      'Exhibit',
      'Transcript',
      'Judgment',
      'Opinion',
      'Minute Entry',
      'Correspondence',
      'Stipulation',
      'Response',
      'Reply',
      'Petition',
      'Complaint',
      'Answer',
      'Other'
    ],
    index: true
  },
  documentSubType: String,
  documentDescription: String,
  
  // Filing Information
  filingDate: {
    type: Date,
    required: true,
    index: true
  },
  filedBy: {
    type: String,
    trim: true
  },
  filingParty: {
    type: String,
    enum: ['Plaintiff', 'Defendant', 'Court', 'Petitioner', 'Respondent', 'Third Party', 'Other']
  },
  attorneyName: String,
  firmName: String,
  
  // Document Content
  pageCount: Number,
  wordCount: Number,
  extractedText: String,
  summary: String,
  keyPoints: [String],
  
  // File Information
  fileName: String,
  fileSize: Number,
  fileType: {
    type: String,
    enum: ['PDF', 'DOCX', 'DOC', 'TXT', 'HTML', 'Image', 'Other']
  },
  mimeType: String,
  
  // Storage & Access
  storageLocation: String,
  fileUrl: String,
  downloadUrl: String,
  viewUrl: String,
  
  // Local Storage
  localPath: String,
  localStorageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  isStored: {
    type: Boolean,
    default: false
  },
  
  // Access Control
  accessLevel: {
    type: String,
    required: true,
    enum: ['Public', 'Restricted', 'Sealed', 'Confidential'],
    default: 'Public',
    index: true
  },
  isSealed: {
    type: Boolean,
    default: false,
    index: true
  },
  sealedReason: String,
  sealedDate: Date,
  
  // Retrieval Information
  retrievedDate: Date,
  retrievedBy: String,
  retrievalSource: {
    type: String,
    enum: ['PACER', 'State System', 'Court Website', 'Manual Upload', 'API', 'Email', 'Other']
  },
  retrievalCost: Number,
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Retrieved', 'Downloading', 'Downloaded', 'Unavailable', 'Error', 'Pending'],
    default: 'Available',
    index: true
  },
  
  // Versions
  version: {
    type: Number,
    default: 1
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  previousVersions: [{
    version: Number,
    documentId: String,
    fileUrl: String,
    archivedAt: Date
  }],
  
  // Related Documents
  relatedDocuments: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourtDocument'
    },
    relationshipType: {
      type: String,
      enum: ['Attachment', 'Exhibit', 'Response to', 'Reply to', 'Amendment', 'Supersedes', 'Related']
    },
    description: String
  }],
  
  // Attachments & Exhibits
  attachments: [{
    attachmentNumber: Number,
    attachmentTitle: String,
    fileName: String,
    fileSize: Number,
    fileUrl: String,
    pageCount: Number
  }],
  
  // OCR & Processing
  ocrCompleted: {
    type: Boolean,
    default: false
  },
  ocrDate: Date,
  ocrQuality: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Not Available']
  },
  textSearchable: {
    type: Boolean,
    default: false
  },
  
  // Review & Analysis
  reviewed: {
    type: Boolean,
    default: false
  },
  reviewedBy: String,
  reviewedDate: Date,
  reviewNotes: String,
  
  importance: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  
  // Tags & Categories
  tags: [{
    type: String,
    trim: true
  }],
  category: String,
  keywords: [String],
  
  // Bookmarks & Favorites
  bookmarkedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookmarkedAt: Date
  }],
  
  // Usage Statistics
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastViewedDate: Date,
  lastDownloadedDate: Date,
  
  // Citations & References
  citedIn: [{
    documentId: String,
    documentTitle: String,
    citationContext: String
  }],
  citesTo: [{
    documentId: String,
    documentTitle: String,
    citationContext: String
  }],
  
  // Legal Analysis
  legalIssues: [String],
  holdings: [String],
  outcome: String,
  
  // Notification
  notifyOnUpdate: {
    type: Boolean,
    default: false
  },
  notificationRecipients: [String],
  
  // Error Handling
  retrievalErrors: [{
    errorDate: Date,
    errorMessage: String,
    errorType: String
  }],
  
  // Metadata
  customFields: mongoose.Schema.Types.Mixed,
  notes: String,
  
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
  lastModifiedBy: String,
  lastModifiedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courtDocumentSchema.index({ documentId: 1 });
courtDocumentSchema.index({ caseNumber: 1, filingDate: -1 });
courtDocumentSchema.index({ courtName: 1, documentType: 1 });
courtDocumentSchema.index({ status: 1, accessLevel: 1 });
courtDocumentSchema.index({ filedBy: 1 });
courtDocumentSchema.index({ tags: 1 });
courtDocumentSchema.index({ keywords: 1 });
courtDocumentSchema.index({ documentTitle: 'text', extractedText: 'text', summary: 'text' });

// Virtual field for attachment count
courtDocumentSchema.virtual('attachmentCount').get(function() {
  return this.attachments ? this.attachments.length : 0;
});

// Virtual field for file size in MB
courtDocumentSchema.virtual('fileSizeMB').get(function() {
  if (!this.fileSize) return 0;
  return (this.fileSize / (1024 * 1024)).toFixed(2);
});

// Virtual field for days since filing
courtDocumentSchema.virtual('daysSinceFiling').get(function() {
  if (!this.filingDate) return null;
  const diff = Date.now() - this.filingDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Static method to find by case
courtDocumentSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.find({ caseNumber }).sort({ filingDate: -1 });
};

// Static method to find by document type
courtDocumentSchema.statics.findByType = function(caseNumber, documentType) {
  return this.find({
    caseNumber,
    documentType
  }).sort({ filingDate: -1 });
};

// Static method to search documents
courtDocumentSchema.statics.searchDocuments = function(searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm }
  };
  
  if (filters.caseNumber) query.caseNumber = filters.caseNumber;
  if (filters.documentType) query.documentType = filters.documentType;
  if (filters.courtName) query.courtName = filters.courtName;
  if (filters.accessLevel) query.accessLevel = filters.accessLevel;
  
  return this.find(query)
    .sort({ score: { $meta: 'textScore' } })
    .limit(50);
};

// Static method to find recent documents
courtDocumentSchema.statics.findRecent = function(days = 7) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    filingDate: { $gte: cutoffDate }
  }).sort({ filingDate: -1 });
};

// Instance method to download document
courtDocumentSchema.methods.recordDownload = function(downloadedBy) {
  this.downloadCount += 1;
  this.lastDownloadedDate = new Date();
  
  if (!this.retrievedDate) {
    this.retrievedDate = new Date();
    this.retrievedBy = downloadedBy;
    this.status = 'Downloaded';
  }
  
  return this.save();
};

// Instance method to view document
courtDocumentSchema.methods.recordView = function() {
  this.viewCount += 1;
  this.lastViewedDate = new Date();
  
  return this.save();
};

// Instance method to add bookmark
courtDocumentSchema.methods.addBookmark = function(userId) {
  if (!this.bookmarkedBy.some(b => b.userId && b.userId.equals(userId))) {
    this.bookmarkedBy.push({
      userId,
      bookmarkedAt: new Date()
    });
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to mark as reviewed
courtDocumentSchema.methods.markAsReviewed = function(reviewedBy, notes) {
  this.reviewed = true;
  this.reviewedBy = reviewedBy;
  this.reviewedDate = new Date();
  this.reviewNotes = notes;
  
  return this.save();
};

// Instance method to extract text
courtDocumentSchema.methods.performOCR = function(extractedText, quality) {
  this.extractedText = extractedText;
  this.ocrCompleted = true;
  this.ocrDate = new Date();
  this.ocrQuality = quality;
  this.textSearchable = true;
  
  return this.save();
};

module.exports = mongoose.model('CourtDocument', courtDocumentSchema);
