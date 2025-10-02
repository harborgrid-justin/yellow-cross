/**
 * CourtroomCalendar Model - Mongoose Schema for Courtroom Calendar
 * Manages courtroom schedules, assignments, hearings, and availability
 */

const mongoose = require('mongoose');

const courtroomCalendarSchema = new mongoose.Schema({
  // Event Identification
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Court Information
  courtName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  courtroom: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  courtroomNumber: String,
  building: String,
  floor: String,
  
  // Judge Assignment
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Judge'
  },
  judgeName: {
    type: String,
    required: true,
    trim: true
  },
  magistrateJudge: String,
  
  // Event Details
  eventType: {
    type: String,
    required: true,
    enum: [
      'Hearing',
      'Trial',
      'Motion Hearing',
      'Status Conference',
      'Settlement Conference',
      'Pretrial Conference',
      'Sentencing',
      'Arraignment',
      'Oral Arguments',
      'Emergency Hearing',
      'Calendar Call',
      'Chambers Conference',
      'Other'
    ],
    index: true
  },
  eventTitle: {
    type: String,
    required: true,
    trim: true
  },
  eventDescription: String,
  
  // Date & Time
  scheduledDate: {
    type: Date,
    required: true,
    index: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  actualStartTime: Date,
  actualEndTime: Date,
  actualDuration: Number,
  
  // Case Information
  caseNumber: {
    type: String,
    required: true,
    index: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  caseTitle: String,
  caseType: String,
  docketNumber: String,
  
  // Parties & Attorneys
  parties: [{
    name: String,
    role: {
      type: String,
      enum: ['Plaintiff', 'Defendant', 'Petitioner', 'Respondent', 'Appellant', 'Appellee', 'Other']
    },
    represented: Boolean,
    attorney: String,
    attorneyFirm: String
  }],
  
  // Attendance
  requiredAttendees: [{
    name: String,
    role: String,
    notified: {
      type: Boolean,
      default: false
    },
    confirmed: {
      type: Boolean,
      default: false
    }
  }],
  actualAttendees: [{
    name: String,
    role: String,
    checkInTime: Date
  }],
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Postponed', 'Cancelled', 'Vacated', 'Continued'],
    default: 'Scheduled',
    index: true
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  
  // Postponement/Continuance
  postponementReason: String,
  continuanceDate: Date,
  continuanceRequested: {
    type: Boolean,
    default: false
  },
  continuanceGranted: {
    type: Boolean,
    default: false
  },
  
  // Hearing Details
  hearingType: String,
  hearingSubject: String,
  motionsToBeHeard: [String],
  documentsToBePresented: [String],
  
  // Trial Details
  trialType: {
    type: String,
    enum: ['Jury Trial', 'Bench Trial', 'N/A']
  },
  juryRequired: Boolean,
  jurySelection: Date,
  estimatedTrialLength: Number,
  
  // Room & Resources
  roomCapacity: Number,
  specialEquipment: [String],
  interpreterRequired: Boolean,
  interpreterLanguage: String,
  videoConference: Boolean,
  videoConferenceLink: String,
  
  // Access & Security
  publicAccess: {
    type: Boolean,
    default: true
  },
  securityLevel: {
    type: String,
    enum: ['Standard', 'Enhanced', 'High', 'Maximum']
  },
  sealedProceeding: {
    type: Boolean,
    default: false
  },
  
  // Outcome & Results
  outcome: String,
  orderIssued: Boolean,
  orderDescription: String,
  nextHearingDate: Date,
  nextHearingType: String,
  
  // Minutes & Notes
  minutes: String,
  judgeNotes: String,
  clerkNotes: String,
  
  // Documents
  filings: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    documentTitle: String,
    filedBy: String,
    filingDate: Date
  }],
  
  // Notifications
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  notificationsSent: [{
    type: {
      type: String,
      enum: ['Scheduled', 'Reminder', 'Changed', 'Cancelled', 'Completed']
    },
    sentAt: Date,
    recipients: [String]
  }],
  remindersSent: {
    oneDayBefore: Boolean,
    oneWeekBefore: Boolean,
    custom: [Date]
  },
  
  // Conflicts
  conflicts: [{
    conflictType: {
      type: String,
      enum: ['Room Double-Booked', 'Judge Conflict', 'Attorney Conflict', 'Time Conflict']
    },
    description: String,
    resolved: Boolean,
    resolvedBy: String,
    resolvedAt: Date
  }],
  
  // Calendar Integration
  externalCalendarIds: [{
    system: String,
    eventId: String
  }],
  
  // Metadata
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium'
  },
  tags: [String],
  notes: String,
  
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
  lastModifiedBy: String,
  lastModifiedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courtroomCalendarSchema.index({ courtroom: 1, scheduledDate: 1 });
