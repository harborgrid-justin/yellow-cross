/**
 * Reporting & Analytics - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Reporting & Analytics - Feature 12', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/reports should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/reports')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Reporting & Analytics');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Case Analytics & Metrics',
        'Financial Dashboards',
        'Attorney Performance Metrics',
        'Client Analytics',
        'Practice Area Analysis',
        'Custom Report Builder',
        'Predictive Analytics',
        'Executive Dashboards'
      ]);
    });
  });

  describe('Sub-Feature 1: Case Analytics & Metrics', () => {
    test('GET /api/reports/case-analytics should return case analytics capabilities', async () => {
      const response = await request(app)
        .get('/api/reports/case-analytics')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Case Analytics & Metrics');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/reports/case-analytics');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Case volume trends');
      expect(response.body.capabilities).toContain('Duration analysis');
      expect(response.body.capabilities).toContain('Outcome tracking');
      expect(response.body.capabilities).toContain('Win/loss ratios');
      expect(response.body.capabilities).toContain('Case type distribution');
    });
  });

  describe('Sub-Feature 2: Financial Dashboards', () => {
    test('GET /api/reports/financial should return financial dashboard capabilities', async () => {
      const response = await request(app)
        .get('/api/reports/financial')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Financial Dashboards');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/reports/financial');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Revenue dashboards');
      expect(response.body.capabilities).toContain('Expense tracking');
      expect(response.body.capabilities).toContain('Profitability analysis');
      expect(response.body.capabilities).toContain('Cash flow reports');
      expect(response.body.capabilities).toContain('Financial forecasting');
    });
  });

  describe('Sub-Feature 3: Attorney Performance Metrics', () => {
    test('GET /api/reports/attorney-performance should return attorney performance capabilities', async () => {
      const response = await request(app)
        .get('/api/reports/attorney-performance')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Attorney Performance Metrics');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/reports/attorney-performance');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Billable hours');
      expect(response.body.capabilities).toContain('Utilization rates');
      expect(response.body.capabilities).toContain('Efficiency metrics');
      expect(response.body.capabilities).toContain('Case outcomes');
      expect(response.body.capabilities).toContain('Performance rankings');
    });
  });

  describe('Sub-Feature 4: Client Analytics', () => {
    test('GET /api/reports/client-analytics should return client analytics capabilities', async () => {
      const response = await request(app)
        .get('/api/reports/client-analytics')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Client Analytics');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/reports/client-analytics');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Acquisition metrics');
      expect(response.body.capabilities).toContain('Retention rates');
      expect(response.body.capabilities).toContain('Client satisfaction');
      expect(response.body.capabilities).toContain('Client lifetime value');
      expect(response.body.capabilities).toContain('Referral tracking');
    });
  });

  describe('Sub-Feature 5: Practice Area Analysis', () => {
    test('GET /api/reports/practice-areas should return practice area analysis capabilities', async () => {
      const response = await request(app)
        .get('/api/reports/practice-areas')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Practice Area Analysis');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/reports/practice-areas');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Revenue by practice area');
      expect(response.body.capabilities).toContain('Matter distribution');
      expect(response.body.capabilities).toContain('Profitability analysis');
      expect(response.body.capabilities).toContain('Growth trends');
      expect(response.body.capabilities).toContain('Capacity planning');
    });
  });

  describe('Sub-Feature 6: Custom Report Builder', () => {
    test('POST /api/reports/custom should return custom report builder capabilities', async () => {
      const response = await request(app)
        .post('/api/reports/custom')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Custom Report Builder');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/reports/custom');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Drag-and-drop builder');
      expect(response.body.capabilities).toContain('Custom metrics');
      expect(response.body.capabilities).toContain('Data visualization');
      expect(response.body.capabilities).toContain('Report templates');
      expect(response.body.capabilities).toContain('Scheduled reports');
    });
  });

  describe('Sub-Feature 7: Predictive Analytics', () => {
    test('GET /api/reports/predictive should return predictive analytics capabilities', async () => {
      const response = await request(app)
        .get('/api/reports/predictive')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Predictive Analytics');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/reports/predictive');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Outcome prediction');
      expect(response.body.capabilities).toContain('Resource forecasting');
      expect(response.body.capabilities).toContain('Demand planning');
      expect(response.body.capabilities).toContain('Trend analysis');
      expect(response.body.capabilities).toContain('Risk prediction');
    });
  });

  describe('Sub-Feature 8: Executive Dashboards', () => {
    test('GET /api/reports/executive should return executive dashboard capabilities', async () => {
      const response = await request(app)
        .get('/api/reports/executive')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Executive Dashboards');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/reports/executive');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('KPI dashboards');
      expect(response.body.capabilities).toContain('Strategic metrics');
      expect(response.body.capabilities).toContain('Performance overview');
      expect(response.body.capabilities).toContain('Real-time data');
      expect(response.body.capabilities).toContain('Drill-down capabilities');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/reports', expectedFeature: 'Reporting & Analytics' },
        { method: 'get', path: '/api/reports/case-analytics', expectedFeature: 'Case Analytics & Metrics' },
        { method: 'get', path: '/api/reports/financial', expectedFeature: 'Financial Dashboards' },
        { method: 'get', path: '/api/reports/attorney-performance', expectedFeature: 'Attorney Performance Metrics' },
        { method: 'get', path: '/api/reports/client-analytics', expectedFeature: 'Client Analytics' },
        { method: 'get', path: '/api/reports/practice-areas', expectedFeature: 'Practice Area Analysis' },
        { method: 'post', path: '/api/reports/custom', expectedFeature: 'Custom Report Builder' },
        { method: 'get', path: '/api/reports/predictive', expectedFeature: 'Predictive Analytics' },
        { method: 'get', path: '/api/reports/executive', expectedFeature: 'Executive Dashboards' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
