/**
 * Workspace Model - Mongoose Schema for Team Collaboration Spaces
 * Virtual workrooms for case-specific team collaboration
 */

const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  // Workspace Identification
  workspaceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  // Workspace Type
  workspaceType: {
    type: String,
    enum: ['Case Workspace', 'Project', 'Department', 'Team', 'Client Portal', 'General', 'Template'],
    default: 'Case Workspace',
    index: true
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
  
  // Owner & Creator
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Members & Access
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    email: String,
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Editor', 'Contributor', 'Viewer'],
      default: 'Contributor'
    },
    permissions: {
      canEdit: { type: Boolean, default: true },
      canDelete: { type: Boolean, default: false },
      canInvite: { type: Boolean, default: false },
      canManageSettings: { type: Boolean, default: false }
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastActiveAt: Date
  }],
  memberCount: {
    type: Number,
    default: 0
  },
  
  // Invitations
  pendingInvitations: [{
    email: String,
    username: String,
    role: String,
    invitedBy: String,
    invitedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }],
  
  // Access Control
  visibility: {
    type: String,
    enum: ['Private', 'Team', 'Organization', 'Public'],
    default: 'Team',
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  
  // Shared Resources
  sharedDocuments: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    documentName: String,
    sharedBy: String,
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  sharedFiles: [{
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SharedFile'
    },
    filename: String,
    sharedBy: String,
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tasks & Activities
  tasks: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    taskNumber: String,
    taskTitle: String,
    status: String,
    assignedTo: String,
    dueDate: Date
  }],
  
  // Activity Feed
  activities: [{
    activityType: {
      type: String,
      enum: ['Member Joined', 'Member Left', 'Document Shared', 'File Uploaded', 'Task Created', 'Comment Added', 'Settings Changed', 'Other']
    },
    description: String,
    performedBy: String,
    performedAt: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  
  // Discussions & Comments
  discussions: [{
    discussionId: String,
    title: String,
    startedBy: String,
    startedAt: {
      type: Date,
      default: Date.now
    },
    replyCount: {
      type: Number,
      default: 0
    },
    lastReplyAt: Date
  }],
  
  // Workspace Settings
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowFileUploads: {
      type: Boolean,
      default: true
    },
    allowInvitations: {
      type: Boolean,
      default: true
    },
    notifyOnActivity: {
      type: Boolean,
      default: true
    },
    notifyOnMention: {
      type: Boolean,
      default: true
    },
    maxFileSize: {
      type: Number,
      default: 100 * 1024 * 1024 // 100 MB
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Suspended', 'Deleted'],
    default: 'Active',
    index: true
  },
  
  // Template Information
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  },
  templateName: String,
  
  // Organization
  tags: [String],
  category: String,
  
  // Statistics
  stats: {
    totalDocuments: { type: Number, default: 0 },
    totalFiles: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 0 }
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
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  archivedBy: String,
  archivedAt: Date
}, {
  timestamps: true
});

// Indexes for performance
workspaceSchema.index({ ownerId: 1, status: 1 });
workspaceSchema.index({ caseId: 1 });
workspaceSchema.index({ workspaceType: 1, status: 1 });
workspaceSchema.index({ 'members.userId': 1 });
workspaceSchema.index({ visibility: 1, status: 1 });

// Pre-save hook to update member count
workspaceSchema.pre('save', function(next) {
  this.memberCount = this.members.length;
  next();
});

// Static method: Find workspaces for user
workspaceSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { ownerId: userId },
      { 'members.userId': userId }
    ],
    status: 'Active'
  }).sort({ lastActivityAt: -1 });
};

// Static method: Find workspaces by case
workspaceSchema.statics.findByCase = function(caseId) {
  return this.find({ 
    caseId,
    status: 'Active'
  }).sort({ createdAt: -1 });
};

// Instance method: Add member
workspaceSchema.methods.addMember = function(userId, username, email, role = 'Contributor') {
  const existingMember = this.members.find(m => m.userId && m.userId.equals(userId));
  
  if (!existingMember) {
    this.members.push({
      userId,
      username,
      email,
      role,
      joinedAt: new Date(),
      lastActiveAt: new Date()
    });
    
    this.activities.push({
      activityType: 'Member Joined',
      description: `${username} joined the workspace`,
      performedBy: username,
      performedAt: new Date()
    });
    
    this.lastActivityAt = new Date();
  }
  
  return this.save();
};

// Instance method: Remove member
workspaceSchema.methods.removeMember = function(userId, removedBy) {
  const memberIndex = this.members.findIndex(m => m.userId && m.userId.equals(userId));
  
  if (memberIndex > -1) {
    const member = this.members[memberIndex];
    this.members.splice(memberIndex, 1);
    
    this.activities.push({
      activityType: 'Member Left',
      description: `${member.username} left the workspace`,
      performedBy: removedBy,
      performedAt: new Date()
    });
    
    this.lastActivityAt = new Date();
  }
  
  return this.save();
};

// Instance method: Add activity
workspaceSchema.methods.addActivity = function(activityType, description, performedBy, metadata = {}) {
  this.activities.push({
    activityType,
    description,
    performedBy,
    performedAt: new Date(),
    metadata
  });
  
  this.lastActivityAt = new Date();
  this.stats.totalActivities += 1;
  
  return this.save();
};

// Instance method: Archive workspace
workspaceSchema.methods.archiveWorkspace = function(archivedBy) {
  this.status = 'Archived';
  this.archivedBy = archivedBy;
  this.archivedAt = new Date();
  return this.save();
};

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace;
