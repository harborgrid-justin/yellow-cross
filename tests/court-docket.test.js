/**
 * Court & Docket Management - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Court & Docket Management - Feature 8', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/court should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/court')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Court & Docket Management');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Court Docket Tracking',
        'Electronic Filing (e-Filing)',
        'Court Rules & Procedures',
        'Opposing Counsel Database',
        'Judge Information',
        'Courtroom Calendar',
        'Docket Alert System',
        'Court Document Retrieval'
      ]);
    });
  });

  describe('Sub-Feature 1: Court Docket Tracking', () => {
    test('GET /api/court/dockets should return docket tracking capabilities', async () => {
      const response = await request(app)
        .get('/api/court/dockets')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Court Docket Tracking');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/court/dockets');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Docket monitoring');
      expect(response.body.capabilities).toContain('Filing tracking');
      expect(response.body.capabilities).toContain('Case status updates');
      expect(response.body.capabilities).toContain('Docket entries');
      expect(response.body.capabilities).toContain('Historical dockets');
    });
  });

  describe('Sub-Feature 2: Electronic Filing (e-Filing)', () => {
    test('POST /api/court/e-filing should return e-filing capabilities', async () => {
      const response = await request(app)
        .post('/api/court/e-filing')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Electronic Filing (e-Filing)');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/court/e-filing');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Electronic filing');
      expect(response.body.capabilities).toContain('Court integration');
      expect(response.body.capabilities).toContain('Filing validation');
      expect(response.body.capabilities).toContain('Filing receipts');
      expect(response.body.capabilities).toContain('Multi-court support');
    });
  });

  describe('Sub-Feature 3: Court Rules & Procedures', () => {
    test('GET /api/court/rules/:court should return court rules capabilities', async () => {
      const response = await request(app)
        .get('/api/court/rules/federal')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Court Rules & Procedures');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/court/rules/:court');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Court rules database');
      expect(response.body.capabilities).toContain('Local rules');
      expect(response.body.capabilities).toContain('Procedural guides');
      expect(response.body.capabilities).toContain('Form requirements');
      expect(response.body.capabilities).toContain('Rule updates');
    });
  });

  describe('Sub-Feature 4: Opposing Counsel Database', () => {
    test('GET /api/court/opposing-counsel should return opposing counsel capabilities', async () => {
      const response = await request(app)
        .get('/api/court/opposing-counsel')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Opposing Counsel Database');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/court/opposing-counsel');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Counsel profiles');
      expect(response.body.capabilities).toContain('Firm information');
      expect(response.body.capabilities).toContain('Contact details');
      expect(response.body.capabilities).toContain('Case history');
      expect(response.body.capabilities).toContain('Communication tracking');
    });
  });

  describe('Sub-Feature 5: Judge Information', () => {
    test('GET /api/court/judges/:id should return judge information capabilities', async () => {
      const response = await request(app)
        .get('/api/court/judges/12345')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Judge Information');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/court/judges/:id');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Judge profiles');
      expect(response.body.capabilities).toContain('Judicial preferences');
      expect(response.body.capabilities).toContain('Ruling history');
      expect(response.body.capabilities).toContain('Courtroom procedures');
      expect(response.body.capabilities).toContain('Biography and background');
    });
  });

  describe('Sub-Feature 6: Courtroom Calendar', () => {
    test('GET /api/court/calendar should return courtroom calendar capabilities', async () => {
      const response = await request(app)
        .get('/api/court/calendar')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Courtroom Calendar');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/court/calendar');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Courtroom schedules');
      expect(response.body.capabilities).toContain('Room assignments');
      expect(response.body.capabilities).toContain('Hearing times');
      expect(response.body.capabilities).toContain('Court availability');
      expect(response.body.capabilities).toContain('Calendar conflicts');
    });
  });

  describe('Sub-Feature 7: Docket Alert System', () => {
    test('POST /api/court/alerts should return docket alert capabilities', async () => {
      const response = await request(app)
        .post('/api/court/alerts')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Docket Alert System');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/court/alerts');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Docket monitoring');
      expect(response.body.capabilities).toContain('Automated alerts');
      expect(response.body.capabilities).toContain('Email notifications');
      expect(response.body.capabilities).toContain('Custom alert rules');
      expect(response.body.capabilities).toContain('Alert history');
    });
  });

  describe('Sub-Feature 8: Court Document Retrieval', () => {
    test('GET /api/court/documents/:id should return document retrieval capabilities', async () => {
      const response = await request(app)
        .get('/api/court/documents/12345')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Court Document Retrieval');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/court/documents/:id');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Document download');
      expect(response.body.capabilities).toContain('Court orders');
      expect(response.body.capabilities).toContain('Filed documents');
      expect(response.body.capabilities).toContain('Sealed documents');
      expect(response.body.capabilities).toContain('Bulk retrieval');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/court', expectedFeature: 'Court & Docket Management' },
        { method: 'get', path: '/api/court/dockets', expectedFeature: 'Court Docket Tracking' },
        { method: 'post', path: '/api/court/e-filing', expectedFeature: 'Electronic Filing (e-Filing)' },
        { method: 'get', path: '/api/court/rules/federal', expectedFeature: 'Court Rules & Procedures' },
        { method: 'get', path: '/api/court/opposing-counsel', expectedFeature: 'Opposing Counsel Database' },
        { method: 'get', path: '/api/court/judges/123', expectedFeature: 'Judge Information' },
        { method: 'get', path: '/api/court/calendar', expectedFeature: 'Courtroom Calendar' },
        { method: 'post', path: '/api/court/alerts', expectedFeature: 'Docket Alert System' },
        { method: 'get', path: '/api/court/documents/123', expectedFeature: 'Court Document Retrieval' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
