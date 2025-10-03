/**
 * Integration Validation Schemas using Joi
 * Input validation for integration and API management operations
 */

const Joi = require('joi');

// Validation schema for integration creation
const createIntegrationSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(1000),
  integrationType: Joi.string().required().valid('Accounting', 'E-Signature', 'Legal Research', 'Calendar', 'Email', 'Document Storage', 'Payment', 'CRM', 'API', 'Webhook', 'Custom'),
  provider: Joi.object({
    name: Joi.string().required(),
    url: Joi.string().uri().optional(),
    documentationUrl: Joi.string().uri().optional()
  }).optional(),
  config: Joi.object({
    apiUrl: Joi.string().uri().required(),
    apiVersion: Joi.string().optional(),
    authType: Joi.string().valid('API Key', 'OAuth', 'OAuth2', 'Basic Auth', 'JWT', 'SAML', 'None').required(),
    credentials: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    settings: Joi.object().pattern(Joi.string(), Joi.any()).optional()
  }).required(),
  apiKey: Joi.string().optional(),
  apiSecret: Joi.string().optional(),
  isEnabled: Joi.boolean().default(true),
  rateLimit: Joi.object({
    enabled: Joi.boolean().default(true),
    requestsPerMinute: Joi.number().min(1).max(10000).default(60),
    requestsPerHour: Joi.number().min(1).max(100000).default(3600),
    requestsPerDay: Joi.number().min(1).max(1000000).default(86400)
  }).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for integration update
const updateIntegrationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(200).optional(),
  description: Joi.string().trim().allow('').max(1000).optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Error', 'Pending', 'Suspended').optional(),
  isEnabled: Joi.boolean().optional(),
  config: Joi.object({
    apiUrl: Joi.string().uri().optional(),
    apiVersion: Joi.string().optional(),
    authType: Joi.string().valid('API Key', 'OAuth', 'OAuth2', 'Basic Auth', 'JWT', 'SAML', 'None').optional(),
    credentials: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    settings: Joi.object().pattern(Joi.string(), Joi.any()).optional()
  }).optional(),
  lastModifiedBy: Joi.string().required().trim()
});

// Validation schema for webhook
const webhookSchema = Joi.object({
  url: Joi.string().required().uri(),
  events: Joi.array().items(Joi.string()).min(1).required(),
  secret: Joi.string().optional()
});

// Validation schema for data sync configuration
const dataSyncSchema = Joi.object({
  enabled: Joi.boolean().required(),
  direction: Joi.string().valid('Import', 'Export', 'Bidirectional').required(),
  frequency: Joi.string().valid('Real-time', 'Hourly', 'Daily', 'Weekly', 'Manual').required()
});

// Validation schema for API request
const apiRequestSchema = Joi.object({
  integrationId: Joi.string().required(),
  endpoint: Joi.string().required(),
  method: Joi.string().valid('GET', 'POST', 'PUT', 'PATCH', 'DELETE').default('GET'),
  headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  body: Joi.any().optional(),
  params: Joi.object().pattern(Joi.string(), Joi.any()).optional()
});

// Validation schema for data import/export
const dataTransferSchema = Joi.object({
  integrationId: Joi.string().required(),
  dataType: Joi.string().required().valid('Cases', 'Clients', 'Documents', 'Invoices', 'Contacts', 'Tasks'),
  direction: Joi.string().required().valid('Import', 'Export'),
  filters: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  mapping: Joi.object().pattern(Joi.string(), Joi.string()).optional()
});

module.exports = {
  createIntegrationSchema,
  updateIntegrationSchema,
  webhookSchema,
  dataSyncSchema,
  apiRequestSchema,
  dataTransferSchema
};
