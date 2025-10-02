/**
 * Calendar & Scheduling System - Validation Schemas
 * Joi validation schemas for all calendar-related operations
 */

const Joi = require('joi');

// Calendar Event Schemas

const createEventSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(2000).allow(''),
  eventType: Joi.string().valid(
    'Court Hearing', 'Court Date', 'Deadline', 'Appointment',
    'Meeting', 'Consultation', 'Deposition', 'Conference',
    'Filing', 'Reminder', 'Task', 'Other'
  ).required(),
  category: Joi.string().trim().max(100).allow(''),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  allDay: Joi.boolean().default(false),
  timezone: Joi.string().trim().default('UTC'),
  location: Joi.string().trim().max(300).allow(''),
  courtroom: Joi.string().trim().max(100).allow(''),
  virtualMeetingUrl: Joi.string().uri().allow(''),
  caseId: Joi.string().trim().allow(''),
  caseNumber: Joi.string().trim().allow(''),
  clientId: Joi.string().trim().allow(''),
  organizer: Joi.string().trim().min(1).max(100).required(),
  attendees: Joi.array().items(Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().allow(''),
    role: Joi.string().trim().allow(''),
    status: Joi.string().valid('Pending', 'Accepted', 'Declined', 'Tentative').default('Pending')
  })).default([]),
  attorneys: Joi.array().items(Joi.string().trim()).default([]),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  status: Joi.string().valid('Scheduled', 'Confirmed', 'Cancelled', 'Completed', 'Rescheduled').default('Scheduled'),
  isRecurring: Joi.boolean().default(false),
  recurrencePattern: Joi.object({
    frequency: Joi.string().valid('Daily', 'Weekly', 'Monthly', 'Yearly'),
    interval: Joi.number().integer().min(1),
    endDate: Joi.date().iso(),
    daysOfWeek: Joi.array().items(Joi.string())
  }).allow(null),
  reminders: Joi.array().items(Joi.object({
    type: Joi.string().valid('Email', 'SMS', 'Push', 'Popup').required(),
    minutesBefore: Joi.number().integer().min(0).required()
  })).default([]),
  resources: Joi.array().items(Joi.object({
    resourceId: Joi.string().trim(),
    resourceName: Joi.string().trim(),
    resourceType: Joi.string().trim()
  })).default([]),
  notes: Joi.string().trim().max(5000).allow(''),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  createdBy: Joi.string().trim().min(1).max(100).required()
});

const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().max(2000).allow(''),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  location: Joi.string().trim().max(300).allow(''),
  courtroom: Joi.string().trim().max(100).allow(''),
  virtualMeetingUrl: Joi.string().uri().allow(''),
  attendees: Joi.array().items(Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().allow(''),
    role: Joi.string().trim().allow(''),
    status: Joi.string().valid('Pending', 'Accepted', 'Declined', 'Tentative')
  })),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical'),
  status: Joi.string().valid('Scheduled', 'Confirmed', 'Cancelled', 'Completed', 'Rescheduled'),
  notes: Joi.string().trim().max(5000).allow(''),
  lastModifiedBy: Joi.string().trim().min(1).max(100).required()
}).min(1);

// Deadline Schemas

const createDeadlineSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(2000).allow(''),
  deadlineType: Joi.string().valid(
    'Filing Deadline', 'Response Deadline', 'Discovery Deadline',
    'Motion Deadline', 'Appeal Deadline', 'Statute of Limitations',
    'Court-Ordered', 'Internal Deadline', 'Custom'
  ).required(),
  dueDate: Joi.date().iso().required(),
  dueTime: Joi.string().trim().allow(''),
  calculationMethod: Joi.string().valid('Manual', 'Court Rules', 'Statute', 'Custom Formula'),
  calculationNotes: Joi.string().trim().max(1000).allow(''),
  courtRule: Joi.string().trim().max(200).allow(''),
  statuteReference: Joi.string().trim().max(200).allow(''),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('High'),
  caseId: Joi.string().trim().required(),
  caseNumber: Joi.string().trim().required(),
  assignedTo: Joi.string().trim().min(1).max(100).required(),
  responsibleAttorney: Joi.string().trim().max(100).allow(''),
  reminders: Joi.array().items(Joi.object({
    daysBeforeDue: Joi.number().integer().min(0).required(),
    reminderType: Joi.string().valid('Email', 'SMS', 'Push', 'In-App'),
    recipients: Joi.array().items(Joi.string().trim())
  })).default([]),
  relatedDocuments: Joi.array().items(Joi.object({
    documentId: Joi.string().trim(),
    documentName: Joi.string().trim()
  })).default([]),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  createdBy: Joi.string().trim().min(1).max(100).required()
});

const calculateDeadlineSchema = Joi.object({
  triggerDate: Joi.date().iso().required(),
  daysToAdd: Joi.number().integer().min(0).required(),
  courtRules: Joi.object({
    skipWeekends: Joi.boolean().default(true),
    holidays: Joi.array().items(Joi.date().iso()).default([]),
    customRules: Joi.object().allow(null)
  }).default({})
});

const extendDeadlineSchema = Joi.object({
  newDueDate: Joi.date().iso().required(),
  extensionReason: Joi.string().trim().min(1).max(500).required(),
  grantedBy: Joi.string().trim().min(1).max(100).required()
});

// Appointment Schemas

const createAppointmentSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(2000).allow(''),
  appointmentType: Joi.string().valid(
    'Client Meeting', 'Consultation', 'Deposition',
    'Internal Meeting', 'Court Appearance', 'Other'
  ).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  location: Joi.string().trim().max(300).allow(''),
  virtualMeetingUrl: Joi.string().uri().allow(''),
  caseId: Joi.string().trim().allow(''),
  caseNumber: Joi.string().trim().allow(''),
  clientId: Joi.string().trim().allow(''),
  organizer: Joi.string().trim().min(1).max(100).required(),
  attendees: Joi.array().items(Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().allow(''),
    role: Joi.string().trim().allow('')
  })).default([]),
  attorneys: Joi.array().items(Joi.string().trim()).min(1).required(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  notes: Joi.string().trim().max(5000).allow(''),
  createdBy: Joi.string().trim().min(1).max(100).required()
});

// Attorney Availability Schemas

const createAvailabilitySchema = Joi.object({
  attorneyName: Joi.string().trim().min(1).max(100).required(),
  attorneyId: Joi.string().trim().allow(''),
  availabilityType: Joi.string().valid(
    'Available', 'Busy', 'Out of Office', 'Tentative',
    'Working Remotely', 'In Court', 'In Meeting',
    'Time Block', 'Vacation', 'Sick Leave'
  ).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  allDay: Joi.boolean().default(false),
  isRecurring: Joi.boolean().default(false),
  recurrencePattern: Joi.object({
    frequency: Joi.string().valid('Daily', 'Weekly', 'Monthly'),
    daysOfWeek: Joi.array().items(Joi.string().valid(
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    )),
    startTime: Joi.string().trim(),
    endTime: Joi.string().trim(),
    effectiveFrom: Joi.date().iso(),
    effectiveUntil: Joi.date().iso()
  }).allow(null),
  reason: Joi.string().trim().max(500).allow(''),
  location: Joi.string().trim().max(300).allow(''),
  notes: Joi.string().trim().max(1000).allow(''),
  allowBookings: Joi.boolean().default(true),
  createdBy: Joi.string().trim().min(1).max(100).required()
});

const checkAvailabilitySchema = Joi.object({
  attorneyName: Joi.string().trim().min(1).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
});

// Resource Schemas

const createResourceSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(1000).allow(''),
  resourceType: Joi.string().valid(
    'Conference Room', 'Meeting Room', 'Office', 'Deposition Room',
    'Video Conference Equipment', 'Projector', 'Laptop', 'Vehicle', 'Other Equipment'
  ).required(),
  location: Joi.object({
    building: Joi.string().trim().allow(''),
    floor: Joi.string().trim().allow(''),
    roomNumber: Joi.string().trim().allow(''),
    address: Joi.string().trim().allow('')
  }).default({}),
  capacity: Joi.number().integer().min(1).default(1),
  features: Joi.array().items(Joi.string().trim()).default([]),
  amenities: Joi.array().items(Joi.string().trim()).default([]),
  isBookable: Joi.boolean().default(true),
  createdBy: Joi.string().trim().min(1).max(100).required()
});

const createResourceBookingSchema = Joi.object({
  resourceId: Joi.string().trim().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  purpose: Joi.string().trim().max(500).allow(''),
  bookedBy: Joi.string().trim().min(1).max(100).required(),
  attendees: Joi.array().items(Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().allow('')
  })).default([]),
  caseId: Joi.string().trim().allow(''),
  caseNumber: Joi.string().trim().allow(''),
  eventId: Joi.string().trim().allow(''),
  setupTime: Joi.number().integer().min(0).default(0),
  cleanupTime: Joi.number().integer().min(0).default(0),
  setupNotes: Joi.string().trim().max(500).allow(''),
  notes: Joi.string().trim().max(1000).allow(''),
  createdBy: Joi.string().trim().min(1).max(100).required()
});

// Conflict Detection Schema

const checkConflictsSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  attorneys: Joi.array().items(Joi.string().trim()).min(1).required(),
  excludeEventId: Joi.string().trim().allow('')
});

// Reminder Schema

const createReminderSchema = Joi.object({
  eventId: Joi.string().trim().required(),
  reminderType: Joi.string().valid('Email', 'SMS', 'Push', 'In-App').required(),
  minutesBefore: Joi.number().integer().min(0).required(),
  recipients: Joi.array().items(Joi.string().trim()).min(1).required(),
  message: Joi.string().trim().max(500).allow(''),
  createdBy: Joi.string().trim().min(1).max(100).required()
});

// Calendar Sync Schema

const syncCalendarSchema = Joi.object({
  provider: Joi.string().valid('Google', 'Outlook', 'iCal').required(),
  syncDirection: Joi.string().valid('OneWay', 'TwoWay').default('TwoWay'),
  calendarId: Joi.string().trim().required(),
  accessToken: Joi.string().trim().required(),
  refreshToken: Joi.string().trim().allow(''),
  syncOptions: Joi.object({
    syncPastDays: Joi.number().integer().min(0).default(30),
    syncFutureDays: Joi.number().integer().min(0).default(90),
    syncCategories: Joi.array().items(Joi.string().trim()).default([])
  }).default({}),
  username: Joi.string().trim().min(1).max(100).required()
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  createDeadlineSchema,
  calculateDeadlineSchema,
  extendDeadlineSchema,
  createAppointmentSchema,
  createAvailabilitySchema,
  checkAvailabilitySchema,
  createResourceSchema,
  createResourceBookingSchema,
  checkConflictsSchema,
  createReminderSchema,
  syncCalendarSchema
};
