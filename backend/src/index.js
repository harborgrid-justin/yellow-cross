/**
 * Yellow Cross - Enterprise Law Firm Practice Management Platform
 * Main Application Entry Point
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import enterprise-grade configurations
const logger = require('./config/logger');
const { validateEnv } = require('./config/env');
const { connectDB } = require('./config/database');
const { performHealthCheck, livenessProbe, readinessProbe } = require('./config/healthCheck');
const setupGracefulShutdown = require('./config/gracefulShutdown');

// Import middleware
const correlationIdMiddleware = require('./middleware/correlationId');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

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
const path = require('path');

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

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Import all feature modules
const caseManagement = require('./features/case-management');
const clientCRM = require('./features/client-crm');
const documentManagement = require('./features/document-management');
const timeBilling = require('./features/time-billing');
const calendarScheduling = require('./features/calendar-scheduling');
const taskWorkflow = require('./features/task-workflow');
const legalResearch = require('./features/legal-research');
const courtDocket = require('./features/court-docket');
const contractManagement = require('./features/contract-management');
const eDiscovery = require('./features/ediscovery');
const compliance = require('./features/compliance');
const reporting = require('./features/reporting');
const communication = require('./features/communication');
const security = require('./features/security');
const integration = require('./features/integration');

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
app.use('/api/reports', reporting);
app.use('/api/communication', communication);
app.use('/api/security', security);
app.use('/api/integrations', integration);

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

module.exports = app;
