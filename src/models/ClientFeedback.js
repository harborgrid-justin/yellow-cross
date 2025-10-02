/**
 * ClientFeedback Model - Mongoose Schema for Client Satisfaction and Feedback
 * Tracks client satisfaction surveys, NPS scores, and retention metrics
 */

const mongoose = require('mongoose');

const clientFeedbackSchema = new mongoose.Schema({
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
  
  // Feedback Type
  feedbackType: {
    type: String,
    required: true,
    enum: ['Survey', 'NPS', 'Review', 'Complaint', 'Compliment', 'Suggestion', 'Exit Interview', 'Other']
  },
  
  // Survey Information
  surveyName: {
    type: String,
    trim: true
  },
  surveyDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Ratings and Scores
  overallSatisfaction: {
    type: Number,
    min: 0,
    max: 10
  },
  npsScore: {
    type: Number,
    min: 0,
    max: 10
  },
  npsCategory: {
    type: String,
    enum: ['Promoter', 'Passive', 'Detractor']
  },
  
  // Detailed Ratings
  ratings: {
    communication: { type: Number, min: 0, max: 10 },
    responsiveness: { type: Number, min: 0, max: 10 },
    expertise: { type: Number, min: 0, max: 10 },
    valueForMoney: { type: Number, min: 0, max: 10 },
    overallExperience: { type: Number, min: 0, max: 10 }
  },
  
  // Feedback Content
  comments: {
    type: String,
    trim: true
  },
  strengths: [{
    type: String,
    trim: true
  }],
  areasForImprovement: [{
    type: String,
    trim: true
  }],
  
  // Related Matter
  relatedCaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  relatedCaseNumber: {
    type: String
  },
  
  // Sentiment Analysis
  sentiment: {
    type: String,
    enum: ['Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative']
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1
  },
  
  // Follow-up Actions
  requiresFollowUp: {
    type: Boolean,
    default: false
  },
  followUpStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'No Action Needed'],
    default: 'Pending'
  },
  followUpNotes: {
    type: String,
    trim: true
  },
  followUpBy: {
    type: String,
    trim: true
  },
  followUpDate: Date,
  
  // Referral Likelihood
  referralLikelihood: {
    type: Number,
    min: 0,
    max: 10
  },
  wouldUseAgain: {
    type: Boolean
  },
  
  // Response Information
  respondedBy: {
    type: String,
    trim: true
  },
  responseDate: Date,
  responseMethod: {
    type: String,
    enum: ['Email', 'Phone', 'Portal', 'In Person', 'Survey Link', 'Other']
  },
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'In Progress', 'Completed', 'Expired'],
    default: 'Draft'
  },
  
  // Tags for categorization
  tags: [{
    type: String,
    trim: true
  }],
  
  // Metadata
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

// Indexes for queries
clientFeedbackSchema.index({ clientId: 1, surveyDate: -1 });
clientFeedbackSchema.index({ feedbackType: 1, surveyDate: -1 });
clientFeedbackSchema.index({ npsCategory: 1 });
clientFeedbackSchema.index({ status: 1 });

// Pre-save hook to calculate NPS category
clientFeedbackSchema.pre('save', function(next) {
  if (this.npsScore !== undefined) {
    if (this.npsScore >= 9) {
      this.npsCategory = 'Promoter';
    } else if (this.npsScore >= 7) {
      this.npsCategory = 'Passive';
    } else {
      this.npsCategory = 'Detractor';
    }
  }
  
  // Calculate average satisfaction if ratings are provided
  if (this.ratings && Object.keys(this.ratings).length > 0) {
    const ratingValues = Object.values(this.ratings).filter(v => v !== null && v !== undefined);
    if (ratingValues.length > 0) {
      this.overallSatisfaction = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;
    }
  }
  
  next();
});

// Virtual for response time (days)
clientFeedbackSchema.virtual('responseTime').get(function() {
  if (!this.responseDate || !this.surveyDate) return null;
  const diffTime = Math.abs(this.responseDate - this.surveyDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const ClientFeedback = mongoose.model('ClientFeedback', clientFeedbackSchema);

module.exports = ClientFeedback;
