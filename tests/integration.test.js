/**
 * Integration & API Management System - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 * Tests both API stubs (without DB) and full business logic (with DB when available)
 */

const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const Integration = require('../src/models/Integration');
const Webhook = require('../src/models/Webhook');
const APIKey = require('../src/models/APIKey');
const ImportExportJob = require('../src/models/ImportExportJob');
const AccountingSync = require('../src/models/AccountingSync');

describe('Integration & API Management System - Feature 15', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/integrations should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/integrations')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature', 'Integration & API Management');
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
    test('GET /api/integrations/third-party should return integrations or capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/third-party')
        .expect(200);
      
      expect(response.body).toBeDefined();
      
      if (mongoose.connection.readyState === 1) {
        // Database connected
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else {
        // Database not connected
        expect(response.body).toHaveProperty('feature', 'Third-Party Integrations');
        expect(response.body).toHaveProperty('capabilities');
        expect(response.body.capabilities).toContain('Integration marketplace');
      }
    });

    test('POST /api/integrations/third-party should create integration when DB connected', async () => {
      if (mongoose.connection.readyState !== 1) {
        // Skip if database not connected
        return;
      }

      const integrationData = {
        name: 'test-integration',
        displayName: 'Test Integration',
        description: 'Test integration for automated testing',
        type: 'CRM',
        provider: 'TestProvider',
        connectionMethod: 'API Key',
        createdBy: 'test-user'
      };

      const response = await request(app)
        .post('/api/integrations/third-party')
        .send(integrationData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.integration).toHaveProperty('integrationNumber');
      expect(response.body.data.integration.name).toBe('test-integration');

      // Cleanup
      if (response.body.data.integration._id) {
        await Integration.findByIdAndDelete(response.body.data.integration._id);
      }
    });
  });

  describe('Sub-Feature 2: RESTful API', () => {
    test('GET /api/integrations/api should return API keys or capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/api')
        .expect(200);
      
      expect(response.body).toBeDefined();
      
      if (mongoose.connection.readyState === 1) {
        // Database connected
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else {
        // Database not connected
        expect(response.body).toHaveProperty('feature', 'RESTful API');
        expect(response.body).toHaveProperty('capabilities');
        expect(response.body.capabilities).toContain('Full REST API');
      }
    });

    test('POST /api/integrations/api/keys should create API key when DB connected', async () => {
      if (mongoose.connection.readyState !== 1) {
        return;
      }

      const keyData = {
        name: 'Test API Key',
        description: 'API key for testing',
        keyType: 'Secret',
        environment: 'Testing',
        createdBy: 'test-user'
      };

      const response = await request(app)
        .post('/api/integrations/api/keys')
        .send(keyData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('key'); // Key shown once
      expect(response.body.data.apiKey).toHaveProperty('keyId');

      // Cleanup
      if (response.body.data.apiKey._id) {
        await APIKey.findByIdAndDelete(response.body.data.apiKey._id);
      }
    });
  });

  describe('Sub-Feature 3: Webhook Support', () => {
    test('GET /api/integrations/webhooks should return webhooks or capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/webhooks')
        .expect(200);
      
      expect(response.body).toBeDefined();
      
      if (mongoose.connection.readyState === 1) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else {
        expect(response.body).toHaveProperty('feature', 'Webhook Support');
        expect(response.body).toHaveProperty('capabilities');
        expect(response.body.capabilities).toContain('Event subscriptions');
      }
    });

    test('POST /api/integrations/webhooks should create webhook when DB connected', async () => {
      if (mongoose.connection.readyState !== 1) {
        return;
      }

      const webhookData = {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['case.created', 'document.uploaded'],
        createdBy: 'test-user'
      };

      const response = await request(app)
        .post('/api/integrations/webhooks')
        .send(webhookData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.webhook).toHaveProperty('webhookId');
      expect(response.body.data.webhook.events).toContain('case.created');

      // Cleanup
      if (response.body.data.webhook._id) {
        await Webhook.findByIdAndDelete(response.body.data.webhook._id);
      }
    });
  });

  describe('Sub-Feature 4: Data Import/Export', () => {
    test('GET /api/integrations/import-export should return jobs or capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/import-export')
        .expect(200);
      
      expect(response.body).toBeDefined();
      
      if (mongoose.connection.readyState === 1) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else {
        expect(response.body).toHaveProperty('feature', 'Data Import/Export');
        expect(response.body).toHaveProperty('capabilities');
        expect(response.body.capabilities).toContain('Bulk import');
      }
    });

    test('POST /api/integrations/import-export should create job when DB connected', async () => {
      if (mongoose.connection.readyState !== 1) {
        return;
      }

      const jobData = {
        name: 'Test Import Job',
        jobType: 'Import',
        dataType: 'Cases',
        file: {
          filename: 'test.csv',
          fileType: 'CSV',
          fileSize: 1024
        },
        createdBy: 'test-user'
      };

      const response = await request(app)
        .post('/api/integrations/import-export')
        .send(jobData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.job).toHaveProperty('jobNumber');
      expect(response.body.data.job.jobType).toBe('Import');

      // Cleanup
      if (response.body.data.job._id) {
        await ImportExportJob.findByIdAndDelete(response.body.data.job._id);
      }
    });
  });

  describe('Sub-Feature 5: Legacy System Integration', () => {
    test('GET /api/integrations/legacy should return legacy integrations or capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/legacy')
        .expect(200);
      
      expect(response.body).toBeDefined();
      
      if (mongoose.connection.readyState === 1) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else {
        expect(response.body).toHaveProperty('feature', 'Legacy System Integration');
        expect(response.body).toHaveProperty('capabilities');
        expect(response.body.capabilities).toContain('Legacy system connectors');
      }
    });

    test('POST /api/integrations/legacy should create legacy integration when DB connected', async () => {
      if (mongoose.connection.readyState !== 1) {
        return;
      }

      const legacyData = {
        name: 'Legacy System',
        systemType: 'Old CRM',
        description: 'Legacy CRM integration',
        createdBy: 'test-user'
      };

      const response = await request(app)
        .post('/api/integrations/legacy')
        .send(legacyData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.integration).toHaveProperty('integrationNumber');
      expect(response.body.data.integration.type).toBe('Legacy System');

      // Cleanup
      if (response.body.data.integration._id) {
        await Integration.findByIdAndDelete(response.body.data.integration._id);
      }
    });
  });

  describe('Sub-Feature 6: Accounting Software Integration', () => {
    test('GET /api/integrations/accounting should return accounting integrations or capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/accounting')
        .expect(200);
      
      expect(response.body).toBeDefined();
      
      if (mongoose.connection.readyState === 1) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else {
        expect(response.body).toHaveProperty('feature', 'Accounting Software Integration');
        expect(response.body).toHaveProperty('capabilities');
        expect(response.body.capabilities).toContain('QuickBooks integration');
      }
    });
  });

  describe('Sub-Feature 7: E-Signature Integration', () => {
    test('GET /api/integrations/e-signature should return e-signature integrations or capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/e-signature')
        .expect(200);
      
      expect(response.body).toBeDefined();
      
      if (mongoose.connection.readyState === 1) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else {
        expect(response.body).toHaveProperty('feature', 'E-Signature Integration');
        expect(response.body).toHaveProperty('capabilities');
        expect(response.body.capabilities).toContain('DocuSign integration');
      }
    });
  });

  describe('Sub-Feature 8: API Security & Rate Limiting', () => {
    test('GET /api/integrations/security should return security information or capabilities', async () => {
      const response = await request(app)
        .get('/api/integrations/security')
        .expect(200);
      
      expect(response.body).toBeDefined();
      
      if (mongoose.connection.readyState === 1) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else {
        expect(response.body).toHaveProperty('feature', 'API Security & Rate Limiting');
        expect(response.body).toHaveProperty('capabilities');
        expect(response.body.capabilities).toContain('API authentication');
      }
    });
  });

  describe('Complete System Verification', () => {
    test('All 8 sub-features should be accessible', async () => {
      const endpoints = [
        '/api/integrations',
        '/api/integrations/third-party',
        '/api/integrations/api',
        '/api/integrations/webhooks',
        '/api/integrations/import-export',
        '/api/integrations/legacy',
        '/api/integrations/accounting',
        '/api/integrations/e-signature',
        '/api/integrations/security'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
      }
    });
  });

  // Database-specific tests
  if (mongoose.connection.readyState === 1) {
    describe('Database Operations', () => {
      let testIntegrationId;
      let testWebhookId;
      let testAPIKeyId;

      afterAll(async () => {
        // Cleanup test data
        if (testIntegrationId) await Integration.findByIdAndDelete(testIntegrationId);
        if (testWebhookId) await Webhook.findByIdAndDelete(testWebhookId);
        if (testAPIKeyId) await APIKey.findByIdAndDelete(testAPIKeyId);
      });

      test('Integration CRUD operations', async () => {
        // Create
        const createResponse = await request(app)
          .post('/api/integrations/third-party')
          .send({
            name: 'crud-test',
            displayName: 'CRUD Test Integration',
            type: 'Custom',
            provider: 'Test',
            connectionMethod: 'API Key',
            createdBy: 'test-user'
          });

        expect(createResponse.status).toBe(201);
        testIntegrationId = createResponse.body.data.integration._id;

        // Read
        const readResponse = await request(app)
          .get('/api/integrations/third-party');

        expect(readResponse.status).toBe(200);
        expect(readResponse.body.success).toBe(true);
      });

      test('Webhook operations with database', async () => {
        const createResponse = await request(app)
          .post('/api/integrations/webhooks')
          .send({
            name: 'DB Test Webhook',
            url: 'https://example.com/test',
            events: ['test.event'],
            createdBy: 'test-user'
          });

        expect(createResponse.status).toBe(201);
        testWebhookId = createResponse.body.data.webhook._id;

        // Test webhook
        const testResponse = await request(app)
          .post(`/api/integrations/webhooks/${testWebhookId}/test`);

        expect(testResponse.status).toBe(200);
        expect(testResponse.body.success).toBe(true);
      });

      test('API key operations with database', async () => {
        const createResponse = await request(app)
          .post('/api/integrations/api/keys')
          .send({
            name: 'DB Test Key',
            keyType: 'Secret',
            environment: 'Testing',
            createdBy: 'test-user'
          });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body.data).toHaveProperty('key');
        testAPIKeyId = createResponse.body.data.apiKey._id;

        // Revoke key
        const revokeResponse = await request(app)
          .post(`/api/integrations/api/keys/${testAPIKeyId}/revoke`)
          .send({
            revokedBy: 'test-user',
            reason: 'Test revocation'
          });

        expect(revokeResponse.status).toBe(200);
        expect(revokeResponse.body.success).toBe(true);
      });
    });
  }
});
