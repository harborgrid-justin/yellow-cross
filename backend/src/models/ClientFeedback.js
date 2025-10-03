/**
 * Client Feedback Model - Mongoose Schema
 * Client satisfaction surveys and feedback tracking
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
  clientNumber: String,
  
  // Feedback Details
  type: {
    type: String,
    required: true,
    enum: ['Survey', 'Review', 'Complaint', 'Compliment', 'Suggestion', 'Other'],
    default: 'Survey'
  },
  
  // Ratings (1-10 scale)
  overallSatisfaction: {
    type: Number,
    min: 1,
    max: 10
  },
  communicationRating: {
    type: Number,
    min: 1,
    max: 10
  },
  responsivenessRating: {
    type: Number,
    min: 1,
    max: 10
  },
  expertiseRating: {
    type: Number,
    min: 1,
    max: 10
  },
  valueRating: {
    type: Number,
    min: 1,
    max: 10
  },
  
  // Feedback Content
  comments: {
    type: String,
    trim: true
  },
  positiveAspects: [{
    type: String,
    trim: true
  }],
  areasForImprovement: [{
    type: String,
    trim: true
  }],
  
  // Related Entities
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  caseNumber: String,
  attorneyReviewed: String,
  
  // NPS (Net Promoter Score)
  npsScore: {
    type: Number,
    min: 0,
    max: 10
  },
  wouldRecommend: {
    type: Boolean
  },
  
  // Status
  status: {
    type: String,
    enum: ['Received', 'Reviewed', 'Action Required', 'Resolved', 'Archived'],
    default: 'Received'
  },
  
  // Response
  responded: {
    type: Boolean,
    default: false
  },
  responseDate: Date,
  responseBy: String,
  responseContent: String,
  
  // Follow-up Actions
  actionItems: [{
    description: String,
    assignedTo: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  
  // Collection Method
  collectionMethod: {
    type: String,
    enum: ['Email Survey', 'Phone Interview', 'In-Person', 'Portal', 'Third-Party', 'Other'],
    default: 'Email Survey'
  },
  surveyId: String,
  
  // Metadata
  feedbackDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdBy: String,
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
clientFeedbackSchema.index({ clientId: 1, feedbackDate: -1 });
clientFeedbackSchema.index({ overallSatisfaction: 1 });
clientFeedbackSchema.index({ status: 1 });

// Calculate average satisfaction
clientFeedbackSchema.virtual('averageRating').get(function() {
  const ratings = [
    this.overallSatisfaction,
    this.communicationRating,
    this.responsivenessRating,
    this.expertiseRating,
    this.valueRating
  ].filter(r => r != null);
  
  if (ratings.length === 0) return null;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
});

// Static method to get client satisfaction metrics
clientFeedbackSchema.statics.getClientMetrics = async function(clientId) {
  const feedbacks = await this.find({ clientId });
  
  if (feedbacks.length === 0) {
    return {
      feedbackCount: 0,
      averageSatisfaction: null,
      npsScore: null
    };
  }
  
  const avgSatisfaction = feedbacks.reduce((sum, f) => sum + (f.overallSatisfaction || 0), 0) / feedbacks.length;
  const npsScores = feedbacks.filter(f => f.npsScore != null).map(f => f.npsScore);
  const avgNps = npsScores.length > 0 ? npsScores.reduce((sum, s) => sum + s, 0) / npsScores.length : null;
  
  return {
    feedbackCount: feedbacks.length,
    averageSatisfaction: avgSatisfaction,
    npsScore: avgNps
  };
};

module.exports = mongoose.model('ClientFeedback', clientFeedbackSchema);
