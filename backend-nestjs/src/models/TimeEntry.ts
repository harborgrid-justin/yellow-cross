/**
 * Time Entry Model - Mongoose Schema for Time Tracking
 * Tracks billable and non-billable time for attorneys and staff
 */

import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  // Entry Information
  entryNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // User Information
  userId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userRole: {
    type: String,
    enum: ['Attorney', 'Paralegal', 'Associate', 'Partner', 'Legal Assistant', 'Other'],
    default: 'Attorney'
  },
  
  // Case/Matter Information
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true
  },
  caseNumber: {
    type: String,
    trim: true,
    index: true
  },
  caseName: {
    type: String,
    trim: true
  },
  
  // Client Information
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    index: true
  },
  clientNumber: {
    type: String,
    trim: true
  },
  
  // Time Details
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: Date,
  endTime: Date,
  duration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  
  // Activity Details
  activityCode: {
    type: String,
    trim: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['Research', 'Document Review', 'Court Appearance', 'Client Meeting', 'Phone Call', 
           'Email', 'Drafting', 'Travel', 'Administrative', 'Consultation', 'Other']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Billing Information
  billable: {
    type: Boolean,
    required: true,
    default: true
  },
  billableStatus: {
    type: String,
    enum: ['Billable', 'Non-Billable', 'No Charge', 'Write-Off', 'Write-Down'],
    default: 'Billable'
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  adjustedAmount: {
    type: Number,
    min: 0
  },
  writeOffAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  writeOffReason: {
    type: String,
    trim: true
  },
  
  // Invoicing
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
  invoiced: {
    type: Boolean,
    default: false
  },
  invoiceDate: Date,
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Approved', 'Invoiced', 'Paid', 'Rejected'],
    default: 'Draft',
    index: true
  },
  approvedBy: {
    type: String,
    trim: true
  },
  approvedDate: Date,
  rejectionReason: {
    type: String,
    trim: true
  },
  
  // Metadata
  entryMethod: {
    type: String,
    enum: ['Manual', 'Timer', 'Bulk Import', 'System Generated'],
    default: 'Manual'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  lastModifiedBy: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
timeEntrySchema.index({ userId: 1, date: -1 });
timeEntrySchema.index({ caseId: 1, date: -1 });
timeEntrySchema.index({ clientId: 1, date: -1 });
timeEntrySchema.index({ status: 1, date: -1 });
timeEntrySchema.index({ invoiced: 1, billable: 1 });

// Calculate amount before save
timeEntrySchema.pre('save', function(next) {
  if (this.isModified('duration') || this.isModified('hourlyRate')) {
    const hours = this.duration / 60;
    this.amount = hours * this.hourlyRate;
    
    if (!this.adjustedAmount) {
      this.adjustedAmount = this.amount;
    }
  }
  next();
});

// Instance method to approve entry
timeEntrySchema.methods.approve = function(approvedBy) {
  this.status = 'Approved';
  this.approvedBy = approvedBy;
  this.approvedDate = new Date();
  return this.save();
};

// Instance method to apply write-off
timeEntrySchema.methods.writeOff = function(amount, reason, modifiedBy) {
  this.writeOffAmount = amount;
  this.writeOffReason = reason;
  this.adjustedAmount = this.amount - amount;
  this.billableStatus = 'Write-Off';
  this.lastModifiedBy = modifiedBy;
  return this.save();
};

// Static method to get user time summary
timeEntrySchema.statics.getUserSummary = async function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalHours: { $sum: { $divide: ['$duration', 60] } },
        billableHours: {
          $sum: {
            $cond: ['$billable', { $divide: ['$duration', 60] }, 0]
          }
        },
        totalAmount: { $sum: '$amount' },
        billableAmount: {
          $sum: {
            $cond: ['$billable', '$amount', 0]
          }
        },
        entries: { $sum: 1 }
      }
    }
  ]);
};

export default mongoose.model('TimeEntry', timeEntrySchema);
