/**
 * CaseLaw Model - Mongoose Schema for Case Law Database
 * Stores precedents, relevant cases, and legal citations
 */

const mongoose = require('mongoose');

const caseLawSchema = new mongoose.Schema({
  // Basic Information
  caseId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  caseName: {
    type: String,
    required: true,
    trim: true
  },
  citation: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Court Information
  court: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  jurisdiction: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  level: {
    type: String,
    enum: ['Supreme Court', 'Court of Appeals', 'District Court', 'State Supreme Court', 'State Appellate', 'Trial Court', 'Other'],
    index: true
  },
  
  // Case Details
  decisionDate: {
    type: Date,
    required: true,
    index: true
  },
  filingDate: Date,
  docketNumber: {
    type: String,
    trim: true
  },
  
  // Content
  summary: {
    type: String,
    required: true
  },
  fullText: {
    type: String
  },
  holdings: [{
    type: String,
    trim: true
  }],
  keyIssues: [{
    type: String,
    trim: true
  }],
  
  // Parties
  parties: {
    plaintiffs: [{
      type: String,
      trim: true
    }],
    defendants: [{
      type: String,
      trim: true
    }],
    appellants: [{
      type: String,
      trim: true
    }],
    appellees: [{
      type: String,
      trim: true
    }]
  },
  
  // Legal Classification
  practiceArea: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  legalTopics: [{
    type: String,
    trim: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  
  // Precedent Value
  precedentValue: {
    type: String,
    enum: ['Binding', 'Persuasive', 'Distinguishable', 'Limited'],
    default: 'Persuasive',
    index: true
  },
  outcome: {
    type: String,
    enum: ['Affirmed', 'Reversed', 'Remanded', 'Vacated', 'Dismissed', 'Modified', 'Other']
  },
  
  // Citations & References
  citedBy: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseLaw'
    },
    citation: String,
    citationDate: Date
  }],
  cites: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseLaw'
    },
    citation: String
  }],
  
  // Shepardizing
  treatmentHistory: [{
    treatment: {
      type: String,
      enum: ['Followed', 'Distinguished', 'Overruled', 'Questioned', 'Criticized', 'Limited', 'Explained']
    },
    citingCase: String,
    citingCitation: String,
    date: Date,
    notes: String
  }],
  currentValidity: {
    type: String,
    enum: ['Good Law', 'Questioned', 'Limited', 'Overruled'],
    default: 'Good Law',
    index: true
  },
  
  // Judges
  judges: [{
    name: String,
    role: {
      type: String,
      enum: ['Chief Judge', 'Associate Judge', 'Justice', 'Magistrate']
    }
  }],
  authoringJudge: {
    type: String,
    trim: true
  },
  
  // Usage & Engagement
  relevanceScore: {
    type: Number,
    default: 0
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastAccessed: Date,
  
  // Links & Resources
  courtUrl: {
    type: String,
    trim: true
  },
  westlawUrl: {
    type: String,
    trim: true
  },
  lexisUrl: {
    type: String,
    trim: true
  },
  
  // Metadata
  addedBy: {
    type: String,
    trim: true
  },
  lastModifiedBy: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
caseLawSchema.index({ court: 1, jurisdiction: 1 });
caseLawSchema.index({ practiceArea: 1, decisionDate: -1 });
caseLawSchema.index({ currentValidity: 1, precedentValue: 1 });
caseLawSchema.index({ legalTopics: 1 });
caseLawSchema.index({ keywords: 1 });
caseLawSchema.index({ caseName: 'text', summary: 'text', holdings: 'text' });

// Instance methods
caseLawSchema.methods.recordAccess = function() {
  this.usageCount += 1;
  this.lastAccessed = Date.now();
};

caseLawSchema.methods.addTreatment = function(treatment, citingCase, citingCitation, notes) {
  this.treatmentHistory.push({
    treatment,
    citingCase,
    citingCitation,
    date: Date.now(),
    notes
  });
  
  // Update validity based on treatment
  if (treatment === 'Overruled') {
    this.currentValidity = 'Overruled';
  } else if (treatment === 'Questioned' && this.currentValidity === 'Good Law') {
    this.currentValidity = 'Questioned';
  } else if (treatment === 'Limited' && this.currentValidity === 'Good Law') {
    this.currentValidity = 'Limited';
  }
};

// Static methods
caseLawSchema.statics.findByJurisdiction = function(jurisdiction) {
  return this.find({ jurisdiction, currentValidity: 'Good Law' })
    .sort({ decisionDate: -1, relevanceScore: -1 });
};

caseLawSchema.statics.searchCaseLaw = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    ...filters
  };
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

caseLawSchema.statics.findByCitation = function(citation) {
  return this.findOne({ citation });
};

module.exports = mongoose.model('CaseLaw', caseLawSchema);
