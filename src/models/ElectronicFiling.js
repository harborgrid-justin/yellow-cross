/**
 * ElectronicFiling Model - Mongoose Schema for Electronic Filing (e-Filing)
 * Manages electronic court filings, submissions, and receipts
 */

const mongoose = require('mongoose');

const electronicFilingSchema = new mongoose.Schema({
  // Filing Identification
  filingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  confirmationNumber: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  
  // Court & Case Information
  courtName: {
    type: String,
    required: true,
    trim: true
  },
  courtSystem: {
    type: String,
    required: true,
    enum: ['Federal', 'State', 'CM/ECF', 'Tyler Technologies', 'Other']
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
  
  // Filing Details
  filingType: {
    type: String,
    required: true,
    enum: ['Motion', 'Brief', 'Pleading', 'Notice', 'Order', 'Declaration', 'Exhibit', 'Response', 'Reply', 'Other']
  },
  documentTitle: {
    type: String,
    required: true,
    trim: true
  },
  documentCategory: String,
  filingParty: {
    type: String,
    required: true,
    enum: ['Plaintiff', 'Defendant', 'Petitioner', 'Respondent', 'Intervenor', 'Amicus', 'Third Party']
  },
  
  // Documents
  documents: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    fileName: {
      type: String,
      required: true
    },
    fileSize: Number,
    fileType: String,
    documentType: {
      type: String,
      enum: ['Lead Document', 'Attachment', 'Exhibit', 'Supporting Document']
    },
    pageCount: Number,
    uploadedAt: Date
  }],
  
  // Filing Status
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'Pending Validation', 'Validation Failed', 'Ready to File', 'Filing in Progress', 'Filed', 'Rejected', 'Cancelled'],
    default: 'Draft',
    index: true
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Validation
  validationStatus: {
    type: String,
    enum: ['Not Validated', 'Passed', 'Failed', 'Warning'],
    default: 'Not Validated'
  },
  validationErrors: [{
    field: String,
    message: String,
    severity: {
      type: String,
      enum: ['Error', 'Warning', 'Info']
    }
  }],
  validatedAt: Date,
  
  // Filing Submission
  submittedAt: Date,
  submittedBy: String,
  submittedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Filing Receipt
  filedAt: Date,
  receiptUrl: String,
  receiptDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  stampedDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  
  // Rejection Details
  rejectedAt: Date,
  rejectionReason: String,
  rejectionNotes: String,
  
  // Attorney Information
  attorneyName: {
    type: String,
    required: true,
    trim: true
  },
  attorneyBarNumber: String,
  firmName: String,
  attorneyEmail: String,
  attorneyPhone: String,
  
  // Service Information
  serviceMethods: [{
    recipient: String,
    recipientType: String,
    serviceMethod: {
      type: String,
      enum: ['Electronic', 'Mail', 'Hand Delivery', 'Certified Mail']
    },
    servedAt: Date,
    confirmationReceived: Boolean
  }],
  
  // Fees
  filingFee: {
    type: Number,
    default: 0
  },
  feeWaiver: {
    type: Boolean,
    default: false
  },
  feeStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Waived', 'Deferred'],
    default: 'Pending'
  },
  paymentMethod: String,
  paymentConfirmation: String,
  paidAt: Date,
  
  // Technical Details
  submissionFormat: {
    type: String,
    enum: ['PDF', 'DOCX', 'HTML', 'XML'],
    default: 'PDF'
  },
  totalFileSize: Number,
  totalPageCount: Number,
  
  // Integration & Tracking
  externalSystemId: String,
  integrationStatus: String,
  apiResponse: mongoose.Schema.Types.Mixed,
  
  // Notifications
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  notificationRecipients: [String],
  notificationsSent: [{
    type: {
      type: String,
      enum: ['Filed', 'Rejected', 'Receipt', 'Status Change']
    },
    sentAt: Date,
    recipients: [String]
  }],
  
  // Additional Information
  urgentFiling: {
    type: Boolean,
    default: false
  },
  confidential: {
    type: Boolean,
    default: false
  },
  sealedFiling: {
    type: Boolean,
    default: false
  },
  notes: String,
  tags: [String],
  
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
electronicFilingSchema.index({ filingId: 1 });
electronicFilingSchema.index({ caseNumber: 1, status: 1 });
electronicFilingSchema.index({ status: 1, submittedAt: -1 });
electronicFilingSchema.index({ attorneyBarNumber: 1 });
electronicFilingSchema.index({ tags: 1 });

// Virtual field for document count
electronicFilingSchema.virtual('documentCount').get(function() {
  return this.documents ? this.documents.length : 0;
});

// Virtual field for is pending
electronicFilingSchema.virtual('isPending').get(function() {
  return ['Draft', 'Pending Validation', 'Ready to File', 'Filing in Progress'].includes(this.status);
});

// Static method to find by case
electronicFilingSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.find({ caseNumber }).sort({ createdAt: -1 });
};

// Static method to find pending filings
electronicFilingSchema.statics.findPending = function() {
  return this.find({
    status: { $in: ['Draft', 'Pending Validation', 'Ready to File', 'Filing in Progress'] }
  }).sort({ createdAt: -1 });
};

// Static method to find by status
electronicFilingSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Instance method to validate filing
electronicFilingSchema.methods.validateFiling = function(validatedBy) {
  const errors = [];
  
  // Check required documents
  if (!this.documents || this.documents.length === 0) {
    errors.push({
      field: 'documents',
      message: 'At least one document is required',
      severity: 'Error'
    });
  }
  
  // Check attorney information
  if (!this.attorneyBarNumber) {
    errors.push({
      field: 'attorneyBarNumber',
      message: 'Attorney bar number is required',
      severity: 'Error'
    });
  }
  
  this.validationErrors = errors;
  this.validationStatus = errors.filter(e => e.severity === 'Error').length > 0 ? 'Failed' : 'Passed';
  this.validatedAt = new Date();
  
  if (this.validationStatus === 'Passed') {
    this.status = 'Ready to File';
  } else {
    this.status = 'Validation Failed';
  }
  
  this.lastModifiedBy = validatedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to submit filing
electronicFilingSchema.methods.submitFiling = function(submittedBy) {
  this.statusHistory.push({
    status: this.status,
    changedBy: submittedBy,
    changedAt: new Date(),
    notes: 'Filing submitted to court'
  });
  
  this.status = 'Filing in Progress';
  this.submittedAt = new Date();
  this.submittedBy = submittedBy;
  this.lastModifiedBy = submittedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to mark as filed
electronicFilingSchema.methods.markAsFiled = function(confirmationNumber, receiptUrl) {
  this.statusHistory.push({
    status: this.status,
    changedBy: 'System',
    changedAt: new Date(),
    notes: 'Filing accepted by court'
  });
  
  this.status = 'Filed';
  this.filedAt = new Date();
  this.confirmationNumber = confirmationNumber;
  this.receiptUrl = receiptUrl;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to reject filing
electronicFilingSchema.methods.rejectFiling = function(reason, notes) {
  this.statusHistory.push({
    status: this.status,
    changedBy: 'System',
    changedAt: new Date(),
    notes: `Filing rejected: ${reason}`
  });
  
  this.status = 'Rejected';
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  this.rejectionNotes = notes;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

module.exports = mongoose.model('ElectronicFiling', electronicFilingSchema);
