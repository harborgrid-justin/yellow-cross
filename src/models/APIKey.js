/**
 * APIKey Model - Mongoose Schema for API Key Management
 * Manages API authentication, rate limiting, and usage tracking
 */

const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  // Basic Information
  keyId: {
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
  
  // API Key Details
  key: {
    type: String,
    required: true,
    unique: true,
    index: true // This should be hashed in production
  },
  keyPrefix: {
    type: String,
    trim: true // First few characters for display (e.g., 'sk_live_abc...')
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Revoked', 'Expired', 'Suspended'],
    default: 'Active',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Key Type & Scope
  keyType: {
    type: String,
    enum: ['Public', 'Secret', 'Restricted'],
    default: 'Secret',
    required: true
  },
  environment: {
    type: String,
    enum: ['Production', 'Sandbox', 'Development', 'Testing'],
    default: 'Production',
    index: true
  },
  
  // Permissions & Scopes
  permissions: {
    read: { type: Boolean, default: true },
    write: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
  },
  
  scopes: [String], // e.g., ['cases:read', 'documents:write', 'clients:read']
  
  allowedResources: [String], // Specific resource IDs or types
  
  allowedEndpoints: [String], // Specific API endpoints
  
  // Rate Limiting
  rateLimits: {
    enabled: { type: Boolean, default: true },
    requestsPerMinute: { type: Number, default: 60 },
    requestsPerHour: { type: Number, default: 1000 },
    requestsPerDay: { type: Number, default: 10000 },
    burstLimit: { type: Number, default: 100 },
    currentMinuteCount: { type: Number, default: 0 },
    currentHourCount: { type: Number, default: 0 },
    currentDayCount: { type: Number, default: 0 },
    lastResetMinute: Date,
    lastResetHour: Date,
    lastResetDay: Date,
    throttled: { type: Boolean, default: false },
    throttledUntil: Date
  },
  
  // Usage Statistics
  statistics: {
    totalRequests: { type: Number, default: 0 },
    successfulRequests: { type: Number, default: 0 },
    failedRequests: { type: Number, default: 0 },
    unauthorizedAttempts: { type: Number, default: 0 },
    lastUsedAt: Date,
    firstUsedAt: Date,
    averageResponseTime: { type: Number, default: 0 },
    dataTransferred: { type: Number, default: 0 }, // bytes
    uniqueIPs: { type: Number, default: 0 },
    endpointsAccessed: { type: Map, of: Number, default: {} }
  },
  
  // Security
  security: {
    ipWhitelist: [String],
    ipBlacklist: [String],
    allowedOrigins: [String], // CORS origins
    allowedReferers: [String],
    requireHTTPS: { type: Boolean, default: true },
    allowedUserAgents: [String],
    maxRequestSize: { type: Number, default: 10485760 }, // 10MB in bytes
    signatureRequired: { type: Boolean, default: false }
  },
  
  // Expiration
  expiresAt: {
    type: Date,
    index: true
  },
  neverExpires: {
    type: Boolean,
    default: false
  },
  lastRotatedAt: Date,
  rotationPolicy: {
    enabled: { type: Boolean, default: false },
    rotateEveryDays: Number,
    nextRotationDate: Date
  },
  
  // Recent Activity (last 20)
  recentActivity: [{
    timestamp: Date,
    method: String,
    endpoint: String,
    statusCode: Number,
    responseTime: Number,
    ipAddress: String,
    userAgent: String
  }],
  
  // Alerts & Notifications
  alerts: {
    notifyOnHighUsage: { type: Boolean, default: false },
    usageThreshold: { type: Number, default: 80 }, // percentage
    notifyOnSuspiciousActivity: { type: Boolean, default: true },
    notifyOnExpiration: { type: Boolean, default: true },
    notificationDaysBeforeExpiry: { type: Number, default: 7 },
    alertEmails: [String]
  },
  
  // Integration Association
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Integration'
  },
  applicationName: String,
  applicationUrl: String,
  
  // Organization
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  
  // Metadata
  tags: [String],
  notes: String,
  metadata: mongoose.Schema.Types.Mixed,
  
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
  revokedAt: Date,
  revokedBy: String,
  revokeReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
apiKeySchema.index({ status: 1, isActive: 1 });
apiKeySchema.index({ environment: 1, status: 1 });
apiKeySchema.index({ createdBy: 1 });
apiKeySchema.index({ expiresAt: 1 });
apiKeySchema.index({ 'statistics.lastUsedAt': -1 });

// Virtual: Is Expired
apiKeySchema.virtual('isExpired').get(function() {
  if (this.neverExpires) return false;
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Virtual: Days Until Expiration
apiKeySchema.virtual('daysUntilExpiration').get(function() {
  if (this.neverExpires || !this.expiresAt) return null;
  const diffTime = this.expiresAt - new Date();
  if (diffTime < 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual: Usage Rate (requests per day)
apiKeySchema.virtual('usageRate').get(function() {
  if (!this.statistics.firstUsedAt) return 0;
  const daysActive = Math.max(1, Math.ceil((new Date() - this.statistics.firstUsedAt) / (1000 * 60 * 60 * 24)));
  return Math.round(this.statistics.totalRequests / daysActive);
});

// Virtual: Success Rate Percentage
apiKeySchema.virtual('successRate').get(function() {
  if (this.statistics.totalRequests === 0) return 100;
  return Math.round((this.statistics.successfulRequests / this.statistics.totalRequests) * 100);
});

// Virtual: Is Rate Limited
apiKeySchema.virtual('isRateLimited').get(function() {
  if (!this.rateLimits.enabled) return false;
  return this.rateLimits.throttled && new Date() < this.rateLimits.throttledUntil;
});

// Static method: Find active keys
apiKeySchema.statics.findActive = function() {
  return this.find({
    status: 'Active',
    isActive: true,
    $or: [
      { expiresAt: { $gt: new Date() } },
      { neverExpires: true }
    ]
  });
};

// Static method: Find expiring soon
apiKeySchema.statics.findExpiringSoon = function(daysThreshold = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysThreshold);
  
  return this.find({
    status: 'Active',
    isActive: true,
    neverExpires: false,
    expiresAt: { $lte: futureDate, $gt: new Date() }
  });
};

// Static method: Get usage statistics
apiKeySchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$environment',
        count: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
        },
        totalRequests: { $sum: '$statistics.totalRequests' },
        avgSuccessRate: {
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

// Instance method: Check rate limit
apiKeySchema.methods.checkRateLimit = function() {
  if (!this.rateLimits.enabled) return { allowed: true };
  
  const now = new Date();
  
  // Check if throttled
  if (this.rateLimits.throttled && now < this.rateLimits.throttledUntil) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded',
      retryAfter: Math.ceil((this.rateLimits.throttledUntil - now) / 1000)
    };
  }
  
  // Reset counters if needed
  const oneMinuteAgo = new Date(now - 60000);
  if (!this.rateLimits.lastResetMinute || this.rateLimits.lastResetMinute < oneMinuteAgo) {
    this.rateLimits.currentMinuteCount = 0;
    this.rateLimits.lastResetMinute = now;
  }
  
  // Check limits
  if (this.rateLimits.currentMinuteCount >= this.rateLimits.requestsPerMinute) {
    this.rateLimits.throttled = true;
    this.rateLimits.throttledUntil = new Date(now.getTime() + 60000);
    return { allowed: false, reason: 'Rate limit exceeded', retryAfter: 60 };
  }
  
  return { allowed: true };
};

// Instance method: Record usage
apiKeySchema.methods.recordUsage = async function(usageData) {
  const { method, endpoint, statusCode, responseTime, ipAddress, userAgent, dataSize = 0 } = usageData;
  
  // Update statistics
  this.statistics.totalRequests += 1;
  if (statusCode >= 200 && statusCode < 300) {
    this.statistics.successfulRequests += 1;
  } else {
    this.statistics.failedRequests += 1;
  }
  
  if (statusCode === 401 || statusCode === 403) {
    this.statistics.unauthorizedAttempts += 1;
  }
  
  this.statistics.lastUsedAt = new Date();
  if (!this.statistics.firstUsedAt) {
    this.statistics.firstUsedAt = new Date();
  }
  
  // Update average response time
  const total = this.statistics.totalRequests;
  this.statistics.averageResponseTime = 
    ((this.statistics.averageResponseTime * (total - 1)) + responseTime) / total;
  
  this.statistics.dataTransferred += dataSize;
  
  // Update endpoint access count
  if (!this.statistics.endpointsAccessed) {
    this.statistics.endpointsAccessed = new Map();
  }
  const currentCount = this.statistics.endpointsAccessed.get(endpoint) || 0;
  this.statistics.endpointsAccessed.set(endpoint, currentCount + 1);
  
  // Update rate limits
  this.rateLimits.currentMinuteCount += 1;
  this.rateLimits.currentHourCount += 1;
  this.rateLimits.currentDayCount += 1;
  
  // Add to recent activity (keep last 20)
  this.recentActivity.unshift({
    timestamp: new Date(),
    method,
    endpoint,
    statusCode,
    responseTime,
    ipAddress,
    userAgent
  });
  this.recentActivity = this.recentActivity.slice(0, 20);
  
  await this.save();
};

// Instance method: Revoke key
apiKeySchema.methods.revoke = async function(revokedBy, reason = '') {
  this.status = 'Revoked';
  this.isActive = false;
  this.revokedAt = new Date();
  this.revokedBy = revokedBy;
  this.revokeReason = reason;
  await this.save();
};

// Instance method: Rotate key
apiKeySchema.methods.rotate = async function() {
  // In production, this would generate a new secure key
  const newKey = `sk_${this.environment.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  this.key = newKey;
  this.keyPrefix = newKey.substring(0, 12) + '...';
  this.lastRotatedAt = new Date();
  if (this.rotationPolicy.enabled && this.rotationPolicy.rotateEveryDays) {
    const nextRotation = new Date();
    nextRotation.setDate(nextRotation.getDate() + this.rotationPolicy.rotateEveryDays);
    this.rotationPolicy.nextRotationDate = nextRotation;
  }
  await this.save();
  return newKey;
};

// Pre-save middleware
apiKeySchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
  
  // Check if expired
  if (!this.neverExpires && this.expiresAt && new Date() > this.expiresAt && this.status === 'Active') {
    this.status = 'Expired';
    this.isActive = false;
  }
  
  next();
});

const APIKey = mongoose.model('APIKey', apiKeySchema);

module.exports = APIKey;
