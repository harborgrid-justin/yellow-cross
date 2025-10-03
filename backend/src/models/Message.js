/**
 * Message Model - Mongoose Schema for Communication & Collaboration
 * Comprehensive data model for messaging and team communication
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Basic Information
  messageId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  subject: {
    type: String,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  
  // Message Type
  messageType: {
    type: String,
    required: true,
    enum: ['Internal', 'Client', 'Email', 'SMS', 'Video Conference', 'File Share', 'System'],
    index: true
  },
  
  // Participants
  sender: {
    userId: {
      type: String,
      required: true,
      index: true
    },
    name: String,
    email: String
  },
  recipients: [{
    userId: String,
    name: String,
    email: String,
    role: {
      type: String,
      enum: ['To', 'CC', 'BCC']
    },
    readAt: Date,
    deliveredAt: Date
  }],
  
  // Thread & References
  threadId: {
    type: String,
    index: true
  },
  inReplyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  references: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  
  // Associations
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    index: true
  },
  
  // Attachments
  attachments: [{
    fileName: String,
    fileSize: Number,
    fileType: String,
    url: String,
    uploadedAt: Date
  }],
  
  // Status & Priority
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Delivered', 'Read', 'Archived', 'Deleted'],
    default: 'Draft',
    index: true
  },
  priority: {
    type: String,
    enum: ['High', 'Normal', 'Low'],
    default: 'Normal'
  },
  
  // Flags & Labels
  isStarred: {
    type: Boolean,
    default: false
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  labels: [String],
  tags: [String],
  
  // Email Integration
  emailHeaders: {
    type: Map,
    of: String
  },
  externalMessageId: String,
  
  // Metadata
  sentAt: Date,
  deliveredAt: Date,
  readAt: Date,
  archivedAt: Date,
  deletedAt: Date,
  
  // Tracking
  readReceipts: [{
    userId: String,
    readAt: Date
  }],
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Sent', 'Delivered', 'Failed', 'Bounced']
  },
  
  // Security
  isEncrypted: {
    type: Boolean,
    default: false
  },
  isConfidential: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ 'sender.userId': 1, createdAt: -1 });
messageSchema.index({ threadId: 1, createdAt: 1 });
messageSchema.index({ caseId: 1, messageType: 1 });
messageSchema.index({ clientId: 1, createdAt: -1 });
messageSchema.index({ status: 1, 'sender.userId': 1 });

// Methods
messageSchema.methods.markAsRead = function(userId) {
  const recipient = this.recipients.find(r => r.userId === userId);
  if (recipient && !recipient.readAt) {
    recipient.readAt = new Date();
  }
  
  if (!this.readReceipts.find(r => r.userId === userId)) {
    this.readReceipts.push({ userId, readAt: new Date() });
  }
  
  // Update overall status if all recipients have read
  if (this.recipients.every(r => r.readAt)) {
    this.status = 'Read';
    this.readAt = new Date();
  }
  
  return this.save();
};

messageSchema.methods.markAsArchived = function() {
  this.status = 'Archived';
  this.archivedAt = new Date();
  return this.save();
};

messageSchema.methods.addAttachment = function(fileData) {
  this.attachments.push({
    ...fileData,
    uploadedAt: new Date()
  });
  return this.save();
};

// Static methods
messageSchema.statics.findByThread = function(threadId) {
  return this.find({ threadId }).sort({ createdAt: 1 });
};

messageSchema.statics.findUnread = function(userId) {
  return this.find({
    'recipients.userId': userId,
    'recipients.readAt': { $exists: false },
    status: { $in: ['Sent', 'Delivered'] }
  }).sort({ createdAt: -1 });
};

messageSchema.statics.findByCase = function(caseId) {
  return this.find({ caseId }).sort({ createdAt: -1 });
};

messageSchema.statics.findByClient = function(clientId) {
  return this.find({ clientId }).sort({ createdAt: -1 });
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
