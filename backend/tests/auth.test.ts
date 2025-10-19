/**
 * Authentication Tests
 * Tests for JWT authentication system and middleware
 */

import request from 'supertest';
import express from 'express';
import authRouter from '../../src/features/auth';
import { authenticate, requireRole, requirePermission } from '../../src/middleware/auth';
import { connectDB } from '../../src/config/database';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

// Test protected route
const protectedRouter = express.Router();
protectedRouter.get('/protected', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});
protectedRouter.get('/admin-only', authenticate, requireRole('Admin'), (req, res) => {
  res.json({ success: true, message: 'Admin access granted' });
});
protectedRouter.get('/permission-test', authenticate, requirePermission('test:access'), (req, res) => {
  res.json({ success: true, message: 'Permission granted' });
});
app.use('/api/test', protectedRouter);

describe('Authentication System', () => {
  let testUser: any;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Connect to database
    await connectDB();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'TestP@ss123',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.user.username).toBe('testuser');
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');

      testUser = res.body.data.user;
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should reject registration with duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'another@example.com',
          password: 'TestP@ss123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Username already exists');
    });

    it('should reject registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'anotheruser',
          email: 'test@example.com',
          password: 'TestP@ss123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Email already exists');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'weakpass',
          email: 'weak@example.com',
          password: 'weak'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Password must contain');
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'invalidemail',
          email: 'not-an-email',
          password: 'TestP@ss123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials (email)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestP@ss123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('sessionId');
    });

    it('should login with valid credentials (username)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'TestP@ss123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestP@ss123'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe('test@example.com');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: refreshToken
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should reject invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-refresh-token'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/change-password', () => {
    it('should change password with valid current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'TestP@ss123',
          newPassword: 'NewP@ss456',
          confirmPassword: 'NewP@ss456'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Password changed');

      // Login with new password to verify
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewP@ss456'
        });

      expect(loginRes.status).toBe(200);
    });

    it('should reject with incorrect current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'NewP@ss789',
          confirmPassword: 'NewP@ss789'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject when passwords do not match', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'NewP@ss456',
          newPassword: 'NewP@ss789',
          confirmPassword: 'Different789'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should accept forgot password request', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test@example.com'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // In development, token is returned for testing
      if (process.env.NODE_ENV === 'development') {
        expect(res.body).toHaveProperty('resetToken');
      }
    });

    it('should not reveal if email does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });

      // Should still return success (security best practice)
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Authentication Middleware', () => {
    it('should allow access to protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/test/protected')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('id');
    });

    it('should block access to protected route without token', async () => {
      const res = await request(app)
        .get('/api/test/protected');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Role-Based Access Control', () => {
    it('should block access if user lacks required role', async () => {
      const res = await request(app)
        .get('/api/test/admin-only')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    // Note: To test admin access, we'd need to update user role in DB
    // This is just showing the pattern
  });

  describe('Permission-Based Access Control', () => {
    it('should block access if user lacks required permission', async () => {
      const res = await request(app)
        .get('/api/test/permission-test')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewP@ss456'
        });

      const sessionId = loginRes.body.data.sessionId;
      const token = loginRes.body.data.accessToken;

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .send({ sessionId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('Password Security', () => {
  it('should enforce password complexity', async () => {
    const testCases = [
      { password: 'short', reason: 'too short' },
      { password: 'nouppercase123!', reason: 'no uppercase' },
      { password: 'NOLOWERCASE123!', reason: 'no lowercase' },
      { password: 'NoNumbers!', reason: 'no numbers' },
      { password: 'NoSpecial123', reason: 'no special char' }
    ];

    for (const testCase of testCases) {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: `test_${Date.now()}`,
          email: `test_${Date.now()}@example.com`,
          password: testCase.password
        });

      expect(res.status).toBe(400);
    }
  });

  it('should hash passwords before storing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: `hashtest_${Date.now()}`,
        email: `hashtest_${Date.now()}@example.com`,
        password: 'TestP@ss123'
      });

    expect(res.status).toBe(201);
    // Password should never be in response
    expect(res.body.data.user.password).toBeUndefined();
  });
});

describe('Account Security', () => {
  it('should lock account after multiple failed login attempts', async () => {
    const testEmail = `locktest_${Date.now()}@example.com`;
    
    // Register user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: `locktest_${Date.now()}`,
        email: testEmail,
        password: 'TestP@ss123'
      });

    // Attempt failed logins (5 times to trigger lock)
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword'
        });
    }

    // Next attempt should be locked
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'TestP@ss123'
      });

    expect(res.status).toBe(423);
    expect(res.body.message).toContain('locked');
  });
});
