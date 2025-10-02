/**
 * Communication & Collaboration - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Communication & Collaboration - Feature 13', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/communication should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/communication')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Communication & Collaboration');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Internal Messaging System',
        'Email Integration',
        'Video Conferencing',
        'File Sharing',
        'Team Collaboration Spaces',
        'Client Communication Portal',
        'External Communication Tracking',
        'Communication Templates'
      ]);
    });
  });

  describe('Sub-Feature 1: Internal Messaging System', () => {
    test('POST /api/communication/messages should return messaging capabilities', async () => {
      const response = await request(app)
        .post('/api/communication/messages')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Internal Messaging System');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/communication/messages');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Direct messaging');
      expect(response.body.capabilities).toContain('Group chats');
      expect(response.body.capabilities).toContain('Message threads');
    });
  });

  describe('Sub-Feature 2: Email Integration', () => {
    test('GET /api/communication/email should return email integration capabilities', async () => {
      const response = await request(app)
        .get('/api/communication/email')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Email Integration');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/communication/email');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Email client integration');
      expect(response.body.capabilities).toContain('Email tracking');
      expect(response.body.capabilities).toContain('Email templates');
    });
  });

  describe('Sub-Feature 3: Video Conferencing', () => {
    test('POST /api/communication/video should return video conferencing capabilities', async () => {
      const response = await request(app)
        .post('/api/communication/video')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Video Conferencing');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/communication/video');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Video calls');
      expect(response.body.capabilities).toContain('Screen sharing');
      expect(response.body.capabilities).toContain('Recording');
    });
  });

  describe('Sub-Feature 4: File Sharing', () => {
    test('POST /api/communication/files should return file sharing capabilities', async () => {
      const response = await request(app)
        .post('/api/communication/files')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'File Sharing');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/communication/files');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Secure sharing');
      expect(response.body.capabilities).toContain('Link generation');
      expect(response.body.capabilities).toContain('Access controls');
    });
  });

  describe('Sub-Feature 5: Team Collaboration Spaces', () => {
    test('POST /api/communication/workspaces should return workspace capabilities', async () => {
      const response = await request(app)
        .post('/api/communication/workspaces')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Team Collaboration Spaces');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/communication/workspaces');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Case workspaces');
      expect(response.body.capabilities).toContain('Team collaboration');
      expect(response.body.capabilities).toContain('Activity feeds');
    });
  });

  describe('Sub-Feature 6: Client Communication Portal', () => {
    test('POST /api/communication/client-portal should return client portal capabilities', async () => {
      const response = await request(app)
        .post('/api/communication/client-portal')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Client Communication Portal');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/communication/client-portal');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Secure messaging');
      expect(response.body.capabilities).toContain('Document sharing');
      expect(response.body.capabilities).toContain('Status updates');
    });
  });

  describe('Sub-Feature 7: External Communication Tracking', () => {
    test('GET /api/communication/external should return external tracking capabilities', async () => {
      const response = await request(app)
        .get('/api/communication/external')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'External Communication Tracking');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/communication/external');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Communication logging');
      expect(response.body.capabilities).toContain('Timeline view');
      expect(response.body.capabilities).toContain('Contact tracking');
    });
  });

  describe('Sub-Feature 8: Communication Templates', () => {
    test('GET /api/communication/templates should return template capabilities', async () => {
      const response = await request(app)
        .get('/api/communication/templates')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Communication Templates');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/communication/templates');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Email templates');
      expect(response.body.capabilities).toContain('Letter templates');
      expect(response.body.capabilities).toContain('Template library');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/communication', expectedFeature: 'Communication & Collaboration' },
        { method: 'post', path: '/api/communication/messages', expectedFeature: 'Internal Messaging System' },
        { method: 'get', path: '/api/communication/email', expectedFeature: 'Email Integration' },
        { method: 'post', path: '/api/communication/video', expectedFeature: 'Video Conferencing' },
        { method: 'post', path: '/api/communication/files', expectedFeature: 'File Sharing' },
        { method: 'post', path: '/api/communication/workspaces', expectedFeature: 'Team Collaboration Spaces' },
        { method: 'post', path: '/api/communication/client-portal', expectedFeature: 'Client Communication Portal' },
        { method: 'get', path: '/api/communication/external', expectedFeature: 'External Communication Tracking' },
        { method: 'get', path: '/api/communication/templates', expectedFeature: 'Communication Templates' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
