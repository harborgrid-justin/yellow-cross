/**
 * Calendar Event Model - Mongoose Schema for Calendar & Scheduling System
 * Core model for all calendar events, appointments, and scheduled items
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
  
  // Event Type & Category
  eventType: {
    type: String,
    required: true,
    enum: [
      'Court Hearing',
      'Court Date',
      'Deadline',
      'Appointment',
      'Meeting',
      'Consultation',
      'Deposition',
      'Conference',
      'Filing',
      'Reminder',
      'Task',
      'Other'
    ]
  },
  category: {
    type: String,
    trim: true
  },
  
  // Timing
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Location
  location: {
    type: String,
    trim: true
  },
  courtroom: {
    type: String,
    trim: true
  },
  virtualMeetingUrl: {
    type: String,
    trim: true
  },
  
  // Relations
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
  
  // Participants
  organizer: {
    type: String,
    required: true,
    trim: true
  },
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
  attorneys: [{
    type: String,
    trim: true
  }],
  
  // Priority & Status
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Cancelled', 'Completed', 'Rescheduled'],
    default: 'Scheduled'
  },
  
  // Recurrence
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Yearly']
    },
    interval: Number,
    endDate: Date,
    daysOfWeek: [String]
  },
  parentEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CalendarEvent'
  },
  
  // Reminders
  reminders: [{
    type: {
      type: String,
      enum: ['Email', 'SMS', 'Push', 'Popup']
    },
    minutesBefore: Number,
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  
  // External Calendar Sync
  externalCalendarId: {
    type: String,
    trim: true
  },
  externalEventId: {
    type: String,
    trim: true
  },
  syncProvider: {
    type: String,
    enum: ['Google', 'Outlook', 'iCal', 'None'],
    default: 'None'
  },
  lastSyncedAt: Date,
  
  // Resources
  resources: [{
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    },
    resourceName: String,
    resourceType: String
  }],
  
  // Notes & Attachments
  notes: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    fileUrl: String,
    fileSize: Number
  }],
  
  // Outcome (for completed events)
  outcome: {
    type: String,
    trim: true
  },
  completionNotes: {
    type: String,
    trim: true
  },
  
  // Metadata
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  tags: [String],
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  lastModifiedAt: Date,
  cancelledBy: String,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes for performance
calendarEventSchema.index({ startDate: 1, endDate: 1 });
calendarEventSchema.index({ eventType: 1, status: 1 });
calendarEventSchema.index({ caseId: 1, startDate: -1 });
calendarEventSchema.index({ organizer: 1, startDate: -1 });
calendarEventSchema.index({ 'attendees.name': 1 });
calendarEventSchema.index({ status: 1, startDate: 1 });

// Virtual for duration in minutes
calendarEventSchema.virtual('durationMinutes').get(function() {
  if (this.startDate && this.endDate) {
    return Math.round((this.endDate - this.startDate) / (1000 * 60));
  }
  return 0;
});

// Virtual for formatted date range
calendarEventSchema.virtual('dateRange').get(function() {
  if (this.startDate && this.endDate) {
    return `${this.startDate.toISOString()} - ${this.endDate.toISOString()}`;
  }
  return '';
});

// Static method: Find events by date range
calendarEventSchema.statics.findByDateRange = function(startDate, endDate, filters = {}) {
  const query = {
    startDate: { $gte: new Date(startDate) },
    endDate: { $lte: new Date(endDate) },
    ...filters
  };
  return this.find(query).sort({ startDate: 1 });
};

// Static method: Find events for a specific attorney
calendarEventSchema.statics.findByAttorney = function(attorneyName, startDate, endDate) {
  return this.find({
    attorneys: attorneyName,
    startDate: { $gte: new Date(startDate) },
    endDate: { $lte: new Date(endDate) },
    status: { $ne: 'Cancelled' }
  }).sort({ startDate: 1 });
};

// Static method: Find upcoming events
calendarEventSchema.statics.findUpcoming = function(days = 7, filters = {}) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    startDate: { $gte: now, $lte: futureDate },
    status: { $nin: ['Cancelled', 'Completed'] },
    ...filters
  }).sort({ startDate: 1 });
};

// Static method: Check for conflicts
calendarEventSchema.statics.findConflicts = async function(startDate, endDate, attorneys, excludeEventId = null) {
  const query = {
    $or: [
      {
        startDate: { $lt: new Date(endDate) },
        endDate: { $gt: new Date(startDate) }
      }
    ],
    attorneys: { $in: attorneys },
    status: { $nin: ['Cancelled'] }
  };
  
  if (excludeEventId) {
    query._id = { $ne: excludeEventId };
  }
  
  return this.find(query).sort({ startDate: 1 });
};

// Instance method: Cancel event
calendarEventSchema.methods.cancelEvent = function(cancelledBy, reason) {
  this.status = 'Cancelled';
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  return this.save();
};

// Instance method: Complete event
calendarEventSchema.methods.completeEvent = function(completedBy, outcome, notes) {
  this.status = 'Completed';
  this.outcome = outcome;
  this.completionNotes = notes;
  this.lastModifiedBy = completedBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Instance method: Reschedule event
calendarEventSchema.methods.reschedule = function(newStartDate, newEndDate, rescheduledBy) {
  this.startDate = new Date(newStartDate);
  this.endDate = new Date(newEndDate);
  this.status = 'Rescheduled';
  this.lastModifiedBy = rescheduledBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Pre-save middleware to update lastModifiedAt
calendarEventSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

module.exports = CalendarEvent;
