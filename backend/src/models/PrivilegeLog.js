/**
 * PrivilegeLog Model - Mongoose Schema for Privilege Review
 * Tracks privileged documents with detailed privilege information
 */

const mongoose = require('mongoose');

const privilegeLogSchema = new mongoose.Schema({
  // Basic Information
  logNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  caseNumber: {
    type: String,
    required: true,
    index: true
  },
  
  // Document Information
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  evidenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  },
  batesNumber: {
    type: String,
    index: true
  },
  documentDate: Date,
  documentType: String,
  
  // Privilege Details
  privilegeType: {
    type: String,
    required: true,
    enum: ['Attorney-Client', 'Work Product', 'Trade Secret', 'Settlement Negotiations', 'Joint Defense', 'Other']
  },
  privilegeBasis: {
    type: String,
    required: true
  },
  
  // Parties
  author: {
    type: String,
    required: true
  },
  authorRole: String,
  recipients: [{
    name: String,
    role: String,
    email: String
  }],
  
  // Description
  documentDescription: {
    type: String,
    required: true
  },
  subject: String,
  
  // Attorney Information
  attorney: {
    type: String,
    required: true
  },
  lawFirm: String,
  attorneyRole: String,
  
  // Legal Advice
  containsLegalAdvice: {
    type: Boolean,
    default: true
  },
  legalAdviceDescription: String,
  
  // Redaction
  redacted: {
    type: Boolean,
    default: false
  },
  redactionType: {
    type: String,
    enum: ['Full', 'Partial', 'None']
  },
  redactionDetails: String,
  
  // Waiver & Claw-back
  waived: {
    type: Boolean,
    default: false
  },
  waiverDate: Date,
  waiverReason: String,
  clawbackRequested: {
    type: Boolean,
    default: false
  },
  clawbackDate: Date,
  clawbackStatus: {
    type: String,
    enum: ['Requested', 'Granted', 'Denied', 'Pending']
  },
  
  // Review Information
  identifiedBy: {
    type: String,
    required: true
  },
  identifiedDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: String,
  reviewDate: Date,
  reviewNotes: String,
  
  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: String,
  verificationDate: Date,
  
  // Status
  status: {
    type: String,
    enum: ['Pending Review', 'Confirmed', 'Challenged', 'Produced', 'Withheld'],
    default: 'Pending Review',
    index: true
  },
  
  // Production Information
  withheld: {
    type: Boolean,
    default: true
  },
  productionResponse: String,
  
  // Notes
  notes: String,
  internalNotes: String
}, {
  timestamps: true
});

// Indexes for performance
privilegeLogSchema.index({ caseId: 1, status: 1 });
privilegeLogSchema.index({ privilegeType: 1 });
privilegeLogSchema.index({ attorney: 1 });
privilegeLogSchema.index({ identifiedDate: -1 });
privilegeLogSchema.index({ waived: 1, withheld: 1 });

// Static method to find by case
privilegeLogSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ identifiedDate: -1 });
};

// Static method to get privilege statistics
privilegeLogSchema.statics.getPrivilegeStats = async function(caseId) {
  return await this.aggregate([
    { $match: { caseId: mongoose.Types.ObjectId(caseId) } },
    {
      $group: {
        _id: '$privilegeType',
        count: { $sum: 1 },
        withheld: {
          $sum: { $cond: ['$withheld', 1, 0] }
        },
        waived: {
          $sum: { $cond: ['$waived', 1, 0] }
        }
      }
    }
  ]);
};

// Instance method to waive privilege
privilegeLogSchema.methods.waivePrivilege = function(waivedBy, reason) {
  this.waived = true;
  this.waiverDate = new Date();
  this.waiverReason = reason;
  this.withheld = false;
  this.status = 'Produced';
  this.reviewedBy = waivedBy;
  this.reviewDate = new Date();
  return this.save();
};

// Instance method to request claw-back
privilegeLogSchema.methods.requestClawback = function(requestedBy, reason) {
  this.clawbackRequested = true;
  this.clawbackDate = new Date();
  this.clawbackStatus = 'Requested';
  this.notes = (this.notes || '') + `\nClaw-back requested by ${requestedBy}: ${reason}`;
  return this.save();
};

module.exports = mongoose.model('PrivilegeLog', privilegeLogSchema);
