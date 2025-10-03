/**
 * Feature 8: Court & Docket Management
 * 8 Sub-Features: Docket Tracking, Electronic Filing, Court Rules & Procedures,
 * Opposing Counsel Database, Judge Information, Courtroom Calendar, Docket Alerts, Document Retrieval
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const CourtDocket = require('../models/CourtDocket');
const ElectronicFiling = require('../models/ElectronicFiling');
const CourtRule = require('../models/CourtRule');
const OpposingCounsel = require('../models/OpposingCounsel');
const Judge = require('../models/Judge');
const CourtroomCalendar = require('../models/CourtroomCalendar');
const DocketAlert = require('../models/DocketAlert');
const CourtDocument = require('../models/CourtDocument');
const { isConnected } = require('../config/database');
const {
  createDocketSchema,
  addDocketEntrySchema,
  createElectronicFilingSchema,
  createCourtRuleSchema,
  createOpposingCounselSchema,
  addCommunicationSchema,
  createJudgeSchema,
  createCalendarEventSchema,
  createDocketAlertSchema,
  createCourtDocumentSchema,
  retrieveDocumentSchema
} = require('../validators/courtValidators');

// Helper function to generate unique IDs
const generateDocketNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `DOCKET-${year}-${random}`;
};

const generateFilingId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `EFILING-${timestamp}-${random}`;
};

const generateEventId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `EVENT-${timestamp}-${random}`;
};

const generateAlertId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ALERT-${timestamp}-${random}`;
};

const generateDocumentId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DOC-${timestamp}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Court Docket Tracking
router.get('/dockets', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Docket Tracking',
        description: 'Monitor court dockets and filings',
        endpoint: '/api/court/dockets',
        capabilities: [
          'Docket monitoring',
          'Filing tracking',
          'Case status updates',
          'Docket entries',
          'Historical dockets'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { caseNumber, courtName, status, monitored } = req.query;
    const query = {};

    if (caseNumber) query.caseNumber = new RegExp(caseNumber, 'i');
    if (courtName) query.courtName = new RegExp(courtName, 'i');
    if (status) query.docketStatus = status;
    if (monitored === 'true') query.isMonitored = true;

    const dockets = await CourtDocket.find(query)
      .sort({ lastUpdatedDate: -1, createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: dockets.length,
      data: dockets
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving dockets',
      error: error.message
    });
  }
});

router.post('/dockets', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Docket Tracking',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createDocketSchema, req.body);
    const docketNumber = generateDocketNumber();

    const newDocket = new CourtDocket({
      ...validatedData,
      docketNumber
    });

    await newDocket.save();

    res.status(201).json({
      success: true,
      message: 'Docket created successfully',
      data: newDocket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating docket',
      error: error.message
    });
  }
});

router.get('/dockets/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Docket Tracking',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const docket = await CourtDocket.findById(req.params.id);

    if (!docket) {
      return res.status(404).json({
        success: false,
        message: 'Docket not found'
      });
    }

    res.json({
      success: true,
      data: docket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving docket',
      error: error.message
    });
  }
});

router.post('/dockets/:id/entries', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Docket Tracking',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(addDocketEntrySchema, req.body);
    const docket = await CourtDocket.findById(req.params.id);

    if (!docket) {
      return res.status(404).json({
        success: false,
        message: 'Docket not found'
      });
    }

    await docket.addEntry(validatedData, validatedData.addedBy);

    res.json({
      success: true,
      message: 'Docket entry added successfully',
      data: docket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding docket entry',
      error: error.message
    });
  }
});

// Sub-Feature 2: Electronic Filing (e-Filing)
router.get('/e-filing', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Electronic Filing (e-Filing)',
        description: 'File documents electronically',
        endpoint: '/api/court/e-filing',
        capabilities: [
          'Electronic filing',
          'Court integration',
          'Filing validation',
          'Filing receipts',
          'Multi-court support'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { caseNumber, status, courtName } = req.query;
    const query = {};

    if (caseNumber) query.caseNumber = caseNumber;
    if (status) query.status = status;
    if (courtName) query.courtName = new RegExp(courtName, 'i');

    const filings = await ElectronicFiling.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: filings.length,
      data: filings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving filings',
      error: error.message
    });
  }
});

router.post('/e-filing', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Electronic Filing (e-Filing)',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createElectronicFilingSchema, req.body);
    const filingId = req.body.filingId || generateFilingId();

    const newFiling = new ElectronicFiling({
      ...validatedData,
      filingId,
      status: 'Draft'
    });

    await newFiling.save();

    res.status(201).json({
      success: true,
      message: 'Electronic filing created successfully',
      data: newFiling
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating filing',
      error: error.message
    });
  }
});

router.get('/e-filing/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Electronic Filing (e-Filing)',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const filing = await ElectronicFiling.findById(req.params.id);

    if (!filing) {
      return res.status(404).json({
        success: false,
        message: 'Filing not found'
      });
    }

    res.json({
      success: true,
      data: filing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving filing',
      error: error.message
    });
  }
});

router.post('/e-filing/:id/validate', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Electronic Filing (e-Filing)',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const filing = await ElectronicFiling.findById(req.params.id);

    if (!filing) {
      return res.status(404).json({
        success: false,
        message: 'Filing not found'
      });
    }

    await filing.validateFiling(req.body.validatedBy || 'System');

    res.json({
      success: true,
      message: 'Filing validated',
      data: {
        validationStatus: filing.validationStatus,
        validationErrors: filing.validationErrors,
        status: filing.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error validating filing',
      error: error.message
    });
  }
});

router.post('/e-filing/:id/submit', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Electronic Filing (e-Filing)',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const filing = await ElectronicFiling.findById(req.params.id);

    if (!filing) {
      return res.status(404).json({
        success: false,
        message: 'Filing not found'
      });
    }

    if (filing.status !== 'Ready to File') {
      return res.status(400).json({
        success: false,
        message: 'Filing must be validated before submission'
      });
    }

    await filing.submitFiling(req.body.submittedBy || 'Unknown');

    res.json({
      success: true,
      message: 'Filing submitted successfully',
      data: filing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error submitting filing',
      error: error.message
    });
  }
});

// Sub-Feature 3: Court Rules & Procedures
router.get('/rules', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Rules & Procedures',
        description: 'Access court-specific rules',
        endpoint: '/api/court/rules',
        capabilities: [
          'Court rules database',
          'Local rules',
          'Procedural guides',
          'Form requirements',
          'Rule updates'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { courtName, ruleType, jurisdiction, search } = req.query;
    let rules;

    if (search) {
      rules = await CourtRule.searchRules(search, { courtName, ruleType, jurisdiction });
    } else {
      const query = { status: 'Active' };
      if (courtName) query.courtName = new RegExp(courtName, 'i');
      if (ruleType) query.ruleType = ruleType;
      if (jurisdiction) query.jurisdiction = jurisdiction;

      rules = await CourtRule.find(query)
        .sort({ ruleNumber: 1 })
        .limit(50);
    }

    res.json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving rules',
      error: error.message
    });
  }
});

router.get('/rules/:court', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Rules & Procedures',
        description: 'Access court-specific rules',
        endpoint: '/api/court/rules/:court',
        capabilities: [
          'Court rules database',
          'Local rules',
          'Procedural guides',
          'Form requirements',
          'Rule updates'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const courtName = req.params.court;
    const rules = await CourtRule.findByCourt(courtName);

    res.json({
      success: true,
      court: courtName,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving court rules',
      error: error.message
    });
  }
});

router.post('/rules', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Rules & Procedures',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createCourtRuleSchema, req.body);

    const newRule = new CourtRule(validatedData);
    await newRule.save();

    res.status(201).json({
      success: true,
      message: 'Court rule created successfully',
      data: newRule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating court rule',
      error: error.message
    });
  }
});

router.get('/rules/id/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Rules & Procedures',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const rule = await CourtRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Rule not found'
      });
    }

    // Increment view count
    await rule.incrementViewCount();

    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving rule',
      error: error.message
    });
  }
});

// Sub-Feature 4: Opposing Counsel Database
router.get('/opposing-counsel', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Opposing Counsel Database',
        description: 'Track opposing counsel and firms',
        endpoint: '/api/court/opposing-counsel',
        capabilities: [
          'Counsel profiles',
          'Firm information',
          'Contact details',
          'Case history',
          'Communication tracking'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { search, firmName, practiceArea, status } = req.query;
    let counsel;

    if (search) {
      counsel = await OpposingCounsel.searchCounsel(search);
    } else if (firmName) {
      counsel = await OpposingCounsel.findByFirm(firmName);
    } else if (practiceArea) {
      counsel = await OpposingCounsel.findByPracticeArea(practiceArea);
    } else {
      const query = { status: status || 'Active' };
      counsel = await OpposingCounsel.find(query)
        .sort({ lastName: 1, firstName: 1 })
        .limit(50);
    }

    res.json({
      success: true,
      count: counsel.length,
      data: counsel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving opposing counsel',
      error: error.message
    });
  }
});

router.post('/opposing-counsel', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Opposing Counsel Database',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createOpposingCounselSchema, req.body);

    const newCounsel = new OpposingCounsel(validatedData);
    await newCounsel.save();

    res.status(201).json({
      success: true,
      message: 'Opposing counsel created successfully',
      data: newCounsel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating opposing counsel',
      error: error.message
    });
  }
});

router.get('/opposing-counsel/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Opposing Counsel Database',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const counsel = await OpposingCounsel.findById(req.params.id);

    if (!counsel) {
      return res.status(404).json({
        success: false,
        message: 'Opposing counsel not found'
      });
    }

    res.json({
      success: true,
      data: counsel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving opposing counsel',
      error: error.message
    });
  }
});

router.post('/opposing-counsel/:id/communications', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Opposing Counsel Database',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(addCommunicationSchema, req.body);
    const counsel = await OpposingCounsel.findById(req.params.id);

    if (!counsel) {
      return res.status(404).json({
        success: false,
        message: 'Opposing counsel not found'
      });
    }

    await counsel.addCommunication(validatedData, validatedData.recordedBy);

    res.json({
      success: true,
      message: 'Communication logged successfully',
      data: counsel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error logging communication',
      error: error.message
    });
  }
});

// Sub-Feature 5: Judge Information
router.get('/judges', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Judge Information',
        description: 'Judge profiles, preferences, and history',
        endpoint: '/api/court/judges',
        capabilities: [
          'Judge profiles',
          'Judicial preferences',
          'Ruling history',
          'Courtroom procedures',
          'Biography and background'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { court, jurisdiction, search, status } = req.query;
    let judges;

    if (search) {
      judges = await Judge.searchJudges(search);
    } else if (court) {
      judges = await Judge.findByCourt(court);
    } else if (jurisdiction) {
      judges = await Judge.findByJurisdiction(jurisdiction);
    } else {
      const query = { status: status || { $in: ['Active', 'Senior Status'] } };
      judges = await Judge.find(query)
        .sort({ lastName: 1, firstName: 1 })
        .limit(50);
    }

    res.json({
      success: true,
      count: judges.length,
      data: judges
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving judges',
      error: error.message
    });
  }
});

router.post('/judges', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Judge Information',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createJudgeSchema, req.body);

    const newJudge = new Judge(validatedData);
    await newJudge.save();

    res.status(201).json({
      success: true,
      message: 'Judge profile created successfully',
      data: newJudge
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating judge profile',
      error: error.message
    });
  }
});

router.get('/judges/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Judge Information',
        description: 'Judge profiles, preferences, and history',
        endpoint: '/api/court/judges/:id',
        capabilities: [
          'Judge profiles',
          'Judicial preferences',
          'Ruling history',
          'Courtroom procedures',
          'Biography and background'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const judge = await Judge.findById(req.params.id);

    if (!judge) {
      return res.status(404).json({
        success: false,
        message: 'Judge not found'
      });
    }

    res.json({
      success: true,
      data: judge
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving judge',
      error: error.message
    });
  }
});

router.post('/judges/:id/rulings', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Judge Information',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const judge = await Judge.findById(req.params.id);

    if (!judge) {
      return res.status(404).json({
        success: false,
        message: 'Judge not found'
      });
    }

    await judge.recordRuling(req.body);

    res.json({
      success: true,
      message: 'Ruling recorded successfully',
      data: {
        rulingHistory: judge.rulingHistory,
        motionGrantRate: judge.motionGrantRate,
        reversalRate: judge.reversalRate
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error recording ruling',
      error: error.message
    });
  }
});

// Sub-Feature 6: Courtroom Calendar
router.get('/calendar', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Courtroom Calendar',
        description: 'Track courtroom assignments and schedules',
        endpoint: '/api/court/calendar',
        capabilities: [
          'Courtroom schedules',
          'Room assignments',
          'Hearing times',
          'Court availability',
          'Calendar conflicts'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { courtroom, judgeName, caseNumber, startDate, endDate, status } = req.query;
    let events;

    if (judgeName && startDate && endDate) {
      events = await CourtroomCalendar.findByJudge(judgeName, new Date(startDate), new Date(endDate));
    } else if (caseNumber) {
      events = await CourtroomCalendar.findByCaseNumber(caseNumber);
    } else {
      const query = {};
      if (courtroom) query.courtroom = courtroom;
      if (judgeName) query.judgeName = judgeName;
      if (status) query.status = status;
      if (startDate) query.scheduledDate = { $gte: new Date(startDate) };
      if (endDate) query.scheduledDate = { ...query.scheduledDate, $lte: new Date(endDate) };

      events = await CourtroomCalendar.find(query)
        .sort({ scheduledDate: 1, scheduledTime: 1 })
        .limit(50);
    }

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving calendar events',
      error: error.message
    });
  }
});

router.post('/calendar', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Courtroom Calendar',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createCalendarEventSchema, req.body);
    const eventId = req.body.eventId || generateEventId();

    const newEvent = new CourtroomCalendar({
      ...validatedData,
      eventId,
      status: 'Scheduled'
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Calendar event created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating calendar event',
      error: error.message
    });
  }
});

router.get('/calendar/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Courtroom Calendar',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const event = await CourtroomCalendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving calendar event',
      error: error.message
    });
  }
});

router.put('/calendar/:id/reschedule', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Courtroom Calendar',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const event = await CourtroomCalendar.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }

    const { newDate, newTime, reason, changedBy } = req.body;
    await event.reschedule(new Date(newDate), newTime, reason, changedBy);

    res.json({
      success: true,
      message: 'Event rescheduled successfully',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error rescheduling event',
      error: error.message
    });
  }
});

// Sub-Feature 7: Docket Alert System
router.get('/alerts', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Docket Alert System',
        description: 'Automated docket monitoring alerts',
        endpoint: '/api/court/alerts',
        capabilities: [
          'Docket monitoring',
          'Automated alerts',
          'Email notifications',
          'Custom alert rules',
          'Alert history'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { caseNumber, status, targetType, userId } = req.query;
    let alerts;

    if (userId) {
      alerts = await DocketAlert.findByUser(userId);
    } else if (caseNumber) {
      alerts = await DocketAlert.findByCaseNumber(caseNumber);
    } else {
      const query = {};
      if (status) query.status = status;
      if (targetType) query.targetType = targetType;

      alerts = await DocketAlert.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .limit(50);
    }

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving alerts',
      error: error.message
    });
  }
});

router.post('/alerts', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Docket Alert System',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createDocketAlertSchema, req.body);
    const alertId = req.body.alertId || generateAlertId();

    const newAlert = new DocketAlert({
      ...validatedData,
      alertId,
      status: 'Active'
    });

    await newAlert.save();

    res.status(201).json({
      success: true,
      message: 'Docket alert created successfully',
      data: newAlert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating docket alert',
      error: error.message
    });
  }
});

router.get('/alerts/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Docket Alert System',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const alert = await DocketAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving alert',
      error: error.message
    });
  }
});

router.post('/alerts/:id/trigger', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Docket Alert System',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const alert = await DocketAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.triggerAlert(req.body);

    res.json({
      success: true,
      message: 'Alert triggered successfully',
      data: {
        alertId: alert.alertId,
        triggeredCount: alert.triggeredCount,
        lastTriggered: alert.lastTriggered
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error triggering alert',
      error: error.message
    });
  }
});

router.put('/alerts/:id/pause', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Docket Alert System',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const alert = await DocketAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.pause(req.body.pausedBy || 'User');

    res.json({
      success: true,
      message: 'Alert paused successfully',
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error pausing alert',
      error: error.message
    });
  }
});

// Sub-Feature 8: Court Document Retrieval
router.get('/documents', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Document Retrieval',
        description: 'Download court documents and orders',
        endpoint: '/api/court/documents',
        capabilities: [
          'Document download',
          'Court orders',
          'Filed documents',
          'Sealed documents',
          'Bulk retrieval'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { caseNumber, courtName, documentType, search, recent } = req.query;
    let documents;

    if (search) {
      documents = await CourtDocument.searchDocuments(search, { caseNumber, courtName, documentType });
    } else if (recent) {
      documents = await CourtDocument.findRecent(parseInt(recent) || 7);
    } else if (caseNumber) {
      documents = await CourtDocument.findByCaseNumber(caseNumber);
    } else {
      const query = {};
      if (courtName) query.courtName = new RegExp(courtName, 'i');
      if (documentType) query.documentType = documentType;

      documents = await CourtDocument.find(query)
        .sort({ filingDate: -1 })
        .limit(50);
    }

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving documents',
      error: error.message
    });
  }
});

router.post('/documents', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Document Retrieval',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createCourtDocumentSchema, req.body);
    const documentId = req.body.documentId || generateDocumentId();

    const newDocument = new CourtDocument({
      ...validatedData,
      documentId,
      status: 'Available'
    });

    await newDocument.save();

    res.status(201).json({
      success: true,
      message: 'Court document created successfully',
      data: newDocument
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating court document',
      error: error.message
    });
  }
});

router.get('/documents/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Document Retrieval',
        description: 'Download court documents and orders',
        endpoint: '/api/court/documents/:id',
        capabilities: [
          'Document download',
          'Court orders',
          'Filed documents',
          'Sealed documents',
          'Bulk retrieval'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const document = await CourtDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Record view
    await document.recordView();

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving document',
      error: error.message
    });
  }
});

router.post('/documents/:id/download', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Document Retrieval',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const document = await CourtDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await document.recordDownload(req.body.downloadedBy || 'Unknown');

    res.json({
      success: true,
      message: 'Download recorded successfully',
      data: {
        documentId: document.documentId,
        downloadCount: document.downloadCount,
        downloadUrl: document.downloadUrl
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error recording download',
      error: error.message
    });
  }
});

router.put('/documents/:id/review', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Court Document Retrieval',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const document = await CourtDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await document.markAsReviewed(req.body.reviewedBy, req.body.notes);

    res.json({
      success: true,
      message: 'Document marked as reviewed',
      data: document
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error reviewing document',
      error: error.message
    });
  }
});

// Court overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Court & Docket Management',
    subFeatures: [
      'Court Docket Tracking',
      'Electronic Filing (e-Filing)',
      'Court Rules & Procedures',
      'Opposing Counsel Database',
      'Judge Information',
      'Courtroom Calendar',
      'Docket Alert System',
      'Court Document Retrieval'
    ]
  });
});

module.exports = router;
