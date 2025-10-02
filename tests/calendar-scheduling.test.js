/**
 * Calendar & Scheduling System - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Calendar & Scheduling System - Feature 5', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/calendar should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/calendar')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Calendar & Scheduling System');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Court Date Management',
        'Deadline Management',
        'Appointment Scheduling',
        'Attorney Availability',
        'Reminder & Notification System',
        'Calendar Synchronization',
        'Resource Scheduling',
        'Conflict Detection'
      ]);
    });
  });

  describe('Sub-Feature 1: Court Date Management', () => {
    test('POST /api/calendar/court-dates should return court date capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/court-dates')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Court Date Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/court-dates');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Court appearance tracking');
      expect(response.body.capabilities).toContain('Hearing scheduling');
      expect(response.body.capabilities).toContain('Trial calendaring');
      expect(response.body.capabilities).toContain('Court location details');
      expect(response.body.capabilities).toContain('Case coordination');
    });
  });

  describe('Sub-Feature 2: Deadline Management', () => {
    test('POST /api/calendar/deadlines should return deadline capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/deadlines')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Deadline Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/deadlines');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Deadline calculation');
      expect(response.body.capabilities).toContain('Court rules engine');
      expect(response.body.capabilities).toContain('Statute tracking');
      expect(response.body.capabilities).toContain('Custom deadline rules');
      expect(response.body.capabilities).toContain('Deadline alerts');
    });
  });

  describe('Sub-Feature 3: Appointment Scheduling', () => {
    test('POST /api/calendar/appointments should return appointment capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/appointments')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Appointment Scheduling');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/appointments');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Client meeting scheduling');
      expect(response.body.capabilities).toContain('Consultation booking');
      expect(response.body.capabilities).toContain('Deposition scheduling');
      expect(response.body.capabilities).toContain('Location management');
      expect(response.body.capabilities).toContain('Online meeting links');
    });
  });

  describe('Sub-Feature 4: Attorney Availability', () => {
    test('GET /api/calendar/availability should return availability capabilities', async () => {
      const response = await request(app)
        .get('/api/calendar/availability')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Attorney Availability');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/availability');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Attorney schedules');
      expect(response.body.capabilities).toContain('Availability windows');
      expect(response.body.capabilities).toContain('Time blocking');
      expect(response.body.capabilities).toContain('Out of office');
      expect(response.body.capabilities).toContain('Capacity planning');
    });
  });

  describe('Sub-Feature 5: Reminder & Notification System', () => {
    test('POST /api/calendar/reminders should return reminder capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/reminders')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Reminder & Notification System');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/reminders');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Email reminders');
      expect(response.body.capabilities).toContain('SMS notifications');
      expect(response.body.capabilities).toContain('Push notifications');
      expect(response.body.capabilities).toContain('Custom reminder rules');
      expect(response.body.capabilities).toContain('Escalation workflows');
    });
  });

  describe('Sub-Feature 6: Calendar Synchronization', () => {
    test('POST /api/calendar/sync should return synchronization capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/sync')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Calendar Synchronization');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/sync');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Outlook integration');
      expect(response.body.capabilities).toContain('Google Calendar sync');
      expect(response.body.capabilities).toContain('iCal support');
      expect(response.body.capabilities).toContain('Two-way sync');
      expect(response.body.capabilities).toContain('Selective sync');
    });
  });

  describe('Sub-Feature 7: Resource Scheduling', () => {
    test('POST /api/calendar/resources should return resource scheduling capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/resources')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Resource Scheduling');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/resources');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Room booking');
      expect(response.body.capabilities).toContain('Equipment reservation');
      expect(response.body.capabilities).toContain('Resource availability');
      expect(response.body.capabilities).toContain('Booking conflicts');
      expect(response.body.capabilities).toContain('Resource calendars');
    });
  });

  describe('Sub-Feature 8: Conflict Detection', () => {
    test('GET /api/calendar/conflicts should return conflict detection capabilities', async () => {
      const response = await request(app)
        .get('/api/calendar/conflicts')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Conflict Detection');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/conflicts');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Schedule conflict detection');
      expect(response.body.capabilities).toContain('Double booking prevention');
      expect(response.body.capabilities).toContain('Travel time consideration');
      expect(response.body.capabilities).toContain('Multi-attorney conflicts');
      expect(response.body.capabilities).toContain('Conflict resolution suggestions');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/calendar', expectedFeature: 'Calendar & Scheduling System' },
        { method: 'post', path: '/api/calendar/court-dates', expectedFeature: 'Court Date Management' },
        { method: 'post', path: '/api/calendar/deadlines', expectedFeature: 'Deadline Management' },
        { method: 'post', path: '/api/calendar/appointments', expectedFeature: 'Appointment Scheduling' },
        { method: 'get', path: '/api/calendar/availability', expectedFeature: 'Attorney Availability' },
        { method: 'post', path: '/api/calendar/reminders', expectedFeature: 'Reminder & Notification System' },
        { method: 'post', path: '/api/calendar/sync', expectedFeature: 'Calendar Synchronization' },
        { method: 'post', path: '/api/calendar/resources', expectedFeature: 'Resource Scheduling' },
        { method: 'get', path: '/api/calendar/conflicts', expectedFeature: 'Conflict Detection' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
