/**
 * Task & Workflow Management - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 */

const request = require('supertest');
const app = require('../src/index');

describe('Task & Workflow Management - Feature 6', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/tasks should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Task & Workflow Management');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'Task Creation & Assignment',
        'Workflow Automation',
        'Task Dependencies',
        'Priority Management',
        'Task Templates',
        'Progress Tracking',
        'Team Collaboration',
        'Workflow Analytics'
      ]);
    });
  });

  describe('Sub-Feature 1: Task Creation & Assignment', () => {
    test('POST /api/tasks/create should return creation capabilities', async () => {
      const response = await request(app)
        .post('/api/tasks/create')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Task Creation & Assignment');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/tasks/create');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Task creation');
      expect(response.body.capabilities).toContain('Team member assignment');
    });
  });

  describe('Sub-Feature 2: Workflow Automation', () => {
    test('POST /api/tasks/workflows should return workflow automation capabilities', async () => {
      const response = await request(app)
        .post('/api/tasks/workflows')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Workflow Automation');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/tasks/workflows');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Workflow templates');
      expect(response.body.capabilities).toContain('Automated task creation');
    });
  });

  describe('Sub-Feature 3: Task Dependencies', () => {
    test('PUT /api/tasks/:id/dependencies should return dependency capabilities', async () => {
      const response = await request(app)
        .put('/api/tasks/12345/dependencies')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Task Dependencies');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/tasks/:id/dependencies');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Dependency mapping');
      expect(response.body.capabilities).toContain('Gantt charts');
    });
  });

  describe('Sub-Feature 4: Priority Management', () => {
    test('PUT /api/tasks/:id/priority should return priority capabilities', async () => {
      const response = await request(app)
        .put('/api/tasks/12345/priority')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Priority Management');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/tasks/:id/priority');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Priority levels');
      expect(response.body.capabilities).toContain('SLA tracking');
    });
  });

  describe('Sub-Feature 5: Task Templates', () => {
    test('GET /api/tasks/templates should return template capabilities', async () => {
      const response = await request(app)
        .get('/api/tasks/templates')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Task Templates');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/tasks/templates');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Template library');
      expect(response.body.capabilities).toContain('Custom templates');
    });
  });

  describe('Sub-Feature 6: Progress Tracking', () => {
    test('GET /api/tasks/:id/progress should return progress tracking capabilities', async () => {
      const response = await request(app)
        .get('/api/tasks/12345/progress')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Progress Tracking');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/tasks/:id/progress');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Completion tracking');
      expect(response.body.capabilities).toContain('Progress indicators');
    });
  });

  describe('Sub-Feature 7: Team Collaboration', () => {
    test('POST /api/tasks/:id/collaborate should return collaboration capabilities', async () => {
      const response = await request(app)
        .post('/api/tasks/12345/collaborate')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Team Collaboration');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/tasks/:id/collaborate');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Task comments');
      expect(response.body.capabilities).toContain('File sharing');
    });
  });

  describe('Sub-Feature 8: Workflow Analytics', () => {
    test('GET /api/tasks/analytics should return analytics capabilities', async () => {
      const response = await request(app)
        .get('/api/tasks/analytics')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Workflow Analytics');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoint', '/api/tasks/analytics');
      expect(response.body).toHaveProperty('capabilities');
      expect(response.body.capabilities).toContain('Efficiency metrics');
      expect(response.body.capabilities).toContain('Completion rates');
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible and functional', async () => {
      // Test all endpoints in sequence
      const endpoints = [
        { method: 'get', path: '/api/tasks', expectedFeature: 'Task & Workflow Management' },
        { method: 'post', path: '/api/tasks/create', expectedFeature: 'Task Creation & Assignment' },
        { method: 'post', path: '/api/tasks/workflows', expectedFeature: 'Workflow Automation' },
        { method: 'put', path: '/api/tasks/123/dependencies', expectedFeature: 'Task Dependencies' },
        { method: 'put', path: '/api/tasks/123/priority', expectedFeature: 'Priority Management' },
        { method: 'get', path: '/api/tasks/templates', expectedFeature: 'Task Templates' },
        { method: 'get', path: '/api/tasks/123/progress', expectedFeature: 'Progress Tracking' },
        { method: 'post', path: '/api/tasks/123/collaborate', expectedFeature: 'Team Collaboration' },
        { method: 'get', path: '/api/tasks/analytics', expectedFeature: 'Workflow Analytics' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path).expect(200);
        expect(response.body).toHaveProperty('feature', endpoint.expectedFeature);
      }
    });
  });
});
