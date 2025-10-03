/**
 * Email Model - Mongoose Schema for Email Integration
 * Tracks emails sent and received through integrated email clients
 */

const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  // Email Identification
  emailId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  messageId: {
    type: String,
    index: true
  },
  threadId: {
    type: String,
    index: true
  },
  
  // Email Headers
  from: {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    name: String
  },
  to: [{
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    name: String
  }],
  cc: [{
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    name: String
  }],
  bcc: [{
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    name: String
  }],
  replyTo: {
    email: String,
    name: String
  },
  
  // Email Content
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  body: {
    type: String,
    required: true
  },
  bodyPlainText: String,
  bodyHtml: String,
  
  // Email Type & Direction
  emailType: {
    type: String,
    enum: ['Received', 'Sent', 'Draft', 'Template'],
    default: 'Received',
    index: true
  },
  direction: {
    type: String,
    enum: ['Inbound', 'Outbound', 'Internal'],
    index: true
  },
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['Draft', 'Queued', 'Sent', 'Delivered', 'Opened', 'Clicked', 'Bounced', 'Failed'],
    default: 'Draft',
    index: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Delivery Tracking
  sentAt: Date,
  deliveredAt: Date,
  openedAt: Date,
  openCount: {
    type: Number,
    default: 0
  },
  clickCount: {
    type: Number,
    default: 0
  },
  
  // Attachments
  attachments: [{
    filename: String,
    fileType: String,
    fileSize: Number,
    storagePath: String,
    contentId: String,
    isInline: {
      type: Boolean,
      default: false
    }
  }],
  hasAttachments: {
    type: Boolean,
    default: false
  },
  attachmentCount: {
    type: Number,
    default: 0
  },
  
  // Case/Matter Association
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: {
    type: String,
    index: true
  },
  autoFiled: {
    type: Boolean,
    default: false
  },
  
  // Contact Association
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  contactName: String,
  
  // Priority & Flags
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  
  // Organization & Filtering
  labels: [String],
  tags: [String],
  folder: {
    type: String,
    enum: ['Inbox', 'Sent', 'Drafts', 'Trash', 'Spam', 'Archive', 'Custom'],
    default: 'Inbox',
    index: true
  },
  customFolder: String,
  
  // Template Information
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunicationTemplate'
  },
  templateName: String,
  isFromTemplate: {
    type: Boolean,
    default: false
  },
  
  // Integration Metadata
  provider: {
    type: String,
    enum: ['Gmail', 'Outlook', 'Exchange', 'SMTP', 'Internal', 'Other'],
    default: 'Internal'
  },
  providerMessageId: String,
  providerThreadId: String,
  
  // Security & Compliance
  isEncrypted: {
    type: Boolean,
    default: false
  },
  isConfidential: {
    type: Boolean,
    default: false
  },
  hasLegalHold: {
    type: Boolean,
    default: false
  },
  
  // Spam & Filtering
  spamScore: Number,
  isSpam: {
    type: Boolean,
    default: false
  },
  isPhishing: {
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
    enum: ['Pending', 'Responded', 'No Response Required', 'Overdue']
  },
  inReplyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Email'
  },
  
  // Audit Trail
  createdBy: {
    type: String,
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
  }
}, {
  timestamps: true
});

// Indexes for performance
emailSchema.index({ 'from.email': 1, createdAt: -1 });
emailSchema.index({ 'to.email': 1, createdAt: -1 });
emailSchema.index({ caseId: 1, createdAt: -1 });
emailSchema.index({ status: 1, emailType: 1 });
emailSchema.index({ folder: 1, isRead: 1 });
emailSchema.index({ subject: 'text', bodyPlainText: 'text' });

// Static method: Find emails for a case
emailSchema.statics.findByCase = function(caseId) {
  return this.find({ caseId })
    .sort({ createdAt: -1 });
};

// Static method: Find unread emails
emailSchema.statics.findUnread = function(userEmail) {
  return this.find({
    'to.email': userEmail,
    isRead: false,
    folder: { $ne: 'Trash' }
  }).sort({ createdAt: -1 });
};

// Static method: Search emails
emailSchema.statics.searchEmails = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query }
  };
  
  if (filters.from) searchQuery['from.email'] = filters.from;
  if (filters.caseId) searchQuery.caseId = filters.caseId;
  if (filters.folder) searchQuery.folder = filters.folder;
  if (filters.isRead !== undefined) searchQuery.isRead = filters.isRead;
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// Static method: Find emails requiring response
emailSchema.statics.findRequiringResponse = function() {
  return this.find({
    requiresResponse: true,
    responseStatus: { $in: ['Pending', 'Overdue'] }
  }).sort({ responseDeadline: 1 });
};

// Instance method: Mark as read
emailSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Instance method: Track open
emailSchema.methods.trackOpen = function() {
  this.openCount += 1;
  if (!this.openedAt) {
    this.openedAt = new Date();
  }
  if (this.status === 'Delivered' || this.status === 'Sent') {
    this.status = 'Opened';
  }
  return this.save();
};

// Instance method: Auto-file to case
emailSchema.methods.autoFileToCase = function(caseId, caseNumber) {
  this.caseId = caseId;
  this.caseNumber = caseNumber;
  this.autoFiled = true;
  return this.save();
};

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
