/**
 * Application Constants
 * 
 * Central location for all app-wide constants
 * Following Google's configuration management practices
 */

export const APP_CONFIG = {
  name: 'Yellow Cross',
  description: 'Enterprise Law Firm Practice Management Platform',
  version: '2.0.0',
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000, // 30 seconds
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  features: '/features',
} as const;

export const STORAGE_KEYS = {
  authToken: 'yellow_cross_auth_token',
  user: 'yellow_cross_user',
  theme: 'yellow_cross_theme',
} as const;

export const FEATURE_SLUGS = {
  caseManagement: 'case-management',
  clientCrm: 'client-crm',
  documentManagement: 'document-management',
  timeBilling: 'time-billing',
  calendarScheduling: 'calendar-scheduling',
  taskWorkflow: 'task-workflow',
  legalResearch: 'legal-research',
  courtDocket: 'court-docket',
  contractManagement: 'contract-management',
  ediscovery: 'ediscovery',
  compliance: 'compliance',
  reportingAnalytics: 'reporting-analytics',
  communication: 'communication',
  security: 'security',
  integration: 'integration',
} as const;
