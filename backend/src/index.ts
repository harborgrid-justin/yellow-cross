/**
 * Yellow Cross - Enterprise Law Firm Practice Management Platform
 * Main Application Entry Point
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

// Import enterprise-grade configurations
import logger from './config/logger';
import { validateEnv } from './config/env';
import { connectDB } from './config/database';
import { performHealthCheck, livenessProbe, readinessProbe } from './config/healthCheck';
import setupGracefulShutdown from './config/gracefulShutdown';

// Import middleware
import correlationIdMiddleware from './middleware/correlationId';
import requestLogger from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Validate environment variables at startup
try {
  if (process.env.NODE_ENV !== 'test') {
    validateEnv();
  }
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;
import path from 'path';

// Connect to PostgreSQL via Prisma (optional - will not fail if connection fails)
if (process.env.NODE_ENV !== 'test') {
  connectDB().catch(err => {
    logger.warn('PostgreSQL connection failed, continuing without database', { error: err.message });
  });
}

// Enterprise middleware stack
app.use(correlationIdMiddleware); // Add correlation IDs first
app.use(requestLogger); // Log all requests

// Security middleware with CSP adjusted for frontend
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from built frontend (dist) directory
// Note: Run 'npm run build' to build the frontend before starting the server
app.use(express.static(path.join(__dirname, '../../dist')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Import all feature modules
import caseManagement from './features/case-management';
import clientCRM from './features/client-crm';
import documentManagement from './features/document-management';
import timeBilling from './features/time-billing';
import calendarScheduling from './features/calendar-scheduling';
import taskWorkflow from './features/task-workflow';
import legalResearch from './features/legal-research';
import courtDocket from './features/court-docket';
import contractManagement from './features/contract-management';
import eDiscovery from './features/ediscovery';
import compliance from './features/compliance';
import reportingAnalytics from './features/reporting-analytics';
import communication from './features/communication';
import security from './features/security';
import integration from './features/integration';
import authRouter from './routes/auth';

// Register all feature routes
app.use('/api/cases', caseManagement);
app.use('/api/clients', clientCRM);
app.use('/api/documents', documentManagement);
app.use('/api/billing', timeBilling);
app.use('/api/calendar', calendarScheduling);
app.use('/api/tasks', taskWorkflow);
app.use('/api/research', legalResearch);
app.use('/api/court', courtDocket);
app.use('/api/contracts', contractManagement);
app.use('/api/ediscovery', eDiscovery);
app.use('/api/compliance', compliance);
app.use('/api/reports', reportingAnalytics);
app.use('/api/communication', communication);
app.use('/api/security', security);
app.use('/api/integrations', integration);

// Authentication routes (convenience wrapper for security/auth endpoints)
app.use('/api/auth', authRouter);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Yellow Cross',
    version: '1.0.0',
    description: 'Enterprise Law Firm Practice Management Platform',
    features: [
      'Case Management System',
      'Client Relationship Management (CRM)',
      'Document Management System',
      'Time & Billing Management',
      'Calendar & Scheduling System',
      'Task & Workflow Management',
      'Legal Research & Knowledge Base',
      'Court & Docket Management',
      'Contract Management',
      'eDiscovery & Evidence Management',
      'Compliance & Risk Management',
      'Reporting & Analytics',
      'Communication & Collaboration',
      'Security & Access Control',
      'Integration & API Management'
    ]
  });
});

// Health check endpoints (Kubernetes-compatible)
app.get('/health', async (req, res) => {
  try {
    const health = await performHealthCheck();
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Liveness probe - for Kubernetes
app.get('/health/liveness', (req, res) => {
  res.json(livenessProbe());
});

// Readiness probe - for Kubernetes
app.get('/health/readiness', async (req, res) => {
  try {
    const readiness = await readinessProbe();
    const statusCode = readiness.status === 'ready' ? 200 : 503;
    res.status(statusCode).json(readiness);
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({
      status: 'not-ready',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Error handling middleware (must be last)
app.use(notFoundHandler); // 404 handler
app.use(errorHandler); // Centralized error handler

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    logger.info('Yellow Cross Platform started', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      features: 15,
      nodeVersion: process.version,
    });
  });
  
  // Setup graceful shutdown
  setupGracefulShutdown(server);
}

export default app;
