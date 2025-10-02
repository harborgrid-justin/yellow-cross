/**
 * DocketAlert Model - Mongoose Schema for Docket Alert System
 * Manages automated docket monitoring alerts and notifications
 */

const mongoose = require('mongoose');

const docketAlertSchema = new mongoose.Schema({
  // Alert Identification
  alertId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Alert Configuration
  alertName: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  
  // Monitoring Target
  targetType: {
    type: String,
    required: true,
    enum: ['Case', 'Docket', 'Judge', 'Opposing Counsel', 'Court', 'Party Name', 'Custom'],
    index: true
  },
  
  // Target Identifiers
  caseNumber: {
    type: String,
    index: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  docketNumber: String,
  courtName: String,
  judgeName: String,
  partyName: String,
  customCriteria: mongoose.Schema.Types.Mixed,
  
  // Alert Rules
  triggerEvents: [{
    eventType: {
      type: String,
      required: true,
      enum: [
        'New Filing',
        'New Docket Entry',
        'Status Change',
        'Hearing Scheduled',
        'Order Issued',
        'Judgment Entered',
        'Motion Filed',
        'Response Filed',
        'Document Filed',
        'Deadline Approaching',
        'Trial Date Set',
        'Settlement Conference',
        'Any Change',
        'Custom'
      ]
    },
    customCondition: String,
    enabled: {
      type: Boolean,
      default: true
    }
  }],
  
  // Filter Criteria
  filters: {
    documentTypes: [String],
    filingParties: [String],
    keywords: [String],
    dateRange: {
      start: Date,
      end: Date
    },
    minimumImportance: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    }
  },
  
  // Alert Status
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Paused', 'Inactive', 'Expired'],
    default: 'Active',
    index: true
  },
  
  // Notification Settings
  notificationMethods: [{
    method: {
      type: String,
      required: true,
      enum: ['Email', 'SMS', 'Push', 'In-App', 'Webhook']
    },
    enabled: {
      type: Boolean,
      default: true
    },
    config: mongoose.Schema.Types.Mixed
  }],
  
  // Recipients
  recipients: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    phone: String,
    notificationPreference: {
      type: String,
      enum: ['All', 'Important Only', 'Daily Digest', 'Weekly Digest']
    }
  }],
  
  // Frequency & Timing
  frequency: {
    type: String,
    required: true,
    enum: ['Real-Time', 'Hourly', 'Daily', 'Weekly', 'Custom'],
    default: 'Real-Time'
  },
  checkSchedule: {
    hour: Number,
    minute: Number,
    dayOfWeek: [Number],
    timezone: String
  },
  
  // Alert Period
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  
  // Alert History
  lastChecked: Date,
  lastTriggered: Date,
  triggeredCount: {
    type: Number,
    default: 0
  },
  
  // Alert Instances
  alerts: [{
    triggeredAt: {
      type: Date,
      default: Date.now
    },
    eventType: String,
    eventDescription: String,
    docketEntry: {
      entryNumber: Number,
      filingDate: Date,
      docketText: String,
      filedBy: String
    },
    documentDetails: {
      documentType: String,
      documentTitle: String,
      pageCount: Number,
      url: String
    },
    notificationsSent: [{
      recipient: String,
      method: String,
      sentAt: Date,
      status: {
        type: String,
        enum: ['Sent', 'Failed', 'Pending']
      },
      deliveryStatus: String
    }],
    acknowledged: {
      type: Boolean,
      default: false
    },
    acknowledgedBy: String,
    acknowledgedAt: Date,
    importance: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    notes: String
  }],
  
  // Performance Stats
  stats: {
    totalAlerts: {
      type: Number,
      default: 0
    },
    acknowledgedAlerts: {
      type: Number,
      default: 0
    },
    falsePositives: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number
  },
  
  // Error Handling
  lastError: {
    date: Date,
    message: String,
    errorType: String
  },
  errorCount: {
    type: Number,
    default: 0
  },
  
  // Integration
  externalSystemId: String,
  apiEndpoint: String,
  webhookUrl: String,
  
  // Priority
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  
  // Metadata
  tags: [String],
  category: String,
  notes: String,
  
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
  lastModifiedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
