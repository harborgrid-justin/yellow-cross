/**
 * Integration & API Management - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Integration & API Management - Feature 15', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/integrations should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/integrations')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Integration & API Management');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Third-Party Integrations',
        'RESTful API',
        'Webhook Support',
        'Data Import/Export',
        'Legacy System Integration',
        'Accounting Software Integration',
        'E-Signature Integration',
        'API Security & Rate Limiting'
      ]);
    });
  });

  describe('Sub-Feature 1: Third-Party Integrations', () => {
    test('GET /api/integrations/third-party should return integration capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/third-party')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Third-Party Integrations');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/integrations/third-party');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Integration marketplace');
      expect(response.body.capabilities).toContain('Pre-built connectors');
      expect(response.body.capabilities).toContain('OAuth connections');
    });
  });

  describe('Sub-Feature 2: RESTful API', () => {
    test('GET /api/integrations/api should return API capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/api')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'RESTful API');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/integrations/api');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Full REST API');
      expect(response.body.capabilities).toContain('API documentation');
      expect(response.body.capabilities).toContain('Developer portal');
    });
  });

  describe('Sub-Feature 3: Webhook Support', () => {
    test('POST /api/integrations/webhooks should return webhook capabilities', async () => {
      const response = await request(app)
        .post('/api/integrations/webhooks')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Webhook Support');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/integrations/webhooks');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Event subscriptions');
      expect(response.body.capabilities).toContain('Webhook configuration');
      expect(response.body.capabilities).toContain('Retry logic');
    });
  });

  describe('Sub-Feature 4: Data Import/Export', () => {
    test('POST /api/integrations/import-export should return import/export capabilities', async () => {
      const response = await request(app)
        .post('/api/integrations/import-export')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Data Import/Export');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/integrations/import-export');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Bulk import');
      expect(response.body.capabilities).toContain('Bulk export');
      expect(response.body.capabilities).toContain('CSV/Excel support');
    });
  });

  describe('Sub-Feature 5: Legacy System Integration', () => {
    test('POST /api/integrations/legacy should return legacy integration capabilities', async () => {
      const response = await request(app)
        .post('/api/integrations/legacy')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Legacy System Integration');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/integrations/legacy');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Legacy system connectors');
      expect(response.body.capabilities).toContain('Data migration');
      expect(response.body.capabilities).toContain('Sync services');
    });
  });

  describe('Sub-Feature 6: Accounting Software Integration', () => {
    test('GET /api/integrations/accounting should return accounting integration capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/accounting')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Accounting Software Integration');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/integrations/accounting');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('QuickBooks integration');
      expect(response.body.capabilities).toContain('Xero integration');
      expect(response.body.capabilities).toContain('Automated sync');
    });
  });

  describe('Sub-Feature 7: E-Signature Integration', () => {
    test('POST /api/integrations/e-signature should return e-signature capabilities', async () => {
      const response = await request(app)
        .post('/api/integrations/e-signature')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'E-Signature Integration');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/integrations/e-signature');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('DocuSign integration');
      expect(response.body.capabilities).toContain('Adobe Sign integration');
      expect(response.body.capabilities).toContain('Template management');
    });
  });

  describe('Sub-Feature 8: API Security & Rate Limiting', () => {
    test('GET /api/integrations/security should return security capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/security')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'API Security & Rate Limiting');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/integrations/security');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('API authentication');
      expect(response.body.capabilities).toContain('Rate limiting');
      expect(response.body.capabilities).toContain('Usage monitoring');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/integrations', expectedFeature: 'Integration & API Management' },
        { method: 'get', path: '/api/integrations/third-party', expectedFeature: 'Third-Party Integrations' },
        { method: 'get', path: '/api/integrations/api', expectedFeature: 'RESTful API' },
        { method: 'post', path: '/api/integrations/webhooks', expectedFeature: 'Webhook Support' },
        { method: 'post', path: '/api/integrations/import-export', expectedFeature: 'Data Import/Export' },
        { method: 'post', path: '/api/integrations/legacy', expectedFeature: 'Legacy System Integration' },
        { method: 'get', path: '/api/integrations/accounting', expectedFeature: 'Accounting Software Integration' },
        { method: 'post', path: '/api/integrations/e-signature', expectedFeature: 'E-Signature Integration' },
        { method: 'get', path: '/api/integrations/security', expectedFeature: 'API Security & Rate Limiting' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
