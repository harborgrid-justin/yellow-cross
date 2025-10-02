/**
 * Attorney Availability Model - Mongoose Schema for Attorney Schedule Management
 * Manages attorney availability, time blocks, and out-of-office periods
 */

const mongoose = require('mongoose');

const attorneyAvailabilitySchema = new mongoose.Schema({
  // Attorney Information
  attorneyName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  attorneyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  // Availability Type
  availabilityType: {
    type: String,
    required: true,
    enum: [
      'Available',
      'Busy',
      'Out of Office',
      'Tentative',
      'Working Remotely',
      'In Court',
      'In Meeting',
      'Time Block',
      'Vacation',
      'Sick Leave'
    ]
  },
  
  // Time Range
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true,
    index: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  
  // Recurring Availability
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly']
    },
    daysOfWeek: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: String,
    endTime: String,
    effectiveFrom: Date,
    effectiveUntil: Date
  },
  
  // Details
  reason: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Capacity Settings
  maxConcurrentEvents: {
    type: Number,
    default: 1
  },
  bufferTimeBefore: {
    type: Number, // in minutes
    default: 0
  },
  bufferTimeAfter: {
    type: Number, // in minutes
    default: 0
  },
  
  // Booking Settings
  allowBookings: {
    type: Boolean,
    default: true
  },
  bookingSlotDuration: {
    type: Number, // in minutes
    default: 60
  },
  minAdvanceBooking: {
    type: Number, // in hours
    default: 24
  },
  maxAdvanceBooking: {
    type: Number, // in days
    default: 90
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Cancelled', 'Expired'],
    default: 'Active',
    index: true
  },
  
  // Override
  isOverride: {
    type: Boolean,
    default: false
  },
  overrideReason: {
    type: String,
    trim: true
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  lastModifiedAt: Date,
  cancelledBy: String,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes
attorneyAvailabilitySchema.index({ attorneyName: 1, startDate: 1, endDate: 1 });
attorneyAvailabilitySchema.index({ startDate: 1, endDate: 1, status: 1 });
attorneyAvailabilitySchema.index({ availabilityType: 1, status: 1 });

// Virtual for duration in hours
attorneyAvailabilitySchema.virtual('durationHours').get(function() {
  if (this.startDate && this.endDate) {
    return Math.round((this.endDate - this.startDate) / (1000 * 60 * 60) * 10) / 10;
  }
  return 0;
});

// Static method: Check attorney availability
attorneyAvailabilitySchema.statics.checkAvailability = async function(attorneyName, startDate, endDate) {
  const conflicts = await this.find({
    attorneyName,
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
    status: 'Active',
    availabilityType: { $in: ['Busy', 'Out of Office', 'In Court', 'In Meeting', 'Vacation', 'Sick Leave'] }
  });
  
  return {
    available: conflicts.length === 0,
    conflicts
  };
};

// Static method: Get attorney schedule
attorneyAvailabilitySchema.statics.getSchedule = function(attorneyName, startDate, endDate) {
  return this.find({
    attorneyName,
    startDate: { $gte: new Date(startDate) },
    endDate: { $lte: new Date(endDate) },
    status: 'Active'
  }).sort({ startDate: 1 });
};

// Static method: Find available time slots
attorneyAvailabilitySchema.statics.findAvailableSlots = async function(
  attorneyName,
  date,
  slotDuration = 60,
  workingHours = { start: '09:00', end: '17:00' }
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(parseInt(workingHours.start.split(':')[0]), parseInt(workingHours.start.split(':')[1]), 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(parseInt(workingHours.end.split(':')[0]), parseInt(workingHours.end.split(':')[1]), 0, 0);
  
  // Get all busy periods for the day
  const busyPeriods = await this.find({
    attorneyName,
    startDate: { $lt: endOfDay },
    endDate: { $gt: startOfDay },
    status: 'Active',
    availabilityType: { $ne: 'Available' }
  }).sort({ startDate: 1 });
  
  // Calculate available slots
  const slots = [];
  let currentTime = new Date(startOfDay);
  
  for (const busy of busyPeriods) {
    const busyStart = new Date(busy.startDate);
    const busyEnd = new Date(busy.endDate);
    
    // Add slots before this busy period
    while (currentTime.getTime() + slotDuration * 60000 <= busyStart.getTime()) {
      slots.push({
        start: new Date(currentTime),
        end: new Date(currentTime.getTime() + slotDuration * 60000)
      });
      currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
    }
    
    // Move current time to end of busy period
    if (busyEnd > currentTime) {
      currentTime = new Date(busyEnd);
    }
  }
  
  // Add remaining slots until end of day
  while (currentTime.getTime() + slotDuration * 60000 <= endOfDay.getTime()) {
    slots.push({
      start: new Date(currentTime),
      end: new Date(currentTime.getTime() + slotDuration * 60000)
    });
    currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
  }
  
  return slots;
};

// Static method: Find attorneys available at specific time
attorneyAvailabilitySchema.statics.findAvailableAttorneys = async function(startDate, endDate, attorneys = []) {
  const query = {
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
    status: 'Active',
    availabilityType: { $in: ['Busy', 'Out of Office', 'In Court', 'In Meeting'] }
  };
  
  if (attorneys.length > 0) {
    query.attorneyName = { $in: attorneys };
  }
  
  const busyAttorneys = await this.distinct('attorneyName', query);
  
  if (attorneys.length > 0) {
    return attorneys.filter(attorney => !busyAttorneys.includes(attorney));
  }
  
  return busyAttorneys;
};

// Instance method: Cancel availability block
attorneyAvailabilitySchema.methods.cancel = function(cancelledBy) {
  this.status = 'Cancelled';
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  this.lastModifiedBy = cancelledBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Pre-save middleware
attorneyAvailabilitySchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  
  // Auto-expire past availability blocks
  if (this.status === 'Active' && this.endDate < new Date()) {
    this.status = 'Expired';
  }
  
  next();
});

const AttorneyAvailability = mongoose.model('AttorneyAvailability', attorneyAvailabilitySchema);

module.exports = AttorneyAvailability;
