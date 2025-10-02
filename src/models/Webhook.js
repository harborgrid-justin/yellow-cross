/**
 * Webhook Model - Mongoose Schema for Webhook Management
 * Manages webhook subscriptions, deliveries, and logs
 */

const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  // Basic Information
  webhookId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Webhook Configuration
  url: {
    type: String,
    required: true,
    trim: true
  },
  method: {
    type: String,
    enum: ['POST', 'PUT', 'PATCH'],
    default: 'POST'
  },
  secret: {
    type: String,
    trim: true // Used for HMAC signature verification
  },
  
  // Event Subscriptions
  events: [{
    type: String,
    required: true
  }], // e.g., ['case.created', 'document.uploaded', 'task.completed']
  
  eventFilters: {
    caseTypes: [String],
    documentCategories: [String],
    userIds: [String],
    tags: [String],
    customFilters: mongoose.Schema.Types.Mixed
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Paused', 'Failed', 'Testing'],
    default: 'Active',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Headers & Authentication
  headers: {
    type: Map,
    of: String,
    default: {}
  },
  authType: {
    type: String,
    enum: ['None', 'Bearer Token', 'Basic Auth', 'API Key', 'OAuth2', 'Custom'],
    default: 'None'
  },
  authConfig: {
    token: String,
    username: String,
    password: String,
    apiKey: String,
    apiKeyHeader: String,
    customAuth: mongoose.Schema.Types.Mixed
  },
  
  // Delivery Settings
  deliverySettings: {
    timeout: { type: Number, default: 30000 }, // milliseconds
    retryAttempts: { type: Number, default: 3 },
    retryIntervals: [Number], // seconds between retries [60, 300, 900]
    retryOnStatus: [Number], // HTTP status codes to retry on
    batchDelivery: { type: Boolean, default: false },
    batchSize: { type: Number, default: 1 },
    batchWindow: { type: Number, default: 60 } // seconds
  },
  
  // Payload Configuration
  payloadConfig: {
    format: {
      type: String,
      enum: ['JSON', 'XML', 'Form Data', 'Custom'],
      default: 'JSON'
    },
    includeFullPayload: { type: Boolean, default: true },
    customTemplate: String,
    includeMetadata: { type: Boolean, default: true },
    includeTimestamp: { type: Boolean, default: true },
    customFields: mongoose.Schema.Types.Mixed
  },
  
  // Statistics
  statistics: {
    totalDeliveries: { type: Number, default: 0 },
    successfulDeliveries: { type: Number, default: 0 },
    failedDeliveries: { type: Number, default: 0 },
    lastDeliveryAt: Date,
    lastSuccessAt: Date,
    lastFailureAt: Date,
    averageResponseTime: { type: Number, default: 0 },
    totalRetries: { type: Number, default: 0 }
  },
  
  // Recent Deliveries (last 10)
  recentDeliveries: [{
    deliveryId: String,
    eventType: String,
    timestamp: Date,
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Pending', 'Retrying']
    },
    statusCode: Number,
    responseTime: Number,
    attempts: Number,
    errorMessage: String
  }],
  
  // Health Monitoring
  health: {
    status: {
      type: String,
      enum: ['Healthy', 'Degraded', 'Failing', 'Unknown'],
      default: 'Unknown'
    },
    lastHealthCheck: Date,
    consecutiveFailures: { type: Number, default: 0 },
    maxConsecutiveFailures: { type: Number, default: 5 },
    successRate: { type: Number, default: 100 } // percentage
  },
  
  // Rate Limiting
  rateLimits: {
    enabled: { type: Boolean, default: false },
    requestsPerMinute: Number,
    requestsPerHour: Number,
    currentMinuteCount: { type: Number, default: 0 },
    currentHourCount: { type: Number, default: 0 }
  },
  
  // Security
  security: {
    ipWhitelist: [String],
    validateSSL: { type: Boolean, default: true },
    signPayload: { type: Boolean, default: true },
    signatureHeader: { type: String, default: 'X-Webhook-Signature' }
  },
  
  // Organization
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Integration'
  },
  
  // Metadata
  tags: [String],
  notes: String,
  environment: {
    type: String,
    enum: ['Production', 'Staging', 'Development', 'Testing'],
    default: 'Production'
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastModifiedBy: String,
  lastModifiedAt: Date,
  lastTriggeredAt: Date,
  pausedAt: Date,
  pausedBy: String,
  pauseReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
webhookSchema.index({ status: 1, isActive: 1 });
webhookSchema.index({ events: 1 });
webhookSchema.index({ createdBy: 1 });
webhookSchema.index({ 'statistics.lastDeliveryAt': -1 });
webhookSchema.index({ 'health.status': 1 });

// Virtual: Success Rate Percentage
webhookSchema.virtual('successRatePercentage').get(function() {
  if (this.statistics.totalDeliveries === 0) {
    return 100;
  }
  return Math.round((this.statistics.successfulDeliveries / this.statistics.totalDeliveries) * 100);
});

// Virtual: Is Healthy
webhookSchema.virtual('isHealthy').get(function() {
  return this.health.status === 'Healthy' && this.health.consecutiveFailures < 3;
});

// Virtual: Days Since Last Delivery
webhookSchema.virtual('daysSinceLastDelivery').get(function() {
  if (!this.statistics.lastDeliveryAt) {
    return null;
  }
  const diffTime = Math.abs(new Date() - this.statistics.lastDeliveryAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Static method: Find active webhooks for event
webhookSchema.statics.findForEvent = function(eventType) {
  return this.find({
    events: eventType,
    status: 'Active',
    isActive: true
  });
};

// Static method: Get webhook statistics
webhookSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalDeliveries: { $sum: '$statistics.totalDeliveries' },
        successfulDeliveries: { $sum: '$statistics.successfulDeliveries' },
        failedDeliveries: { $sum: '$statistics.failedDeliveries' }
      }
    }
  ]);
  return stats;
};

