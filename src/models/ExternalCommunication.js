/**
 * ExternalCommunication Model - Mongoose Schema for External Communication Tracking
 * Tracks all external communications including opposing counsel, courts, vendors
 */

const mongoose = require('mongoose');

const externalCommunicationSchema = new mongoose.Schema({
  // Communication Identification
  communicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Communication Type
  communicationType: {
    type: String,
    enum: [
      'Email', 'Phone Call', 'Letter', 'Fax', 'Meeting', 
      'Court Filing', 'Deposition', 'Hearing', 'Conference', 'Other'
    ],
    required: true,
    index: true
  },
  
  // Direction
  direction: {
    type: String,
    enum: ['Inbound', 'Outbound'],
    required: true,
    index: true
  },
  
  // Communication Details
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  description: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  summary: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Internal Party
  internalParticipants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    role: String,
    email: String
  }],
  primaryContact: {
    type: String,
    required: true,
    trim: true
  },
  
  // External Party
  externalParticipants: [{
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact'
    },
    name: {
      type: String,
      required: true
    },
    organization: String,
    role: String,
    email: String,
    phone: String,
    type: {
      type: String,
      enum: ['Opposing Counsel', 'Court', 'Client', 'Witness', 'Expert', 'Vendor', 'Government', 'Other']
    }
  }],
  
  // Case/Matter Association
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
  
  // Date & Time
  communicationDate: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    min: 0
  },
  
  // Status & Follow-up
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Scheduled', 'Cancelled', 'Requires Follow-up'],
    default: 'Completed',
    index: true
  },
  requiresFollowUp: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String,
  followUpCompleted: {
    type: Boolean,
    default: false
  },
  
  // Response Tracking
  requiresResponse: {
    type: Boolean,
    default: false
  },
  responseDeadline: Date,
  responseStatus: {
    type: String,
    enum: ['Not Required', 'Pending', 'Completed', 'Overdue']
  },
  responseDate: Date,
  
  // Attachments & Documents
  attachments: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    filename: String,
    fileType: String,
    storagePath: String,
    attachedAt: {
      type: Date,
      default: Date.now
    }
  }],
  hasAttachments: {
    type: Boolean,
    default: false
  },
  
  // Related Communications
  relatedCommunications: [{
    communicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExternalCommunication'
    },
    relationshipType: {
      type: String,
      enum: ['Reply To', 'Follow-up', 'Related', 'Referenced']
    }
  }],
  
  // Meeting/Call Details
  meetingDetails: {
    location: String,
    meetingType: {
      type: String,
      enum: ['In Person', 'Video Conference', 'Phone Call', 'Conference Call']
    },
    dialInNumber: String,
    meetingLink: String,
    agenda: String
  },
  
  // Phone Call Details
  phoneCallDetails: {
    phoneNumber: String,
    callDirection: {
      type: String,
      enum: ['Inbound', 'Outbound']
    },
    callDuration: Number,
    recordingAvailable: {
      type: Boolean,
      default: false
    },
    recordingPath: String
  },
  
  // Letter/Document Details
  letterDetails: {
    letterType: {
      type: String,
      enum: ['Formal Letter', 'Demand Letter', 'Response', 'Notice', 'Correspondence']
    },
    deliveryMethod: {
      type: String,
      enum: ['Mail', 'Email', 'Fax', 'Courier', 'Hand Delivery']
    },
    trackingNumber: String,
    deliveryConfirmation: {
      type: Boolean,
      default: false
    },
    deliveredDate: Date
  },
  
  // Court Communication Details
  courtDetails: {
    courtName: String,
    courtType: String,
    caseNumber: String,
    hearingDate: Date,
    filingType: String,
    docketNumber: String
  },
  
  // Outcomes & Actions
  outcomes: [{
    outcome: String,
    actionRequired: Boolean,
    actionDescription: String,
    assignedTo: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  
  // Priority & Importance
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Critical'],
    default: 'Normal'
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  // Confidentiality & Security
  isConfidential: {
    type: Boolean,
    default: false
  },
  isPrivileged: {
    type: Boolean,
    default: false
  },
  hasLegalHold: {
    type: Boolean,
    default: false
  },
  
  // Tags & Organization
  tags: [String],
  category: String,
  
  // Billing
  isBillable: {
    type: Boolean,
    default: true
  },
  billingCode: String,
  billingAmount: Number,
  billingStatus: {
    type: String,
    enum: ['Not Billed', 'Billed', 'Paid']
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  lastViewedAt: Date,
  
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
  recordedBy: String
}, {
  timestamps: true
});

// Indexes for performance
externalCommunicationSchema.index({ caseId: 1, communicationDate: -1 });
externalCommunicationSchema.index({ communicationType: 1, direction: 1 });
externalCommunicationSchema.index({ 'externalParticipants.contactId': 1 });
externalCommunicationSchema.index({ status: 1, requiresFollowUp: 1 });
externalCommunicationSchema.index({ communicationDate: -1 });
externalCommunicationSchema.index({ subject: 'text', description: 'text' });

// Static method: Find communications for case
externalCommunicationSchema.statics.findByCase = function(caseId) {
  return this.find({ caseId })
    .sort({ communicationDate: -1 });
};

// Static method: Find communications by type
externalCommunicationSchema.statics.findByType = function(communicationType, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    communicationType,
    communicationDate: { $gte: startDate }
  }).sort({ communicationDate: -1 });
};

// Static method: Find communications requiring follow-up
externalCommunicationSchema.statics.findRequiringFollowUp = function() {
  return this.find({
    requiresFollowUp: true,
    followUpCompleted: false,
    status: { $ne: 'Cancelled' }
  }).sort({ followUpDate: 1 });
};

// Static method: Get communication timeline for case
externalCommunicationSchema.statics.getTimeline = function(caseId, startDate, endDate) {
  const query = { caseId };
  
  if (startDate || endDate) {
    query.communicationDate = {};
    if (startDate) query.communicationDate.$gte = startDate;
    if (endDate) query.communicationDate.$lte = endDate;
  }
  
  return this.find(query).sort({ communicationDate: 1 });
};

// Static method: Get analytics
externalCommunicationSchema.statics.getAnalytics = function(filters = {}) {
  const matchStage = {};
  
  if (filters.caseId) matchStage.caseId = filters.caseId;
  if (filters.startDate || filters.endDate) {
    matchStage.communicationDate = {};
    if (filters.startDate) matchStage.communicationDate.$gte = filters.startDate;
    if (filters.endDate) matchStage.communicationDate.$lte = filters.endDate;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$communicationType',
        count: { $sum: 1 },
        totalDuration: { $sum: '$duration' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Instance method: Mark follow-up complete
externalCommunicationSchema.methods.completeFollowUp = function() {
  this.followUpCompleted = true;
  this.requiresFollowUp = false;
  return this.save();
};

// Instance method: Add related communication
externalCommunicationSchema.methods.addRelatedCommunication = function(communicationId, relationshipType) {
  this.relatedCommunications.push({
    communicationId,
    relationshipType
  });
  return this.save();
};

const ExternalCommunication = mongoose.model('ExternalCommunication', externalCommunicationSchema);

module.exports = ExternalCommunication;
