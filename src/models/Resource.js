/**
 * Resource Model - Mongoose Schema for Resource Scheduling
 * Manages conference rooms, equipment, and other bookable resources
 */

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  // Basic Information
  resourceNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Resource Type
  resourceType: {
    type: String,
    required: true,
    enum: [
      'Conference Room',
      'Meeting Room',
      'Office',
      'Deposition Room',
      'Video Conference Equipment',
      'Projector',
      'Laptop',
      'Vehicle',
      'Other Equipment'
    ]
  },
  
  // Location
  location: {
    building: String,
    floor: String,
    roomNumber: String,
    address: String
  },
  
  // Capacity & Features
  capacity: {
    type: Number,
    default: 1
  },
  features: [{
    type: String,
    trim: true
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  
  // Availability
  status: {
    type: String,
    required: true,
    enum: ['Available', 'In Use', 'Maintenance', 'Unavailable', 'Retired'],
    default: 'Available',
    index: true
  },
  isBookable: {
    type: Boolean,
    default: true
  },
  
  // Booking Settings
  bookingRules: {
    minBookingDuration: {
      type: Number, // in minutes
      default: 30
    },
    maxBookingDuration: {
      type: Number, // in minutes
      default: 480 // 8 hours
    },
    minAdvanceBooking: {
      type: Number, // in hours
      default: 1
    },
    maxAdvanceBooking: {
      type: Number, // in days
      default: 90
    },
    bufferTime: {
      type: Number, // in minutes
      default: 15
    },
    requiresApproval: {
      type: Boolean,
      default: false
    }
  },
  
  // Operating Hours
  operatingHours: {
    monday: { start: String, end: String, available: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
    thursday: { start: String, end: String, available: { type: Boolean, default: true } },
    friday: { start: String, end: String, available: { type: Boolean, default: true } },
    saturday: { start: String, end: String, available: { type: Boolean, default: false } },
    sunday: { start: String, end: String, available: { type: Boolean, default: false } }
  },
  
  // Maintenance
  maintenanceSchedule: [{
    startDate: Date,
    endDate: Date,
    reason: String,
    scheduledBy: String
  }],
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,
  
  // Metadata
  tags: [String],
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  lastModifiedAt: Date
}, {
  timestamps: true
});

// Indexes
resourceSchema.index({ resourceType: 1, status: 1 });
resourceSchema.index({ isBookable: 1, status: 1 });
resourceSchema.index({ name: 1, resourceType: 1 });

// Resource Booking sub-schema
const resourceBookingSchema = new mongoose.Schema({
  // Booking Information
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
    index: true
  },
  resourceName: {
    type: String,
    required: true
  },
  
  // Booking Details
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
  purpose: {
    type: String,
    trim: true
  },
  
  // Booking Owner
  bookedBy: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  attendees: [{
    name: String,
    email: String
  }],
  
  // Relations
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  caseNumber: String,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CalendarEvent'
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
    default: 'Confirmed',
    index: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  approvedBy: String,
  approvedAt: Date,
  
  // Setup & Cleanup
  setupTime: {
    type: Number, // in minutes
    default: 0
  },
  cleanupTime: {
    type: Number, // in minutes
    default: 0
  },
  setupNotes: String,
  
  // Notes
  notes: {
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
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes for ResourceBooking
resourceBookingSchema.index({ resourceId: 1, startDate: 1, endDate: 1 });
resourceBookingSchema.index({ bookedBy: 1, status: 1 });
resourceBookingSchema.index({ status: 1, startDate: 1 });

// Static method: Check resource availability
resourceSchema.statics.checkAvailability = async function(resourceId, startDate, endDate) {
  const ResourceBooking = mongoose.model('ResourceBooking');
  
  const conflicts = await ResourceBooking.find({
    resourceId,
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
    status: { $nin: ['Cancelled', 'No Show'] }
  });
  
  return {
    available: conflicts.length === 0,
    conflicts
  };
};

// Static method: Find available resources
resourceSchema.statics.findAvailable = async function(resourceType, startDate, endDate, minCapacity = 1) {
  const ResourceBooking = mongoose.model('ResourceBooking');
  
  // Get all resources of this type that meet capacity requirements
  const resources = await this.find({
    resourceType,
    isBookable: true,
    status: 'Available',
    capacity: { $gte: minCapacity }
  });
  
  // Check each resource for conflicts
  const availableResources = [];
  
  for (const resource of resources) {
    const { available } = await this.checkAvailability(resource._id, startDate, endDate);
    if (available) {
      availableResources.push(resource);
    }
  }
  
  return availableResources;
};

// Static method for ResourceBooking: Find conflicts
resourceBookingSchema.statics.findConflicts = function(resourceId, startDate, endDate, excludeBookingId = null) {
  const query = {
    resourceId,
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
    status: { $nin: ['Cancelled', 'No Show'] }
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  return this.find(query).sort({ startDate: 1 });
};

// Instance method for ResourceBooking: Cancel booking
resourceBookingSchema.methods.cancelBooking = function(cancelledBy, reason) {
  this.status = 'Cancelled';
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  this.lastModifiedBy = cancelledBy;
  this.lastModifiedAt = new Date();
  return this.save();
};

// Pre-save middleware
resourceSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

resourceBookingSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

const Resource = mongoose.model('Resource', resourceSchema);
const ResourceBooking = mongoose.model('ResourceBooking', resourceBookingSchema);

module.exports = { Resource, ResourceBooking };
