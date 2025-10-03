/**
 * ClientCommunication Model - Mongoose Schema for Client Communication Tracking
 * Tracks all client interactions including emails, calls, meetings
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
    required: true,
    index: true
  },
  
  // Communication Details
  communicationType: {
    type: String,
    required: true,
    enum: ['Email', 'Phone Call', 'Meeting', 'Video Call', 'Text Message', 'Letter', 'Portal Message', 'Other']
  },
  direction: {
    type: String,
    enum: ['Inbound', 'Outbound'],
    required: true
  },
  subject: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  
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
  
  // Participants
  initiatedBy: {
    type: String,
    required: true,
    trim: true
  },
  attendees: [{
    name: String,
    role: String
  }],
  
  // Categorization
  category: {
    type: String,
    enum: ['Case Discussion', 'Billing', 'Status Update', 'Consultation', 'Document Review', 'Strategy', 'Other'],
    default: 'Case Discussion'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Related Items
  relatedCaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  relatedCaseNumber: {
    type: String
  },
  
  // Attachments and Follow-ups
  attachments: [{
    filename: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  followUpCompleted: {
    type: Boolean,
    default: false
  },
  
  // Billable tracking
  billable: {
    type: Boolean,
    default: false
  },
  billableHours: {
    type: Number,
    default: 0
  },
  
  // Metadata
  createdBy: {
    type: String,
    trim: true
  },
  createdByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
clientCommunicationSchema.index({ clientId: 1, communicationDate: -1 });
clientCommunicationSchema.index({ communicationType: 1, communicationDate: -1 });
clientCommunicationSchema.index({ followUpRequired: 1, followUpDate: 1 });

// Virtual for communication summary
clientCommunicationSchema.virtual('summary').get(function() {
  return `${this.communicationType} - ${this.subject || 'No subject'} on ${this.communicationDate.toDateString()}`;
});

const ClientCommunication = mongoose.model('ClientCommunication', clientCommunicationSchema);

module.exports = ClientCommunication;
