/**
 * Message Model - Mongoose Schema for Internal Messaging System
 * Tracks internal team messages, direct messages, and group chats
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Message Identification
  messageId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Message Type & Content
  messageType: {
    type: String,
    enum: ['Direct', 'Group', 'Broadcast', 'System', 'Announcement'],
    default: 'Direct',
    index: true
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  
  // Sender Information
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  senderName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Recipient Information
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipientName: {
    type: String,
    trim: true
  },
  
  // Group Chat
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessageGroup',
    index: true
  },
  groupName: {
    type: String,
    trim: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Member'],
      default: 'Member'
    }
  }],
  
  // Threading
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    index: true
  },
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isThreadStarter: {
    type: Boolean,
    default: true
  },
  replyCount: {
    type: Number,
    default: 0
  },
  
  // Attachments
  attachments: [{
    filename: String,
    fileType: String,
    fileSize: Number,
    storagePath: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Mentions
  mentions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    notified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['Sent', 'Delivered', 'Read', 'Archived', 'Deleted'],
    default: 'Sent',
    index: true
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Priority & Urgency
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  isUrgent: {
    type: Boolean,
    default: false
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
  
  // Reactions
  reactions: [{
    reactionType: {
      type: String,
      enum: ['Like', 'Love', 'Agree', 'Helpful', 'Resolved']
    },
    username: String,
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Edit & Delete
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  editHistory: [{
    content: String,
    editedAt: Date,
    editedBy: String
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: String,
  
  // Search & Organization
  tags: [String],
  isStarred: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  
  // Audit Trail
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
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ recipientId: 1, status: 1 });
messageSchema.index({ groupId: 1, createdAt: -1 });
messageSchema.index({ caseId: 1, createdAt: -1 });
messageSchema.index({ threadId: 1, createdAt: 1 });
messageSchema.index({ 'mentions.username': 1 });
messageSchema.index({ content: 'text', subject: 'text' });

// Static method: Find messages for user (sent or received)
messageSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { senderId: userId },
      { recipientId: userId },
      { 'participants.userId': userId }
    ],
    isDeleted: false
  }).sort({ createdAt: -1 });
};

// Static method: Find unread messages for user
messageSchema.statics.findUnreadByUser = function(userId) {
  return this.find({
    recipientId: userId,
    status: { $ne: 'Read' },
    isDeleted: false
  }).sort({ createdAt: -1 });
};

// Static method: Search messages
messageSchema.statics.searchMessages = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    isDeleted: false
  };
  
  if (filters.senderId) searchQuery.senderId = filters.senderId;
  if (filters.recipientId) searchQuery.recipientId = filters.recipientId;
  if (filters.caseId) searchQuery.caseId = filters.caseId;
  if (filters.messageType) searchQuery.messageType = filters.messageType;
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// Instance method: Mark as read
messageSchema.methods.markAsRead = function(userId, username) {
  if (this.status !== 'Read') {
    this.status = 'Read';
    this.readBy.push({
      userId,
      username,
      readAt: new Date()
    });
  }
  return this.save();
};

// Instance method: Add reaction
messageSchema.methods.addReaction = function(reactionType, username) {
  const existingReaction = this.reactions.find(r => r.username === username);
  
  if (existingReaction) {
    existingReaction.reactionType = reactionType;
    existingReaction.reactedAt = new Date();
  } else {
    this.reactions.push({
      reactionType,
      username,
      reactedAt: new Date()
    });
  }
  
  return this.save();
};

// Instance method: Edit message
messageSchema.methods.editMessage = function(newContent, editedBy) {
  this.editHistory.push({
    content: this.content,
    editedAt: new Date(),
    editedBy
  });
  
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  
  return this.save();
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
