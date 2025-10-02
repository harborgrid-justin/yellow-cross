/**
 * Integration Model - Mongoose Schema for Third-Party Integrations
 * Manages connections to external systems and services
 */

const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  // Basic Information
  integrationNumber: {
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
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Integration Type & Category
  type: {
    type: String,
    required: true,
    enum: ['Accounting', 'E-Signature', 'CRM', 'Document Storage', 'Payment Gateway', 
           'Email', 'Calendar', 'Analytics', 'Communication', 'Legal Research', 
           'Court Filing', 'Legacy System', 'Custom', 'Other'],
    index: true
  },
  provider: {
    type: String,
    required: true,
    trim: true // e.g., 'QuickBooks', 'Xero', 'DocuSign', 'Adobe Sign'
  },
  category: {
    type: String,
    enum: ['Finance', 'Document', 'Communication', 'Productivity', 'Legal', 'Other'],
    default: 'Other'
  },
  
  // Connection Details
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Error', 'Pending Setup', 'Disconnected'],
    default: 'Pending Setup',
    index: true
  },
  connectionMethod: {
    type: String,
    enum: ['OAuth2', 'API Key', 'Basic Auth', 'Token', 'SAML', 'Custom'],
    required: true
  },
  
  // Authentication & Credentials (encrypted in production)
  credentials: {
    apiKey: { type: String, trim: true },
    apiSecret: { type: String, trim: true },
    accessToken: { type: String, trim: true },
    refreshToken: { type: String, trim: true },
    tokenExpiry: Date,
    clientId: { type: String, trim: true },
    clientSecret: { type: String, trim: true },
    username: { type: String, trim: true },
    password: { type: String, trim: true }, // Should be encrypted
    customFields: mongoose.Schema.Types.Mixed
  },
  
  // Configuration
  config: {
    baseUrl: { type: String, trim: true },
    apiVersion: { type: String, trim: true },
    webhookUrl: { type: String, trim: true },
    webhookSecret: { type: String, trim: true },
    environment: {
      type: String,
      enum: ['Production', 'Sandbox', 'Development', 'Staging'],
      default: 'Production'
    },
    timeout: { type: Number, default: 30000 }, // milliseconds
    retryAttempts: { type: Number, default: 3 },
    customSettings: mongoose.Schema.Types.Mixed
  },
  
  // Sync Settings
  syncSettings: {
    enabled: { type: Boolean, default: false },
    direction: {
      type: String,
      enum: ['Bidirectional', 'Inbound Only', 'Outbound Only', 'None'],
      default: 'None'
    },
    frequency: {
      type: String,
      enum: ['Real-time', 'Every 5 Minutes', 'Every 15 Minutes', 'Hourly', 'Daily', 'Weekly', 'Manual'],
      default: 'Manual'
    },
    lastSyncAt: Date,
    nextSyncAt: Date,
    autoSync: { type: Boolean, default: false },
    syncOnCreate: { type: Boolean, default: false },
    syncOnUpdate: { type: Boolean, default: false },
    syncOnDelete: { type: Boolean, default: false }
  },
  
  // Data Mapping
  dataMapping: {
    fieldMappings: [{
      sourceField: String,
      targetField: String,
      transformation: String,
      required: Boolean,
      defaultValue: String
    }],
    objectMappings: [{
      sourceObject: String,
      targetObject: String,
      direction: String
    }]
  },
  
  // Features & Capabilities
  features: {
    supportsWebhooks: { type: Boolean, default: false },
    supportsImport: { type: Boolean, default: false },
    supportsExport: { type: Boolean, default: false },
    supportsBulkOperations: { type: Boolean, default: false },
    supportsRealTime: { type: Boolean, default: false },
    supportsOAuth: { type: Boolean, default: false },
    availableEndpoints: [String],
    supportedOperations: [String]
  },
  
  // Usage Statistics
  statistics: {
    totalRequests: { type: Number, default: 0 },
    successfulRequests: { type: Number, default: 0 },
    failedRequests: { type: Number, default: 0 },
    lastRequestAt: Date,
    averageResponseTime: { type: Number, default: 0 }, // milliseconds
    dataTransferred: { type: Number, default: 0 }, // bytes
    recordsSynced: { type: Number, default: 0 }
  },
  
  // Health & Monitoring
  health: {
    status: {
      type: String,
      enum: ['Healthy', 'Degraded', 'Down', 'Unknown'],
      default: 'Unknown'
    },
    lastHealthCheck: Date,
    responseTime: Number,
    uptime: Number,
    errorRate: Number,
    lastError: {
      message: String,
      code: String,
      timestamp: Date
    }
  },
  
  // Rate Limiting
  rateLimits: {
    requestsPerMinute: Number,
    requestsPerHour: Number,
    requestsPerDay: Number,
    currentMinuteCount: { type: Number, default: 0 },
    currentHourCount: { type: Number, default: 0 },
    currentDayCount: { type: Number, default: 0 },
    lastResetAt: Date
  },
  
  // Organization
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  
  // Logs & History
  connectionHistory: [{
    action: String, // 'Connected', 'Disconnected', 'Error', 'Updated'
    timestamp: { type: Date, default: Date.now },
    performedBy: String,
    details: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Metadata
  tags: [String],
  notes: String,
  isActive: { type: Boolean, default: true, index: true },
  isSystem: { type: Boolean, default: false }, // System-managed integrations
  isPremium: { type: Boolean, default: false },
  
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
  connectedAt: Date,
  disconnectedAt: Date,
  disconnectedBy: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
integrationSchema.index({ type: 1, status: 1 });
integrationSchema.index({ provider: 1, status: 1 });
integrationSchema.index({ createdBy: 1, status: 1 });
integrationSchema.index({ 'syncSettings.lastSyncAt': -1 });
integrationSchema.index({ 'health.status': 1 });
integrationSchema.index({ createdAt: -1 });

// Virtual: Connection Status Description
integrationSchema.virtual('connectionStatusDescription').get(function() {
  const statusMap = {
    'Active': 'Connected and working properly',
    'Inactive': 'Disabled by user',
    'Error': 'Connection error occurred',
    'Pending Setup': 'Configuration incomplete',
    'Disconnected': 'Not currently connected'
  };
  return statusMap[this.status] || 'Unknown status';
});

// Virtual: Days Since Last Sync
integrationSchema.virtual('daysSinceLastSync').get(function() {
  if (!this.syncSettings || !this.syncSettings.lastSyncAt) {
    return null;
  }
  const diffTime = Math.abs(new Date() - this.syncSettings.lastSyncAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual: Health Score (0-100)
integrationSchema.virtual('healthScore').get(function() {
  if (!this.statistics || this.statistics.totalRequests === 0) {
    return 100;
  }
  const successRate = (this.statistics.successfulRequests / this.statistics.totalRequests) * 100;
  return Math.round(successRate);
});

// Static method: Find active integrations by type
integrationSchema.statics.findActiveByType = function(type) {
  return this.find({ type, status: 'Active', isActive: true }).sort({ createdAt: -1 });
};

// Static method: Find integrations needing sync
integrationSchema.statics.findNeedingSync = function() {
  return this.find({
    'syncSettings.enabled': true,
    'syncSettings.autoSync': true,
    'syncSettings.nextSyncAt': { $lte: new Date() },
    status: 'Active'
  });
};

// Static method: Get integration statistics
integrationSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
        },
        totalRequests: { $sum: '$statistics.totalRequests' },
        successRate: {
          $avg: {
            $cond: [
              { $eq: ['$statistics.totalRequests', 0] },
              100,
              { $multiply: [
                { $divide: ['$statistics.successfulRequests', '$statistics.totalRequests'] },
                100
              ]}
            ]
          }
        }
      }
    }
  ]);
  return stats;
};

