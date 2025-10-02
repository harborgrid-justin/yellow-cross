/**
 * Feature 5: Calendar & Scheduling System
 * 8 Sub-Features: Court Date Management, Deadline Management, Appointment Scheduling,
 * Attorney Availability, Reminder & Notification, Calendar Sync, Resource Scheduling, Conflict Detection
 */

const express = require('express');
const router = express.Router();

// Sub-Feature 1: Court Date Management
router.post('/court-dates', (req, res) => {
  res.json({
    feature: 'Court Date Management',
    description: 'Track court appearances, hearings, and trials',
    endpoint: '/api/calendar/court-dates',
    capabilities: [
      'Court appearance tracking',
      'Hearing scheduling',
      'Trial calendaring',
      'Court location details',
      'Case coordination'
    ]
  });
});

// Sub-Feature 2: Deadline Management
router.post('/deadlines', (req, res) => {
  res.json({
    feature: 'Deadline Management',
    description: 'Calculate deadlines and statute of limitations',
    endpoint: '/api/calendar/deadlines',
    capabilities: [
      'Deadline calculation',
      'Court rules engine',
      'Statute tracking',
      'Custom deadline rules',
      'Deadline alerts'
    ]
  });
});

// Sub-Feature 3: Appointment Scheduling
router.post('/appointments', (req, res) => {
  res.json({
    feature: 'Appointment Scheduling',
    description: 'Client meetings, consultations, and depositions',
    endpoint: '/api/calendar/appointments',
    capabilities: [
      'Client meeting scheduling',
      'Consultation booking',
      'Deposition scheduling',
      'Location management',
      'Online meeting links'
    ]
  });
});

// Sub-Feature 4: Attorney Availability
router.get('/availability', (req, res) => {
  res.json({
    feature: 'Attorney Availability',
    description: 'Manage attorney schedules and conflicts',
    endpoint: '/api/calendar/availability',
    capabilities: [
      'Attorney schedules',
      'Availability windows',
      'Time blocking',
      'Out of office',
      'Capacity planning'
    ]
  });
});

// Sub-Feature 5: Reminder & Notification System
router.post('/reminders', (req, res) => {
  res.json({
    feature: 'Reminder & Notification System',
    description: 'Automated reminders and alerts',
    endpoint: '/api/calendar/reminders',
    capabilities: [
      'Email reminders',
      'SMS notifications',
      'Push notifications',
      'Custom reminder rules',
      'Escalation workflows'
    ]
  });
});

// Sub-Feature 6: Calendar Synchronization
router.post('/sync', (req, res) => {
  res.json({
    feature: 'Calendar Synchronization',
    description: 'Sync with Outlook, Google Calendar',
    endpoint: '/api/calendar/sync',
    capabilities: [
      'Outlook integration',
      'Google Calendar sync',
      'iCal support',
      'Two-way sync',
      'Selective sync'
    ]
  });
});

// Sub-Feature 7: Resource Scheduling
router.post('/resources', (req, res) => {
  res.json({
    feature: 'Resource Scheduling',
    description: 'Conference rooms and equipment reservation',
    endpoint: '/api/calendar/resources',
    capabilities: [
      'Room booking',
      'Equipment reservation',
      'Resource availability',
      'Booking conflicts',
      'Resource calendars'
    ]
  });
});

// Sub-Feature 8: Conflict Detection
router.get('/conflicts', (req, res) => {
  res.json({
    feature: 'Conflict Detection',
    description: 'Automatic scheduling conflict detection',
    endpoint: '/api/calendar/conflicts',
    capabilities: [
      'Schedule conflict detection',
      'Double booking prevention',
      'Travel time consideration',
      'Multi-attorney conflicts',
      'Conflict resolution suggestions'
    ]
  });
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
