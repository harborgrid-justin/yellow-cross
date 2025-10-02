/**
 * Yellow Cross - Enterprise Law Firm Practice Management Platform
 * Main Application Entry Point
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Yellow Cross Platform running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('All 15 enterprise features loaded successfully');
  });
}

module.exports = app;
