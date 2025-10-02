/**
 * ResearchProject Model - Mongoose Schema for Research Collaboration
 * Manages collaborative research projects, shared research, and annotations
 */

const mongoose = require('mongoose');

const researchProjectSchema = new mongoose.Schema({
  // Basic Information
  projectId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Project Type
  projectType: {
    type: String,
    required: true,
    enum: ['Case Research', 'Legal Analysis', 'Literature Review', 'Statutory Research', 'Regulatory Research', 'General Research', 'Other'],
    index: true
  },
  
  // Classification
  practiceArea: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  jurisdiction: {
    type: String,
    trim: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Related Entities
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  matter: {
    type: String,
    trim: true
  },
  
  // Team & Collaboration
  owner: {
    type: String,
    required: true,
    trim: true
  },
  team: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    role: {
      type: String,
      enum: ['Owner', 'Editor', 'Contributor', 'Viewer'],
      default: 'Contributor'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      canEdit: {
        type: Boolean,
        default: false
      },
      canAddMembers: {
        type: Boolean,
        default: false
      },
      canDelete: {
        type: Boolean,
        default: false
      }
    }
  }],
  
  // Research Content
  researchItems: [{
    itemId: String,
    itemType: {
      type: String,
      enum: ['Case Law', 'Statute', 'Article', 'Memo', 'Note', 'Citation', 'Document', 'Link'],
      required: true
    },
    title: String,
    content: String,
    reference: {
      type: mongoose.Schema.Types.Mixed
    },
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    },
    tags: [String],
    annotations: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String,
      text: String,
      highlightedText: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String,
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      replies: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        username: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }]
    }]
  }],
  
  // Workspace & Organization
  workspaces: [{
    name: String,
    description: String,
    items: [String], // Array of itemIds
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Citations & References
  citations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citation'
  }],
  caseLawReferences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseLaw'
  }],
  memoReferences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalMemorandum'
  }],
  
  // Attachments
  attachments: [{
    filename: String,
    fileType: String,
    fileSize: Number,
    url: String,
    uploadedBy: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status & Timeline
  status: {
    type: String,
    enum: ['Active', 'In Progress', 'On Hold', 'Completed', 'Archived'],
    default: 'Active',
    index: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  completedDate: Date,
  
  // Access Control
  visibility: {
    type: String,
    enum: ['Public', 'Team Only', 'Private', 'Restricted'],
    default: 'Team Only',
    index: true
  },
  
  // Activity Tracking
  activityLog: [{
    action: {
      type: String,
      enum: ['Created', 'Item Added', 'Item Removed', 'Annotation Added', 'Comment Added', 'Member Added', 'Member Removed', 'Status Changed', 'Updated']
    },
    performedBy: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }],
  
  // Engagement Metrics
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  },
  totalItems: {
    type: Number,
    default: 0
  },
  totalAnnotations: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number,
    default: 0
  },
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
researchProjectSchema.index({ projectType: 1, practiceArea: 1 });
researchProjectSchema.index({ status: 1, visibility: 1 });
researchProjectSchema.index({ owner: 1, status: 1 });
researchProjectSchema.index({ 'team.userId': 1 });
researchProjectSchema.index({ lastActivity: -1 });
researchProjectSchema.index({ tags: 1 });
researchProjectSchema.index({ name: 'text', description: 'text' });

// Instance methods
researchProjectSchema.methods.addTeamMember = function(userId, name, role = 'Contributor') {
  const permissions = {
    canEdit: role === 'Owner' || role === 'Editor',
    canAddMembers: role === 'Owner',
    canDelete: role === 'Owner'
  };
  
  this.team.push({
    userId,
    name,
    role,
    joinedAt: Date.now(),
    permissions
  });
  
  this.logActivity('Member Added', this.lastModifiedBy, `Added ${name} as ${role}`);
};

researchProjectSchema.methods.addResearchItem = function(itemType, title, content, addedBy, reference = null) {
  const itemId = new mongoose.Types.ObjectId().toString();
  
  this.researchItems.push({
    itemId,
    itemType,
    title,
    content,
    reference,
    addedBy,
    addedAt: Date.now(),
    annotations: [],
    comments: []
  });
  
  this.totalItems += 1;
  this.lastActivity = Date.now();
  this.logActivity('Item Added', addedBy, `Added ${itemType}: ${title}`);
  
  return itemId;
};

researchProjectSchema.methods.addAnnotation = function(itemId, userId, username, text, highlightedText) {
  const item = this.researchItems.id(itemId);
  if (item) {
    item.annotations.push({
      userId,
      username,
      text,
      highlightedText,
      createdAt: Date.now()
    });
    
    this.totalAnnotations += 1;
    this.lastActivity = Date.now();
    this.logActivity('Annotation Added', username, `Annotated item: ${item.title}`);
  }
};

researchProjectSchema.methods.addComment = function(itemId, userId, username, text) {
  const item = this.researchItems.id(itemId);
  if (item) {
    item.comments.push({
      userId,
      username,
      text,
      createdAt: Date.now(),
      replies: []
    });
    
    this.totalComments += 1;
    this.lastActivity = Date.now();
    this.logActivity('Comment Added', username, `Commented on: ${item.title}`);
  }
};

researchProjectSchema.methods.logActivity = function(action, performedBy, details) {
  this.activityLog.push({
    action,
    performedBy,
    timestamp: Date.now(),
    details
  });
};

researchProjectSchema.methods.complete = function() {
  this.status = 'Completed';
  this.completedDate = Date.now();
  this.logActivity('Status Changed', this.lastModifiedBy, 'Project completed');
};

// Static methods
researchProjectSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { owner: userId },
      { 'team.userId': userId }
    ],
    status: { $ne: 'Archived' }
  }).sort({ lastActivity: -1 });
};

researchProjectSchema.statics.findByPracticeArea = function(practiceArea) {
  return this.find({ practiceArea, status: { $in: ['Active', 'In Progress'] } })
    .sort({ lastActivity: -1 });
};

researchProjectSchema.statics.searchProjects = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    ...filters
  };
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('ResearchProject', researchProjectSchema);
