/**
 * Case Note Model - Mongoose Schema for Case Notes & Updates
 * Tracks all notes, updates, and journal entries for cases
 */

import mongoose from 'mongoose';

const caseNoteSchema = new mongoose.Schema({
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
  
  // Note Content
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  noteType: {
    type: String,
    enum: ['General', 'Meeting', 'Phone Call', 'Email', 'Court Appearance', 'Research', 'Client Communication', 'Internal', 'Other'],
    default: 'General'
  },
  
  // Categorization
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  
  // Visibility & Access
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Team Only', 'Client Visible'],
    default: 'Team Only'
  },
  
  // Author & Attribution
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Editing
  lastModifiedBy: {
    type: String,
    trim: true
  },
  editHistory: [{
    editedBy: String,
    editedAt: Date,
    previousContent: String
  }],
  
  // Pinning & Importance
  pinned: {
    type: Boolean,
    default: false
  },
  
  // Attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: Date
  }],
  
  // Related items
  relatedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseTimelineEvent'
  }]
}, {
  timestamps: true
});

// Indexes
caseNoteSchema.index({ caseId: 1, createdAt: -1 });
caseNoteSchema.index({ caseNumber: 1, noteType: 1 });
caseNoteSchema.index({ tags: 1 });
caseNoteSchema.index({ pinned: 1, caseId: 1 });

// Pre-save middleware to track edits
caseNoteSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.editHistory.push({
      editedBy: this.lastModifiedBy,
      editedAt: Date.now(),
      previousContent: this.content
    });
  }
  next();
});

// Static methods
caseNoteSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ pinned: -1, createdAt: -1 });
};

caseNoteSchema.statics.findByType = function(caseId, noteType) {
  return this.find({ caseId, noteType }).sort({ createdAt: -1 });
};

caseNoteSchema.statics.searchNotes = function(caseId, searchTerm) {
  return this.find({
    caseId,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } }
    ]
  }).sort({ createdAt: -1 });
};

export default mongoose.model('CaseNote', caseNoteSchema);
