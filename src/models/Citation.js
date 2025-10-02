/**
 * Citation Model - Mongoose Schema for Research Citation Management
 * Manages legal citations, references, and Bluebook formatting
 */

const mongoose = require('mongoose');

const citationSchema = new mongoose.Schema({
  // Basic Information
  citationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  citationText: {
    type: String,
    required: true,
    trim: true
  },
  
  // Citation Type
  citationType: {
    type: String,
    required: true,
    enum: ['Case', 'Statute', 'Regulation', 'Constitution', 'Book', 'Law Review', 'Journal', 'Treatise', 'Other'],
    index: true
  },
  
  // Source Details
  caseName: {
    type: String,
    trim: true
  },
  reporter: {
    type: String,
    trim: true
  },
  volume: {
    type: String,
    trim: true
  },
  page: {
    type: String,
    trim: true
  },
  court: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    index: true
  },
  
  // Book/Article Details
  author: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  publication: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  edition: {
    type: String,
    trim: true
  },
  
  // Online Sources
  url: {
    type: String,
    trim: true
  },
  doi: {
    type: String,
    trim: true
  },
  accessDate: Date,
  
  // Bluebook Formatting
  bluebookFormat: {
    full: String,
    short: String,
    id: String
  },
  pinCite: {
    type: String,
    trim: true
  },
  
  // Classification
  practiceArea: {
    type: String,
    trim: true,
    index: true
  },
  jurisdiction: {
    type: String,
    trim: true,
    index: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  
  // Linked Records
  caseLawId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseLaw'
  },
  usedInMemos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalMemorandum'
  }],
  usedInDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  
  // Validation & Status
  isValidated: {
    type: Boolean,
    default: false
  },
  validatedBy: {
    type: String,
    trim: true
  },
  validatedAt: Date,
  validationNotes: {
    type: String,
    trim: true
  },
  
  // Usage Tracking
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: Date,
  
  // Metadata
  createdBy: {
    type: String,
    required: true,
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
citationSchema.index({ citationType: 1, practiceArea: 1 });
citationSchema.index({ year: -1 });
citationSchema.index({ jurisdiction: 1 });
citationSchema.index({ topics: 1 });
citationSchema.index({ tags: 1 });
citationSchema.index({ citationText: 'text', caseName: 'text', title: 'text' });

// Instance methods
citationSchema.methods.recordUsage = function() {
  this.usageCount += 1;
  this.lastUsed = Date.now();
};

citationSchema.methods.validate = function(validatedBy, notes) {
  this.isValidated = true;
  this.validatedBy = validatedBy;
  this.validatedAt = Date.now();
  this.validationNotes = notes;
};

citationSchema.methods.generateBluebook = function() {
  let full = '';
  
  if (this.citationType === 'Case') {
    full = `${this.caseName}, ${this.volume} ${this.reporter} ${this.page}`;
    if (this.court) full += ` (${this.court}`;
    if (this.year) full += ` ${this.year})`;
    else if (this.court) full += ')';
  } else if (this.citationType === 'Statute') {
    full = `${this.title}, ${this.volume} ${this.reporter} ${this.page} (${this.year})`;
  } else if (this.citationType === 'Law Review') {
    full = `${this.author}, ${this.title}, ${this.volume} ${this.publication} ${this.page} (${this.year})`;
  }
  
  this.bluebookFormat = {
    full,
    short: this.caseName || this.title,
    id: 'Id.'
  };
  
  return full;
};

// Static methods
citationSchema.statics.findByType = function(citationType) {
  return this.find({ citationType, isValidated: true })
    .sort({ usageCount: -1, year: -1 });
};

citationSchema.statics.searchCitations = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    ...filters
  };
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Citation', citationSchema);
