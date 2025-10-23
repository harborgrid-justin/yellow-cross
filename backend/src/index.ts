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

// Import all feature modules - Original 15 features
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
import searchRouter from './features/search';
import notificationsRouter from './features/notifications';

// Import new 45 features
import litigationManagement from './features/litigation-management';
import mediationADR from './features/mediation-adr';
import intellectualProperty from './features/intellectual-property';
import realEstateTransactions from './features/real-estate-transactions';
import corporateGovernance from './features/corporate-governance';
import mergersAcquisitions from './features/mergers-acquisitions';
import employmentLaw from './features/employment-law';
import immigrationLaw from './features/immigration-law';
import familyLaw from './features/family-law';
import criminalDefense from './features/criminal-defense';
import bankruptcyManagement from './features/bankruptcy-management';
import estatePlanning from './features/estate-planning';
import taxLaw from './features/tax-law';
import personalInjury from './features/personal-injury';
import classAction from './features/class-action';
import appellatePractice from './features/appellate-practice';
import environmentalLaw from './features/environmental-law';
import healthcareLaw from './features/healthcare-law';
import insuranceDefense from './features/insurance-defense';
import securitiesLaw from './features/securities-law';
import financialServices from './features/financial-services';
import energyUtilities from './features/energy-utilities';
import telecommunications from './features/telecommunications';
import aviationLaw from './features/aviation-law';
import maritimeLaw from './features/maritime-law';
import constructionLaw from './features/construction-law';
import franchiseLaw from './features/franchise-law';
import sportsEntertainment from './features/sports-entertainment';
import technologyTransactions from './features/technology-transactions';
import dataPrivacy from './features/data-privacy';
import cybersecurityLegal from './features/cybersecurity-legal';
import governmentContracts from './features/government-contracts';
import nonProfitLaw from './features/non-profit-law';
import educationLaw from './features/education-law';
import laborRelations from './features/labor-relations';
import internationalTrade from './features/international-trade';
import antitrustCompetition from './features/antitrust-competition';
import whiteCollarCrime from './features/white-collar-crime';
import civilRights from './features/civil-rights';
import municipalLaw from './features/municipal-law';
import veteransAffairs from './features/veterans-affairs';
import socialSecurity from './features/social-security';
import consumerProtection from './features/consumer-protection';
import landlordTenant from './features/landlord-tenant';
import proBono from './features/pro-bono';

// Register all feature routes - Original 15 features
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
app.use('/api/search', searchRouter);
app.use('/api/notifications', notificationsRouter);

// Register new 45 feature routes
app.use('/api/litigation', litigationManagement);
app.use('/api/mediation', mediationADR);
app.use('/api/ip', intellectualProperty);
app.use('/api/realestate', realEstateTransactions);
app.use('/api/governance', corporateGovernance);
app.use('/api/manda', mergersAcquisitions);
app.use('/api/employment', employmentLaw);
app.use('/api/immigration', immigrationLaw);
app.use('/api/family', familyLaw);
app.use('/api/criminal', criminalDefense);
app.use('/api/bankruptcy', bankruptcyManagement);
app.use('/api/estate', estatePlanning);
app.use('/api/tax', taxLaw);
app.use('/api/personalinjury', personalInjury);
app.use('/api/classaction', classAction);
app.use('/api/appellate', appellatePractice);
app.use('/api/environmental', environmentalLaw);
app.use('/api/healthcare', healthcareLaw);
app.use('/api/insurancedefense', insuranceDefense);
app.use('/api/securities', securitiesLaw);
app.use('/api/financial', financialServices);
app.use('/api/energy', energyUtilities);
app.use('/api/telecom', telecommunications);
app.use('/api/aviation', aviationLaw);
app.use('/api/maritime', maritimeLaw);
app.use('/api/construction', constructionLaw);
app.use('/api/franchise', franchiseLaw);
app.use('/api/sports', sportsEntertainment);
app.use('/api/technology', technologyTransactions);
app.use('/api/privacy', dataPrivacy);
app.use('/api/cybersecurity', cybersecurityLegal);
app.use('/api/govcontracts', governmentContracts);
app.use('/api/nonprofit', nonProfitLaw);
app.use('/api/education', educationLaw);
app.use('/api/labor', laborRelations);
app.use('/api/trade', internationalTrade);
app.use('/api/antitrust', antitrustCompetition);
app.use('/api/whitecollar', whiteCollarCrime);
app.use('/api/civilrights', civilRights);
app.use('/api/municipal', municipalLaw);
app.use('/api/veterans', veteransAffairs);
app.use('/api/socialsecurity', socialSecurity);
app.use('/api/consumer', consumerProtection);
app.use('/api/landlordtenant', landlordTenant);
app.use('/api/probono', proBono);

// Authentication routes (convenience wrapper for security/auth endpoints)
app.use('/api/auth', authRouter);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Yellow Cross',
    version: '2.0.0',
    description: 'Enterprise Law Firm Practice Management Platform - Now with 60 Production Features',
    totalFeatures: 60,
    features: [
      // Original 15 features
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
      'Integration & API Management',
      // New 45 features
      'Litigation Management',
      'Mediation & ADR',
      'Intellectual Property Management',
      'Real Estate Transactions',
      'Corporate Governance',
      'Mergers & Acquisitions',
      'Employment Law',
      'Immigration Law',
      'Family Law',
      'Criminal Defense',
      'Bankruptcy Management',
      'Estate Planning',
      'Tax Law',
      'Personal Injury',
      'Class Action Management',
      'Appellate Practice',
      'Environmental Law',
      'Healthcare Law',
      'Insurance Defense',
      'Securities Law',
      'Financial Services',
      'Energy & Utilities',
      'Telecommunications',
      'Aviation Law',
      'Maritime Law',
      'Construction Law',
      'Franchise Law',
      'Sports & Entertainment',
      'Technology Transactions',
      'Data Privacy & GDPR',
      'Cybersecurity Legal',
      'Government Contracts',
      'Non-Profit Law',
      'Education Law',
      'Labor Relations',
      'International Trade',
      'Antitrust & Competition',
      'White Collar Crime',
      'Civil Rights',
      'Municipal Law',
      'Veterans Affairs',
      'Social Security',
      'Consumer Protection',
      'Landlord-Tenant Law',
      'Pro Bono Management'
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
      features: 60,
      nodeVersion: process.version,
    });
  });
  
  // Setup graceful shutdown
  setupGracefulShutdown(server);
}

export default app;
