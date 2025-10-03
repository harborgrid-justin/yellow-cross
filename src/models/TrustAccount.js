/**
 * TrustAccount Model - Mongoose Schema for Trust Accounting (IOLTA Compliance)
 * Comprehensive data model for client trust account management
 */

const mongoose = require('mongoose');

const trustAccountSchema = new mongoose.Schema({
  // Basic Information
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Client Information
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Bank Information
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  bankAccountNumber: {
    type: String,
    required: true,
    trim: true
  },
  bankRoutingNumber: {
    type: String,
    trim: true
  },
  bankAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  
  // Account Type
  accountType: {
    type: String,
    required: true,
    enum: ['IOLTA', 'Client Trust', 'Pooled Trust', 'Individual Trust'],
    default: 'Client Trust'
  },
  
  // Balance Information
  currentBalance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  availableBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive', 'Closed', 'Suspended'],
    default: 'Active',
    index: true
  },
  
  // Transactions
  transactions: [{
    transactionNumber: String,
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['Deposit', 'Withdrawal', 'Transfer In', 'Transfer Out', 'Interest', 'Fee', 'Adjustment'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    balance: {
      type: Number,
      required: true
    },
    description: String,
    reference: String,
    checkNumber: String,
    relatedCaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    relatedInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice'
    },
    performedBy: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Reconciliation
  lastReconciledDate: {
    type: Date
  },
  lastReconciledBalance: {
    type: Number,
    default: 0
  },
  lastReconciledBy: {
    type: String,
    trim: true
  },
  reconciliationHistory: [{
    date: Date,
    balance: Number,
    bankBalance: Number,
    difference: Number,
    reconciledBy: String,
    notes: String,
    status: {
      type: String,
      enum: ['Matched', 'Unmatched', 'Under Review']
    }
  }],
  
  // IOLTA Compliance
  ioLTACompliant: {
    type: Boolean,
    default: true
  },
  interestEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  interestPaidToBar: {
    type: Number,
    default: 0,
    min: 0
  },
  lastInterestPaymentDate: {
    type: Date
  },
  
  // Three-Way Reconciliation
  threeWayReconciliation: {
    clientLedgerBalance: {
      type: Number,
      default: 0
    },
    trustAccountBalance: {
      type: Number,
      default: 0
    },
    bankStatementBalance: {
      type: Number,
      default: 0
    },
    lastReconciliationDate: Date,
    isBalanced: {
      type: Boolean,
      default: false
    },
    variance: {
      type: Number,
      default: 0
    }
  },
  
  // Minimum Balance Requirements
  minimumBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  belowMinimumAlerts: [{
    date: Date,
    balance: Number,
    alertSentTo: String
  }],
  
  // Case Associations
  relatedCases: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    caseNumber: String,
    allocatedAmount: Number
  }],
  
  // Audit Trail
  auditLog: [{
    date: {
      type: Date,
      default: Date.now
    },
    action: String,
    performedBy: String,
    details: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  }],
  
  // Alerts & Notifications
  alerts: [{
    type: {
      type: String,
      enum: ['Low Balance', 'Overdraft', 'Reconciliation Issue', 'IOLTA Compliance', 'Other']
    },
    message: String,
    severity: {
      type: String,
      enum: ['Info', 'Warning', 'Critical']
    },
    date: Date,
    resolved: Boolean,
    resolvedDate: Date,
    resolvedBy: String
  }],
  
  // Account Opening & Closing
  openedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  closedDate: {
    type: Date
  },
  closureReason: {
    type: String,
    trim: true
  },
  
  // Notes
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  // Audit Trail
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Indexes
trustAccountSchema.index({ clientId: 1, status: 1 });
trustAccountSchema.index({ accountType: 1, status: 1 });
trustAccountSchema.index({ 'transactions.date': -1 });

// Virtual for formatted balance
trustAccountSchema.virtual('formattedBalance').get(function() {
  return `$${this.currentBalance.toFixed(2)}`;
});

// Instance method to add transaction
trustAccountSchema.methods.addTransaction = function(type, amount, description, performedBy, reference) {
  const transactionNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
  // Calculate new balance
  let newBalance = this.currentBalance;
  if (['Deposit', 'Transfer In', 'Interest'].includes(type)) {
    newBalance += amount;
  } else if (['Withdrawal', 'Transfer Out', 'Fee'].includes(type)) {
    newBalance -= amount;
  } else if (type === 'Adjustment') {
    newBalance += amount; // amount can be positive or negative
  }
  
  // Add transaction
  this.transactions.push({
    transactionNumber,
    date: new Date(),
    type,
    amount,
    balance: newBalance,
    description,
    reference,
    performedBy
  });
  
  // Update current balance
  this.currentBalance = newBalance;
  
  // Add to audit log
  this.auditLog.push({
    date: new Date(),
    action: `Transaction: ${type}`,
    performedBy,
    details: description,
    oldValue: this.currentBalance - (type === 'Deposit' ? amount : -amount),
    newValue: newBalance
  });
  
  return transactionNumber;
};

// Instance method to reconcile account
trustAccountSchema.methods.reconcile = function(bankBalance, username, notes) {
  const clientLedgerBalance = this.currentBalance;
  const difference = bankBalance - clientLedgerBalance;
  
  this.lastReconciledDate = new Date();
  this.lastReconciledBalance = clientLedgerBalance;
  this.lastReconciledBy = username;
  
  this.reconciliationHistory.push({
    date: new Date(),
    balance: clientLedgerBalance,
    bankBalance,
    difference,
    reconciledBy: username,
    notes,
    status: Math.abs(difference) < 0.01 ? 'Matched' : 'Unmatched'
  });
  
  // Update three-way reconciliation
  this.threeWayReconciliation.clientLedgerBalance = clientLedgerBalance;
  this.threeWayReconciliation.trustAccountBalance = clientLedgerBalance;
  this.threeWayReconciliation.bankStatementBalance = bankBalance;
  this.threeWayReconciliation.lastReconciliationDate = new Date();
  this.threeWayReconciliation.isBalanced = Math.abs(difference) < 0.01;
  this.threeWayReconciliation.variance = difference;
  
  return Math.abs(difference) < 0.01;
};

// Instance method to perform three-way reconciliation
trustAccountSchema.methods.performThreeWayReconciliation = function() {
  const clientLedger = this.threeWayReconciliation.clientLedgerBalance;
  const trustAccount = this.threeWayReconciliation.trustAccountBalance;
  const bankStatement = this.threeWayReconciliation.bankStatementBalance;
  
  const isBalanced = (
    Math.abs(clientLedger - trustAccount) < 0.01 &&
    Math.abs(trustAccount - bankStatement) < 0.01 &&
    Math.abs(clientLedger - bankStatement) < 0.01
  );
  
  this.threeWayReconciliation.isBalanced = isBalanced;
  this.threeWayReconciliation.variance = Math.max(
    Math.abs(clientLedger - trustAccount),
    Math.abs(trustAccount - bankStatement),
    Math.abs(clientLedger - bankStatement)
  );
  
  return isBalanced;
};

// Instance method to check minimum balance
trustAccountSchema.methods.checkMinimumBalance = function(alertRecipient) {
  if (this.currentBalance < this.minimumBalance) {
    this.belowMinimumAlerts.push({
      date: new Date(),
      balance: this.currentBalance,
      alertSentTo: alertRecipient
    });
    
    this.alerts.push({
      type: 'Low Balance',
      message: `Account balance $${this.currentBalance.toFixed(2)} is below minimum $${this.minimumBalance.toFixed(2)}`,
      severity: 'Warning',
      date: new Date(),
      resolved: false
    });
    
    return false;
  }
  return true;
};

// Instance method to close account
trustAccountSchema.methods.close = function(reason, username) {
  if (this.currentBalance > 0) {
    throw new Error('Cannot close account with positive balance');
  }
  
  this.status = 'Closed';
  this.closedDate = new Date();
  this.closureReason = reason;
  
  this.auditLog.push({
    date: new Date(),
    action: 'Account Closed',
    performedBy: username,
    details: reason
  });
};

// Pre-save middleware
trustAccountSchema.pre('save', function(next) {
  // Update lastModifiedAt
  this.lastModifiedAt = new Date();
  
  // Update available balance (subtract pending)
  this.availableBalance = this.currentBalance - Math.abs(this.pendingBalance);
  
  next();
});

// Static method to get IOLTA summary
trustAccountSchema.statics.getIOLTASummary = async function() {
  const pipeline = [
    {
      $match: {
        accountType: 'IOLTA',
        status: 'Active'
      }
    },
    {
      $group: {
        _id: null,
        totalBalance: { $sum: '$currentBalance' },
        totalInterestEarned: { $sum: '$interestEarned' },
        totalInterestPaid: { $sum: '$interestPaidToBar' },
        accountCount: { $sum: 1 }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalBalance: 0,
    totalInterestEarned: 0,
    totalInterestPaid: 0,
    accountCount: 0
  };
};

module.exports = mongoose.model('TrustAccount', trustAccountSchema);
