/**
 * ContractNegotiation Model - Mongoose Schema for Contract Negotiation Tracking
 * Tracks negotiation history, changes, and comments for contracts
 */

const mongoose = require('mongoose');

const contractNegotiationSchema = new mongoose.Schema({
  // Negotiation Identification
  negotiationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Contract Reference
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true,
    index: true
  },
  contractNumber: {
    type: String,
    trim: true,
    index: true
  },
  
  // Negotiation Details
  roundNumber: {
    type: Number,
    required: true,
    default: 1
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Negotiation Type
  negotiationType: {
    type: String,
    enum: ['Clause Modification', 'Term Change', 'Pricing', 'Timeline', 'Scope', 'General', 'Other'],
    required: true
  },
  
  // Parties Involved
  proposedBy: {
    type: String,
    required: true,
    trim: true
  },
  partyType: {
    type: String,
    enum: ['Internal', 'External', 'Client', 'Vendor'],
    required: true
  },
  assignedTo: {
    type: String,
    trim: true
  },
  
  // Change Tracking
  changes: [{
    changeType: {
      type: String,
      enum: ['Addition', 'Deletion', 'Modification', 'Redline'],
      required: true
    },
    section: String,
    clause: String,
    originalText: String,
    proposedText: String,
    finalText: String,
    position: {
      startLine: Number,
      endLine: Number,
      page: Number
    },
    accepted: {
      type: Boolean,
      default: null
    },
    acceptedBy: String,
    acceptedAt: Date,
    rejectionReason: String
  }],
  
  // Status & Progress
  status: {
    type: String,
    enum: ['Open', 'Under Review', 'Accepted', 'Rejected', 'Partially Accepted', 'Closed'],
    default: 'Open',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  
  // Response & Resolution
  response: {
    respondedBy: String,
    respondedAt: Date,
    responseText: String,
    decision: {
      type: String,
      enum: ['Accepted', 'Rejected', 'Counter Proposal', 'Need Discussion']
    }
  },
  counterProposal: {
    proposedText: String,
    proposedBy: String,
    proposedAt: Date,
    rationale: String
  },
  resolution: {
    resolvedBy: String,
    resolvedAt: Date,
    finalDecision: String,
    notes: String
  },
  
  // Comments & Discussion
  comments: [{
    commentBy: String,
    commentAt: {
      type: Date,
      default: Date.now
    },
    commentText: String,
    isInternal: {
      type: Boolean,
      default: false
    },
    mentions: [String]
  }],
  
  // Attachments
  attachments: [{
    filename: String,
    fileType: String,
    fileSize: Number,
    uploadedBy: String,
    uploadedAt: Date,
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    description: String
  }],
  
  // Timeline
  dueDate: Date,
  responseDeadline: Date,
  
  // Impact Assessment
  impactLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  financialImpact: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    description: String
  },
  legalImpact: String,
  businessImpact: String,
  
  // Related Negotiations
  relatedNegotiations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContractNegotiation'
  }],
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastModifiedBy: String,
  lastModifiedDate: Date,
  
  // Activity Tracking
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  lastActivityBy: String,
  
  // Internal Notes
  internalNotes: String
}, {
  timestamps: true
});

// Indexes
contractNegotiationSchema.index({ contractId: 1, roundNumber: 1 });
contractNegotiationSchema.index({ status: 1, priority: 1 });
contractNegotiationSchema.index({ proposedBy: 1, createdDate: -1 });
contractNegotiationSchema.index({ assignedTo: 1, status: 1 });

// Virtual fields
contractNegotiationSchema.virtual('changeCount').get(function() {
  return this.changes.length;
});

contractNegotiationSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

contractNegotiationSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate && this.status !== 'Closed';
});

// Static methods
contractNegotiationSchema.statics.findByContract = function(contractId) {
  return this.find({ contractId })
    .sort({ roundNumber: 1, createdDate: -1 });
};

contractNegotiationSchema.statics.findPending = function() {
  return this.find({ 
    status: { $in: ['Open', 'Under Review'] }
  }).sort({ priority: -1, createdDate: 1 });
};

contractNegotiationSchema.statics.getAnalyticsByContract = function(contractId) {
  return this.aggregate([
    { $match: { contractId: mongoose.Types.ObjectId(contractId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgResponseTime: { $avg: '$responseTime' }
      }
    }
  ]);
};

// Instance methods
contractNegotiationSchema.methods.addComment = function(commentBy, commentText, isInternal = false, mentions = []) {
  this.comments.push({
    commentBy,
    commentText,
    isInternal,
    mentions
  });
  this.lastActivityDate = new Date();
  this.lastActivityBy = commentBy;
  return this.save();
};

contractNegotiationSchema.methods.addChange = function(change) {
  this.changes.push(change);
  this.lastActivityDate = new Date();
  return this.save();
};

contractNegotiationSchema.methods.acceptChange = function(changeId, acceptedBy) {
  const change = this.changes.id(changeId);
  if (change) {
    change.accepted = true;
    change.acceptedBy = acceptedBy;
    change.acceptedAt = new Date();
    change.finalText = change.proposedText;
    this.lastActivityDate = new Date();
    this.lastActivityBy = acceptedBy;
    return this.save();
  }
  throw new Error('Change not found');
};

contractNegotiationSchema.methods.rejectChange = function(changeId, rejectedBy, reason) {
  const change = this.changes.id(changeId);
  if (change) {
    change.accepted = false;
    change.acceptedBy = rejectedBy;
    change.acceptedAt = new Date();
    change.rejectionReason = reason;
    this.lastActivityDate = new Date();
    this.lastActivityBy = rejectedBy;
    return this.save();
  }
  throw new Error('Change not found');
};

contractNegotiationSchema.methods.respond = function(respondedBy, responseText, decision) {
  this.response = {
    respondedBy,
    respondedAt: new Date(),
    responseText,
    decision
  };
  
  if (decision === 'Accepted') {
    this.status = 'Accepted';
  } else if (decision === 'Rejected') {
    this.status = 'Rejected';
  } else if (decision === 'Counter Proposal') {
    this.status = 'Under Review';
  }
  
  this.lastActivityDate = new Date();
  this.lastActivityBy = respondedBy;
  return this.save();
};

contractNegotiationSchema.methods.resolve = function(resolvedBy, finalDecision, notes = '') {
  this.resolution = {
    resolvedBy,
    resolvedAt: new Date(),
    finalDecision,
    notes
  };
  this.status = 'Closed';
  this.lastActivityDate = new Date();
  this.lastActivityBy = resolvedBy;
  return this.save();
};

// Pre-save middleware to auto-generate negotiation ID
contractNegotiationSchema.pre('save', async function(next) {
  if (this.isNew && !this.negotiationId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.negotiationId = `NEG-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('ContractNegotiation', contractNegotiationSchema);