courtroomCalendarSchema.index({ judgeName: 1, scheduledDate: 1 });
courtroomCalendarSchema.index({ caseNumber: 1, scheduledDate: 1 });
courtroomCalendarSchema.index({ status: 1, scheduledDate: 1 });
courtroomCalendarSchema.index({ eventType: 1, scheduledDate: 1 });

// Virtual field for is upcoming
courtroomCalendarSchema.virtual('isUpcoming').get(function() {
  return this.scheduledDate > new Date() && this.status === 'Scheduled';
});

// Virtual field for days until event
courtroomCalendarSchema.virtual('daysUntilEvent').get(function() {
  if (!this.scheduledDate) return null;
  const diff = this.scheduledDate.getTime() - Date.now();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Static method to find by courtroom and date
courtroomCalendarSchema.statics.findByRoomAndDate = function(courtroom, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    courtroom,
    scheduledDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $nin: ['Cancelled', 'Vacated'] }
  }).sort({ scheduledTime: 1 });
};

// Static method to find by judge
courtroomCalendarSchema.statics.findByJudge = function(judgeName, startDate, endDate) {
  const query = {
    judgeName,
    status: { $nin: ['Cancelled', 'Vacated'] }
  };
  
  if (startDate && endDate) {
    query.scheduledDate = { $gte: startDate, $lte: endDate };
  }
  
  return this.find(query).sort({ scheduledDate: 1, scheduledTime: 1 });
};

// Static method to find by case
courtroomCalendarSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.find({ caseNumber }).sort({ scheduledDate: -1 });
};

// Static method to check conflicts
courtroomCalendarSchema.statics.checkConflicts = function(courtroom, scheduledDate, scheduledTime, duration) {
  const eventStart = new Date(`${scheduledDate.toDateString()} ${scheduledTime}`);
  const eventEnd = new Date(eventStart.getTime() + duration * 60000);
  
  return this.find({
    courtroom,
    scheduledDate,
    status: { $nin: ['Cancelled', 'Vacated', 'Completed'] },
    $or: [
      {
        $and: [
          { scheduledTime: { $lte: scheduledTime } },
          // Check if existing event end time overlaps
        ]
      }
    ]
  });
};

// Instance method to reschedule
courtroomCalendarSchema.methods.reschedule = function(newDate, newTime, reason, changedBy) {
  this.statusHistory.push({
    status: this.status,
    changedBy,
    changedAt: new Date(),
    reason: `Rescheduled from ${this.scheduledDate.toDateString()} ${this.scheduledTime}. Reason: ${reason}`
  });
  
  this.scheduledDate = newDate;
  this.scheduledTime = newTime;
  this.status = 'Scheduled';
  this.lastModifiedBy = changedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to cancel
courtroomCalendarSchema.methods.cancelEvent = function(reason, cancelledBy) {
  this.statusHistory.push({
    status: this.status,
    changedBy: cancelledBy,
    changedAt: new Date(),
    reason: `Cancelled: ${reason}`
  });
  
  this.status = 'Cancelled';
  this.lastModifiedBy = cancelledBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to mark as completed
courtroomCalendarSchema.methods.complete = function(outcome, completedBy) {
  this.status = 'Completed';
  this.outcome = outcome;
  this.actualEndTime = new Date();
  
  if (this.actualStartTime) {
    this.actualDuration = Math.floor((this.actualEndTime - this.actualStartTime) / 60000);
  }
  
  this.lastModifiedBy = completedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

module.exports = mongoose.model('CourtroomCalendar', courtroomCalendarSchema);
