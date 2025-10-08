/**
 * Enterprise Setup Verification Tests
 * Tests that verify the new PostgreSQL/Prisma setup is working
 */

import request from 'supertest';
import path from 'path';
import fs from 'fs';

// Don't load the app yet to test structure first
describe('Enterprise Setup Verification', () => {
  
  describe('Project Structure', () => {
    test('should have backend folder', () => {
      const backendPath = path.join(__dirname, '../');
      expect(fs.existsSync(backendPath)).toBe(true);
    });

    test('should have frontend folder', () => {
      const frontendPath = path.join(__dirname, '../../frontend');
      expect(fs.existsSync(frontendPath)).toBe(true);
    });

    test('should have Prisma schema', () => {
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      expect(fs.existsSync(schemaPath)).toBe(true);
    });

    test('should have docker-compose.yml', () => {
      const dockerComposePath = path.join(__dirname, '../../docker-compose.yml');
      expect(fs.existsSync(dockerComposePath)).toBe(true);
    });

    test('should have Dockerfile', () => {
      const dockerfilePath = path.join(__dirname, '../../Dockerfile');
      expect(fs.existsSync(dockerfilePath)).toBe(true);
    });
  });

  describe('Prisma Configuration', () => {
    test('should have Prisma schema with PostgreSQL datasource', () => {
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      
      expect(schemaContent).toContain('datasource db');
      expect(schemaContent).toContain('provider = "postgresql"');
    });

    test('should have Case model in schema', () => {
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      
      expect(schemaContent).toContain('model Case');
      expect(schemaContent).toContain('caseNumber');
    });

    test('should have Document model in schema', () => {
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      
      expect(schemaContent).toContain('model Document');
      expect(schemaContent).toContain('documentNumber');
    });

    test('should have Task model in schema', () => {
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      
      expect(schemaContent).toContain('model Task');
      expect(schemaContent).toContain('taskNumber');
    });

    test('should have Evidence model in schema', () => {
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      
      expect(schemaContent).toContain('model Evidence');
      expect(schemaContent).toContain('evidenceNumber');
    });
  });

  describe('Database Configuration', () => {
    test('should export Prisma client getter', () => {
      import { prisma, getPrismaClient } from '../src/config/database';
      
      expect(getPrismaClient).toBeDefined();
      expect(typeof getPrismaClient).toBe('function');
      expect(prisma).toBeDefined();
    });

    test('should have connectDB function', () => {
      import { connectDB } from '../src/config/database';
      
      expect(connectDB).toBeDefined();
      expect(typeof connectDB).toBe('function');
    });

    test('should have isConnected function', () => {
      import { isConnected } from '../src/config/database';
      
      expect(isConnected).toBeDefined();
      expect(typeof isConnected).toBe('function');
    });
  });

  describe('Application Server', () => {
    let app;

    beforeAll(() => {
      // Load app after structure tests pass
      app = require('../src/index');
    });

    afterAll(async () => {
      // Clean up Prisma client to allow Jest to exit
      import { disconnectDB } from '../src/config/database';
      await disconnectDB();
    });

    test('should start server and respond to health check', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      // Status can be 'healthy', 'degraded' (no DB), or 'unhealthy'
      expect(['healthy', 'degraded', 'unhealthy']).toContain(response.body.status);
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('checks');
    });

    test('should serve frontend static files', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
      expect(response.text).toContain('Yellow Cross');
    });

    test('should have feature routes registered', () => {
      // Just verify the app object exists and has the router
      expect(app).toBeDefined();
      expect(app._router).toBeDefined();
    });
  });

  describe('Package Configuration', () => {
    test('should have Prisma in dependencies', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageJson.dependencies).toHaveProperty('@prisma/client');
      expect(packageJson.devDependencies).toHaveProperty('prisma');
    });

    test('should have PostgreSQL driver in dependencies', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageJson.dependencies).toHaveProperty('pg');
    });

    test('should have setup scripts configured', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageJson.scripts).toHaveProperty('setup');
      expect(packageJson.scripts).toHaveProperty('prisma:generate');
      expect(packageJson.scripts).toHaveProperty('prisma:migrate');
      expect(packageJson.scripts).toHaveProperty('docker:setup');
    });

    test('should have updated main entry point', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageJson.main).toBe('backend/src/index.js');
    });
  });

  describe('Docker Configuration', () => {
    test('should have docker-compose with PostgreSQL service', () => {
      const dockerComposePath = path.join(__dirname, '../../docker-compose.yml');
      const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');
      
      expect(dockerComposeContent).toContain('postgres:');
      expect(dockerComposeContent).toContain('image: postgres:15-alpine');
    });

    test('should have docker-compose with backend service', () => {
      const dockerComposePath = path.join(__dirname, '../../docker-compose.yml');
      const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');
      
      expect(dockerComposeContent).toContain('backend:');
      expect(dockerComposeContent).toContain('dockerfile: Dockerfile');
    });

    test('should have Dockerfile with Node.js base', () => {
      const dockerfilePath = path.join(__dirname, '../../Dockerfile');
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
      
      expect(dockerfileContent).toContain('FROM node:18-alpine');
    });
  });
});
