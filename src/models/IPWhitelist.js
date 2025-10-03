/**
 * IPWhitelist Model - Mongoose Schema for IP Whitelisting
 * Comprehensive data model for IP-based access control
 */

const mongoose = require('mongoose');

const ipWhitelistSchema = new mongoose.Schema({
  // Entry ID
  entryNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // IP Information
  ipAddress: {
    type: String,
    trim: true,
    index: true
  },
  ipRange: {
    start: {
      type: String,
      trim: true
    },
    end: {
      type: String,
      trim: true
    }
  },
  cidrNotation: {
    type: String,
    trim: true
  },
  
  // Type
  entryType: {
    type: String,
    enum: ['Single IP', 'IP Range', 'CIDR', 'Dynamic'],
    required: true,
    default: 'Single IP'
  },
  
  // Scope
  scope: {
    type: String,
    enum: ['Global', 'User', 'Role', 'Organization', 'Department'],
    required: true,
    default: 'Global',
    index: true
  },
  
  // Associated Entities
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  username: {
    type: String,
    trim: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  roleName: {
    type: String,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  
  // Geolocation
  geolocation: {
    country: {
      type: String,
      trim: true
    },
    countryCode: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Geolocation Blocking
  blockCountries: [{
    type: String,
    trim: true
  }],
  blockRegions: [{
    type: String,
    trim: true
  }],
  
  // Description & Purpose
  description: {
    type: String,
    trim: true
  },
  purpose: {
    type: String,
    trim: true
  },
  
  // Status & Configuration
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Expired', 'Suspended'],
    default: 'Active',
    index: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Exceptions
  allowExceptions: {
    type: Boolean,
    default: false
  },
  exceptions: [{
    ipAddress: String,
    reason: String,
    addedAt: Date
  }],
  
  // Time-based Restrictions
  validFrom: {
    type: Date
  },
  validUntil: {
    type: Date,
    index: true
  },
  schedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6 // 0 = Sunday, 6 = Saturday
    }],
    startTime: String, // HH:mm format
    endTime: String    // HH:mm format
  },
  
  // Usage Statistics
  lastUsed: {
    type: Date,
    index: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  blockedAttempts: {
    type: Number,
    default: 0
  },
  
  // Access History
  accessHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    action: String,
    success: Boolean
  }],
  
  // Dynamic IP Support
  isDynamic: {
    type: Boolean,
    default: false
  },
  dynamicIpHistory: [{
    ipAddress: String,
    detectedAt: Date,
    verifiedBy: String
  }],
  
  // Audit Fields
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    trim: true
  },
  updatedBy: {
    type: String,
    trim: true
  },
  modificationHistory: [{
    modifiedBy: String,
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    changes: String
  }]
}, {
  timestamps: true
});

// Indexes for performance
ipWhitelistSchema.index({ ipAddress: 1, status: 1 });
ipWhitelistSchema.index({ scope: 1, status: 1 });
ipWhitelistSchema.index({ validUntil: 1 });

// Generate entry number
const generateEntryNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `IP-${year}-${random}`;
};

// Helper function to check if IP is in range
const isIpInRange = (ip, start, end) => {
  const ipNum = ipToNumber(ip);
  const startNum = ipToNumber(start);
  const endNum = ipToNumber(end);
  return ipNum >= startNum && ipNum <= endNum;
};

const ipToNumber = (ip) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
};

// Helper function to check CIDR match
const matchesCIDR = (ip, cidr) => {
  const [range, bits = 32] = cidr.split('/');
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);
  return (ipToNumber(ip) & mask) === (ipToNumber(range) & mask);
};

// Pre-save middleware
ipWhitelistSchema.pre('save', function(next) {
  if (this.isNew && !this.entryNumber) {
    this.entryNumber = generateEntryNumber();
  }
  this.updatedAt = new Date();
  next();
});

// Instance method to check if IP matches this entry
ipWhitelistSchema.methods.matchesIP = function(ip) {
  if (this.status !== 'Active') {
    return false;
  }
  
  // Check validity period
  const now = new Date();
  if (this.validFrom && now < this.validFrom) {
    return false;
  }
  if (this.validUntil && now > this.validUntil) {
    return false;
  }
  
  // Check schedule if enabled
  if (this.schedule && this.schedule.enabled) {
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (!this.schedule.daysOfWeek.includes(currentDay)) {
      return false;
    }
    
    if (this.schedule.startTime && currentTime < this.schedule.startTime) {
      return false;
    }
    
    if (this.schedule.endTime && currentTime > this.schedule.endTime) {
      return false;
    }
  }
  
  // Check IP match
  switch (this.entryType) {
    case 'Single IP':
      return this.ipAddress === ip;
    
    case 'IP Range':
      if (this.ipRange && this.ipRange.start && this.ipRange.end) {
        return isIpInRange(ip, this.ipRange.start, this.ipRange.end);
      }
      return false;
    
    case 'CIDR':
      if (this.cidrNotation) {
        return matchesCIDR(ip, this.cidrNotation);
      }
      return false;
    
    case 'Dynamic':
      // Check if IP is in dynamic history
      return this.dynamicIpHistory.some(entry => entry.ipAddress === ip);
    
    default:
      return false;
  }
};

// Instance method to record access
ipWhitelistSchema.methods.recordAccess = async function(userId, username, action, success) {
  this.lastUsed = new Date();
  this.usageCount += 1;
  
  if (!success) {
    this.blockedAttempts += 1;
  }
  
  this.accessHistory.push({
    timestamp: new Date(),
    userId,
    username,
    action,
    success
  });
  
  // Keep only last 100 access records
  if (this.accessHistory.length > 100) {
    this.accessHistory = this.accessHistory.slice(-100);
  }
  
  return this.save();
};

// Static method to check if IP is whitelisted
ipWhitelistSchema.statics.isWhitelisted = async function(ip, userId = null, role = null) {
  const query = {
    status: 'Active'
  };
  
  // Build query based on scope
  const scopeQueries = [
    { scope: 'Global' }
  ];
  
  if (userId) {
    scopeQueries.push({ scope: 'User', userId });
  }
  
  if (role) {
    scopeQueries.push({ scope: 'Role', roleName: role });
  }
  
  query.$or = scopeQueries;
  
  const entries = await this.find(query);
  
  for (const entry of entries) {
    if (entry.matchesIP(ip)) {
      return { allowed: true, entry };
    }
  }
  
  return { allowed: false, entry: null };
};

module.exports = mongoose.model('IPWhitelist', ipWhitelistSchema);
