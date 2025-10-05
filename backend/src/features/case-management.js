/**
 * Feature 1: Case Management System
 * 8 Sub-Features: Creation & Intake, Tracking & Status, Assignment & Distribution,
 * Timeline Management, Categorization & Tagging, Notes & Updates, Closing & Archive, Analytics
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const CaseNote = require('../models/CaseNote');
const CaseTimelineEvent = require('../models/CaseTimelineEvent');
const { isConnected } = require('../config/database');
const {
  createCaseSchema,
  assignCaseSchema,
  updateStatusSchema,
  categorizeCaseSchema,
  closeCaseSchema,
  createNoteSchema,
  createTimelineEventSchema
} = require('../validators/caseValidators');

// Helper function to generate case number
const generateCaseNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CASE-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Case Creation & Intake
router.post('/create', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Creation & Intake',
        description: 'Create new cases with intake forms and client questionnaires',
        endpoint: '/api/cases/create',
        capabilities: [
          'New case creation',
          'Client intake forms',
          'Matter type selection',
          'Initial assessment',
          'Case number generation'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createCaseSchema, req.body);

    // Generate case number
    const caseNumber = generateCaseNumber();

    // Create new case
    const newCase = new Case({
      ...validatedData,
      caseNumber,
      status: 'Open',
      openedDate: new Date()
    });

    await newCase.save();

    // Create initial timeline event
    const timelineEvent = new CaseTimelineEvent({
      caseId: newCase._id,
      caseNumber: newCase.caseNumber,
      title: 'Case Created',
      description: `Case ${newCase.caseNumber} created`,
      eventType: 'Case Created',
      eventDate: new Date(),
      createdBy: validatedData.createdBy
    });

    await timelineEvent.save();

    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: {
        case: newCase,
        caseNumber: newCase.caseNumber,
        caseId: newCase._id
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating case',
      error: error.message
    });
  }
});

// Sub-Feature 2: Case Tracking & Status
router.get('/:id/status', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Tracking & Status',
        description: 'Track case progress, status updates, and milestones',
        endpoint: '/api/cases/:id/status',
        capabilities: [
          'Real-time status tracking',
          'Milestone monitoring',
          'Progress indicators',
          'Status history',
          'Automated status updates'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const caseId = req.params.id;
    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Get recent timeline events
    const recentEvents = await CaseTimelineEvent.find({ caseId })
      .sort({ eventDate: -1 })
      .limit(10);

    // Get upcoming deadlines
    const upcomingDeadlines = await CaseTimelineEvent.findUpcomingDeadlines(caseId, 30);

    res.json({
      success: true,
      data: {
        caseNumber: caseData.caseNumber,
        currentStatus: caseData.status,
        priority: caseData.priority,
        openedDate: caseData.openedDate,
        duration: caseData.duration,
        statusHistory: caseData.statusHistory,
        assignedTo: caseData.assignedTo,
        recentEvents: recentEvents,
        upcomingDeadlines: upcomingDeadlines,
        progress: {
          daysOpen: caseData.duration,
          totalEvents: recentEvents.length,
          pendingDeadlines: upcomingDeadlines.length
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching case status',
      error: error.message
    });
  }
});

// Update case status
router.put('/:id/status', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Update Case Status',
        description: 'Update the status of a case',
        endpoint: '/api/cases/:id/status',
        capabilities: [
          'Status updates',
          'Status history tracking',
          'Automated notifications',
          'Audit trail'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(updateStatusSchema, req.body);
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    await caseData.updateStatus(validatedData.status, validatedData.updatedBy, validatedData.notes);

    res.json({
      success: true,
      message: 'Case status updated successfully',
      data: caseData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating case status',
      error: error.message
    });
  }
});

// Sub-Feature 3: Case Assignment & Distribution
router.put('/:id/assign', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Assignment & Distribution',
        description: 'Assign cases to attorneys and distribute workload',
        endpoint: '/api/cases/:id/assign',
        capabilities: [
          'Attorney assignment',
          'Team allocation',
          'Workload balancing',
          'Skill-based routing',
          'Assignment history'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const caseId = req.params.id;
    const validatedData = validateRequest(assignCaseSchema, req.body);

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Use the case method to assign
    caseData.assignCase(
      validatedData.assignedTo,
      validatedData.assignedBy,
      validatedData.reason
    );

    await caseData.save();

    // Create timeline event
    const timelineEvent = new CaseTimelineEvent({
      caseId: caseData._id,
      caseNumber: caseData.caseNumber,
      title: 'Case Assigned',
      description: `Case assigned to ${validatedData.assignedTo}`,
      eventType: 'Assignment',
      eventDate: new Date(),
      createdBy: validatedData.assignedBy,
      notes: validatedData.reason
    });

    await timelineEvent.save();

    res.json({
      success: true,
      message: 'Case assigned successfully',
      data: {
        caseNumber: caseData.caseNumber,
        assignedTo: caseData.assignedTo,
        assignmentHistory: caseData.assignmentHistory
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error assigning case',
      error: error.message
    });
  }
});

// Sub-Feature 4: Case Timeline Management
router.get('/:id/timeline', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Timeline Management',
        description: 'Visual timeline with key dates and event tracking',
        endpoint: '/api/cases/:id/timeline',
        capabilities: [
          'Visual timeline view',
          'Key date tracking',
          'Event chronology',
          'Deadline tracking',
          'Historical events'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const caseId = req.params.id;
    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Get all timeline events
    const events = await CaseTimelineEvent.findByCaseId(caseId);

    // Separate deadlines and regular events
    const deadlines = events.filter(e => e.isDeadline);
    const regularEvents = events.filter(e => !e.isDeadline);

    res.json({
      success: true,
      data: {
        caseNumber: caseData.caseNumber,
        caseTitle: caseData.title,
        openedDate: caseData.openedDate,
        timeline: {
          allEvents: events,
          deadlines: deadlines,
          regularEvents: regularEvents,
          upcomingDeadlines: deadlines.filter(d => !d.completed && d.eventDate > new Date()),
          overdueDeadlines: deadlines.filter(d => !d.completed && d.eventDate < new Date()),
          completedDeadlines: deadlines.filter(d => d.completed)
        },
        statistics: {
          totalEvents: events.length,
          totalDeadlines: deadlines.length,
          upcomingDeadlines: deadlines.filter(d => !d.completed && d.eventDate > new Date()).length,
          overdueDeadlines: deadlines.filter(d => !d.completed && d.eventDate < new Date()).length
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching timeline',
      error: error.message
    });
  }
});

// Create timeline event
router.post('/:id/timeline', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Create Timeline Event',
        description: 'Add a new event to the case timeline',
        endpoint: '/api/cases/:id/timeline',
        capabilities: [
          'Event creation',
          'Deadline tracking',
          'Event categorization',
          'Automated notifications'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createTimelineEventSchema, req.body);
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    const timelineEvent = new CaseTimelineEvent({
      caseId: req.params.id,
      caseNumber: caseData.caseNumber,
      ...validatedData
    });

    await timelineEvent.save();

    res.status(201).json({
      success: true,
      message: 'Timeline event created successfully',
      data: timelineEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating timeline event',
      error: error.message
    });
  }
});

// Sub-Feature 5: Case Categorization & Tagging
router.put('/:id/categorize', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Categorization & Tagging',
        description: 'Organize cases by practice area, type, and priority',
        endpoint: '/api/cases/:id/categorize',
        capabilities: [
          'Practice area classification',
          'Custom tagging',
          'Priority levels',
          'Case type assignment',
          'Multi-level categorization'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const caseId = req.params.id;
    const validatedData = validateRequest(categorizeCaseSchema, req.body);

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Update categorization fields
    if (validatedData.practiceArea) caseData.practiceArea = validatedData.practiceArea;
    if (validatedData.caseType) caseData.caseType = validatedData.caseType;
    if (validatedData.priority) caseData.priority = validatedData.priority;
    if (validatedData.tags) caseData.tags = validatedData.tags;
    
    caseData.lastModifiedBy = validatedData.updatedBy;

    await caseData.save();

    res.json({
      success: true,
      message: 'Case categorization updated successfully',
      data: {
        caseNumber: caseData.caseNumber,
        practiceArea: caseData.practiceArea,
        caseType: caseData.caseType,
        priority: caseData.priority,
        tags: caseData.tags
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating categorization',
      error: error.message
    });
  }
});

// Sub-Feature 6: Case Notes & Updates
router.post('/:id/notes', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Notes & Updates',
        description: 'Add notes, updates, and maintain case journal',
        endpoint: '/api/cases/:id/notes',
        capabilities: [
          'Case notes creation',
          'Update logging',
          'Searchable journal',
          'Note categorization',
          'Collaborative annotations'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const caseId = req.params.id;
    const validatedData = validateRequest(createNoteSchema, req.body);

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Create new note
    const newNote = new CaseNote({
      ...validatedData,
      caseId: caseData._id,
      caseNumber: caseData.caseNumber
    });

    await newNote.save();

    // Create timeline event for the note
    const timelineEvent = new CaseTimelineEvent({
      caseId: caseData._id,
      caseNumber: caseData.caseNumber,
      title: 'Note Added',
      description: validatedData.title || 'New note added',
      eventType: 'Note Added',
      eventDate: new Date(),
      createdBy: validatedData.createdBy,
      notes: validatedData.content.substring(0, 100) + (validatedData.content.length > 100 ? '...' : '')
    });

    await timelineEvent.save();

    // Get all notes for the case
    const allNotes = await CaseNote.findByCaseId(caseId);

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: {
        note: newNote,
        totalNotes: allNotes.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding note',
      error: error.message
    });
  }
});

// Get all notes for a case
router.get('/:id/notes', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const caseId = req.params.id;
    const notes = await CaseNote.findByCaseId(caseId);

    res.json({
      success: true,
      data: {
        notes: notes,
        totalNotes: notes.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message
    });
  }
});

// Sub-Feature 7: Case Closing & Archive
router.post('/:id/close', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Closing & Archive',
        description: 'Close cases with proper archiving and retention policies',
        endpoint: '/api/cases/:id/close',
        capabilities: [
          'Case closure workflow',
          'Archive management',
          'Retention policies',
          'Final documentation',
          'Reopen capabilities'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const caseId = req.params.id;
    const validatedData = validateRequest(closeCaseSchema, req.body);

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    if (caseData.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Case is already closed'
      });
    }

    // Close the case using instance method
    caseData.closeCase(
      validatedData.closedBy,
      validatedData.outcome,
      validatedData.resolution
    );

    // Archive if requested
    if (validatedData.archiveImmediately) {
      caseData.archiveCase(validatedData.closedBy);
    }

    await caseData.save();

    // Create timeline event
    const timelineEvent = new CaseTimelineEvent({
      caseId: caseData._id,
      caseNumber: caseData.caseNumber,
      title: 'Case Closed',
      description: `Case closed with outcome: ${validatedData.outcome}`,
      eventType: 'Case Closed',
      eventDate: new Date(),
      createdBy: validatedData.closedBy,
      outcome: validatedData.outcome,
      notes: validatedData.resolution
    });

    await timelineEvent.save();

    res.json({
      success: true,
      message: 'Case closed successfully',
      data: {
        caseNumber: caseData.caseNumber,
        status: caseData.status,
        closedDate: caseData.closedDate,
        outcome: caseData.outcome,
        archived: caseData.archived,
        duration: caseData.duration
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error closing case',
      error: error.message
    });
  }
});

// Reopen a closed case
router.post('/:id/reopen', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const caseId = req.params.id;
    const { reopenedBy, reason } = req.body;

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    if (caseData.status !== 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Only closed cases can be reopened'
      });
    }

    if (!caseData.canReopen) {
      return res.status(400).json({
        success: false,
        message: 'This case cannot be reopened'
      });
    }

    caseData.status = 'Open';
    caseData.closedDate = null;
    caseData.archived = false;
    caseData.lastModifiedBy = reopenedBy;

    await caseData.save();

    // Create timeline event
    const timelineEvent = new CaseTimelineEvent({
      caseId: caseData._id,
      caseNumber: caseData.caseNumber,
      title: 'Case Reopened',
      description: `Case reopened by ${reopenedBy}`,
      eventType: 'Status Change',
      eventDate: new Date(),
      createdBy: reopenedBy,
      notes: reason
    });

    await timelineEvent.save();

    res.json({
      success: true,
      message: 'Case reopened successfully',
      data: {
        caseNumber: caseData.caseNumber,
        status: caseData.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error reopening case',
      error: error.message
    });
  }
});

// Sub-Feature 8: Case Analytics Dashboard
router.get('/analytics', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Analytics Dashboard',
        description: 'Case metrics, performance indicators, and trends',
        endpoint: '/api/cases/analytics',
        capabilities: [
          'Case volume metrics',
          'Duration analysis',
          'Outcome tracking',
          'Performance KPIs',
          'Trend analysis'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get overall analytics
    const analytics = await Case.getAnalytics();

    // Get cases by status
    const casesByStatus = await Case.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get cases by priority
    const casesByPriority = await Case.aggregate([
      { $match: { archived: false } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get cases by matter type
    const casesByMatterType = await Case.aggregate([
      {
        $group: {
          _id: '$matterType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCases = await Case.countDocuments({
      openedDate: { $gte: thirtyDaysAgo }
    });

    const recentClosed = await Case.countDocuments({
      closedDate: { $gte: thirtyDaysAgo }
    });

    // Get top assignees
    const topAssignees = await Case.aggregate([
      { $match: { archived: false, assignedTo: { $ne: null } } },
      {
        $group: {
          _id: '$assignedTo',
          caseCount: { $sum: 1 },
          openCases: {
            $sum: { $cond: [{ $ne: ['$status', 'Closed'] }, 1, 0] }
          }
        }
      },
      { $sort: { caseCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          ...analytics,
          recentActivity: {
            newCasesLast30Days: recentCases,
            closedCasesLast30Days: recentClosed
          }
        },
        breakdown: {
          byStatus: casesByStatus,
          byPriority: casesByPriority,
          byMatterType: casesByMatterType
        },
        performance: {
          topAssignees: topAssignees,
          averageCaseDuration: analytics.avgDuration || 0
        },
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

// List all cases (with pagination and filtering)
router.get('/', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Case Management System',
        subFeatures: [
          'Case Creation & Intake',
          'Case Tracking & Status',
          'Case Assignment & Distribution',
          'Case Timeline Management',
          'Case Categorization & Tagging',
          'Case Notes & Updates',
          'Case Closing & Archive',
          'Case Analytics Dashboard'
        ],
        message: 'Database not connected - showing system capabilities only'
      });
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { archived: false };
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.matterType) filter.matterType = req.query.matterType;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.search) {
      filter.$or = [
        { caseNumber: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
        { clientName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get cases
    const cases = await Case.find(filter)
      .sort({ priority: -1, openedDate: -1 })
      .limit(limit)
      .skip(skip)
      .select('-statusHistory -assignmentHistory -customFields');

    const totalCases = await Case.countDocuments(filter);
    const totalPages = Math.ceil(totalCases / limit);

    res.json({
      success: true,
      data: {
        cases: cases,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalCases: totalCases,
          casesPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching cases',
      error: error.message
    });
  }
});

// Get a single case by ID
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const caseId = req.params.id;
    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.json({
      success: true,
      data: {
        case: caseData
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching case',
      error: error.message
    });
  }
});

module.exports = router;
