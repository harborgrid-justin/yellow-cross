/**
 * Calendar Validation Schemas using Joi
 * Input validation for calendar and scheduling operations
 */

import Joi from 'joi';

// Validation schema for calendar event creation
const createEventSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  eventType: Joi.string().required().valid('Court Date', 'Deadline', 'Appointment', 'Reminder', 'Task', 'Other'),
  eventSubType: Joi.string().trim().allow('').max(100),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  allDay: Joi.boolean().default(false),
  location: Joi.object({
    type: Joi.string().valid('Physical', 'Virtual', 'Phone', 'TBD').default('Physical'),
    address: Joi.string().trim().allow('').max(500),
    courtroom: Joi.string().trim().allow('').max(100),
    meetingLink: Joi.string().uri().allow('').max(500),
    phoneNumber: Joi.string().trim().allow('').max(50),
    notes: Joi.string().trim().allow('').max(500)
  }).optional(),
  courtInfo: Joi.object({
    courtName: Joi.string().trim().allow('').max(200),
    judgeName: Joi.string().trim().allow('').max(100),
    caseNumber: Joi.string().trim().allow('').max(50),
    docketNumber: Joi.string().trim().allow('').max(50),
    hearingType: Joi.string().trim().allow('').max(100)
  }).optional(),
  attendees: Joi.array().items(Joi.object({
    name: Joi.string().trim().max(100),
    email: Joi.string().email().allow('').max(100),
    role: Joi.string().trim().allow('').max(50),
    status: Joi.string().valid('Pending', 'Accepted', 'Declined', 'Tentative').default('Pending')
  })).optional(),
  organizer: Joi.string().trim().allow('').max(100),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().allow('').max(50),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  reminders: Joi.array().items(Joi.object({
    type: Joi.string().valid('Email', 'SMS', 'Push', 'System').default('Email'),
    minutesBefore: Joi.number().min(0).max(10080)
  })).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  recurrence: Joi.object({
    enabled: Joi.boolean().default(false),
    pattern: Joi.string().valid('Daily', 'Weekly', 'Monthly', 'Yearly'),
    interval: Joi.number().min(1).max(365),
    endDate: Joi.date(),
    daysOfWeek: Joi.array().items(Joi.number().min(0).max(6)),
    endAfterOccurrences: Joi.number().min(1).max(365)
  }).optional(),
  resources: Joi.array().items(Joi.object({
    type: Joi.string().valid('Conference Room', 'Equipment', 'Vehicle', 'Other'),
    name: Joi.string().trim().max(100),
    quantity: Joi.number().min(1).default(1)
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notes: Joi.string().trim().allow('').max(2000),
  createdBy: Joi.string().required().trim()
});

// Validation schema for deadline creation
const createDeadlineSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  deadlineType: Joi.string().required().valid('Filing', 'Response', 'Discovery', 'Motion', 'Appeal', 'Statute of Limitations', 'Other'),
  dueDate: Joi.date().required(),
  triggerDate: Joi.date().optional(),
  calculationMethod: Joi.string().valid('Calendar Days', 'Business Days', 'Court Days').default('Calendar Days'),
  daysAllowed: Joi.number().min(0).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  caseId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  caseNumber: Joi.string().trim().allow('').max(50),
  courtRule: Joi.object({
    jurisdiction: Joi.string().trim().allow('').max(100),
    court: Joi.string().trim().allow('').max(100),
    ruleNumber: Joi.string().trim().allow('').max(50),
    ruleDescription: Joi.string().trim().allow('').max(500)
  }).optional(),
  assignedTo: Joi.string().trim().allow('').max(100),
  alerts: Joi.array().items(Joi.object({
    alertType: Joi.string().valid('Email', 'SMS', 'Push', 'System').default('Email'),
    daysBefore: Joi.number().min(0).max(365),
    recipient: Joi.string().trim().max(100)
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for appointment scheduling
const scheduleAppointmentSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  appointmentType: Joi.string().required().valid('Client Meeting', 'Consultation', 'Deposition', 'Internal Meeting', 'Other'),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  location: Joi.object({
    type: Joi.string().valid('Physical', 'Virtual', 'Phone', 'TBD').default('Physical'),
    address: Joi.string().trim().allow('').max(500),
    meetingLink: Joi.string().uri().allow('').max(500),
    phoneNumber: Joi.string().trim().allow('').max(50)
  }).required(),
  attendees: Joi.array().items(Joi.object({
    name: Joi.string().trim().required().max(100),
    email: Joi.string().email().allow('').max(100),
    role: Joi.string().trim().allow('').max(50)
  })).min(1).required(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  notes: Joi.string().trim().allow('').max(2000),
  reminders: Joi.array().items(Joi.object({
    type: Joi.string().valid('Email', 'SMS', 'Push').default('Email'),
    minutesBefore: Joi.number().min(0).max(10080)
  })).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for event update
const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).optional(),
  description: Joi.string().trim().allow('').max(2000).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  status: Joi.string().valid('Scheduled', 'Confirmed', 'Rescheduled', 'Cancelled', 'Completed', 'No Show').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  notes: Joi.string().trim().allow('').max(2000).optional(),
  lastModifiedBy: Joi.string().required().trim()
}).min(2);

// Validation schema for deadline completion
const completeDeadlineSchema = Joi.object({
  completedBy: Joi.string().required().trim(),
  completionNotes: Joi.string().trim().allow('').max(1000),
  filingConfirmation: Joi.object({
    confirmationNumber: Joi.string().trim().max(100),
    filedDate: Joi.date(),
    filingMethod: Joi.string().trim().max(100)
  }).optional()
});

// Validation schema for deadline extension request
const requestExtensionSchema = Joi.object({
  newDueDate: Joi.date().required(),
  reason: Joi.string().required().trim().min(10).max(500),
  requestedBy: Joi.string().required().trim()
});

// Validation schema for availability check
const checkAvailabilitySchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  attendees: Joi.array().items(Joi.string().trim()).optional(),
  resources: Joi.array().items(Joi.string().trim()).optional()
});

// Validation schema for resource scheduling
const scheduleResourceSchema = Joi.object({
  resourceType: Joi.string().required().valid('Conference Room', 'Equipment', 'Vehicle', 'Other'),
  resourceName: Joi.string().required().trim().min(2).max(100),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  quantity: Joi.number().min(1).default(1),
  purpose: Joi.string().trim().allow('').max(200),
  requestedBy: Joi.string().required().trim()
});

// Validation schema for reminder creation
const createReminderSchema = Joi.object({
  eventId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  reminderType: Joi.string().required().valid('Email', 'SMS', 'Push', 'System'),
  minutesBefore: Joi.number().required().min(0).max(10080), // max 1 week in minutes
  recipient: Joi.string().trim().allow('').max(100),
  customMessage: Joi.string().trim().allow('').max(500)
});

export {

  createEventSchema,
  createDeadlineSchema,
  scheduleAppointmentSchema,
  updateEventSchema,
  completeDeadlineSchema,
  requestExtensionSchema,
  checkAvailabilitySchema,
  scheduleResourceSchema,
  createReminderSchema

};
