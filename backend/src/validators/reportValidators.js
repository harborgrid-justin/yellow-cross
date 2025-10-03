/**
 * Report Validation Schemas using Joi
 * Input validation for reporting and analytics operations
 */

const Joi = require('joi');

// Validation schema for report creation
const createReportSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(1000),
  reportType: Joi.string().required().valid('Case Analytics', 'Financial', 'Attorney Performance', 'Client Analytics', 'Practice Area', 'Custom', 'Predictive', 'Executive Dashboard'),
  dateRange: Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional()
  }).optional(),
  filters: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  metrics: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    value: Joi.any(),
    unit: Joi.string().optional(),
    trend: Joi.string().valid('Increasing', 'Decreasing', 'Stable', 'N/A').optional()
  })).optional(),
  visibility: Joi.string().valid('Public', 'Private', 'Shared').default('Private'),
  sharedWith: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    role: Joi.string().required(),
    accessLevel: Joi.string().valid('View', 'Edit', 'Admin').default('View')
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  category: Joi.string().trim().allow('').max(100),
  createdBy: Joi.string().required().trim()
});

// Validation schema for report update
const updateReportSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).optional(),
  description: Joi.string().trim().allow('').max(1000).optional(),
  filters: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  metrics: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    value: Joi.any(),
    unit: Joi.string().optional(),
    trend: Joi.string().valid('Increasing', 'Decreasing', 'Stable', 'N/A').optional()
  })).optional(),
  visibility: Joi.string().valid('Public', 'Private', 'Shared').optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Draft', 'Published', 'Scheduled', 'Archived').optional(),
  lastModifiedBy: Joi.string().required().trim()
});

// Validation schema for report schedule
const scheduleReportSchema = Joi.object({
  enabled: Joi.boolean().required(),
  frequency: Joi.string().valid('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly').optional(),
  recipients: Joi.array().items(Joi.string().email()).optional()
});

// Validation schema for analytics query
const analyticsQuerySchema = Joi.object({
  metric: Joi.string().required(),
  dateRange: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
  }).optional(),
  groupBy: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').optional(),
  filters: Joi.object().pattern(Joi.string(), Joi.any()).optional()
});

// Validation schema for custom report builder
const customReportSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  dataSource: Joi.string().required().valid('Cases', 'Clients', 'Documents', 'Billing', 'Tasks', 'Compliance'),
  columns: Joi.array().items(Joi.string()).min(1).required(),
  filters: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  limit: Joi.number().min(1).max(1000).default(100),
  createdBy: Joi.string().required().trim()
});

// Validation schema for dashboard configuration
const dashboardConfigSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  widgets: Joi.array().items(Joi.object({
    type: Joi.string().required().valid('metric', 'chart', 'table', 'list'),
    title: Joi.string().required(),
    dataSource: Joi.string().required(),
    config: Joi.object().optional(),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required(),
      width: Joi.number().required(),
      height: Joi.number().required()
    }).optional()
  })).required(),
  refreshInterval: Joi.number().min(0).optional(),
  createdBy: Joi.string().required().trim()
});

module.exports = {
  createReportSchema,
  updateReportSchema,
  scheduleReportSchema,
  analyticsQuerySchema,
  customReportSchema,
  dashboardConfigSchema
};
