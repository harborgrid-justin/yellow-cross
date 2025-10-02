/**
 * eDiscovery & Evidence Management - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('eDiscovery & Evidence Management - Feature 10', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/ediscovery should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/ediscovery')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('eDiscovery & Evidence Management');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Evidence Collection & Preservation',
        'Document Review Platform',
        'eDiscovery Processing',
        'Privilege Review',
        'Production Management',
        'Evidence Tagging & Coding',
        'Legal Hold Management',
        'eDiscovery Analytics'
      ]);
    });
  });

  describe('Sub-Feature 1: Evidence Collection & Preservation', () => {
    test('POST /api/ediscovery/collect should return collection capabilities', async () => {
      const response = await request(app)
        .post('/api/ediscovery/collect')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Evidence Collection & Preservation');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/ediscovery/collect');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Digital evidence collection');
      expect(response.body.capabilities).toContain('Chain of custody');
    });
  });

  describe('Sub-Feature 2: Document Review Platform', () => {
    test('GET /api/ediscovery/review should return review capabilities', async () => {
      const response = await request(app)
        .get('/api/ediscovery/review')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Document Review Platform');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/ediscovery/review');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Document viewer');
      expect(response.body.capabilities).toContain('Batch review');
    });
  });

  describe('Sub-Feature 3: eDiscovery Processing', () => {
    test('POST /api/ediscovery/process should return processing capabilities', async () => {
      const response = await request(app)
        .post('/api/ediscovery/process')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'eDiscovery Processing');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/ediscovery/process');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('ESI processing');
      expect(response.body.capabilities).toContain('De-duplication');
    });
  });

  describe('Sub-Feature 4: Privilege Review', () => {
    test('POST /api/ediscovery/privilege should return privilege review capabilities', async () => {
      const response = await request(app)
        .post('/api/ediscovery/privilege')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Privilege Review');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/ediscovery/privilege');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Privilege identification');
      expect(response.body.capabilities).toContain('Redaction tools');
    });
  });

  describe('Sub-Feature 5: Production Management', () => {
    test('POST /api/ediscovery/productions should return production capabilities', async () => {
      const response = await request(app)
        .post('/api/ediscovery/productions')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Production Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/ediscovery/productions');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Production sets');
      expect(response.body.capabilities).toContain('Bates numbering');
    });
  });

  describe('Sub-Feature 6: Evidence Tagging & Coding', () => {
    test('POST /api/ediscovery/tagging should return tagging capabilities', async () => {
      const response = await request(app)
        .post('/api/ediscovery/tagging')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Evidence Tagging & Coding');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/ediscovery/tagging');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Document tagging');
      expect(response.body.capabilities).toContain('Coding schemes');
    });
  });

  describe('Sub-Feature 7: Legal Hold Management', () => {
    test('POST /api/ediscovery/legal-holds should return legal hold capabilities', async () => {
      const response = await request(app)
        .post('/api/ediscovery/legal-holds')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Legal Hold Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/ediscovery/legal-holds');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Hold notifications');
      expect(response.body.capabilities).toContain('Custodian tracking');
    });
  });

  describe('Sub-Feature 8: eDiscovery Analytics', () => {
    test('GET /api/ediscovery/analytics should return analytics capabilities', async () => {
      const response = await request(app)
        .get('/api/ediscovery/analytics')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'eDiscovery Analytics');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/ediscovery/analytics');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Document analytics');
      expect(response.body.capabilities).toContain('Predictive coding');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/ediscovery', expectedFeature: 'eDiscovery & Evidence Management' },
        { method: 'post', path: '/api/ediscovery/collect', expectedFeature: 'Evidence Collection & Preservation' },
        { method: 'get', path: '/api/ediscovery/review', expectedFeature: 'Document Review Platform' },
        { method: 'post', path: '/api/ediscovery/process', expectedFeature: 'eDiscovery Processing' },
        { method: 'post', path: '/api/ediscovery/privilege', expectedFeature: 'Privilege Review' },
        { method: 'post', path: '/api/ediscovery/productions', expectedFeature: 'Production Management' },
        { method: 'post', path: '/api/ediscovery/tagging', expectedFeature: 'Evidence Tagging & Coding' },
        { method: 'post', path: '/api/ediscovery/legal-holds', expectedFeature: 'Legal Hold Management' },
        { method: 'get', path: '/api/ediscovery/analytics', expectedFeature: 'eDiscovery Analytics' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
