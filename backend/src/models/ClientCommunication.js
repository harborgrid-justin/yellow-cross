/**
 * Client Communication Model - Mongoose Schema
 * Tracks all client interactions, emails, calls, meetings
 */

const mongoose = require('mongoose');

const clientCommunicationSchema = new mongoose.Schema({
  // Reference to Client
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  clientNumber: {
    type: String,
    index: true
  },
  
  // Communication Details
  type: {
    type: String,
    required: true,
    enum: ['Email', 'Phone Call', 'Meeting', 'Text Message', 'Video Conference', 'Mail', 'Portal Message', 'Other'],
    index: true
  },
  direction: {
    type: String,
    required: true,
    enum: ['Inbound', 'Outbound'],
    default: 'Outbound'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  
  // Participants
  initiatedBy: {
    type: String,
    required: true,
    trim: true
  },
  participants: [{
    name: String,
    email: String,
    role: String
  }],
  
  // Related Entities
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  caseNumber: String,
  
  // Timing
  communicationDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  
  // Status and Priority
  status: {
    type: String,
    enum: ['Completed', 'Pending Follow-up', 'Scheduled', 'Cancelled'],
    default: 'Completed'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  
  // Follow-up
  requiresFollowUp: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpCompleted: {
    type: Boolean,
    default: false
  },
  
  // Attachments
  attachments: [{
    filename: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: Date
  }],
  
  // Tags and Categories
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Sentiment Analysis (for future AI integration)
  sentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
    default: 'Neutral'
  },
  
  // Billable
  billable: {
    type: Boolean,
    default: false
  },
  billedAmount: {
    type: Number,
    default: 0
  },
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
clientCommunicationSchema.index({ clientId: 1, communicationDate: -1 });
clientCommunicationSchema.index({ type: 1, communicationDate: -1 });
clientCommunicationSchema.index({ status: 1 });

// Static method to get communication history
clientCommunicationSchema.statics.getClientHistory = function(clientId, limit = 50) {
  return this.find({ clientId })
    .sort({ communicationDate: -1 })
    .limit(limit);
};

// Static method to get analytics
clientCommunicationSchema.statics.getAnalytics = async function(clientId, startDate, endDate) {
  const match = { clientId };
  if (startDate && endDate) {
    match.communicationDate = { $gte: startDate, $lte: endDate };
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalDuration: { $sum: '$duration' }
      }
    }
  ]);
};

module.exports = mongoose.model('ClientCommunication', clientCommunicationSchema);
