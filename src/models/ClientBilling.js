/**
 * ClientBilling Model - Mongoose Schema for Client Billing Information
 * Tracks payment methods, billing history, and financial relationships
 */

const mongoose = require('mongoose');

const clientBillingSchema = new mongoose.Schema({
  // Reference to Client
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  clientNumber: {
    type: String,
    required: true,
    index: true
  },
  
  // Payment Method Information
  paymentMethod: {
    type: {
      type: String,
      enum: ['Credit Card', 'Bank Transfer', 'Check', 'Cash', 'Wire Transfer', 'Retainer', 'Other'],
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: true
    },
    details: {
      // Credit Card
      cardLastFour: String,
      cardType: String,
      expirationDate: String,
      
      // Bank Account
      accountLastFour: String,
      bankName: String,
      accountType: String,
      routingNumber: String,
      
      // Check
      checkPreference: String,
      
      // Retainer
      retainerAmount: Number,
      retainerBalance: Number,
      retainerStartDate: Date,
      retainerEndDate: Date
    }
  },
  
  // Billing Preferences
  billingCycle: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Per Matter', 'Hourly', 'Retainer'],
    default: 'Per Matter'
  },
  invoiceDelivery: {
    type: String,
    enum: ['Email', 'Mail', 'Portal', 'Both'],
    default: 'Email'
  },
  invoiceEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Credit Information
  creditLimit: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  availableCredit: {
    type: Number,
    default: 0
  },
  creditStatus: {
    type: String,
    enum: ['Good', 'Warning', 'Hold', 'Collections', 'Legal Action'],
    default: 'Good'
  },
  
  // Payment Terms
  paymentTerms: {
    type: String,
    enum: ['Due on Receipt', 'Net 15', 'Net 30', 'Net 60', 'Net 90', 'Custom'],
    default: 'Net 30'
  },
  customTermsDays: {
    type: Number
  },
  latePaymentFee: {
    type: Number,
    default: 0
  },
  
  // Auto-Billing Setup
  autoBilling: {
    enabled: {
      type: Boolean,
      default: false
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 28
    },
    minimumAmount: {
      type: Number,
      default: 0
    }
  },
  
  // Payment History Summary
  paymentHistory: {
    totalPaid: {
      type: Number,
      default: 0
    },
    totalInvoiced: {
      type: Number,
      default: 0
    },
    totalOutstanding: {
      type: Number,
      default: 0
    },
    averagePaymentTime: {
      type: Number, // days
      default: 0
    },
    onTimePaymentRate: {
      type: Number, // percentage
      default: 100
    },
    lastPaymentDate: Date,
    lastPaymentAmount: Number
  },
  
  // Status and Flags
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Inactive', 'Delinquent'],
    default: 'Active'
  },
  delinquentSince: {
    type: Date
  },
  
  // Metadata
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for queries
clientBillingSchema.index({ clientId: 1, 'paymentMethod.isPrimary': 1 });
clientBillingSchema.index({ creditStatus: 1 });
clientBillingSchema.index({ status: 1 });

// Virtual for credit utilization percentage
clientBillingSchema.virtual('creditUtilization').get(function() {
  if (this.creditLimit === 0) return 0;
  return (this.currentBalance / this.creditLimit) * 100;
});

// Method to update balance
clientBillingSchema.methods.updateBalance = function(amount, type) {
  if (type === 'charge') {
    this.currentBalance += amount;
    this.paymentHistory.totalInvoiced += amount;
    this.paymentHistory.totalOutstanding += amount;
  } else if (type === 'payment') {
    this.currentBalance -= amount;
    this.paymentHistory.totalPaid += amount;
    this.paymentHistory.totalOutstanding -= amount;
    this.paymentHistory.lastPaymentDate = new Date();
    this.paymentHistory.lastPaymentAmount = amount;
  }
  
  this.availableCredit = this.creditLimit - this.currentBalance;
  
  // Update credit status
  if (this.currentBalance > this.creditLimit) {
    this.creditStatus = 'Hold';
  } else if (this.currentBalance > this.creditLimit * 0.8) {
    this.creditStatus = 'Warning';
  } else {
    this.creditStatus = 'Good';
  }
};

const ClientBilling = mongoose.model('ClientBilling', clientBillingSchema);

module.exports = ClientBilling;
