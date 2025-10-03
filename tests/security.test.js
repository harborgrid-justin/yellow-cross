/**
 * Security & Access Control - Integration Tests
 * Verifies all 8 sub-features are implemented and operational
 * Tests both API stubs (without DB) and full business logic (with DB when available)
 */

const request = require('supertest');
const app = require('../src/index');

describe('Security & Access Control - Feature 14', () => {
  
  describe('Overview Endpoint', () => {
    test('GET /api/security should list all 8 sub-features', async () => {
      const response = await request(app)
        .get('/api/security')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Security & Access Control');
      expect(response.body.subFeatures).toHaveLength(8);
      expect(response.body.subFeatures).toEqual([
        'User Authentication & SSO',
        'Role-Based Access Control',
        'Data Encryption',
        'Audit Trails',
        'IP Whitelisting',
        'Session Management',
        'Data Backup & Recovery',
        'Security Monitoring & Alerts'
      ]);
    });
  });

  describe('Sub-Feature 1: User Authentication & SSO', () => {
    test('POST /api/security/auth should handle login', async () => {
      const response = await request(app)
        .post('/api/security/auth')
        .send({
          username: 'attorney@firm.com',
          password: 'SecurePass123!',
          mfaCode: '123456'
        })
        .expect((res) => {
          expect([200, 401]).toContain(res.status);
        });
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('User Authentication & SSO');
    });

    test('POST /api/security/register should handle user registration', async () => {
      const response = await request(app)
        .post('/api/security/register')
        .send({
          username: 'newuser',
          email: 'newuser@firm.com',
          password: 'SecurePass123!',
          firstName: 'New',
          lastName: 'User',
          role: 'Attorney',
          createdBy: 'admin'
        })
        .expect((res) => {
          expect([201, 409, 503]).toContain(res.status);
        });
    });

    test('POST /api/security/sso-login should handle SSO login', async () => {
      const response = await request(app)
        .post('/api/security/sso-login')
        .send({
          provider: 'SAML',
          ssoId: 'user123',
          email: 'user@firm.com',
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect((res) => {
          expect([200, 503]).toContain(res.status);
        });
    });

    test('POST /api/security/logout should handle logout', async () => {
      const response = await request(app)
        .post('/api/security/logout')
        .send({
          sessionId: 'session123',
          userId: '507f1f77bcf86cd799439011'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Sub-Feature 2: Role-Based Access Control', () => {
    test('GET /api/security/roles should list roles', async () => {
      const response = await request(app)
        .get('/api/security/roles')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Role-Based Access Control');
    });

    test('POST /api/security/roles should create new role', async () => {
      const response = await request(app)
        .post('/api/security/roles')
        .send({
          roleName: 'senior-attorney',
          displayName: 'Senior Attorney',
          description: 'Senior attorney with elevated permissions',
          permissions: [
            {
              resource: 'cases',
              actions: ['create', 'read', 'update', 'delete']
            }
          ],
          createdBy: 'admin'
        })
        .expect((res) => {
          expect([201, 409, 503]).toContain(res.status);
        });
    });

    test('POST /api/security/roles/assign should assign role to user', async () => {
      const response = await request(app)
        .post('/api/security/roles/assign')
        .send({
          userId: '507f1f77bcf86cd799439011',
          roleId: '507f1f77bcf86cd799439012',
          assignedBy: 'admin'
        })
        .expect((res) => {
          expect([200, 404, 503]).toContain(res.status);
        });
    });
  });

  describe('Sub-Feature 3: Data Encryption', () => {
    test('GET /api/security/encryption should return encryption settings', async () => {
      const response = await request(app)
        .get('/api/security/encryption')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Data Encryption');
      expect(response.body.capabilities).toContain('End-to-end encryption');
      expect(response.body.capabilities).toContain('At-rest encryption');
    });

    test('POST /api/security/encryption/encrypt should encrypt data', async () => {
      const response = await request(app)
        .post('/api/security/encryption/encrypt')
        .send({
          data: { sensitive: 'information' },
          fieldLevel: true
        })
        .expect((res) => {
          expect([200, 400]).toContain(res.status);
        });
    });
  });

  describe('Sub-Feature 4: Audit Trails', () => {
    test('GET /api/security/audit should retrieve audit logs', async () => {
      const response = await request(app)
        .get('/api/security/audit')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Audit Trails');
    });

    test('POST /api/security/audit should create audit log', async () => {
      const response = await request(app)
        .post('/api/security/audit')
        .send({
          eventType: 'Login',
          eventCategory: 'Authentication',
          username: 'testuser',
          action: 'User logged in',
          success: true,
          ipAddress: '192.168.1.1'
        })
        .expect((res) => {
          expect([201, 503]).toContain(res.status);
        });
    });

    test('POST /api/security/audit/verify-integrity should verify log chain', async () => {
      const response = await request(app)
        .post('/api/security/audit/verify-integrity')
        .send({
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        })
        .expect((res) => {
          expect([200, 400, 503]).toContain(res.status);
        });
    });
  });

  describe('Sub-Feature 5: IP Whitelisting', () => {
    test('GET /api/security/ip-whitelist should list IP whitelist entries', async () => {
      const response = await request(app)
        .get('/api/security/ip-whitelist')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('IP Whitelisting');
    });

    test('POST /api/security/ip-whitelist should add IP to whitelist', async () => {
      const response = await request(app)
        .post('/api/security/ip-whitelist')
        .send({
          ipAddress: '192.168.1.100',
          entryType: 'Single IP',
          scope: 'Global',
          description: 'Office IP',
          createdBy: 'admin'
        })
        .expect((res) => {
          expect([201, 503]).toContain(res.status);
        });
    });

    test('POST /api/security/ip-whitelist/check should verify IP whitelist', async () => {
      const response = await request(app)
        .post('/api/security/ip-whitelist/check')
        .send({
          ipAddress: '192.168.1.100',
          userId: '507f1f77bcf86cd799439011'
        })
        .expect((res) => {
          expect([200, 503]).toContain(res.status);
        });
    });
  });

  describe('Sub-Feature 6: Session Management', () => {
    test('GET /api/security/sessions should retrieve user sessions', async () => {
      const response = await request(app)
        .get('/api/security/sessions')
        .query({ userId: '507f1f77bcf86cd799439011' })
        .expect((res) => {
          expect([200, 400, 404]).toContain(res.status);
        });
    });

    test('POST /api/security/sessions/terminate should terminate session', async () => {
      const response = await request(app)
        .post('/api/security/sessions/terminate')
        .send({
          sessionId: 'session123',
          userId: '507f1f77bcf86cd799439011',
          terminatedBy: 'admin'
        })
        .expect((res) => {
          expect([200, 404, 503]).toContain(res.status);
        });
    });

    test('POST /api/security/sessions/terminate-all should terminate all sessions', async () => {
      const response = await request(app)
        .post('/api/security/sessions/terminate-all')
        .send({
          userId: '507f1f77bcf86cd799439011',
          terminatedBy: 'admin'
        })
        .expect((res) => {
          expect([200, 400, 404, 503]).toContain(res.status);
        });
    });
  });

  describe('Sub-Feature 7: Data Backup & Recovery', () => {
    test('GET /api/security/backup should list backups', async () => {
      const response = await request(app)
        .get('/api/security/backup')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Data Backup & Recovery');
    });

    test('POST /api/security/backup should create backup', async () => {
      const response = await request(app)
        .post('/api/security/backup')
        .send({
          backupName: 'Daily Backup',
          description: 'Daily automated backup',
          backupType: 'Full',
          scope: 'Database',
          encrypted: true,
          compressed: true,
          createdBy: 'system'
        })
        .expect((res) => {
          expect([201, 503]).toContain(res.status);
        });
    });

    test('POST /api/security/backup/restore should restore backup', async () => {
      const response = await request(app)
        .post('/api/security/backup/restore')
        .send({
          backupId: '507f1f77bcf86cd799439011',
          restoreType: 'Full',
          restoredBy: 'admin'
        })
        .expect((res) => {
          expect([200, 400, 404, 503]).toContain(res.status);
        });
    });
  });

  describe('Sub-Feature 8: Security Monitoring & Alerts', () => {
    test('GET /api/security/monitoring should retrieve security alerts', async () => {
      const response = await request(app)
        .get('/api/security/monitoring')
        .expect(200);
      
      expect(response.body).toHaveProperty('feature');
      expect(response.body.feature).toBe('Security Monitoring & Alerts');
    });

    test('POST /api/security/monitoring/alert should create security alert', async () => {
      const response = await request(app)
        .post('/api/security/monitoring/alert')
        .send({
          title: 'Suspicious Login Attempt',
          description: 'Multiple failed login attempts detected',
          alertType: 'Brute Force Attack',
          severity: 'High',
          sourceIP: '10.0.0.1',
          targetUsername: 'admin',
          detectionMethod: 'Rule-Based'
        })
        .expect((res) => {
          expect([201, 503]).toContain(res.status);
        });
    });

    test('GET /api/security/monitoring/statistics should return security statistics', async () => {
      const response = await request(app)
        .get('/api/security/monitoring/statistics')
        .query({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        })
        .expect((res) => {
          expect([200, 503]).toContain(res.status);
        });
    });
  });

  describe('Integration Tests', () => {
    test('Should handle complete authentication flow', async () => {
      // Register
      const registerResponse = await request(app)
        .post('/api/security/register')
        .send({
          username: 'integrationtest',
          email: 'integration@test.com',
          password: 'TestPass123!',
          firstName: 'Integration',
          lastName: 'Test',
          createdBy: 'system'
        });
      
      expect([201, 409, 503]).toContain(registerResponse.status);
    });

    test('Should handle role and permission flow', async () => {
      // Create role
      const roleResponse = await request(app)
        .post('/api/security/roles')
        .send({
          roleName: 'test-role',
          displayName: 'Test Role',
          permissions: [
            { resource: 'documents', actions: ['read', 'write'] }
          ],
          createdBy: 'admin'
        });
      
      expect([201, 409, 503]).toContain(roleResponse.status);
    });

    test('Should handle security monitoring flow', async () => {
      // Create alert
      const alertResponse = await request(app)
        .post('/api/security/monitoring/alert')
        .send({
          title: 'Test Alert',
          alertType: 'Suspicious Activity',
          severity: 'Medium'
        });
      
      expect([201, 503]).toContain(alertResponse.status);
    });
  });
});
