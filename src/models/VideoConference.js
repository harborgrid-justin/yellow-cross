/**
 * VideoConference Model - Mongoose Schema for Video Conferencing
 * Tracks video calls, depositions, and virtual meetings
 */

const mongoose = require('mongoose');

const videoConferenceSchema = new mongoose.Schema({
  // Conference Identification
  conferenceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  meetingId: {
    type: String,
    unique: true,
    index: true
  },
  meetingUrl: {
    type: String,
    required: true
  },
  
  // Conference Details
  title: {
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
  conferenceType: {
    type: String,
    enum: ['Team Meeting', 'Client Meeting', 'Deposition', 'Court Hearing', 'Consultation', 'Training', 'Other'],
    default: 'Team Meeting',
    index: true
  },
  
  // Scheduling
  scheduledStartTime: {
    type: Date,
    required: true,
    index: true
  },
  scheduledEndTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Actual Times
  actualStartTime: Date,
  actualEndTime: Date,
  actualDuration: Number,
  
  // Host Information
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Participants
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    role: {
      type: String,
      enum: ['Host', 'Co-Host', 'Participant', 'Observer'],
      default: 'Participant'
    },
    joinedAt: Date,
    leftAt: Date,
    duration: Number,
    isExternal: {
      type: Boolean,
      default: false
    }
  }],
  
  // Invitations
  invitees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    invitationStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Tentative'],
      default: 'Pending'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled',
    index: true
  },
  
  // Conference Settings
  settings: {
    isRecordingEnabled: {
      type: Boolean,
      default: false
    },
    isScreenSharingEnabled: {
      type: Boolean,
      default: true
    },
    isChatEnabled: {
      type: Boolean,
      default: true
    },
    isWaitingRoomEnabled: {
      type: Boolean,
      default: false
    },
    requiresPassword: {
      type: Boolean,
      default: false
    },
    password: String,
    maxParticipants: {
      type: Number,
      default: 100
    },
    allowJoinBeforeHost: {
      type: Boolean,
      default: false
    }
  },
  
  // Recording
  recordings: [{
    recordingId: String,
    filename: String,
    storagePath: String,
    fileSize: Number,
    duration: Number,
    format: String,
    startTime: Date,
    endTime: Date,
    recordedBy: String
  }],
  hasRecording: {
    type: Boolean,
    default: false
  },
  
  // Transcription
  transcripts: [{
    transcriptId: String,
    filename: String,
    storagePath: String,
    language: String,
    generatedAt: Date
  }],
  hasTranscript: {
    type: Boolean,
    default: false
  },
  
  // Chat & Annotations
  chatMessages: [{
    senderId: mongoose.Schema.Types.ObjectId,
    senderName: String,
    message: String,
    timestamp: Date,
    isPrivate: Boolean
  }],
  annotations: [{
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    type: String,
    content: String,
    timestamp: Date
  }],
  
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
  
  // Virtual Background & Features
  features: {
    virtualBackgroundEnabled: {
      type: Boolean,
      default: true
    },
    breakoutRoomsEnabled: {
      type: Boolean,
      default: false
    },
    pollsEnabled: {
      type: Boolean,
      default: false
    },
    whiteboard: {
      type: Boolean,
      default: false
    }
  },
  
  // Integration
  provider: {
    type: String,
    enum: ['Zoom', 'Teams', 'WebEx', 'Google Meet', 'Custom', 'Internal'],
    default: 'Internal'
  },
  providerMeetingId: String,
  
  // Security & Compliance
  isEncrypted: {
    type: Boolean,
    default: true
  },
  isConfidential: {
    type: Boolean,
    default: false
  },
  hasLegalHold: {
    type: Boolean,
    default: false
  },
  
  // Notifications & Reminders
  reminders: [{
    reminderTime: Date,
    reminderType: String,
    sent: Boolean
  }],
  
  // Notes & Follow-up
  notes: {
    type: String,
    maxlength: 5000
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  
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
  cancelledBy: String,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes for performance
videoConferenceSchema.index({ hostId: 1, scheduledStartTime: -1 });
videoConferenceSchema.index({ status: 1, scheduledStartTime: 1 });
videoConferenceSchema.index({ caseId: 1, scheduledStartTime: -1 });
videoConferenceSchema.index({ 'participants.userId': 1 });

// Static method: Find upcoming conferences
videoConferenceSchema.statics.findUpcoming = function(userId, days = 7) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  
  return this.find({
    $or: [
      { hostId: userId },
      { 'participants.userId': userId },
      { 'invitees.userId': userId }
    ],
    scheduledStartTime: { $gte: startDate, $lte: endDate },
    status: { $in: ['Scheduled', 'In Progress'] }
  }).sort({ scheduledStartTime: 1 });
};

// Static method: Find conferences by case
videoConferenceSchema.statics.findByCase = function(caseId) {
  return this.find({ caseId })
    .sort({ scheduledStartTime: -1 });
};

// Instance method: Start conference
videoConferenceSchema.methods.startConference = function() {
  this.status = 'In Progress';
  this.actualStartTime = new Date();
  return this.save();
};

// Instance method: End conference
videoConferenceSchema.methods.endConference = function() {
  this.status = 'Completed';
  this.actualEndTime = new Date();
  if (this.actualStartTime) {
    this.actualDuration = Math.floor((this.actualEndTime - this.actualStartTime) / 1000 / 60);
  }
  return this.save();
};

// Instance method: Add participant
videoConferenceSchema.methods.addParticipant = function(userId, name, email, role = 'Participant') {
  this.participants.push({
    userId,
    name,
    email,
    role,
    joinedAt: new Date()
  });
  return this.save();
};

const VideoConference = mongoose.model('VideoConference', videoConferenceSchema);

module.exports = VideoConference;
