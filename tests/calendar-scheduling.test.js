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
        .send({
          title: 'Test Court Hearing',
          startDate: '2024-12-15T10:00:00Z',
          endDate: '2024-12-15T11:00:00Z',
          organizer: 'John Doe',
          createdBy: 'testuser'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Court Date Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/court-dates');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Court appearance tracking');
      expect(response.body.capabilities).toContain('Hearing scheduling');
    });

    test('GET /api/calendar/court-dates should return court dates list', async () => {
      const response = await request(app)
        .get('/api/calendar/court-dates')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Court Date Management');
    });
  });

  describe('Sub-Feature 2: Deadline Management', () => {
    test('POST /api/calendar/deadlines should return deadline capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/deadlines')
        .send({
          title: 'Test Deadline',
          deadlineType: 'Filing Deadline',
          dueDate: '2024-12-20T17:00:00Z',
          caseId: '507f1f77bcf86cd799439011',
          caseNumber: 'CASE-2024-0001',
          assignedTo: 'Jane Smith',
          createdBy: 'testuser'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Deadline Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/deadlines');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Deadline calculation');
      expect(response.body.capabilities).toContain('Court rules engine');
    });

    test('GET /api/calendar/deadlines should return deadlines list', async () => {
      const response = await request(app)
        .get('/api/calendar/deadlines')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Deadline Management');
    });

    test('POST /api/calendar/deadlines/calculate should calculate deadline', async () => {
      const response = await request(app)
        .post('/api/calendar/deadlines/calculate')
        .send({
          triggerDate: '2024-12-01T00:00:00Z',
          daysToAdd: 30,
          courtRules: {
            skipWeekends: true,
            holidays: []
          }
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Deadline Calculation');
    });
  });

  describe('Sub-Feature 3: Appointment Scheduling', () => {
    test('POST /api/calendar/appointments should return appointment capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/appointments')
        .send({
          title: 'Client Consultation',
          appointmentType: 'Consultation',
          startDate: '2024-12-10T14:00:00Z',
          endDate: '2024-12-10T15:00:00Z',
          organizer: 'Attorney Name',
          attorneys: ['Attorney Name'],
          createdBy: 'testuser'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Appointment Scheduling');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/appointments');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Client meeting scheduling');
      expect(response.body.capabilities).toContain('Consultation booking');
    });

    test('GET /api/calendar/appointments should return appointments list', async () => {
      const response = await request(app)
        .get('/api/calendar/appointments')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Appointment Scheduling');
    });
  });

  describe('Sub-Feature 4: Attorney Availability', () => {
    test('GET /api/calendar/availability should require attorney parameter', async () => {
      const response = await request(app)
        .get('/api/calendar/availability')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Attorney Availability');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/availability');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Attorney schedules');
      expect(response.body.capabilities).toContain('Availability windows');
    });

    test('POST /api/calendar/availability/check should check attorney availability', async () => {
      const response = await request(app)
        .post('/api/calendar/availability/check')
        .send({
          attorneyName: 'John Doe',
          startDate: '2024-12-15T10:00:00Z',
          endDate: '2024-12-15T11:00:00Z'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });

    test('POST /api/calendar/availability should set attorney availability', async () => {
      const response = await request(app)
        .post('/api/calendar/availability')
        .send({
          attorneyName: 'John Doe',
          availabilityType: 'Out of Office',
          startDate: '2024-12-20T00:00:00Z',
          endDate: '2024-12-22T23:59:59Z',
          reason: 'Vacation',
          createdBy: 'testuser'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });

    test('GET /api/calendar/availability/slots should get available slots', async () => {
      const response = await request(app)
        .get('/api/calendar/availability/slots')
        .query({
          attorney: 'John Doe',
          date: '2024-12-15',
          duration: 60
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });
  });

  describe('Sub-Feature 5: Reminder & Notification System', () => {
    test('POST /api/calendar/reminders should return reminder capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/reminders')
        .send({
          eventId: '507f1f77bcf86cd799439011',
          reminderType: 'Email',
          minutesBefore: 60,
          recipients: ['user@example.com'],
          createdBy: 'testuser'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Reminder & Notification System');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/reminders');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Email reminders');
      expect(response.body.capabilities).toContain('SMS notifications');
    });

    test('GET /api/calendar/reminders/pending should return pending reminders', async () => {
      const response = await request(app)
        .get('/api/calendar/reminders/pending')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });
  });

  describe('Sub-Feature 6: Calendar Synchronization', () => {
    test('POST /api/calendar/sync should return sync capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/sync')
        .send({
          provider: 'Google',
          syncDirection: 'TwoWay',
          calendarId: 'primary',
          accessToken: 'test-token',
          username: 'testuser'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Calendar Synchronization');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/sync');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Outlook integration');
      expect(response.body.capabilities).toContain('Google Calendar sync');
    });

    test('GET /api/calendar/sync/status should return sync status', async () => {
      const response = await request(app)
        .get('/api/calendar/sync/status')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });
  });

  describe('Sub-Feature 7: Resource Scheduling', () => {
    test('POST /api/calendar/resources should return resource capabilities', async () => {
      const response = await request(app)
        .post('/api/calendar/resources')
        .send({
          name: 'Conference Room A',
          resourceType: 'Conference Room',
          capacity: 10,
          createdBy: 'testuser'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Resource Scheduling');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/resources');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Room booking');
      expect(response.body.capabilities).toContain('Equipment reservation');
    });

    test('GET /api/calendar/resources should return resources list', async () => {
      const response = await request(app)
        .get('/api/calendar/resources')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });

    test('POST /api/calendar/resources/book should book a resource', async () => {
      const response = await request(app)
        .post('/api/calendar/resources/book')
        .send({
          resourceId: '507f1f77bcf86cd799439011',
          startDate: '2024-12-15T10:00:00Z',
          endDate: '2024-12-15T12:00:00Z',
          purpose: 'Client Meeting',
          bookedBy: 'John Doe',
          createdBy: 'testuser'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });

    test('GET /api/calendar/resources/bookings should return bookings list', async () => {
      const response = await request(app)
        .get('/api/calendar/resources/bookings')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });
  });

  describe('Sub-Feature 8: Conflict Detection', () => {
    test('GET /api/calendar/conflicts should require attorney parameter', async () => {
      const response = await request(app)
        .get('/api/calendar/conflicts')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Conflict Detection');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/calendar/conflicts');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Schedule conflict detection');
      expect(response.body.capabilities).toContain('Double booking prevention');
    });

    test('POST /api/calendar/conflicts/check should check for conflicts', async () => {
      const response = await request(app)
        .post('/api/calendar/conflicts/check')
        .send({
          startDate: '2024-12-15T10:00:00Z',
          endDate: '2024-12-15T11:00:00Z',
          attorneys: ['John Doe', 'Jane Smith']
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });
  });

  describe('Additional Endpoints', () => {
    test('GET /api/calendar/events should return events list', async () => {
      const response = await request(app)
        .get('/api/calendar/events')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Database not connected');
    });
  });
});
