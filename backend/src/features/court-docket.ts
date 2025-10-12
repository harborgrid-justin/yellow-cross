/**
 * Feature 8: Court & Docket Management
 * 8 Sub-Features: Docket Tracking, Electronic Filing, Court Rules & Procedures,
 * Opposing Counsel Database, Judge Information, Courtroom Calendar, Docket Alerts, Document Retrieval
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

import express from 'express';
const router = express.Router();
import CourtDocket from '../models/CourtDocket';
import { isConnected } from '../config/database';
import {
  createDocketSchema,
  addDocketEntrySchema,
  addHearingSchema,
  eFilingSchema,
  addOpposingCounselSchema
} from '../validators/courtValidators';

// Helper function to generate docket number
const generateDocketNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DCK-${year}-${random}`;
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
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { caseId, courtName, status, caseType, limit = 100 } = req.query;

    // Build query
    const query = {};
    
    if (caseId) {
      query.caseId = caseId;
    }
    if (courtName) {
      query['courtInfo.courtName'] = courtName;
    }
    if (status) {
      query.status = status;
    }
    if (caseType) {
      query.caseType = caseType;
    }

    // Get dockets
    const dockets = await CourtDocket.find(query)
      .sort({ filingDate: -1, lastChecked: -1 })
      .limit(parseInt(limit))
      .select('docketNumber courtCaseNumber title courtInfo caseType status filingDate entryCount lastChecked');

    // Get statistics
    const stats = {
      total: dockets.length,
      byCourt: await CourtDocket.aggregate([
        { $match: query },
        { $group: { _id: '$courtInfo.courtName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      byStatus: await CourtDocket.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      byCaseType: await CourtDocket.aggregate([
        { $match: query },
        { $group: { _id: '$caseType', count: { $sum: 1 } } }
      ])
    };

    res.json({
      success: true,
      data: {
        dockets,
        count: dockets.length,
        statistics: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new docket
router.post('/dockets', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({
        feature: 'Create Docket',
        message: 'Database not connected'
      });
    }

    // Validate input
    const validatedData = validateRequest(createDocketSchema, req.body);

    // Generate docket number
    const docketNumber = generateDocketNumber();

    // Create new docket
    const docket = new CourtDocket({
      ...validatedData,
      docketNumber,
      entries: [],
      hearings: []
    });

    await docket.save();

    res.status(201).json({
      success: true,
      message: 'Court docket created successfully',
      data: {
        docket,
        docketNumber: docket.docketNumber
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get docket by ID
router.get('/dockets/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Get Docket', message: 'Database not connected' });
    }

    const docket = await CourtDocket.findByPk(req.params.id);

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    // Record check
    await docket.recordCheck();

    res.json({
      success: true,
      data: { docket }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add docket entry
router.post('/dockets/:id/entries', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Add Docket Entry', message: 'Database not connected' });
    }

    // Validate input
    const validatedData = validateRequest(addDocketEntrySchema, req.body);

    const docket = await CourtDocket.findByPk(req.params.id);

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    // Add entry
    await docket.addEntry(validatedData);

    res.status(201).json({
      success: true,
      message: 'Docket entry added successfully',
      data: {
        docketNumber: docket.docketNumber,
        entryCount: docket.entries.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 2: Electronic Filing (e-Filing)
router.post('/e-filing', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { docketId } = req.body;

    if (!docketId) {
      return res.status(400).json({
        success: false,
        error: 'Docket ID is required'
      });
    }

    // Validate e-filing data
    const validatedData = validateRequest(eFilingSchema, req.body);

    const docket = await CourtDocket.findByPk(docketId);

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    // Check if e-filing is enabled for this docket
    if (!docket.eFiling) {
      docket.eFiling = { enabled: true, filings: [] };
    }

    // Generate filing ID
    const filingId = `EFIL-${Date.now()}`;

    // Add e-filing entry
    docket.eFiling.filings.push({
      filingId,
      filedDate: new Date(),
      documentType: validatedData.documentType,
      status: 'Pending',
      confirmationNumber: `CONF-${Date.now()}`
    });

    await docket.save();

    res.status(201).json({
      success: true,
      message: 'E-filing submitted successfully',
      data: {
        filingId,
        status: 'Pending',
        docketNumber: docket.docketNumber
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get e-filing status
router.get('/e-filing/:docketId', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'E-Filing Status', message: 'Database not connected' });
    }

    const docket = await CourtDocket.findByPk(req.params.docketId)
      .select('docketNumber eFiling');

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    res.json({
      success: true,
      data: {
        docketNumber: docket.docketNumber,
        eFilingEnabled: docket.eFiling?.enabled || false,
        filings: docket.eFiling?.filings || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 3: Court Rules & Procedures
router.get('/rules/:court', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    // Get dockets for this court to extract applicable rules
    const dockets = await CourtDocket.findAll({ where: {
      'courtInfo.courtName': courtName
    } })
      .select('applicableRules')
      .limit(100);

    // Aggregate all unique rules
    const rulesMap = new Map();
    dockets.forEach(docket => {
      if (docket.applicableRules) {
        docket.applicableRules.forEach(rule => {
          if (!rulesMap.has(rule.ruleNumber)) {
            rulesMap.set(rule.ruleNumber, rule);
          }
        });
      }
    });

    const rules = Array.from(rulesMap.values());

    res.json({
      success: true,
      data: {
        court: courtName,
        rules,
        count: rules.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add rule to docket
router.post('/rules/:docketId', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Add Court Rule', message: 'Database not connected' });
    }

    const { ruleNumber, ruleTitle, description } = req.body;

    if (!ruleNumber || !ruleTitle) {
      return res.status(400).json({
        success: false,
        error: 'Rule number and title are required'
      });
    }

    const docket = await CourtDocket.findByPk(req.params.docketId);

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    if (!docket.applicableRules) {
      docket.applicableRules = [];
    }

    docket.applicableRules.push({
      ruleNumber,
      ruleTitle,
      description
    });

    await docket.save();

    res.status(201).json({
      success: true,
      message: 'Court rule added successfully',
      data: {
        docketNumber: docket.docketNumber,
        rule: { ruleNumber, ruleTitle }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 4: Opposing Counsel Database
router.get('/opposing-counsel', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { firmName, name, limit = 100 } = req.query;

    // Aggregate all opposing counsel from dockets
    const pipeline = [
      { $unwind: '$opposingCounsel' },
      { $match: {} }
    ];

    if (firmName) {
      pipeline[1].$match['opposingCounsel.firmName'] = { $regex: firmName, $options: 'i' };
    }
    if (name) {
      pipeline[1].$match['opposingCounsel.name'] = { $regex: name, $options: 'i' };
    }

    pipeline.push(
      {
        $group: {
          _id: '$opposingCounsel.name',
          counsel: { $first: '$opposingCounsel' },
          caseCount: { $sum: 1 },
          dockets: { $push: { docketNumber: '$docketNumber', title: '$title' } }
        }
      },
      { $sort: { caseCount: -1 } },
      { $limit: parseInt(limit) }
    );

    const counselList = await CourtDocket.aggregate(pipeline);

    res.json({
      success: true,
      data: {
        counselList,
        count: counselList.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add opposing counsel to docket
router.post('/opposing-counsel/:docketId', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Add Opposing Counsel', message: 'Database not connected' });
    }

    // Validate input
    const validatedData = validateRequest(addOpposingCounselSchema, req.body);

    const docket = await CourtDocket.findByPk(req.params.docketId);

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    if (!docket.opposingCounsel) {
      docket.opposingCounsel = [];
    }

    docket.opposingCounsel.push(validatedData);
    await docket.save();

    res.status(201).json({
      success: true,
      message: 'Opposing counsel added successfully',
      data: {
        docketNumber: docket.docketNumber,
        counsel: validatedData.name
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 5: Judge Information
router.get('/judges/:id', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const judgeName = decodeURIComponent(req.params.id);

    // Find all dockets with this judge
    const dockets = await CourtDocket.findAll({ where: {
      'judge.name': judgeName
    } })
      .select('docketNumber title judge courtInfo caseType status filingDate')
      .sort({ filingDate: -1 })
      .limit(50);

    // Aggregate judge information
    const judgeInfo = dockets.length > 0 ? dockets[0].judge : null;

    // Calculate statistics
    const stats = {
      totalCases: dockets.length,
      byCaseType: await CourtDocket.aggregate([
        { $match: { 'judge.name': judgeName } },
        { $group: { _id: '$caseType', count: { $sum: 1 } } }
      ]),
      byStatus: await CourtDocket.aggregate([
        { $match: { 'judge.name': judgeName } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    };

    res.json({
      success: true,
      data: {
        judgeName,
        judgeInfo,
        cases: dockets,
        statistics: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all judges
router.get('/judges', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Judges List', message: 'Database not connected' });
    }

    const judges = await CourtDocket.aggregate([
      { $match: { 'judge.name': { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: '$judge.name',
          judge: { $first: '$judge' },
          caseCount: { $sum: 1 },
          courts: { $addToSet: '$courtInfo.courtName' }
        }
      },
      { $sort: { caseCount: -1 } },
      { $limit: 100 }
    ]);

    res.json({
      success: true,
      data: {
        judges: judges.map(j => ({
          name: j.id,
          info: j.judge,
          caseCount: j.caseCount,
          courts: j.courts
        })),
        count: judges.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 6: Courtroom Calendar
router.get('/calendar', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { startDate, endDate, courtName, limit = 100 } = req.query;

    // Build date range query
    const dateQuery = {};
    if (startDate) {
      dateQuery.$gte = new Date(startDate);
    }
    if (endDate) {
      dateQuery.$lte = new Date(endDate);
    } else {
      // Default to next 30 days if no end date
      dateQuery.$lte = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    // Build match query
    const matchQuery = {
      'hearings.0': { $exists: true }
    };

    if (courtName) {
      matchQuery['courtInfo.courtName'] = courtName;
    }

    // Get dockets with hearings
    const dockets = await CourtDocket.find(matchQuery)
      .select('docketNumber courtCaseNumber title courtInfo hearings')
      .limit(parseInt(limit));

    // Extract and filter hearings
    const hearings = [];
    dockets.forEach(docket => {
      if (docket.hearings) {
        docket.hearings.forEach(hearing => {
          if (Object.keys(dateQuery).length === 0 || 
              (hearing.hearingDate >= dateQuery.$gte && hearing.hearingDate <= dateQuery.$lte)) {
            hearings.push({
              docketNumber: docket.docketNumber,
              courtCaseNumber: docket.courtCaseNumber,
              title: docket.title,
              court: docket.courtInfo.courtName,
              ...hearing.toObject()
            });
          }
        });
      }
    });

    // Sort by hearing date
    hearings.sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate));

    res.json({
      success: true,
      data: {
        hearings: hearings.slice(0, parseInt(limit)),
        count: hearings.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add hearing to docket
router.post('/calendar/:docketId', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Add Hearing', message: 'Database not connected' });
    }

    // Validate input
    const validatedData = validateRequest(addHearingSchema, req.body);

    const docket = await CourtDocket.findByPk(req.params.docketId);

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    // Add hearing
    await docket.addHearing(validatedData);

    res.status(201).json({
      success: true,
      message: 'Hearing added successfully',
      data: {
        docketNumber: docket.docketNumber,
        hearingDate: validatedData.hearingDate
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 7: Docket Alert System
router.post('/alerts', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const { docketId, enabled, frequency, recipients } = req.body;

    if (!docketId) {
      return res.status(400).json({
        success: false,
        error: 'Docket ID is required'
      });
    }

    const docket = await CourtDocket.findByPk(docketId);

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    // Update alert settings
    docket.alerts = {
      enabled: enabled !== undefined ? enabled : true,
      frequency: frequency || 'Daily',
      recipients: recipients || []
    };

    await docket.save();

    res.json({
      success: true,
      message: 'Alert settings updated successfully',
      data: {
        docketNumber: docket.docketNumber,
        alerts: docket.alerts
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get alert settings
router.get('/alerts/:docketId', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Alert Settings', message: 'Database not connected' });
    }

    const docket = await CourtDocket.findByPk(req.params.docketId)
      .select('docketNumber alerts');

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    res.json({
      success: true,
      data: {
        docketNumber: docket.docketNumber,
        alerts: docket.alerts || { enabled: false }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 8: Court Document Retrieval
router.get('/documents/:id', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.json({
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

    const documentId = req.params.id;

    // Find dockets with this document in entries
    const docket = await CourtDocket.findOne({
      'entries.id': documentId
    }).select('docketNumber entries');

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Find the specific entry
    const entry = docket.entries.id(documentId);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Document entry not found'
      });
    }

    // Check if document is sealed
    if (entry.isSealed) {
      return res.status(403).json({
        success: false,
        error: 'Document is sealed and cannot be accessed'
      });
    }

    res.json({
      success: true,
      data: {
        docketNumber: docket.docketNumber,
        entry: entry,
        downloadUrl: entry.documentUrl || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all documents for a docket
router.get('/documents/docket/:docketId', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Docket Documents', message: 'Database not connected' });
    }

    const docket = await CourtDocket.findByPk(req.params.docketId)
      .select('docketNumber entries');

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    // Filter non-sealed documents if requested
    const { includeSealed = 'false' } = req.query;
    let documents = docket.entries || [];

    if (includeSealed === 'false') {
      documents = documents.filter(entry => !entry.isSealed);
    }

    res.json({
      success: true,
      data: {
        docketNumber: docket.docketNumber,
        documents,
        count: documents.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update docket
router.put('/dockets/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Update Docket', message: 'Database not connected' });
    }

    const docket = await CourtDocket.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastModifiedBy: req.body.modifiedBy
      },
      { new: true, runValidators: true }
    );

    if (!docket) {
      return res.status(404).json({
        success: false,
        error: 'Docket not found'
      });
    }

    res.json({
      success: true,
      message: 'Docket updated successfully',
      data: { docket }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Court overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Court & Docket Management',
    description: 'Comprehensive court docket tracking and e-filing system',
    subFeatures: [
      'Court Docket Tracking',
      'Electronic Filing (e-Filing)',
      'Court Rules & Procedures',
      'Opposing Counsel Database',
      'Judge Information',
      'Courtroom Calendar',
      'Docket Alert System',
      'Court Document Retrieval'
    ],
    endpoints: {
      getDockets: 'GET /api/court/dockets',
      createDocket: 'POST /api/court/dockets',
      getDocket: 'GET /api/court/dockets/:id',
      updateDocket: 'PUT /api/court/dockets/:id',
      addEntry: 'POST /api/court/dockets/:id/entries',
      eFiling: 'POST /api/court/e-filing',
      courtRules: 'GET /api/court/rules/:court',
      opposingCounsel: 'GET /api/court/opposing-counsel',
      judges: 'GET /api/court/judges',
      calendar: 'GET /api/court/calendar',
      alerts: 'POST /api/court/alerts',
      documents: 'GET /api/court/documents/:id'
    }
  });
});

// Delete docket by ID
router.delete('/dockets/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Delete Docket', message: 'Database not connected' });
    }

    const docket = await CourtDocket.findByPk(req.params.id);
    if (!docket) {
      return res.status(404).json({
        success: false,
        message: 'Docket not found'
      });
    }

    // Archive instead of delete for court records
    await docket.update({
      status: 'Archived',
      lastModifiedBy: req.body.deletedBy || 'System'
    });

    res.json({
      success: true,
      message: 'Docket archived successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
