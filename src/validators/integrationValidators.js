/**
 * Integration Validation Schemas using Joi
 * Input validation for integration & API management operations
 */

const Joi = require('joi');

// Validation schema for creating/updating third-party integration
const integrationSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  displayName: Joi.string().required().trim().min(2).max(150),
  description: Joi.string().trim().allow('').max(500),
  type: Joi.string().required().valid(
    'Accounting', 'E-Signature', 'CRM', 'Document Storage', 'Payment Gateway',
    'Email', 'Calendar', 'Analytics', 'Communication', 'Legal Research',
    'Court Filing', 'Legacy System', 'Custom', 'Other'
  ),
  provider: Joi.string().required().trim().min(2).max(100),
  category: Joi.string().valid('Finance', 'Document', 'Communication', 'Productivity', 'Legal', 'Other').default('Other'),
  connectionMethod: Joi.string().required().valid('OAuth2', 'API Key', 'Basic Auth', 'Token', 'SAML', 'Custom'),
  credentials: Joi.object({
    apiKey: Joi.string().trim().allow(''),
    apiSecret: Joi.string().trim().allow(''),
    accessToken: Joi.string().trim().allow(''),
    refreshToken: Joi.string().trim().allow(''),
    clientId: Joi.string().trim().allow(''),
    clientSecret: Joi.string().trim().allow(''),
    username: Joi.string().trim().allow(''),
    password: Joi.string().trim().allow('')
  }).optional(),
  config: Joi.object({
    baseUrl: Joi.string().uri().trim().allow(''),
    apiVersion: Joi.string().trim().allow(''),
    environment: Joi.string().valid('Production', 'Sandbox', 'Development', 'Staging').default('Production')
  }).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for webhook configuration
const webhookSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  description: Joi.string().trim().allow('').max(500),
  url: Joi.string().required().uri().trim(),
  method: Joi.string().valid('POST', 'PUT', 'PATCH').default('POST'),
  secret: Joi.string().trim().allow('').max(200),
  events: Joi.array().items(Joi.string().trim()).min(1).required(),
  eventFilters: Joi.object({
    caseTypes: Joi.array().items(Joi.string()),
    documentCategories: Joi.array().items(Joi.string()),
    userIds: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string())
  }).optional(),
  headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  authType: Joi.string().valid('None', 'Bearer Token', 'Basic Auth', 'API Key', 'OAuth2', 'Custom').default('None'),
  authConfig: Joi.object({
    token: Joi.string().trim().allow(''),
    username: Joi.string().trim().allow(''),
    password: Joi.string().trim().allow(''),
    apiKey: Joi.string().trim().allow('')
  }).optional(),
  deliverySettings: Joi.object({
    timeout: Joi.number().min(1000).max(120000).default(30000),
    retryAttempts: Joi.number().min(0).max(10).default(3),
    batchDelivery: Joi.boolean().default(false)
  }).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for API key generation
const apiKeySchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  description: Joi.string().trim().allow('').max(500),
  keyType: Joi.string().valid('Public', 'Secret', 'Restricted').default('Secret'),
  environment: Joi.string().valid('Production', 'Sandbox', 'Development', 'Testing').default('Production'),
  permissions: Joi.object({
    read: Joi.boolean().default(true),
    write: Joi.boolean().default(false),
    delete: Joi.boolean().default(false),
    admin: Joi.boolean().default(false)
  }).optional(),
  scopes: Joi.array().items(Joi.string().trim()).optional(),
  rateLimits: Joi.object({
    enabled: Joi.boolean().default(true),
    requestsPerMinute: Joi.number().min(1).max(10000).default(60),
    requestsPerHour: Joi.number().min(1).max(100000).default(1000),
    requestsPerDay: Joi.number().min(1).max(1000000).default(10000)
  }).optional(),
  security: Joi.object({
    ipWhitelist: Joi.array().items(Joi.string().ip()).optional(),
    requireHTTPS: Joi.boolean().default(true)
  }).optional(),
  expiresAt: Joi.date().greater('now').optional(),
  neverExpires: Joi.boolean().default(false),
  createdBy: Joi.string().required().trim()
});

// Validation schema for import/export job
const importExportJobSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  description: Joi.string().trim().allow('').max(500),
  jobType: Joi.string().required().valid('Import', 'Export'),
  dataType: Joi.string().required().valid(
    'Cases', 'Clients', 'Documents', 'Tasks', 'Contacts', 
    'Billing', 'TimeEntries', 'Custom'
  ),
  file: Joi.object({
    filename: Joi.string().required().trim(),
    originalName: Joi.string().trim().allow(''),
    fileType: Joi.string().required().valid('CSV', 'Excel', 'JSON', 'XML', 'PDF', 'Text'),
    fileSize: Joi.number().min(0).max(100 * 1024 * 1024), // 100MB max
    hasHeader: Joi.boolean().default(true)
  }).when('jobType', {
    is: 'Import',
    then: Joi.required()
  }),
  config: Joi.object({
    mode: Joi.string().valid('Create Only', 'Update Only', 'Create or Update', 'Replace All').default('Create or Update'),
    batchSize: Joi.number().min(1).max(1000).default(100),
    skipErrors: Joi.boolean().default(false),
    validateBeforeImport: Joi.boolean().default(true),
    dryRun: Joi.boolean().default(false)
  }).optional(),
  fieldMapping: Joi.array().items(
    Joi.object({
      sourceField: Joi.string().required().trim(),
      targetField: Joi.string().required().trim(),
      dataType: Joi.string().valid('String', 'Number', 'Date', 'Boolean', 'Array', 'Object').optional(),
      transformation: Joi.string().trim().allow('').optional(),
      defaultValue: Joi.string().allow('').optional(),
      required: Joi.boolean().default(false)
    })
  ).optional(),
  filters: Joi.object({
    dateRange: Joi.object({
      startDate: Joi.date().optional(),
      endDate: Joi.date().greater(Joi.ref('startDate')).optional()
    }).optional(),
    status: Joi.array().items(Joi.string()).optional(),
    categories: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }).optional(),
  exportSettings: Joi.object({
    includeRelated: Joi.boolean().default(false),
    includeAttachments: Joi.boolean().default(false),
    includeMetadata: Joi.boolean().default(true),
    columns: Joi.array().items(Joi.string()).optional()
  }).optional(),
  notifications: Joi.object({
    notifyOnCompletion: Joi.boolean().default(true),
    notifyOnError: Joi.boolean().default(true),
    notifyEmails: Joi.array().items(Joi.string().email()).optional()
  }).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for legacy system connection
const legacySystemSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  systemType: Joi.string().required().trim(),
  description: Joi.string().trim().allow('').max(500),
  connectionDetails: Joi.object({
    host: Joi.string().trim().allow(''),
    port: Joi.number().min(1).max(65535).optional(),
    database: Joi.string().trim().allow(''),
    protocol: Joi.string().trim().allow(''),
    connectionString: Joi.string().trim().allow('')
  }).optional(),
  credentials: Joi.object({
    username: Joi.string().trim().allow(''),
    password: Joi.string().trim().allow(''),
    apiKey: Joi.string().trim().allow('')
  }).optional(),
  dataMapping: Joi.object({
    tableMappings: Joi.array().items(
      Joi.object({
        sourceTable: Joi.string().required(),
        targetTable: Joi.string().required()
      })
    ).optional()
  }).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for accounting software sync
const accountingSyncSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  provider: Joi.string().required().valid(
    'QuickBooks Online', 'QuickBooks Desktop', 'Xero', 
    'Sage', 'FreshBooks', 'Other'
  ),
  integrationId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  syncType: Joi.string().required().valid(
    'Invoices', 'Payments', 'Expenses', 'Clients', 
    'Chart of Accounts', 'Time Entries', 'Full Sync'
  ),
  direction: Joi.string().required().valid(
    'Push to Accounting', 'Pull from Accounting', 'Bidirectional'
  ),
  config: Joi.object({
    autoSync: Joi.boolean().default(false),
    syncFrequency: Joi.string().valid(
      'Real-time', 'Every 15 Minutes', 'Hourly', 'Daily', 'Weekly', 'Manual'
    ).default('Manual'),
    syncWindow: Joi.object({
      startDate: Joi.date().optional(),
      endDate: Joi.date().greater(Joi.ref('startDate')).optional()
    }).optional(),
    handleDuplicates: Joi.string().valid('Skip', 'Update', 'Create New', 'Merge').default('Skip')
  }).optional(),
  mapping: Joi.object({
    invoiceSettings: Joi.object({
      invoicePrefix: Joi.string().trim().allow(''),
      defaultTerms: Joi.string().trim().allow('')
    }).optional(),
    accountMapping: Joi.array().items(
      Joi.object({
        lawFirmAccount: Joi.string().required(),
        accountingAccount: Joi.string().required()
      })
    ).optional()
  }).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for e-signature integration
const eSignatureSchema = Joi.object({
  provider: Joi.string().required().valid('DocuSign', 'Adobe Sign', 'HelloSign', 'PandaDoc', 'Other'),
  name: Joi.string().required().trim().min(2).max(100),
  description: Joi.string().trim().allow('').max(500),
  integrationId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  documentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  templateId: Joi.string().trim().allow('').optional(),
  signers: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim(),
      email: Joi.string().required().email(),
      role: Joi.string().valid('Signer', 'Approver', 'CC', 'Witness').default('Signer'),
      order: Joi.number().min(1).optional()
    })
  ).min(1).required(),
  settings: Joi.object({
    sendNow: Joi.boolean().default(true),
    reminderEnabled: Joi.boolean().default(true),
    reminderDelay: Joi.number().min(1).max(30).default(3), // days
    expirationDays: Joi.number().min(1).max(365).optional()
  }).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for rate limiting configuration
const rateLimitSchema = Joi.object({
  enabled: Joi.boolean().required(),
  requestsPerMinute: Joi.number().min(1).max(10000).optional(),
  requestsPerHour: Joi.number().min(1).max(100000).optional(),
  requestsPerDay: Joi.number().min(1).max(1000000).optional(),
  burstLimit: Joi.number().min(1).max(1000).optional(),
  throttleResponse: Joi.string().valid('Block', 'Queue', 'Slow Down').default('Block'),
  whitelist: Joi.array().items(Joi.string().ip()).optional(),
  updatedBy: Joi.string().required().trim()
});

// Validation schema for connection test
const connectionTestSchema = Joi.object({
  integrationId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  testEndpoint: Joi.string().uri().trim().optional(),
  timeout: Joi.number().min(1000).max(60000).default(10000)
});

module.exports = {
  integrationSchema,
  webhookSchema,
  apiKeySchema,
  importExportJobSchema,
  legacySystemSchema,
  accountingSyncSchema,
  eSignatureSchema,
  rateLimitSchema,
  connectionTestSchema
};
