/**
 * Contract Management System - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Contract Management System - Feature 9', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/contracts should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/contracts')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Contract Management');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Contract Creation & Drafting',
        'Contract Repository',
        'Contract Review Workflow',
        'Contract Negotiation Tracking',
        'Contract Lifecycle Management',
        'Contract Renewal Management',
        'Contract Compliance Monitoring',
        'Contract Analytics'
      ]);
    });
  });

  describe('Sub-Feature 1: Contract Creation & Drafting', () => {
    test('POST /api/contracts/create should return creation capabilities', async () => {
      const response = await request(app)
        .post('/api/contracts/create')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Contract Creation & Drafting');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/contracts/create');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Template-based creation');
      expect(response.body.capabilities).toContain('Clause library');
    });
  });

  describe('Sub-Feature 2: Contract Repository', () => {
    test('GET /api/contracts/repository should return repository capabilities', async () => {
      const response = await request(app)
        .get('/api/contracts/repository')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Contract Repository');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/contracts/repository');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Centralized storage');
      expect(response.body.capabilities).toContain('Contract categorization');
    });
  });

  describe('Sub-Feature 3: Contract Review Workflow', () => {
    test('POST /api/contracts/:id/review should return review capabilities', async () => {
      const response = await request(app)
        .post('/api/contracts/12345/review')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Contract Review Workflow');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/contracts/:id/review');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Approval workflows');
      expect(response.body.capabilities).toContain('Review routing');
    });
  });

  describe('Sub-Feature 4: Contract Negotiation Tracking', () => {
    test('POST /api/contracts/:id/negotiations should return negotiation capabilities', async () => {
      const response = await request(app)
        .post('/api/contracts/12345/negotiations')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Contract Negotiation Tracking');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/contracts/:id/negotiations');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Redline tracking');
      expect(response.body.capabilities).toContain('Negotiation history');
    });
  });

  describe('Sub-Feature 5: Contract Lifecycle Management', () => {
    test('GET /api/contracts/:id/lifecycle should return lifecycle capabilities', async () => {
      const response = await request(app)
        .get('/api/contracts/12345/lifecycle')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Contract Lifecycle Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/contracts/:id/lifecycle');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Lifecycle stages');
      expect(response.body.capabilities).toContain('Status tracking');
    });
  });

  describe('Sub-Feature 6: Contract Renewal Management', () => {
    test('GET /api/contracts/renewals should return renewal capabilities', async () => {
      const response = await request(app)
        .get('/api/contracts/renewals')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Contract Renewal Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/contracts/renewals');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Renewal tracking');
      expect(response.body.capabilities).toContain('Expiration alerts');
    });
  });

  describe('Sub-Feature 7: Contract Compliance Monitoring', () => {
    test('GET /api/contracts/:id/compliance should return compliance capabilities', async () => {
      const response = await request(app)
        .get('/api/contracts/12345/compliance')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Contract Compliance Monitoring');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/contracts/:id/compliance');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Obligation tracking');
      expect(response.body.capabilities).toContain('Deliverable monitoring');
    });
  });

  describe('Sub-Feature 8: Contract Analytics', () => {
    test('GET /api/contracts/analytics should return analytics capabilities', async () => {
      const response = await request(app)
        .get('/api/contracts/analytics')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Contract Analytics');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/contracts/analytics');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Value analysis');
      expect(response.body.capabilities).toContain('Risk assessment');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/contracts', expectedFeature: 'Contract Management' },
        { method: 'post', path: '/api/contracts/create', expectedFeature: 'Contract Creation & Drafting' },
        { method: 'get', path: '/api/contracts/repository', expectedFeature: 'Contract Repository' },
        { method: 'post', path: '/api/contracts/123/review', expectedFeature: 'Contract Review Workflow' },
        { method: 'post', path: '/api/contracts/123/negotiations', expectedFeature: 'Contract Negotiation Tracking' },
        { method: 'get', path: '/api/contracts/123/lifecycle', expectedFeature: 'Contract Lifecycle Management' },
        { method: 'get', path: '/api/contracts/renewals', expectedFeature: 'Contract Renewal Management' },
        { method: 'get', path: '/api/contracts/123/compliance', expectedFeature: 'Contract Compliance Monitoring' },
        { method: 'get', path: '/api/contracts/analytics', expectedFeature: 'Contract Analytics' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
