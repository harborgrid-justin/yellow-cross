/**
 * User Model - Mongoose Schema for Security & Access Control
 * Comprehensive data model for user management and authentication
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
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
    lowercase: true
  },
  
  // Authentication
  password: {
    type: String,
    required: true
  },
  passwordHistory: [{
    password: String,
    changedAt: Date
  }],
  passwordExpiresAt: Date,
  mustChangePassword: {
    type: Boolean,
    default: false
  },
  
  // Multi-Factor Authentication
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  mfaSecret: String,
  mfaBackupCodes: [String],
  
  // Profile Information
  firstName: String,
  lastName: String,
  fullName: String,
  jobTitle: String,
  department: String,
  phoneNumber: String,
  profilePicture: String,
  
  // Roles & Permissions
  roles: [{
    type: String,
    enum: ['Admin', 'Attorney', 'Paralegal', 'Staff', 'Client', 'Guest']
  }],
  permissions: [String],
  
  // Access Control
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Locked', 'Pending'],
    default: 'Pending',
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpires: Date,
  
  // Session Management
  sessions: [{
    sessionId: String,
    ipAddress: String,
    userAgent: String,
    loginAt: Date,
    lastActivityAt: Date,
    expiresAt: Date,
    isActive: Boolean
  }],
  currentSession: String,
  
  // Security Settings
  allowedIPs: [String],
  blockedIPs: [String],
  loginAttempts: {
    type: Number,
    default: 0
  },
  lastLoginAttempt: Date,
  lockedUntil: Date,
  
  // Login History
  lastLogin: Date,
  lastLoginIP: String,
  lastLoginUserAgent: String,
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    userAgent: String,
    success: Boolean,
    failureReason: String
  }],
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
  
  // Metadata
  createdBy: String,
  lastModifiedBy: String,
  notes: String,
  tags: [String]
}, {
  timestamps: true
});

// Indexes
userSchema.index({ roles: 1, status: 1 });
userSchema.index({ email: 1, status: 1 });
userSchema.index({ lastLogin: -1 });

// Virtual for full name
userSchema.virtual('displayName').get(function() {
  return this.fullName || `${this.firstName} ${this.lastName}`.trim() || this.username;
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set password expiry (90 days)
    this.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    
    next();
  } catch (error) {
    next(error);
  }
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.recordLoginAttempt = function(success, ipAddress, userAgent, failureReason = null) {
  this.loginHistory.push({
    timestamp: new Date(),
    ipAddress,
    userAgent,
    success,
    failureReason
  });
  
  if (success) {
    this.loginAttempts = 0;
    this.lastLogin = new Date();
    this.lastLoginIP = ipAddress;
    this.lastLoginUserAgent = userAgent;
  } else {
    this.loginAttempts += 1;
    this.lastLoginAttempt = new Date();
    
    // Lock account after 5 failed attempts
    if (this.loginAttempts >= 5) {
      this.status = 'Locked';
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
  }
  
  return this.save();
};

userSchema.methods.createSession = function(ipAddress, userAgent) {
  const sessionId = `SES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  this.sessions.push({
    sessionId,
    ipAddress,
    userAgent,
    loginAt: new Date(),
    lastActivityAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    isActive: true
  });
  
  this.currentSession = sessionId;
  return sessionId;
};

userSchema.methods.endSession = function(sessionId) {
  const session = this.sessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.isActive = false;
  }
  return this.save();
};

userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.roles.includes('Admin');
};

userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

// Static methods
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username.toLowerCase() });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActive = function() {
  return this.find({ status: 'Active' });
};

const User = mongoose.model('User', userSchema);

export default User;
