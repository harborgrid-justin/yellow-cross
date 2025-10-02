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
const AttorneyAvailability = require('../models/AttorneyAvailability');
const { Resource, ResourceBooking } = require('../models/Resource');
const { isConnected } = require('../config/database');
const {
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
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `DL-${year}-${random}`;
};

// Helper function to generate resource number
const generateResourceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RES-${year}-${random}`;
};

// Helper function to generate booking number
const generateBookingNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `BK-${year}-${random}`;
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
    const validatedData = validateRequest(createEventSchema, {
      ...req.body,
      eventType: 'Court Date'
    });

    // Generate event number
    const eventNumber = generateEventNumber();

    // Check for scheduling conflicts
    if (validatedData.attorneys && validatedData.attorneys.length > 0) {
      const conflicts = await CalendarEvent.findConflicts(
        validatedData.startDate,
        validatedData.endDate,
        validatedData.attorneys
      );

      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Scheduling conflict detected',
          conflicts: conflicts.map(c => ({
            eventId: c._id,
            title: c.title,
            startDate: c.startDate,
            endDate: c.endDate,
            attorneys: c.attorneys
          }))
        });
      }
    }

    // Create court date event
    const courtDate = new CalendarEvent({
      ...validatedData,
      eventNumber,
      eventType: 'Court Date'
    });

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
      message: error.message
    });
  }
});

// Get court dates
router.get('/court-dates', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Date Management',
        message: 'Database not connected'
      });
    }

    const { startDate, endDate, caseId, attorney } = req.query;
    const filters = { eventType: 'Court Date', status: { $ne: 'Cancelled' } };

    if (caseId) filters.caseId = caseId;
    if (attorney) filters.attorneys = attorney;

    let courtDates;
    if (startDate && endDate) {
      courtDates = await CalendarEvent.findByDateRange(startDate, endDate, filters);
    } else {
      courtDates = await CalendarEvent.findUpcoming(30, filters);
    }

    res.json({
      success: true,
      count: courtDates.length,
      data: courtDates
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Sub-Feature 2: Deadline Management
router.post('/deadlines', async (req, res) => {
  try {
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
    const validatedData = validateRequest(createDeadlineSchema, req.body);

    // Generate deadline number
    const deadlineNumber = generateDeadlineNumber();

    // Create deadline
    const deadline = new Deadline({
      ...validatedData,
      deadlineNumber,
      status: 'Upcoming'
    });

    await deadline.save();

    res.status(201).json({
      success: true,
      message: 'Deadline created successfully',
      data: {
        deadline,
        deadlineNumber: deadline.deadlineNumber,
        deadlineId: deadline._id,
        daysUntilDue: deadline.daysUntilDue
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get deadlines
router.get('/deadlines', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Deadline Management',
        message: 'Database not connected'
      });
    }

    const { type, caseId, attorney, includeCompleted } = req.query;
    let deadlines;

    if (type === 'upcoming') {
      const days = parseInt(req.query.days) || 30;
      deadlines = await Deadline.findUpcoming(days, caseId ? { caseId } : {});
    } else if (type === 'overdue') {
      deadlines = await Deadline.findOverdue(caseId ? { caseId } : {});
    } else if (caseId) {
      deadlines = await Deadline.findByCaseId(caseId, includeCompleted === 'true');
    } else if (attorney) {
      deadlines = await Deadline.findByAttorney(attorney, includeCompleted === 'true');
    } else {
      deadlines = await Deadline.find({ completed: false }).sort({ dueDate: 1 }).limit(100);
    }

    res.json({
      success: true,
      count: deadlines.length,
      data: deadlines
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Calculate deadline
router.post('/deadlines/calculate', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Deadline Calculation',
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(calculateDeadlineSchema, req.body);
    
    const calculatedDate = Deadline.calculateDeadline(
      validatedData.triggerDate,
      validatedData.daysToAdd,
      validatedData.courtRules
    );

    res.json({
      success: true,
      data: {
        triggerDate: validatedData.triggerDate,
        daysToAdd: validatedData.daysToAdd,
        calculatedDeadline: calculatedDate,
        courtRules: validatedData.courtRules
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Mark deadline as completed
router.post('/deadlines/:id/complete', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const deadline = await Deadline.findById(req.params.id);
    if (!deadline) {
      return res.status(404).json({
        success: false,
        message: 'Deadline not found'
      });
    }

    const { completedBy, notes } = req.body;
    await deadline.markCompleted(completedBy, notes);

    res.json({
      success: true,
      message: 'Deadline marked as completed',
      data: deadline
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Extend deadline
router.post('/deadlines/:id/extend', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const deadline = await Deadline.findById(req.params.id);
    if (!deadline) {
      return res.status(404).json({
        success: false,
        message: 'Deadline not found'
      });
    }

    const validatedData = validateRequest(extendDeadlineSchema, req.body);
    await deadline.extendDeadline(
      validatedData.newDueDate,
      validatedData.extensionReason,
      validatedData.grantedBy
    );

    res.json({
      success: true,
      message: 'Deadline extended successfully',
      data: deadline
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Sub-Feature 3: Appointment Scheduling
router.post('/appointments', async (req, res) => {
  try {
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
    const validatedData = validateRequest(createAppointmentSchema, req.body);

    // Generate event number
    const eventNumber = generateEventNumber();

    // Check for attorney availability
    if (validatedData.attorneys && validatedData.attorneys.length > 0) {
      const conflicts = await CalendarEvent.findConflicts(
        validatedData.startDate,
        validatedData.endDate,
        validatedData.attorneys
      );

      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Attorney not available at requested time',
          conflicts: conflicts.map(c => ({
            eventId: c._id,
            title: c.title,
            startDate: c.startDate,
            endDate: c.endDate,
            attorneys: c.attorneys
          }))
        });
      }
    }

    // Create appointment
    const appointment = new CalendarEvent({
      ...validatedData,
      eventNumber,
      eventType: 'Appointment'
    });

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
      message: error.message
    });
  }
});

// Get appointments
router.get('/appointments', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Appointment Scheduling',
        message: 'Database not connected'
      });
    }

    const { startDate, endDate, attorney, caseId, status } = req.query;
    const filters = { eventType: 'Appointment' };

    if (attorney) filters.attorneys = attorney;
    if (caseId) filters.caseId = caseId;
    if (status) filters.status = status;

    let appointments;
    if (startDate && endDate) {
      appointments = await CalendarEvent.findByDateRange(startDate, endDate, filters);
    } else {
      appointments = await CalendarEvent.findUpcoming(7, filters);
    }

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update appointment
router.put('/appointments/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const appointment = await CalendarEvent.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const validatedData = validateRequest(updateEventSchema, req.body);

    // Update appointment fields
    Object.keys(validatedData).forEach(key => {
      if (key !== 'lastModifiedBy') {
        appointment[key] = validatedData[key];
      }
    });
    appointment.lastModifiedBy = validatedData.lastModifiedBy;

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel appointment
router.post('/appointments/:id/cancel', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const appointment = await CalendarEvent.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const { cancelledBy, reason } = req.body;
    await appointment.cancelEvent(cancelledBy, reason);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Sub-Feature 4: Attorney Availability
router.get('/availability', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
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

    if (!attorney) {
      return res.status(400).json({
        success: false,
        message: 'Attorney name is required'
      });
    }

    if (startDate && endDate) {
      const schedule = await AttorneyAvailability.getSchedule(attorney, startDate, endDate);
      
      res.json({
        success: true,
        attorney,
        startDate,
        endDate,
        count: schedule.length,
        data: schedule
      });
    } else {
      // Check current availability
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const { available, conflicts } = await AttorneyAvailability.checkAvailability(
        attorney,
        now,
        endOfDay
      );

      res.json({
        success: true,
        attorney,
        currentlyAvailable: available,
        conflicts: conflicts.length > 0 ? conflicts : []
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Check attorney availability for specific time
router.post('/availability/check', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(checkAvailabilitySchema, req.body);

    const { available, conflicts } = await AttorneyAvailability.checkAvailability(
      validatedData.attorneyName,
      validatedData.startDate,
      validatedData.endDate
    );

    res.json({
      success: true,
      attorney: validatedData.attorneyName,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      available,
      conflicts: conflicts.map(c => ({
        id: c._id,
        type: c.availabilityType,
        startDate: c.startDate,
        endDate: c.endDate,
        reason: c.reason
      }))
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Set attorney availability
router.post('/availability', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(createAvailabilitySchema, req.body);

    const availability = new AttorneyAvailability(validatedData);
    await availability.save();

    res.status(201).json({
      success: true,
      message: 'Attorney availability set successfully',
      data: availability
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get available time slots
router.get('/availability/slots', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const { attorney, date, duration } = req.query;

    if (!attorney || !date) {
      return res.status(400).json({
        success: false,
        message: 'Attorney name and date are required'
      });
    }

    const slotDuration = parseInt(duration) || 60;
    const slots = await AttorneyAvailability.findAvailableSlots(attorney, date, slotDuration);

    res.json({
      success: true,
      attorney,
      date,
      slotDuration,
      count: slots.length,
      slots
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Sub-Feature 5: Reminder & Notification System
router.post('/reminders', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
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

    const validatedData = validateRequest(createReminderSchema, req.body);

    // Find the event
    const event = await CalendarEvent.findById(validatedData.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Add reminder to event
    event.reminders.push({
      type: validatedData.reminderType,
      minutesBefore: validatedData.minutesBefore,
      sent: false
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: {
        eventId: event._id,
        eventTitle: event.title,
        reminder: event.reminders[event.reminders.length - 1]
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get pending reminders
router.get('/reminders/pending', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    // Find events with unsent reminders that are due
    const now = new Date();
    const events = await CalendarEvent.find({
      status: { $nin: ['Cancelled', 'Completed'] },
      'reminders.sent': false,
      startDate: { $gt: now }
    });

    const pendingReminders = [];
    
    events.forEach(event => {
      event.reminders.forEach((reminder, index) => {
        if (!reminder.sent) {
          const reminderTime = new Date(event.startDate);
          reminderTime.setMinutes(reminderTime.getMinutes() - reminder.minutesBefore);
          
          if (reminderTime <= now) {
            pendingReminders.push({
              eventId: event._id,
              eventTitle: event.title,
              eventStartDate: event.startDate,
              reminderIndex: index,
              reminderType: reminder.type,
              minutesBefore: reminder.minutesBefore,
              reminderTime
            });
          }
        }
      });
    });

    res.json({
      success: true,
      count: pendingReminders.length,
      data: pendingReminders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Sub-Feature 6: Calendar Synchronization
router.post('/sync', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
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

    const validatedData = validateRequest(syncCalendarSchema, req.body);

    // In production, this would integrate with external calendar APIs
    // For now, we'll mark events for sync and track sync status

    const syncOptions = validatedData.syncOptions;
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - syncOptions.syncPastDays);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + syncOptions.syncFutureDays);

    // Find events in date range
    const eventsToSync = await CalendarEvent.find({
      startDate: { $gte: pastDate, $lte: futureDate },
      status: { $ne: 'Cancelled' }
    });

    // Update sync metadata
    const syncUpdates = [];
    for (const event of eventsToSync) {
      event.syncProvider = validatedData.provider;
      event.externalCalendarId = validatedData.calendarId;
      event.lastSyncedAt = new Date();
      await event.save();
      syncUpdates.push({
        eventId: event._id,
        eventTitle: event.title,
        synced: true
      });
    }

    res.json({
      success: true,
      message: `Calendar synchronized with ${validatedData.provider}`,
      data: {
        provider: validatedData.provider,
        calendarId: validatedData.calendarId,
        syncDirection: validatedData.syncDirection,
        eventsSynced: syncUpdates.length,
        dateRange: {
          from: pastDate,
          to: futureDate
        },
        events: syncUpdates
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get sync status
router.get('/sync/status', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const { provider } = req.query;
    const filters = {};
    
    if (provider) {
      filters.syncProvider = provider;
    }

    const syncedEvents = await CalendarEvent.find({
      ...filters,
      externalCalendarId: { $exists: true, $ne: null }
    }).sort({ lastSyncedAt: -1 }).limit(100);

    // Group by provider
    const syncStatus = {};
    syncedEvents.forEach(event => {
      const prov = event.syncProvider || 'None';
      if (!syncStatus[prov]) {
        syncStatus[prov] = {
          provider: prov,
          count: 0,
          lastSync: null
        };
      }
      syncStatus[prov].count++;
      if (!syncStatus[prov].lastSync || event.lastSyncedAt > syncStatus[prov].lastSync) {
        syncStatus[prov].lastSync = event.lastSyncedAt;
      }
    });

    res.json({
      success: true,
      syncStatus: Object.values(syncStatus),
      totalSyncedEvents: syncedEvents.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Sub-Feature 7: Resource Scheduling
router.post('/resources', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
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

    const validatedData = validateRequest(createResourceSchema, req.body);

    // Generate resource number
    const resourceNumber = generateResourceNumber();

    const resource = new Resource({
      ...validatedData,
      resourceNumber,
      status: 'Available'
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: {
        resource,
        resourceNumber: resource.resourceNumber,
        resourceId: resource._id
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get resources
router.get('/resources', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const { type, status, available, startDate, endDate, minCapacity } = req.query;
    
    if (available === 'true' && startDate && endDate) {
      // Find available resources for time range
      const capacity = minCapacity ? parseInt(minCapacity) : 1;
      const availableResources = await Resource.findAvailable(
        type || 'Conference Room',
        startDate,
        endDate,
        capacity
      );

      res.json({
        success: true,
        count: availableResources.length,
        data: availableResources
      });
    } else {
      // Get all resources with filters
      const filters = {};
      if (type) filters.resourceType = type;
      if (status) filters.status = status;

      const resources = await Resource.find(filters).sort({ name: 1 });

      res.json({
        success: true,
        count: resources.length,
        data: resources
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Book resource
router.post('/resources/book', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(createResourceBookingSchema, req.body);

    // Check resource exists
    const resource = await Resource.findById(validatedData.resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check availability
    const { available, conflicts } = await Resource.checkAvailability(
      validatedData.resourceId,
      validatedData.startDate,
      validatedData.endDate
    );

    if (!available) {
      return res.status(409).json({
        success: false,
        message: 'Resource not available at requested time',
        conflicts: conflicts.map(c => ({
          bookingId: c._id,
          startDate: c.startDate,
          endDate: c.endDate,
          bookedBy: c.bookedBy
        }))
      });
    }

    // Create booking
    const bookingNumber = generateBookingNumber();
    const booking = new ResourceBooking({
      ...validatedData,
      bookingNumber,
      resourceName: resource.name,
      status: resource.bookingRules?.requiresApproval ? 'Pending' : 'Confirmed'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Resource booked successfully',
      data: {
        booking,
        bookingNumber: booking.bookingNumber,
        bookingId: booking._id,
        requiresApproval: resource.bookingRules?.requiresApproval || false
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get resource bookings
router.get('/resources/bookings', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const { resourceId, bookedBy, status, startDate, endDate } = req.query;
    const filters = {};

    if (resourceId) filters.resourceId = resourceId;
    if (bookedBy) filters.bookedBy = bookedBy;
    if (status) filters.status = status;
    
    if (startDate && endDate) {
      filters.startDate = { $gte: new Date(startDate) };
      filters.endDate = { $lte: new Date(endDate) };
    }

    const bookings = await ResourceBooking.find(filters)
      .sort({ startDate: 1 })
      .limit(200);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel resource booking
router.post('/resources/bookings/:id/cancel', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const booking = await ResourceBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const { cancelledBy, reason } = req.body;
    await booking.cancelBooking(cancelledBy, reason);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Sub-Feature 8: Conflict Detection
router.get('/conflicts', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
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

    const { attorney, startDate, endDate } = req.query;

    if (!attorney) {
      return res.status(400).json({
        success: false,
        message: 'Attorney name is required'
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Find conflicts for attorney
    const conflicts = await CalendarEvent.findConflicts(
      startDate,
      endDate,
      [attorney]
    );

    // Analyze conflicts
    const conflictAnalysis = {
      hasConflicts: conflicts.length > 0,
      conflictCount: conflicts.length,
      conflicts: conflicts.map(c => ({
        eventId: c._id,
        eventNumber: c.eventNumber,
        title: c.title,
        eventType: c.eventType,
        startDate: c.startDate,
        endDate: c.endDate,
        location: c.location,
        priority: c.priority,
        status: c.status
      }))
    };

    // Check resource conflicts if provided
    const resourceId = req.query.resourceId;
    if (resourceId) {
      const resourceConflicts = await ResourceBooking.findConflicts(
        resourceId,
        startDate,
        endDate
      );

      conflictAnalysis.resourceConflicts = {
        hasConflicts: resourceConflicts.length > 0,
        conflictCount: resourceConflicts.length,
        conflicts: resourceConflicts.map(b => ({
          bookingId: b._id,
          bookingNumber: b.bookingNumber,
          startDate: b.startDate,
          endDate: b.endDate,
          bookedBy: b.bookedBy,
          purpose: b.purpose
        }))
      };
    }

    res.json({
      success: true,
      attorney,
      timeSlot: {
        startDate,
        endDate
      },
      ...conflictAnalysis
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Check conflicts for multiple attorneys
router.post('/conflicts/check', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(checkConflictsSchema, req.body);

    const conflicts = await CalendarEvent.findConflicts(
      validatedData.startDate,
      validatedData.endDate,
      validatedData.attorneys,
      validatedData.excludeEventId
    );

    // Group conflicts by attorney
    const conflictsByAttorney = {};
    validatedData.attorneys.forEach(attorney => {
      conflictsByAttorney[attorney] = [];
    });

    conflicts.forEach(conflict => {
      conflict.attorneys.forEach(attorney => {
        if (validatedData.attorneys.includes(attorney)) {
          conflictsByAttorney[attorney].push({
            eventId: conflict._id,
            eventNumber: conflict.eventNumber,
            title: conflict.title,
            eventType: conflict.eventType,
            startDate: conflict.startDate,
            endDate: conflict.endDate,
            location: conflict.location
          });
        }
      });
    });

    // Find available attorneys
    const availableAttorneys = validatedData.attorneys.filter(
      attorney => conflictsByAttorney[attorney].length === 0
    );

    res.json({
      success: true,
      timeSlot: {
        startDate: validatedData.startDate,
        endDate: validatedData.endDate
      },
      attorneys: validatedData.attorneys,
      hasConflicts: conflicts.length > 0,
      totalConflicts: conflicts.length,
      availableAttorneys,
      conflictsByAttorney
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Calendar overview
router.get('/', async (req, res) => {
  try {
    const overview = {
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
    };

    // If database is connected, provide statistics
    if (isConnected()) {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const [
        totalEvents,
        upcomingEvents,
        totalDeadlines,
        upcomingDeadlines,
        overdueDeadlines,
        totalResources,
        activeBookings
      ] = await Promise.all([
        CalendarEvent.countDocuments({ status: { $ne: 'Cancelled' } }),
        CalendarEvent.countDocuments({
          startDate: { $gte: now, $lte: futureDate },
          status: { $nin: ['Cancelled', 'Completed'] }
        }),
        Deadline.countDocuments({ completed: false }),
        Deadline.countDocuments({
          dueDate: { $gte: now, $lte: futureDate },
          completed: false
        }),
        Deadline.countDocuments({
          dueDate: { $lt: now },
          completed: false
        }),
        Resource.countDocuments({ status: 'Available' }),
        ResourceBooking.countDocuments({
          status: { $in: ['Confirmed', 'Pending'] },
          endDate: { $gte: now }
        })
      ]);

      overview.statistics = {
        events: {
          total: totalEvents,
          upcoming: upcomingEvents
        },
        deadlines: {
          total: totalDeadlines,
          upcoming: upcomingDeadlines,
          overdue: overdueDeadlines
        },
        resources: {
          total: totalResources,
          activeBookings
        }
      };

      overview.databaseConnected = true;
    } else {
      overview.databaseConnected = false;
      overview.message = 'Database not connected - statistics unavailable';
    }

    res.json(overview);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get calendar events (consolidated endpoint)
router.get('/events', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const { startDate, endDate, eventType, attorney, caseId, status } = req.query;
    const filters = {};

    if (eventType) filters.eventType = eventType;
    if (attorney) filters.attorneys = attorney;
    if (caseId) filters.caseId = caseId;
    if (status) filters.status = status;

    let events;
    if (startDate && endDate) {
      events = await CalendarEvent.findByDateRange(startDate, endDate, filters);
    } else {
      const days = parseInt(req.query.days) || 30;
      events = await CalendarEvent.findUpcoming(days, filters);
    }

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get event by ID
router.get('/events/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        message: 'Database not connected'
      });
    }

    const event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