docketAlertSchema.index({ alertId: 1 });
docketAlertSchema.index({ caseNumber: 1, status: 1 });
docketAlertSchema.index({ status: 1, frequency: 1 });
docketAlertSchema.index({ targetType: 1, status: 1 });
docketAlertSchema.index({ 'recipients.userId': 1 });
docketAlertSchema.index({ tags: 1 });

// Virtual field for is active
docketAlertSchema.virtual('isActive').get(function() {
  if (this.status !== 'Active') return false;
  if (this.endDate && this.endDate < new Date()) return false;
  return true;
});

// Virtual field for unread alert count
docketAlertSchema.virtual('unreadCount').get(function() {
  return this.alerts.filter(a => !a.read).length;
});

// Virtual field for pending acknowledgment count
docketAlertSchema.virtual('pendingAcknowledgmentCount').get(function() {
  return this.alerts.filter(a => !a.acknowledged).length;
});

// Static method to find active alerts
docketAlertSchema.statics.findActive = function() {
  return this.find({
    status: 'Active',
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: new Date() } }
    ]
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method to find by case
docketAlertSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.find({ caseNumber }).sort({ createdAt: -1 });
};

// Static method to find by user
docketAlertSchema.statics.findByUser = function(userId) {
  return this.find({
    'recipients.userId': userId,
    status: 'Active'
  }).sort({ priority: -1, lastTriggered: -1 });
};

// Static method to find alerts due for check
docketAlertSchema.statics.findDueForCheck = function() {
  const now = new Date();
  
  return this.find({
    status: 'Active',
    $or: [
      { frequency: 'Real-Time' },
      {
        frequency: 'Hourly',
        $or: [
          { lastChecked: { $exists: false } },
          { lastChecked: { $lte: new Date(now - 60 * 60 * 1000) } }
        ]
      },
      {
        frequency: 'Daily',
        $or: [
          { lastChecked: { $exists: false } },
          { lastChecked: { $lte: new Date(now - 24 * 60 * 60 * 1000) } }
        ]
      }
    ]
  });
};

// Instance method to trigger alert
docketAlertSchema.methods.triggerAlert = function(alertData) {
  const newAlert = {
    triggeredAt: new Date(),
    eventType: alertData.eventType,
    eventDescription: alertData.eventDescription,
    docketEntry: alertData.docketEntry,
    documentDetails: alertData.documentDetails,
    importance: alertData.importance || 'Medium',
    read: false,
    acknowledged: false
  };
  
  this.alerts.unshift(newAlert); // Add to beginning
  this.lastTriggered = new Date();
  this.triggeredCount += 1;
  this.stats.totalAlerts += 1;
  
  // Keep only last 100 alerts
  if (this.alerts.length > 100) {
    this.alerts = this.alerts.slice(0, 100);
  }
  
  return this.save();
};

// Instance method to acknowledge alert
docketAlertSchema.methods.acknowledgeAlert = function(alertIndex, acknowledgedBy) {
  if (this.alerts[alertIndex]) {
    this.alerts[alertIndex].acknowledged = true;
    this.alerts[alertIndex].acknowledgedBy = acknowledgedBy;
    this.alerts[alertIndex].acknowledgedAt = new Date();
    this.stats.acknowledgedAlerts += 1;
    
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to mark alert as read
docketAlertSchema.methods.markAsRead = function(alertIndex) {
  if (this.alerts[alertIndex]) {
    this.alerts[alertIndex].read = true;
    this.alerts[alertIndex].readAt = new Date();
    
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to pause alert
docketAlertSchema.methods.pause = function(pausedBy) {
  this.status = 'Paused';
  this.lastModifiedBy = pausedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to resume alert
docketAlertSchema.methods.resume = function(resumedBy) {
  this.status = 'Active';
  this.lastModifiedBy = resumedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Instance method to update last checked
docketAlertSchema.methods.updateLastChecked = function() {
  this.lastChecked = new Date();
  return this.save();
};

module.exports = mongoose.model('DocketAlert', docketAlertSchema);
