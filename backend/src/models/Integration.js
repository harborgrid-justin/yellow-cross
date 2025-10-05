/**
 * Integration Model - Mongoose Schema for Integration & API Management
 * Comprehensive data model for third-party integrations and API connections
 */

const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  // Basic Information
  integrationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Integration Type
  integrationType: {
    type: String,
    required: true,
    enum: ['Accounting', 'E-Signature', 'Legal Research', 'Calendar', 'Email', 'Document Storage', 'Payment', 'CRM', 'API', 'Webhook', 'Custom'],
    index: true
  },
  
  // Provider Information
  provider: {
    name: String,
    url: String,
    documentationUrl: String
  },
  
  // Configuration
  config: {
    apiUrl: String,
    apiVersion: String,
    authType: {
      type: String,
      enum: ['API Key', 'OAuth', 'OAuth2', 'Basic Auth', 'JWT', 'SAML', 'None']
    },
    credentials: {
      type: Map,
      of: String
    },
    settings: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  
  // Authentication
  apiKey: String,
  apiSecret: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,
  
  // Status & Health
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Error', 'Pending', 'Suspended'],
    default: 'Pending',
    index: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  lastHealthCheck: Date,
  healthStatus: {
    type: String,
    enum: ['Healthy', 'Degraded', 'Down', 'Unknown']
  },
  
  // Usage Statistics
  statistics: {
    totalRequests: {
      type: Number,
      default: 0
    },
    successfulRequests: {
      type: Number,
      default: 0
    },
    failedRequests: {
      type: Number,
      default: 0
    },
    lastRequestAt: Date,
    avgResponseTime: Number
  },
  
  // Rate Limiting
  rateLimit: {
    enabled: {
      type: Boolean,
      default: true
    },
    requestsPerMinute: {
      type: Number,
      default: 60
    },
    requestsPerHour: {
      type: Number,
      default: 3600
    },
    requestsPerDay: {
      type: Number,
      default: 86400
    }
  },
  
  // Webhooks
  webhooks: [{
    webhookId: String,
    url: String,
    events: [String],
    secret: String,
    isActive: Boolean,
    lastTriggered: Date
  }],
  
  // Data Sync
  dataSync: {
    enabled: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      enum: ['Import', 'Export', 'Bidirectional']
    },
    frequency: {
      type: String,
      enum: ['Real-time', 'Hourly', 'Daily', 'Weekly', 'Manual']
    },
    lastSyncAt: Date,
    nextSyncAt: Date,
    syncStatus: String
  },
  
  // Error Tracking
  errors: [{
    timestamp: Date,
    errorCode: String,
    errorMessage: String,
    request: String,
    resolved: Boolean
  }],
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
    index: true
  },
  lastModifiedBy: String,
  tags: [String],
  notes: String
}, {
  timestamps: true
});

// Indexes
integrationSchema.index({ integrationType: 1, status: 1 });
integrationSchema.index({ isEnabled: 1, status: 1 });
integrationSchema.index({ createdBy: 1 });

// Methods
integrationSchema.methods.incrementRequests = function(success = true) {
  this.statistics.totalRequests += 1;
  if (success) {
    this.statistics.successfulRequests += 1;
  } else {
    this.statistics.failedRequests += 1;
  }
  this.statistics.lastRequestAt = new Date();
  return this.save();
};

integrationSchema.methods.updateHealthStatus = function(status, responseTime) {
  this.healthStatus = status;
  this.lastHealthCheck = new Date();
  
  if (responseTime) {
    const currentAvg = this.statistics.avgResponseTime || 0;
    const totalRequests = this.statistics.totalRequests || 1;
    this.statistics.avgResponseTime = 
      (currentAvg * (totalRequests - 1) + responseTime) / totalRequests;
  }
  
  return this.save();
};

integrationSchema.methods.addError = function(errorCode, errorMessage, request) {
  this.errors.push({
    timestamp: new Date(),
    errorCode,
    errorMessage,
    request,
    resolved: false
  });
  
  // Keep only last 100 errors
  if (this.errors.length > 100) {
    this.errors = this.errors.slice(-100);
  }
  
  return this.save();
};

integrationSchema.methods.refreshAccessToken = async function() {
  // Stub for token refresh logic
  // In production, this would call the provider's token refresh endpoint
  this.tokenExpiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
  return this.save();
};

// Static methods
integrationSchema.statics.findActive = function() {
  return this.find({ status: 'Active', isEnabled: true });
};

integrationSchema.statics.findByType = function(integrationType) {
  return this.find({ integrationType, status: 'Active' });
};

const Integration = mongoose.model('Integration', integrationSchema);

module.exports = Integration;
