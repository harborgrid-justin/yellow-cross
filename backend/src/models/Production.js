/**
 * Production Model - Mongoose Schema for Production Management
 * Manages document production sets with Bates numbering
 */

const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  // Basic Information
  productionNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  productionName: {
    type: String,
    required: true
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
  
  // Production Details
  productionType: {
    type: String,
    enum: ['Initial', 'Supplemental', 'Rolling', 'Final'],
    default: 'Initial'
  },
  productionFormat: {
    type: String,
    enum: ['Native', 'TIFF', 'PDF', 'Paper', 'Load File', 'Mixed'],
    required: true
  },
  
  // Bates Numbering
  batesPrefix: {
    type: String,
    required: true
  },
  batesStartNumber: {
    type: Number,
    required: true
  },
  batesEndNumber: {
    type: Number
  },
  batesFormat: {
    type: String,
    default: 'PREFIX-000000'
  },
  
  // Document Set
  documents: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    evidenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evidence'
    },
    batesNumber: String,
    pageCount: Number,
    producedFormat: String
  }],
  totalDocuments: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    default: 0
  },
  
  // Recipient Information
  producedTo: {
    type: String,
    required: true
  },
  recipientFirm: String,
  recipientEmail: String,
  recipientAddress: String,
  
  // Dates
  productionDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  dueDate: Date,
  deliveredDate: Date,
  
  // Delivery Details
  deliveryMethod: {
    type: String,
    enum: ['Electronic', 'Physical', 'Secure Portal', 'FTP', 'Mail', 'Hand Delivery'],
    default: 'Electronic'
  },
  deliveryLocation: String,
  trackingNumber: String,
  
  // Metadata & Load Files
  includeMetadata: {
    type: Boolean,
    default: true
  },
  metadataFields: [String],
  loadFileGenerated: {
    type: Boolean,
    default: false
  },
  loadFilePath: String,
  
  // Privilege Information
  privilegeLogIncluded: {
    type: Boolean,
    default: false
  },
  privilegeLogPath: String,
  redactedDocuments: {
    type: Number,
    default: 0
  },
  
  // Validation & Quality Control
  validated: {
    type: Boolean,
    default: false
  },
  validatedBy: String,
  validationDate: Date,
  validationErrors: [{
    errorType: String,
    description: String,
    documentId: mongoose.Schema.Types.ObjectId
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'In Progress', 'Ready for Review', 'Approved', 'Delivered', 'Completed'],
    default: 'Draft',
    index: true
  },
  
  // Cost Tracking
  estimatedCost: Number,
  actualCost: Number,
  costPerPage: Number,
  
  // Correspondence
  coverLetter: String,
  transmittalLetter: String,
  notes: String,
  
  // Created By
  createdBy: {
    type: String,
    required: true
  },
  approvedBy: String,
  approvalDate: Date
}, {
  timestamps: true
});

// Indexes for performance
productionSchema.index({ caseId: 1, status: 1 });
productionSchema.index({ productionDate: -1 });
productionSchema.index({ producedTo: 1 });
productionSchema.index({ batesPrefix: 1, batesStartNumber: 1 });

// Virtual field for production size
productionSchema.virtual('productionSize').get(function() {
  return `${this.totalDocuments} documents, ${this.totalPages} pages`;
});

// Static method to get next Bates number
productionSchema.statics.getNextBatesNumber = async function(caseId, prefix) {
  const lastProduction = await this.findOne({ caseId, batesPrefix: prefix })
    .sort({ batesEndNumber: -1 })
    .limit(1);
  
  if (!lastProduction) {
    return { prefix, number: 1 };
  }
  
  return { prefix, number: (lastProduction.batesEndNumber || 0) + 1 };
};

// Static method to find by case
productionSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ productionDate: -1 });
};

// Instance method to add document to production
productionSchema.methods.addDocument = function(documentData) {
  const batesNum = this.batesStartNumber + this.documents.length;
  const batesNumber = `${this.batesPrefix}-${batesNum.toString().padStart(6, '0')}`;
  
  this.documents.push({
    ...documentData,
    batesNumber
  });
  
  this.totalDocuments = this.documents.length;
  this.totalPages += documentData.pageCount || 1;
  this.batesEndNumber = batesNum;
  
  return this.save();
};

// Instance method to generate load file
productionSchema.methods.generateLoadFile = function() {
  this.loadFileGenerated = true;
  this.loadFilePath = `/productions/${this.productionNumber}/loadfile.dat`;
  return this.save();
};

// Instance method to approve production
productionSchema.methods.approveProduction = function(approvedBy) {
  this.status = 'Approved';
  this.approvedBy = approvedBy;
  this.approvalDate = new Date();
  return this.save();
};

module.exports = mongoose.model('Production', productionSchema);
