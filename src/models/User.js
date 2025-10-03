/**
 * User Model - Mongoose Schema for User Authentication & Management
 * Comprehensive data model for user authentication, SSO, and access control
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: function() {
      return !this.ssoProvider; // Password not required if using SSO
    }
  },
  
  // Personal Details
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  
  // Role & Permissions
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Partner', 'Attorney', 'Paralegal', 'Legal Assistant', 'Clerk', 'Client', 'Guest'],
    default: 'Legal Assistant',
    index: true
  },
  customRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  permissions: [{
    resource: String,
    actions: [String] // read, write, update, delete
  }],
  
  // Authentication & Security
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  mfaSecret: {
    type: String
  },
  mfaBackupCodes: [{
    code: String,
    used: Boolean,
    usedAt: Date
  }],
  
  // SSO Configuration
  ssoProvider: {
    type: String,
    enum: ['SAML', 'OAuth', 'LDAP', 'Azure AD', 'Google', null],
    default: null
  },
  ssoId: {
    type: String,
    trim: true,
    sparse: true
  },
  ssoMetadata: {
    type: Map,
    of: String
  },
  
  // Biometric Authentication
  biometricEnabled: {
    type: Boolean,
    default: false
  },
  biometricData: {
    type: String // Encrypted biometric hash
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Locked', 'Pending Activation'],
    default: 'Pending Activation',
    index: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Password Management
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  passwordHistory: [{
    hash: String,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Login History
  lastLoginAt: Date,
  lastLoginIp: String,
  loginHistory: [{
    loginAt: {
      type: Date,
      default: Date.now
    },
    ip: String,
    userAgent: String,
    success: Boolean,
    failureReason: String
  }],
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockedUntil: Date,
  
  // Session Management
  activeSessions: [{
    sessionId: String,
    deviceInfo: String,
    ip: String,
    startedAt: Date,
    lastActivity: Date,
    expiresAt: Date
  }],
  maxConcurrentSessions: {
    type: Number,
    default: 3
  },
  sessionTimeout: {
    type: Number,
    default: 86400 // 24 hours in seconds
  },
  
  // Organization & Department
  organization: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  
  // IP Whitelisting
  allowedIPs: [{
    ip: String,
    range: String,
    description: String,
    addedAt: Date
  }],
  ipWhitelistEnabled: {
    type: Boolean,
    default: false
  },
  
  // Preferences
  preferences: {
    timezone: {
      type: String,
      default: 'America/New_York'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      inApp: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Timestamps
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
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1, status: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'activeSessions.sessionId': 1 });

// Virtual for full name
userSchema.virtual('displayName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Update fullName
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  
  // Hash password if modified
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = new Date();
    
    // Store in password history
    if (!this.isNew) {
      this.passwordHistory.push({
        hash: this.password,
        changedAt: new Date()
      });
      
      // Keep only last 5 passwords
      if (this.passwordHistory.length > 5) {
        this.passwordHistory = this.passwordHistory.slice(-5);
      }
    }
  }
  
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if account is locked
userSchema.methods.isLocked = function() {
  return this.status === 'Locked' || (this.lockedUntil && this.lockedUntil > Date.now());
};

// Instance method to increment failed login attempts
userSchema.methods.incrementFailedLogins = async function() {
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.status = 'Locked';
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
  }
  
  return this.save();
};

// Instance method to reset failed login attempts
userSchema.methods.resetFailedLogins = async function() {
  this.failedLoginAttempts = 0;
  if (this.status === 'Locked' && (!this.lockedUntil || this.lockedUntil < Date.now())) {
    this.status = 'Active';
    this.lockedUntil = undefined;
  }
  return this.save();
};

// Instance method to add session
userSchema.methods.addSession = function(sessionId, deviceInfo, ip) {
  const expiresAt = new Date(Date.now() + this.sessionTimeout * 1000);
  
  this.activeSessions.push({
    sessionId,
    deviceInfo,
    ip,
    startedAt: new Date(),
    lastActivity: new Date(),
    expiresAt
  });
  
  // Enforce max concurrent sessions
  if (this.activeSessions.length > this.maxConcurrentSessions) {
    this.activeSessions = this.activeSessions.slice(-this.maxConcurrentSessions);
  }
  
  return this.save();
};

// Instance method to remove session
userSchema.methods.removeSession = function(sessionId) {
  this.activeSessions = this.activeSessions.filter(s => s.sessionId !== sessionId);
  return this.save();
};

// Instance method to update session activity
userSchema.methods.updateSessionActivity = function(sessionId) {
  const session = this.activeSessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.lastActivity = new Date();
  }
  return this.save();
};

// Static method to find by email or username
userSchema.statics.findByLogin = function(login) {
  return this.findOne({
    $or: [
      { email: login.toLowerCase() },
      { username: login.toLowerCase() }
    ]
  });
};

module.exports = mongoose.model('User', userSchema);
