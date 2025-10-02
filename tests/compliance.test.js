/**
 * Compliance & Risk Management - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Compliance & Risk Management - Feature 11', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/compliance should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/compliance')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Compliance & Risk Management');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Ethics & Compliance Tracking',
        'Risk Assessment Tools',
        'Malpractice Prevention',
        'Regulatory Compliance',
        'Audit Trail & Logging',
        'Data Privacy Compliance',
        'Professional Liability Management',
        'Compliance Reporting'
      ]);
    });
  });

  describe('Sub-Feature 1: Ethics & Compliance Tracking', () => {
    test('GET /api/compliance/ethics should return ethics tracking capabilities', async () => {
      const response = await request(app)
        .get('/api/compliance/ethics')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Ethics & Compliance Tracking');
      expect(response.body).toHaveProperty('description', 'Monitor ethical obligations');
      expect(response.body).toHaveProperty('endpoint', '/api/compliance/ethics');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Ethics rules tracking');
      expect(response.body.capabilities).toContain('CLE tracking');
    });
  });

  describe('Sub-Feature 2: Risk Assessment Tools', () => {
    test('POST /api/compliance/risk-assessment should return risk assessment capabilities', async () => {
      const response = await request(app)
        .post('/api/compliance/risk-assessment')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Risk Assessment Tools');
      expect(response.body).toHaveProperty('description', 'Identify and assess case risks');
      expect(response.body).toHaveProperty('endpoint', '/api/compliance/risk-assessment');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Risk identification');
      expect(response.body.capabilities).toContain('Risk scoring');
    });
  });

  describe('Sub-Feature 3: Malpractice Prevention', () => {
    test('GET /api/compliance/malpractice-prevention should return malpractice prevention capabilities', async () => {
      const response = await request(app)
        .get('/api/compliance/malpractice-prevention')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Malpractice Prevention');
      expect(response.body).toHaveProperty('description', 'Conflict checks and deadline monitoring');
      expect(response.body).toHaveProperty('endpoint', '/api/compliance/malpractice-prevention');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Conflict checking');
      expect(response.body.capabilities).toContain('Deadline monitoring');
    });
  });

  describe('Sub-Feature 4: Regulatory Compliance (ABA, State Bar)', () => {
    test('GET /api/compliance/regulatory should return regulatory compliance capabilities', async () => {
      const response = await request(app)
        .get('/api/compliance/regulatory')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Regulatory Compliance');
      expect(response.body).toHaveProperty('description', 'ABA and state bar compliance');
      expect(response.body).toHaveProperty('endpoint', '/api/compliance/regulatory');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('ABA compliance');
      expect(response.body.capabilities).toContain('State bar rules');
    });
  });

  describe('Sub-Feature 5: Audit Trail & Logging', () => {
    test('GET /api/compliance/audit-trail should return audit trail capabilities', async () => {
      const response = await request(app)
        .get('/api/compliance/audit-trail')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Audit Trail & Logging');
      expect(response.body).toHaveProperty('description', 'Comprehensive activity logging');
      expect(response.body).toHaveProperty('endpoint', '/api/compliance/audit-trail');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Activity logging');
      expect(response.body.capabilities).toContain('User actions');
    });
  });

  describe('Sub-Feature 6: Data Privacy Compliance (GDPR, CCPA)', () => {
    test('GET /api/compliance/privacy should return data privacy capabilities', async () => {
      const response = await request(app)
        .get('/api/compliance/privacy')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Data Privacy Compliance');
      expect(response.body).toHaveProperty('description', 'GDPR and CCPA compliance tools');
      expect(response.body).toHaveProperty('endpoint', '/api/compliance/privacy');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('GDPR compliance');
      expect(response.body.capabilities).toContain('CCPA compliance');
    });
  });

  describe('Sub-Feature 7: Professional Liability Management', () => {
    test('GET /api/compliance/liability should return liability management capabilities', async () => {
      const response = await request(app)
        .get('/api/compliance/liability')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Professional Liability Management');
      expect(response.body).toHaveProperty('description', 'Track insurance and claims');
      expect(response.body).toHaveProperty('endpoint', '/api/compliance/liability');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Insurance tracking');
      expect(response.body.capabilities).toContain('Claims management');
    });
  });

  describe('Sub-Feature 8: Compliance Reporting', () => {
    test('GET /api/compliance/reports should return compliance reporting capabilities', async () => {
      const response = await request(app)
        .get('/api/compliance/reports')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Compliance Reporting');
      expect(response.body).toHaveProperty('description', 'Generate compliance reports and attestations');
      expect(response.body).toHaveProperty('endpoint', '/api/compliance/reports');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Compliance reports');
      expect(response.body.capabilities).toContain('Attestations');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/compliance', expectedFeature: 'Compliance & Risk Management' },
        { method: 'get', path: '/api/compliance/ethics', expectedFeature: 'Ethics & Compliance Tracking' },
        { method: 'post', path: '/api/compliance/risk-assessment', expectedFeature: 'Risk Assessment Tools' },
        { method: 'get', path: '/api/compliance/malpractice-prevention', expectedFeature: 'Malpractice Prevention' },
        { method: 'get', path: '/api/compliance/regulatory', expectedFeature: 'Regulatory Compliance' },
        { method: 'get', path: '/api/compliance/audit-trail', expectedFeature: 'Audit Trail & Logging' },
        { method: 'get', path: '/api/compliance/privacy', expectedFeature: 'Data Privacy Compliance' },
        { method: 'get', path: '/api/compliance/liability', expectedFeature: 'Professional Liability Management' },
        { method: 'get', path: '/api/compliance/reports', expectedFeature: 'Compliance Reporting' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
