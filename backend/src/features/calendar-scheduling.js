/**
 * Feature 5: Calendar & Scheduling System
 * 8 Sub-Features: Court Date Management, Deadline Management, Appointment Scheduling,
 * Attorney Availability, Reminder & Notification, Calendar Sync, Resource Scheduling, Conflict Detection
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');
const Deadline = require('../models/Deadline');
const { isConnected } = require('../config/database');
const {
  createEventSchema,
  createDeadlineSchema,
  scheduleAppointmentSchema,
  updateEventSchema,
  completeDeadlineSchema,
  requestExtensionSchema,
  checkAvailabilitySchema,
  scheduleResourceSchema,
  createReminderSchema
} = require('../validators/calendarValidators');

// Helper function to generate event number
const generateEventNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `EVT-${year}-${random}`;
};

// Helper function to generate deadline number
const generateDeadlineNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DL-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Court Date Management
router.post('/court-dates', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Date Management',
        description: 'Track court appearances, hearings, and trials',
        endpoint: '/api/calendar/court-dates',
        capabilities: [
          'Court appearance tracking',
          'Hearing scheduling',
          'Trial calendaring',
          'Court location details',
          'Case coordination'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const { error, value: validatedData } = createEventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Force event type to Court Date
    validatedData.eventType = 'Court Date';
    validatedData.eventNumber = generateEventNumber();

    // Create calendar event
    const courtDate = new CalendarEvent(validatedData);
    await courtDate.save();

    res.status(201).json({
      success: true,
      message: 'Court date scheduled successfully',
      data: {
        courtDate,
        eventNumber: courtDate.eventNumber,
        eventId: courtDate._id
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get court dates
router.get('/court-dates', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { caseId, startDate, endDate, status } = req.query;
    const query = { eventType: 'Court Date' };

    if (caseId) query.caseId = caseId;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const courtDates = await CalendarEvent.find(query)
      .sort({ startDate: 1 })
      .limit(100);

    res.json({
      success: true,
      data: {
        courtDates,
        total: courtDates.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 2: Deadline Management
router.post('/deadlines', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Deadline Management',
        description: 'Calculate deadlines and statute of limitations',
        endpoint: '/api/calendar/deadlines',
        capabilities: [
          'Deadline calculation',
          'Court rules engine',
          'Statute tracking',
          'Custom deadline rules',
          'Deadline alerts'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const { error, value: validatedData } = createDeadlineSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    validatedData.deadlineNumber = generateDeadlineNumber();

    // Create deadline
    const deadline = new Deadline(validatedData);
    await deadline.save();

    res.status(201).json({
      success: true,
      message: 'Deadline created successfully',
      data: {
        deadline,
        deadlineNumber: deadline.deadlineNumber,
        deadlineId: deadline._id,
        daysUntilDue: deadline.daysUntilDue,
        isCritical: deadline.isCritical
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get deadlines
router.get('/deadlines', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { caseId, status, priority, upcoming } = req.query;
    let query = {};

    if (caseId) query.caseId = caseId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    let deadlines;
    if (upcoming) {
      const days = parseInt(upcoming) || 7;
      deadlines = await Deadline.findUpcoming(days);
    } else {
      deadlines = await Deadline.find(query)
        .sort({ dueDate: 1 })
        .limit(100);
    }

    res.json({
      success: true,
      data: {
        deadlines,
        total: deadlines.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get overdue deadlines
router.get('/deadlines/overdue', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const overdueDeadlines = await Deadline.findOverdue();

    res.json({
      success: true,
      data: {
        overdueDeadlines,
        total: overdueDeadlines.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Complete deadline
router.post('/deadlines/:id/complete', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { error, value: validatedData } = completeDeadlineSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const deadline = await Deadline.findById(req.params.id);
    if (!deadline) {
      return res.status(404).json({
        success: false,
        error: 'Deadline not found'
      });
    }

    await deadline.markCompleted(
      validatedData.completedBy,
      validatedData.completionNotes
    );

    if (validatedData.filingConfirmation) {
      deadline.filingConfirmation = validatedData.filingConfirmation;
      await deadline.save();
    }

    res.json({
      success: true,
      message: 'Deadline marked as completed',
      data: { deadline }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Request deadline extension
router.post('/deadlines/:id/extension', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { error, value: validatedData } = requestExtensionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const deadline = await Deadline.findById(req.params.id);
    if (!deadline) {
      return res.status(404).json({
        success: false,
        error: 'Deadline not found'
      });
    }

    await deadline.requestExtension(
      validatedData.newDueDate,
      validatedData.reason,
      validatedData.requestedBy
    );

    res.json({
      success: true,
      message: 'Extension request submitted',
      data: { deadline }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 3: Appointment Scheduling
router.post('/appointments', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Appointment Scheduling',
        description: 'Client meetings, consultations, and depositions',
        endpoint: '/api/calendar/appointments',
        capabilities: [
          'Client meeting scheduling',
          'Consultation booking',
          'Deposition scheduling',
          'Location management',
          'Online meeting links'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const { error, value: validatedData } = scheduleAppointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Set event properties
    validatedData.eventType = 'Appointment';
    validatedData.eventSubType = validatedData.appointmentType;
    validatedData.eventNumber = generateEventNumber();

    // Create appointment
    const appointment = new CalendarEvent(validatedData);
    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: {
        appointment,
        eventNumber: appointment.eventNumber,
        eventId: appointment._id
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get appointments
router.get('/appointments', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { startDate, endDate, status } = req.query;
    const query = { eventType: 'Appointment' };

    if (status) query.status = status;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const appointments = await CalendarEvent.find(query)
      .sort({ startDate: 1 })
      .limit(100);

    res.json({
      success: true,
      data: {
        appointments,
        total: appointments.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 4: Attorney Availability
router.get('/availability', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
        feature: 'Attorney Availability',
        description: 'Manage attorney schedules and conflicts',
        endpoint: '/api/calendar/availability',
        capabilities: [
          'Attorney schedules',
          'Availability windows',
          'Time blocking',
          'Out of office',
          'Capacity planning'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { attorney, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    const query = {
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
      status: { $in: ['Scheduled', 'Confirmed'] }
    };

    if (attorney) {
      query.$or = [
        { organizer: attorney },
        { 'attendees.name': attorney }
      ];
    }

    const events = await CalendarEvent.find(query).sort({ startDate: 1 });

    res.json({
      success: true,
      data: {
        events,
        total: events.length,
        attorney: attorney || 'All',
        period: {
          start: startDate,
          end: endDate
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 5: Reminder & Notification System
router.post('/reminders', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({
        feature: 'Reminder & Notification System',
        description: 'Automated reminders and alerts',
        endpoint: '/api/calendar/reminders',
        capabilities: [
          'Email reminders',
          'SMS notifications',
          'Push notifications',
          'Custom reminder rules',
          'Escalation workflows'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate request data
    const validatedData = validateRequest(createReminderSchema, req.body);
    const { eventId, reminderType, minutesBefore } = validatedData;

    const event = await CalendarEvent.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    event.reminders.push({
      type: reminderType,
      minutesBefore: minutesBefore
    });

    await event.save();

    res.json({
      success: true,
      message: 'Reminder added successfully',
      data: { event }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get pending reminders
router.get('/reminders/pending', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const now = new Date();
    const upcoming = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours

    const events = await CalendarEvent.find({
      startDate: { $gte: now, $lte: upcoming },
      status: { $in: ['Scheduled', 'Confirmed'] },
      'reminders.sent': false
    }).select('title startDate reminders');

    res.json({
      success: true,
      data: {
        events,
        total: events.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 6: Calendar Synchronization
router.post('/sync', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({
        feature: 'Calendar Synchronization',
        description: 'Sync with Outlook, Google Calendar',
        endpoint: '/api/calendar/sync',
        capabilities: [
          'Outlook integration',
          'Google Calendar sync',
          'iCal support',
          'Two-way sync',
          'Selective sync'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { eventId, provider, externalEventId } = req.body;

    if (!eventId || !provider) {
      return res.status(400).json({
        success: false,
        error: 'eventId and provider are required'
      });
    }

    const event = await CalendarEvent.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Update sync status
    if (provider === 'outlook') {
      event.syncStatus.outlook = {
        synced: true,
        syncedAt: new Date(),
        eventId: externalEventId
      };
    } else if (provider === 'google') {
      event.syncStatus.google = {
        synced: true,
        syncedAt: new Date(),
        eventId: externalEventId
      };
    }

    await event.save();

    res.json({
      success: true,
      message: `Event synced with ${provider} successfully`,
      data: { event }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get sync status
router.get('/sync/status', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const outlookSynced = await CalendarEvent.countDocuments({ 'syncStatus.outlook.synced': true });
    const googleSynced = await CalendarEvent.countDocuments({ 'syncStatus.google.synced': true });
    const totalEvents = await CalendarEvent.countDocuments();

    res.json({
      success: true,
      data: {
        totalEvents,
        outlookSynced,
        googleSynced,
        syncPercentage: {
          outlook: totalEvents > 0 ? Math.round((outlookSynced / totalEvents) * 100) : 0,
          google: totalEvents > 0 ? Math.round((googleSynced / totalEvents) * 100) : 0
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 7: Resource Scheduling
router.post('/resources', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
        feature: 'Resource Scheduling',
        description: 'Conference rooms and equipment reservation',
        endpoint: '/api/calendar/resources',
        capabilities: [
          'Room booking',
          'Equipment reservation',
          'Resource availability',
          'Booking conflicts',
          'Resource calendars'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { error, value: validatedData } = scheduleResourceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Check for resource conflicts
    const conflicts = await CalendarEvent.find({
      'resources.name': validatedData.resourceName,
      startDate: { $lte: validatedData.endDate },
      endDate: { $gte: validatedData.startDate },
      status: { $in: ['Scheduled', 'Confirmed'] }
    });

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Resource is not available for the requested time',
        conflicts: conflicts.map(c => ({
          eventNumber: c.eventNumber,
          title: c.title,
          startDate: c.startDate,
          endDate: c.endDate
        }))
      });
    }

    // Create resource booking event
    const resourceEvent = new CalendarEvent({
      eventNumber: generateEventNumber(),
      title: `${validatedData.resourceType}: ${validatedData.resourceName}`,
      description: validatedData.purpose,
      eventType: 'Other',
      eventSubType: 'Resource Booking',
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      resources: [{
        type: validatedData.resourceType,
        name: validatedData.resourceName,
        quantity: validatedData.quantity,
        status: 'Reserved'
      }],
      createdBy: validatedData.requestedBy,
      status: 'Confirmed'
    });

    await resourceEvent.save();

    res.status(201).json({
      success: true,
      message: 'Resource reserved successfully',
      data: {
        resourceEvent,
        eventNumber: resourceEvent.eventNumber
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get resource availability
router.get('/resources/availability', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { resourceName, startDate, endDate } = req.query;

    if (!resourceName || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'resourceName, startDate, and endDate are required'
      });
    }

    const bookings = await CalendarEvent.find({
      'resources.name': resourceName,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
      status: { $in: ['Scheduled', 'Confirmed'] }
    }).select('title startDate endDate resources');

    res.json({
      success: true,
      data: {
        resourceName,
        period: { start: startDate, end: endDate },
        bookings,
        isAvailable: bookings.length === 0,
        conflictCount: bookings.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 8: Conflict Detection
router.get('/conflicts', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
        feature: 'Conflict Detection',
        description: 'Automatic scheduling conflict detection',
        endpoint: '/api/calendar/conflicts',
        capabilities: [
          'Schedule conflict detection',
          'Double booking prevention',
          'Travel time consideration',
          'Multi-attorney conflicts',
          'Conflict resolution suggestions'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { startDate, endDate, attendee, eventId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    const query = {
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
      status: { $in: ['Scheduled', 'Confirmed'] }
    };

    if (attendee) {
      query.$or = [
        { organizer: attendee },
        { 'attendees.name': attendee }
      ];
    }

    if (eventId) {
      query._id = { $ne: eventId };
    }

    const conflicts = await CalendarEvent.find(query).sort({ startDate: 1 });

    res.json({
      success: true,
      data: {
        hasConflicts: conflicts.length > 0,
        conflictCount: conflicts.length,
        conflicts: conflicts.map(c => ({
          eventNumber: c.eventNumber,
          title: c.title,
          startDate: c.startDate,
          endDate: c.endDate,
          eventType: c.eventType,
          location: c.location
        })),
        period: { start: startDate, end: endDate }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Check specific event for conflicts
router.post('/conflicts/check', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { error, value: validatedData } = checkAvailabilitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const conflicts = await CalendarEvent.findConflicts(
      validatedData.startDate,
      validatedData.endDate
    );

    // Check for attendee conflicts
    let attendeeConflicts = [];
    if (validatedData.attendees && validatedData.attendees.length > 0) {
      attendeeConflicts = conflicts.filter(event =>
        validatedData.attendees.some(attendee =>
          event.organizer === attendee ||
          event.attendees.some(a => a.name === attendee)
        )
      );
    }

    // Check for resource conflicts
    let resourceConflicts = [];
    if (validatedData.resources && validatedData.resources.length > 0) {
      resourceConflicts = conflicts.filter(event =>
        event.resources.some(r =>
          validatedData.resources.includes(r.name)
        )
      );
    }

    res.json({
      success: true,
      data: {
        hasConflicts: conflicts.length > 0,
        totalConflicts: conflicts.length,
        attendeeConflicts: attendeeConflicts.length,
        resourceConflicts: resourceConflicts.length,
        conflicts: conflicts.map(c => ({
          eventNumber: c.eventNumber,
          title: c.title,
          startDate: c.startDate,
          endDate: c.endDate
        }))
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get upcoming events
router.get('/events/upcoming', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const days = parseInt(req.query.days) || 7;
    const events = await CalendarEvent.findUpcoming(days);

    res.json({
      success: true,
      data: {
        events,
        total: events.length,
        days
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update calendar event
router.put('/events/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { error, value: validatedData } = updateEventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Calendar overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Calendar & Scheduling System',
    subFeatures: [
      'Court Date Management',
      'Deadline Management',
      'Appointment Scheduling',
      'Attorney Availability',
      'Reminder & Notification System',
      'Calendar Synchronization',
      'Resource Scheduling',
      'Conflict Detection'
    ]
  });
});

module.exports = router;
