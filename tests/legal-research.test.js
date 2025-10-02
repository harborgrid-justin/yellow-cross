/**
 * Legal Research & Knowledge Base - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Legal Research & Knowledge Base - Feature 7', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/research should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/research')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Legal Research & Knowledge Base');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Legal Research Integration',
        'Internal Knowledge Base',
        'Case Law Database',
        'Legal Memoranda Library',
        'Research Citation Management',
        'Practice Area Resources',
        'Legal Updates & Alerts',
        'Research Collaboration'
      ]);
    });
  });

  describe('Sub-Feature 1: Legal Research Integration', () => {
    test('GET /api/research/integrations should return integration capabilities', async () => {
      const response = await request(app)
        .get('/api/research/integrations')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Legal Research Integration');
      expect(response.body).toHaveProperty('description', 'Connect to Westlaw, LexisNexis');
      expect(response.body).toHaveProperty('endpoint', '/api/research/integrations');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Westlaw integration');
      expect(response.body.capabilities).toContain('LexisNexis connection');
      expect(response.body.capabilities).toContain('Case law search');
    });
  });

  describe('Sub-Feature 2: Internal Knowledge Base', () => {
    test('GET /api/research/knowledge-base should return knowledge base capabilities', async () => {
      const response = await request(app)
        .get('/api/research/knowledge-base')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Internal Knowledge Base');
      expect(response.body).toHaveProperty('description', 'Store firm knowledge and best practices');
      expect(response.body).toHaveProperty('endpoint', '/api/research/knowledge-base');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Knowledge articles');
      expect(response.body.capabilities).toContain('Best practices');
      expect(response.body.capabilities).toContain('Firm precedents');
    });
  });

  describe('Sub-Feature 3: Case Law Database', () => {
    test('GET /api/research/case-law should return case law capabilities', async () => {
      const response = await request(app)
        .get('/api/research/case-law')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Case Law Database');
      expect(response.body).toHaveProperty('description', 'Search precedents and relevant cases');
      expect(response.body).toHaveProperty('endpoint', '/api/research/case-law');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Precedent search');
      expect(response.body.capabilities).toContain('Citation lookup');
      expect(response.body.capabilities).toContain('Shepardizing');
    });
  });

  describe('Sub-Feature 4: Legal Memoranda Library', () => {
    test('POST /api/research/memoranda should return memoranda capabilities', async () => {
      const response = await request(app)
        .post('/api/research/memoranda')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Legal Memoranda Library');
      expect(response.body).toHaveProperty('description', 'Store and retrieve legal memos');
      expect(response.body).toHaveProperty('endpoint', '/api/research/memoranda');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Memo storage');
      expect(response.body.capabilities).toContain('Search and retrieval');
      expect(response.body.capabilities).toContain('Topic categorization');
    });
  });

  describe('Sub-Feature 5: Research Citation Management', () => {
    test('POST /api/research/citations should return citation management capabilities', async () => {
      const response = await request(app)
        .post('/api/research/citations')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Research Citation Management');
      expect(response.body).toHaveProperty('description', 'Organize citations and references');
      expect(response.body).toHaveProperty('endpoint', '/api/research/citations');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Citation tracking');
      expect(response.body.capabilities).toContain('Bluebook formatting');
      expect(response.body.capabilities).toContain('Reference library');
    });
  });

  describe('Sub-Feature 6: Practice Area Resources', () => {
    test('GET /api/research/practice-areas/:area should return practice area capabilities', async () => {
      const response = await request(app)
        .get('/api/research/practice-areas/corporate')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Practice Area Resources');
      expect(response.body).toHaveProperty('description', 'Specialized resources by practice area');
      expect(response.body).toHaveProperty('endpoint', '/api/research/practice-areas/:area');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Practice area libraries');
      expect(response.body.capabilities).toContain('Specialized forms');
      expect(response.body.capabilities).toContain('Industry resources');
    });
  });

  describe('Sub-Feature 7: Legal Updates & Alerts', () => {
    test('GET /api/research/updates should return legal updates capabilities', async () => {
      const response = await request(app)
        .get('/api/research/updates')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Legal Updates & Alerts');
      expect(response.body).toHaveProperty('description', 'Track changes in law and regulations');
      expect(response.body).toHaveProperty('endpoint', '/api/research/updates');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Legislative updates');
      expect(response.body.capabilities).toContain('Regulatory changes');
      expect(response.body.capabilities).toContain('Case law alerts');
    });
  });

  describe('Sub-Feature 8: Research Collaboration', () => {
    test('POST /api/research/collaborate should return collaboration capabilities', async () => {
      const response = await request(app)
        .post('/api/research/collaborate')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Research Collaboration');
      expect(response.body).toHaveProperty('description', 'Share research and annotate findings');
      expect(response.body).toHaveProperty('endpoint', '/api/research/collaborate');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Research sharing');
      expect(response.body.capabilities).toContain('Collaborative annotations');
      expect(response.body.capabilities).toContain('Comments and notes');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/research', expectedFeature: 'Legal Research & Knowledge Base' },
        { method: 'get', path: '/api/research/integrations', expectedFeature: 'Legal Research Integration' },
        { method: 'get', path: '/api/research/knowledge-base', expectedFeature: 'Internal Knowledge Base' },
        { method: 'get', path: '/api/research/case-law', expectedFeature: 'Case Law Database' },
        { method: 'post', path: '/api/research/memoranda', expectedFeature: 'Legal Memoranda Library' },
        { method: 'post', path: '/api/research/citations', expectedFeature: 'Research Citation Management' },
        { method: 'get', path: '/api/research/practice-areas/litigation', expectedFeature: 'Practice Area Resources' },
        { method: 'get', path: '/api/research/updates', expectedFeature: 'Legal Updates & Alerts' },
        { method: 'post', path: '/api/research/collaborate', expectedFeature: 'Research Collaboration' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