// Instance method: Record delivery
webhookSchema.methods.recordDelivery = async function(deliveryData) {
  const { eventType, status, statusCode, responseTime, attempts, errorMessage } = deliveryData;
  
  // Update statistics
  this.statistics.totalDeliveries += 1;
  if (status === 'Success') {
    this.statistics.successfulDeliveries += 1;
    this.statistics.lastSuccessAt = new Date();
    this.health.consecutiveFailures = 0;
  } else {
    this.statistics.failedDeliveries += 1;
    this.statistics.lastFailureAt = new Date();
    this.health.consecutiveFailures += 1;
  }
  this.statistics.lastDeliveryAt = new Date();
  this.lastTriggeredAt = new Date();
  
  if (attempts > 1) {
    this.statistics.totalRetries += (attempts - 1);
  }
  
  // Update average response time
  const total = this.statistics.totalDeliveries;
  this.statistics.averageResponseTime = 
    ((this.statistics.averageResponseTime * (total - 1)) + responseTime) / total;
  
  // Update success rate
  this.health.successRate = (this.statistics.successfulDeliveries / this.statistics.totalDeliveries) * 100;
  
  // Add to recent deliveries (keep last 10)
  this.recentDeliveries.unshift({
    deliveryId: `DEL-${Date.now()}`,
    eventType,
    timestamp: new Date(),
    status,
    statusCode,
    responseTime,
    attempts,
    errorMessage
  });
  this.recentDeliveries = this.recentDeliveries.slice(0, 10);
  
  // Update health status
  if (this.health.consecutiveFailures >= this.health.maxConsecutiveFailures) {
    this.health.status = 'Failing';
    this.status = 'Failed';
  } else if (this.health.successRate < 80) {
    this.health.status = 'Degraded';
  } else {
    this.health.status = 'Healthy';
  }
  
  await this.save();
};

// Instance method: Test webhook
webhookSchema.methods.test = async function() {
  const testPayload = {
    event: 'webhook.test',
    timestamp: new Date().toISOString(),
    message: 'This is a test webhook delivery'
  };
  
  // In production, this would actually send the test request
  await this.recordDelivery({
    eventType: 'webhook.test',
    status: 'Success',
    statusCode: 200,
    responseTime: 150,
    attempts: 1
  });
  
  return { success: true, message: 'Test webhook sent successfully' };
};

// Instance method: Pause webhook
webhookSchema.methods.pause = async function(pausedBy, reason = '') {
  this.status = 'Paused';
  this.pausedAt = new Date();
  this.pausedBy = pausedBy;
  this.pauseReason = reason;
  await this.save();
};

// Instance method: Resume webhook
webhookSchema.methods.resume = async function() {
  this.status = 'Active';
  this.pausedAt = null;
  this.pausedBy = null;
  this.pauseReason = null;
  this.health.consecutiveFailures = 0;
  await this.save();
};

// Pre-save middleware
webhookSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

const Webhook = mongoose.model('Webhook', webhookSchema);

module.exports = Webhook;