// Instance method: Test connection
integrationSchema.methods.testConnection = async function() {
  this.health.lastHealthCheck = new Date();
  this.health.status = 'Healthy'; // In production, this would actually test the API
  await this.save();
  return this.health;
};

// Instance method: Record connection event
integrationSchema.methods.recordConnection = async function(action, performedBy, details = '') {
  this.connectionHistory.push({
    action,
    timestamp: new Date(),
    performedBy,
    details
  });
  
  if (action === 'Connected') {
    this.status = 'Active';
    this.connectedAt = new Date();
  } else if (action === 'Disconnected') {
    this.status = 'Disconnected';
    this.disconnectedAt = new Date();
    this.disconnectedBy = performedBy;
  }
  
  await this.save();
};

// Instance method: Update statistics
integrationSchema.methods.updateStatistics = async function(success = true, responseTime = 0, dataSize = 0) {
  this.statistics.totalRequests += 1;
  if (success) {
    this.statistics.successfulRequests += 1;
  } else {
    this.statistics.failedRequests += 1;
  }
  this.statistics.lastRequestAt = new Date();
  
  // Update average response time
  const totalRequests = this.statistics.totalRequests;
  this.statistics.averageResponseTime = 
    ((this.statistics.averageResponseTime * (totalRequests - 1)) + responseTime) / totalRequests;
  
  this.statistics.dataTransferred += dataSize;
  
  await this.save();
};

// Pre-save middleware
integrationSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  next();
});

const Integration = mongoose.model('Integration', integrationSchema);

module.exports = Integration;
