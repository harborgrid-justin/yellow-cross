/**
 * Report Validation Schemas using Joi
 * Input validation for reporting and analytics operations
 */

const Joi = require('joi');

// Validation schema for analytics query parameters
const analyticsQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  practiceArea: Joi.string().trim().optional(),
  attorney: Joi.string().trim().optional(),
  status: Joi.string().valid('Open', 'In Progress', 'On Hold', 'Pending Review', 'Closed', 'Archived').optional(),
  matterType: Joi.string().trim().optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  groupBy: Joi.string().valid('status', 'priority', 'matterType', 'practiceArea', 'attorney', 'month').optional()
});

// Validation schema for financial dashboard query
const financialQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  practiceArea: Joi.string().trim().optional(),
  attorney: Joi.string().trim().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  includeProjections: Joi.boolean().default(false),
  groupBy: Joi.string().valid('month', 'quarter', 'year', 'practiceArea', 'attorney').optional()
});

// Validation schema for attorney performance query
const attorneyPerformanceQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  attorney: Joi.string().trim().optional(),
  practiceArea: Joi.string().trim().optional(),
  includeComparison: Joi.boolean().default(false),
  metric: Joi.string().valid('billableHours', 'caseOutcomes', 'efficiency', 'clientSatisfaction').optional()
});

// Validation schema for client analytics query
const clientAnalyticsQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  segment: Joi.string().trim().optional(),
  includeRetention: Joi.boolean().default(true),
  includeLifetimeValue: Joi.boolean().default(true)
});

// Validation schema for practice area analysis query
const practiceAreaQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  practiceArea: Joi.string().trim().optional(),
  includeForecasting: Joi.boolean().default(false),
  compareWithPrevious: Joi.boolean().default(false)
});

// Validation schema for custom report creation
const createCustomReportSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().allow('').max(2000),
  reportType: Joi.string().required().valid('Case Analytics', 'Financial', 'Attorney Performance', 'Client Analytics', 'Practice Area', 'Custom', 'Predictive', 'Executive'),
  category: Joi.string().trim().allow('').max(100),
  dataSource: Joi.string().valid('Cases', 'Tasks', 'Documents', 'Clients', 'Financial', 'Mixed').default('Mixed'),
  filters: Joi.object({
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().optional(),
    status: Joi.array().items(Joi.string()).optional(),
    practiceArea: Joi.array().items(Joi.string()).optional(),
    attorney: Joi.array().items(Joi.string()).optional(),
    client: Joi.array().items(Joi.string()).optional(),
    customFilters: Joi.object().optional()
  }).optional(),
  metrics: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    aggregationType: Joi.string().valid('sum', 'avg', 'count', 'min', 'max', 'median', 'percentage').required(),
    field: Joi.string().required()
  })).optional(),
  groupBy: Joi.array().items(Joi.string()).optional(),
  sortBy: Joi.object({
    field: Joi.string().required(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }).optional(),
  visualizationType: Joi.string().valid('Table', 'Bar Chart', 'Line Chart', 'Pie Chart', 'Area Chart', 'Scatter Plot', 'Heatmap', 'Gauge', 'Mixed').default('Table'),
  isScheduled: Joi.boolean().default(false),
  scheduleConfig: Joi.object({
    frequency: Joi.string().valid('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly').optional(),
    time: Joi.string().optional(),
    recipients: Joi.array().items(Joi.string().email()).optional(),
    format: Joi.string().valid('PDF', 'Excel', 'CSV', 'HTML').default('PDF')
  }).optional(),
  visibility: Joi.string().valid('Public', 'Private', 'Team', 'Executive').default('Team'),
  sharedWith: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for predictive analytics query
const predictiveAnalyticsQuerySchema = Joi.object({
  predictionType: Joi.string().required().valid('caseOutcome', 'resourceDemand', 'revenueForecasting', 'riskAssessment', 'trendAnalysis'),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  forecastPeriod: Joi.number().min(1).max(365).default(90),
  confidenceLevel: Joi.number().min(0).max(1).default(0.95),
  practiceArea: Joi.string().trim().optional(),
  includeFactors: Joi.boolean().default(true)
});

// Validation schema for executive dashboard query
const executiveDashboardQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  includeKPIs: Joi.boolean().default(true),
  includeComparison: Joi.boolean().default(true),
  detailLevel: Joi.string().valid('summary', 'detailed', 'comprehensive').default('summary')
});

// Validation schema for report scheduling
const scheduleReportSchema = Joi.object({
  reportId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  frequency: Joi.string().required().valid('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'),
  time: Joi.string().required(),
  recipients: Joi.array().items(Joi.string().email()).min(1).required(),
  format: Joi.string().valid('PDF', 'Excel', 'CSV', 'HTML').default('PDF'),
  enabled: Joi.boolean().default(true)
});

module.exports = {
  analyticsQuerySchema,
  financialQuerySchema,
  attorneyPerformanceQuerySchema,
  clientAnalyticsQuerySchema,
  practiceAreaQuerySchema,
  createCustomReportSchema,
  predictiveAnalyticsQuerySchema,
  executiveDashboardQuerySchema,
  scheduleReportSchema
};
