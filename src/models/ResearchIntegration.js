/**
 * ResearchIntegration Model - Mongoose Schema for External Research Integration
 * Manages connections to Westlaw, LexisNexis, and other legal research platforms
 */

const mongoose = require('mongoose');

const researchIntegrationSchema = new mongoose.Schema({
  // Basic Information
  integrationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Westlaw', 'LexisNexis', 'Bloomberg Law', 'Fastcase', 'Casetext', 'Other'],
    index: true
  },
  
  // Connection Details
  apiKey: {
    type: String,
    trim: true
  },
  accountId: {
    type: String,
    trim: true
  },
  credentials: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Configuration
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  accessLevel: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium', 'Enterprise'],
    default: 'Standard'
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Search History & Cache
  searchHistory: [{
    query: String,
    platform: String,
    searchedBy: String,
    searchedAt: {
      type: Date,
      default: Date.now
    },
    resultsCount: Number
  }],
  
  // Usage Tracking
  usageStats: {
    totalSearches: {
      type: Number,
      default: 0
    },
    lastUsed: Date,
    monthlySearches: {
      type: Number,
      default: 0
    },
    searchLimit: Number
  },
  
  // Metadata
  createdBy: {
    type: String,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  
  customSettings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
researchIntegrationSchema.index({ platform: 1, isActive: 1 });
researchIntegrationSchema.index({ 'usageStats.lastUsed': -1 });

// Instance methods
researchIntegrationSchema.methods.recordSearch = function(query, searchedBy, resultsCount) {
  this.searchHistory.push({
    query,
    platform: this.platform,
    searchedBy,
    searchedAt: Date.now(),
    resultsCount
  });
  
  this.usageStats.totalSearches += 1;
  this.usageStats.monthlySearches += 1;
  this.usageStats.lastUsed = Date.now();
};

researchIntegrationSchema.methods.resetMonthlyUsage = function() {
  this.usageStats.monthlySearches = 0;
};

module.exports = mongoose.model('ResearchIntegration', researchIntegrationSchema);
