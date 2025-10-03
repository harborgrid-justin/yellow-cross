/**
 * CalendarEvent Model - Mongoose Schema for Calendar & Scheduling System
 * Comprehensive data model for legal calendar management
 */

const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  // Basic Information
  eventNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Event Type
  eventType: {
    type: String,
    required: true,
    enum: ['Court Date', 'Deadline', 'Appointment', 'Reminder', 'Task', 'Other'],
    index: true
  },
  eventSubType: {
    type: String,
    trim: true
  },
  
  // Date & Time
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    index: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Physical', 'Virtual', 'Phone', 'TBD'],
      default: 'Physical'
    },
    address: String,
    courtroom: String,
    meetingLink: String,
    phoneNumber: String,
    notes: String
  },
  
  // Court Information (for Court Dates)
  courtInfo: {
    courtName: String,
    judgeName: String,
    caseNumber: String,
    docketNumber: String,
    hearingType: String
  },
  
  // Participants
  attendees: [{
    name: String,
    email: String,
    role: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Tentative'],
      default: 'Pending'
    }
  }],
  organizer: {
    type: String,
    trim: true
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
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  
  // Reminder Settings
  reminders: [{
    type: {
      type: String,
      enum: ['Email', 'SMS', 'Push', 'System'],
      default: 'Email'
    },
    minutesBefore: Number,
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  
  // Status
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Rescheduled', 'Cancelled', 'Completed', 'No Show'],
    default: 'Scheduled',
    index: true
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  
  // Recurrence
  recurrence: {
    enabled: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    },
    interval: Number,
    endDate: Date,
    daysOfWeek: [Number],
    endAfterOccurrences: Number
  },
  
  // Resources
  resources: [{
    type: {
      type: String,
      enum: ['Conference Room', 'Equipment', 'Vehicle', 'Other']
    },
    name: String,
    quantity: Number,
    status: String
  }],
  
  // Conflict Detection
  conflicts: [{
    conflictWith: mongoose.Schema.Types.ObjectId,
    conflictType: String,
    detectedAt: Date,
    resolved: Boolean
  }],
  
  // Synchronization
  syncStatus: {
    outlook: {
      synced: Boolean,
      syncedAt: Date,
      eventId: String
    },
    google: {
      synced: Boolean,
      syncedAt: Date,
      eventId: String
    }
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
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
calendarEventSchema.index({ startDate: 1, endDate: 1 });
calendarEventSchema.index({ caseId: 1, startDate: 1 });
calendarEventSchema.index({ status: 1, startDate: 1 });
calendarEventSchema.index({ eventType: 1, startDate: 1 });

// Virtual for duration
calendarEventSchema.virtual('duration').get(function() {
  if (this.endDate && this.startDate) {
    return Math.round((this.endDate - this.startDate) / (1000 * 60)); // Duration in minutes
  }
  return null;
});

// Virtual for is upcoming
calendarEventSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

// Virtual for is overdue
calendarEventSchema.virtual('isOverdue').get(function() {
  return this.endDate < new Date() && this.status !== 'Completed' && this.status !== 'Cancelled';
});

// Instance method to check for conflicts
calendarEventSchema.methods.hasConflicts = function() {
  return this.conflicts && this.conflicts.length > 0 && this.conflicts.some(c => !c.resolved);
};

// Instance method to mark as completed
calendarEventSchema.methods.markCompleted = function(completedBy) {
  this.status = 'Completed';
  this.lastModifiedBy = completedBy;
  return this.save();
};

// Static method to find upcoming events
calendarEventSchema.statics.findUpcoming = function(days = 7) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  
  return this.find({
    startDate: { $gte: startDate, $lte: endDate },
    status: { $in: ['Scheduled', 'Confirmed'] }
  }).sort({ startDate: 1 });
};

// Static method to find by case
calendarEventSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ startDate: -1 });
};

// Static method to find conflicts
calendarEventSchema.statics.findConflicts = function(startDate, endDate, excludeEventId = null) {
  const query = {
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      { startDate: { $gte: startDate, $lte: endDate } }
    ],
    status: { $in: ['Scheduled', 'Confirmed'] }
  };
  
  if (excludeEventId) {
    query._id = { $ne: excludeEventId };
  }
  
  return this.find(query);
};

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
