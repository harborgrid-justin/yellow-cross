/**
 * TaskComment Model - Mongoose Schema for Task Collaboration
 * Tracks comments, mentions, and collaboration activity on tasks
 */

const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema({
  // Task Reference
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
    index: true
  },
  taskNumber: {
    type: String,
    required: true,
    index: true
  },
  
  // Comment Content
  content: {
    type: String,
    required: true,
    trim: true
  },
  commentType: {
    type: String,
    enum: ['Comment', 'Update', 'Mention', 'Attachment', 'Status Change', 'System'],
    default: 'Comment'
  },
  
  // Mentions & Notifications
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
  
  // Threading
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskComment'
  },
  isReply: {
    type: Boolean,
    default: false
  },
  replyCount: {
    type: Number,
    default: 0
  },
  
  // Reactions
  reactions: [{
    reactionType: {
      type: String,
      enum: ['Like', 'Love', 'Agree', 'Disagree', 'Helpful']
    },
    username: String,
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: String,
  
  // Visibility
  visibility: {
    type: String,
    enum: ['Public', 'Team Only', 'Private'],
    default: 'Team Only'
  },
  
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
  }
}, {
  timestamps: true
});

// Indexes for performance optimization
taskCommentSchema.index({ taskId: 1, createdAt: -1 });
taskCommentSchema.index({ taskNumber: 1, commentType: 1 });
taskCommentSchema.index({ parentCommentId: 1 });
taskCommentSchema.index({ 'mentions.username': 1 });

// Static method: Find comments for a task
taskCommentSchema.statics.findByTask = function(taskId) {
  return this.find({ 
    taskId, 
    isDeleted: false 
  }).sort({ createdAt: -1 });
};

// Static method: Find mentions for a user
taskCommentSchema.statics.findMentions = function(username) {
  return this.find({
    'mentions.username': username,
    isDeleted: false
  }).sort({ createdAt: -1 });
};

// Instance method: Add reaction
taskCommentSchema.methods.addReaction = function(reactionType, username) {
  // Check if user already reacted
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

// Instance method: Edit comment
taskCommentSchema.methods.editComment = function(newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Instance method: Delete comment (soft delete)
taskCommentSchema.methods.deleteComment = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

const TaskComment = mongoose.model('TaskComment', taskCommentSchema);

module.exports = TaskComment;
