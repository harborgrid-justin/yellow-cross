/**
 * Feature 11: Compliance & Risk Management
 * 8 Sub-Features: Ethics & Compliance Tracking, Risk Assessment Tools, Malpractice Prevention,
 * Regulatory Compliance, Audit Trail & Logging, Data Privacy Compliance, Professional Liability Management, Compliance Reporting
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

import express from 'express';
const router = express.Router();
import ComplianceItem from '../models/ComplianceItem';
import { isConnected } from '../config/database';
import {
  createComplianceItemSchema,
  updateComplianceStatusSchema,
  addRiskFactorSchema,
  remediationPlanSchema,
  auditTrailSchema,
  complianceReportSchema
} from '../validators/complianceValidators';

// Helper function to generate compliance number
const generateComplianceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CMP-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Create compliance item
router.post('/create', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Create Compliance Item', message: 'Database not connected' });
    }

    // Validate input
    const validatedData = validateRequest(createComplianceItemSchema, req.body);

    // Generate compliance number
    const complianceNumber = generateComplianceNumber();

    // Create new compliance item
    const item = new ComplianceItem({
      ...validatedData,
      complianceNumber
    });

    // Calculate risk score if risk factors provided
    if (item.riskFactors && item.riskFactors.length > 0) {
      await item.calculateRiskScore();
    }

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Compliance item created successfully',
      data: {
        item,
        complianceNumber: item.complianceNumber
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get compliance item by ID
router.get('/:id', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Get Compliance Item', message: 'Database not connected' });
    }

    const item = await ComplianceItem.findByPk(req.params.id)
      .populate('caseId', 'caseNumber title')
      .populate('clientId', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Compliance item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List all compliance items with filtering
router.get('/list/all', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'List Compliance Items', message: 'Database not connected' });
    }

    const { complianceType, status, priority, riskLevel, page = 1, limit = 20 } = req.query;
    const filters = {};

    if (complianceType) filters.complianceType = complianceType;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (riskLevel) filters.riskLevel = riskLevel;

    const items = await ComplianceItem.find(filters)
      .populate('caseId', 'caseNumber title')
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ComplianceItem.countDocuments(filters);

    res.json({
      success: true,
      data: {
        items,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalItems: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update compliance status
router.put('/:id/status', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Update Compliance Status', message: 'Database not connected' });
    }

    const validatedData = validateRequest(updateComplianceStatusSchema, req.body);

    const item = await ComplianceItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Compliance item not found' });
    }

    const oldStatus = item.status;
    item.status = validatedData.status;

    // Add to history
    item.statusHistory.push({
      status: validatedData.status,
      changedBy: validatedData.modifiedBy,
      notes: validatedData.notes,
      changedAt: new Date()
    });

    // Add audit trail
    item.auditTrail.push({
      action: 'Status Updated',
      performedBy: validatedData.modifiedBy,
      timestamp: new Date(),
      details: `Status changed from ${oldStatus} to ${validatedData.status}`,
      previousValue: oldStatus,
      newValue: validatedData.status
    });

    if (validatedData.status === 'Remediated' || validatedData.status === 'Compliant') {
      item.resolvedDate = new Date();
    }

    await item.save();

    res.json({
      success: true,
      message: 'Compliance status updated successfully',
      data: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add risk factor
router.post('/:id/risk-factor', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Add Risk Factor', message: 'Database not connected' });
    }

    const validatedData = validateRequest(addRiskFactorSchema, req.body);

    const item = await ComplianceItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Compliance item not found' });
    }

    item.riskFactors.push(validatedData);
    await item.calculateRiskScore();
    await item.save();

    res.json({
      success: true,
      message: 'Risk factor added successfully',
      data: {
        item,
        newRiskScore: item.riskScore,
        newRiskLevel: item.riskLevel
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Set remediation plan
router.post('/:id/remediation', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Set Remediation Plan', message: 'Database not connected' });
    }

    const validatedData = validateRequest(remediationPlanSchema, req.body);

    const item = await ComplianceItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Compliance item not found' });
    }

    item.remediationPlan = {
      plan: validatedData.plan,
      startDate: validatedData.startDate || new Date(),
      targetCompletionDate: validatedData.targetCompletionDate,
      responsibleParty: validatedData.responsibleParty,
      status: 'Planned',
      notes: validatedData.notes
    };

    item.auditTrail.push({
      action: 'Remediation Plan Created',
      performedBy: validatedData.responsibleParty,
      timestamp: new Date(),
      details: 'Remediation plan has been set'
    });

    await item.save();

    res.json({
      success: true,
      message: 'Remediation plan set successfully',
      data: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 1: Ethics & Compliance Tracking
router.get('/ethics/tracking', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Ethics & Compliance Tracking', message: 'Database not connected' });
    }

    const ethicsItems = await ComplianceItem.findAll({ where: { complianceType: 'Ethics' } })
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = {
      total: ethicsItems.length,
      byStatus: {},
      byPriority: {},
      avgRiskScore: 0
    };

    ethicsItems.forEach(item => {
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
      stats.byPriority[item.priority] = (stats.byPriority[item.priority] || 0) + 1;
      stats.avgRiskScore += item.riskScore;
    });

    if (ethicsItems.length > 0) {
      stats.avgRiskScore = stats.avgRiskScore / ethicsItems.length;
    }

    res.json({
      success: true,
      data: {
        items: ethicsItems,
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

// Sub-Feature 2: Risk Assessment Tools
router.post('/risk-assessment', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Risk Assessment', message: 'Database not connected' });
    }

    const { caseId: _caseId, clientId: _clientId, riskFactors } = req.body;

    // Calculate overall risk score
    let totalRiskScore = 0;
    let riskCount = 0;

    if (riskFactors && riskFactors.length > 0) {
      riskFactors.forEach(factor => {
        const impactScore = { 'Critical': 100, 'High': 75, 'Medium': 50, 'Low': 25 }[factor.impact] || 50;
        const likelihoodScore = { 'Very Likely': 1.0, 'Likely': 0.75, 'Possible': 0.5, 'Unlikely': 0.25 }[factor.likelihood] || 0.5;
        totalRiskScore += impactScore * likelihoodScore;
        riskCount++;
      });
    }

    const avgRiskScore = riskCount > 0 ? totalRiskScore / riskCount : 50;
    const riskLevel = avgRiskScore >= 75 ? 'Critical' :
                      avgRiskScore >= 60 ? 'High' :
                      avgRiskScore >= 40 ? 'Medium' : 'Low';

    res.json({
      success: true,
      data: {
        riskScore: Math.round(avgRiskScore),
        riskLevel,
        analysisDate: new Date(),
        riskFactorsAnalyzed: riskCount,
        recommendation: riskLevel === 'Critical' || riskLevel === 'High' ?
          'Immediate action required' :
          'Monitor and review regularly'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 3: Malpractice Prevention
router.get('/malpractice-prevention', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Malpractice Prevention', message: 'Database not connected' });
    }

    const malpracticeItems = await ComplianceItem.find({ 
      complianceType: 'Malpractice Prevention',
      status: { $in: ['Active', 'Under Review'] }
    }).sort({ priority: 1, dueDate: 1 });

    // Check for high-risk cases
    const highRiskCases = await ComplianceItem.find({
      riskLevel: { $in: ['Critical', 'High'] },
      status: { $ne: 'Remediated' }
    }).limit(10);

    res.json({
      success: true,
      data: {
        activeItems: malpracticeItems,
        highRiskAlerts: highRiskCases,
        summary: {
          totalActive: malpracticeItems.length,
          criticalRisk: highRiskCases.filter(i => i.riskLevel === 'Critical').length,
          highRisk: highRiskCases.filter(i => i.riskLevel === 'High').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Conflict check
router.post('/conflict-check', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Conflict Check', message: 'Database not connected' });
    }

    const { clientName, opposingParty, caseType: _caseType } = req.body;

    // Search for potential conflicts
    const conflicts = await ComplianceItem.find({
      complianceType: 'Conflict Check',
      $or: [
        { 'conflictDetails.involvedParties': { $regex: clientName, $options: 'i' } },
        { 'conflictDetails.involvedParties': { $regex: opposingParty, $options: 'i' } }
      ]
    });

    const hasConflict = conflicts.length > 0;

    res.json({
      success: true,
      data: {
        hasConflict,
        conflictCount: conflicts.length,
        conflicts: conflicts.map(c => ({
          id: c.id,
          title: c.title,
          status: c.status,
          riskLevel: c.riskLevel,
          details: c.conflictDetails
        })),
        checkDate: new Date(),
        recommendation: hasConflict ? 'Review conflicts before proceeding' : 'No conflicts detected'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 4: Regulatory Compliance
router.get('/regulatory', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Regulatory Compliance', message: 'Database not connected' });
    }

    const { regulatoryBody } = req.query;
    const filters = { complianceType: 'Regulatory' };
    if (regulatoryBody) filters.regulatoryBody = regulatoryBody;

    const regulatoryItems = await ComplianceItem.find(filters)
      .sort({ dueDate: 1 });

    const upcoming = regulatoryItems.filter(item => {
      const daysUntilDue = item.dueDate ? 
        Math.ceil((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 
        999;
      return daysUntilDue >= 0 && daysUntilDue <= 30;
    });

    const overdue = regulatoryItems.filter(item => {
      return item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'Compliant';
    });

    res.json({
      success: true,
      data: {
        allItems: regulatoryItems,
        upcomingDeadlines: upcoming,
        overdueItems: overdue,
        summary: {
          total: regulatoryItems.length,
          upcoming: upcoming.length,
          overdue: overdue.length,
          compliant: regulatoryItems.filter(i => i.status === 'Compliant').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 5: Audit Trail & Logging
router.get('/audit-trail', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Audit Trail', message: 'Database not connected' });
    }

    const { startDate, endDate, performedBy, action, page = 1, limit = 50 } = req.query;

    // Aggregate audit trails from all compliance items
    const filters = {};
    if (startDate || endDate) {
      filters['auditTrail.timestamp'] = {};
      if (startDate) filters['auditTrail.timestamp'].$gte = new Date(startDate);
      if (endDate) filters['auditTrail.timestamp'].$lte = new Date(endDate);
    }

    const items = await ComplianceItem.find(filters)
      .select('complianceNumber title auditTrail')
      .sort({ 'auditTrail.timestamp': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Flatten audit trails
    const auditEntries = [];
    items.forEach(item => {
      item.auditTrail.forEach(entry => {
        if (!performedBy || entry.performedBy === performedBy) {
          if (!action || entry.action.includes(action)) {
            auditEntries.push({
              complianceNumber: item.complianceNumber,
              complianceTitle: item.title,
              ...entry.toObject()
            });
          }
        }
      });
    });

    res.json({
      success: true,
      data: {
        entries: auditEntries.slice(0, limit),
        totalEntries: auditEntries.length,
        currentPage: page
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add audit trail entry to compliance item
router.post('/audit-trail/:complianceId', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Add Audit Trail', message: 'Database not connected' });
    }

    const validatedData = validateRequest(auditTrailSchema, req.body);
    
    const complianceItem = await ComplianceItem.findByPk(req.params.complianceId);
    
    if (!complianceItem) {
      return res.status(404).json({
        success: false,
        error: 'Compliance item not found'
      });
    }

    // Add audit trail entry
    if (!complianceItem.auditTrail) {
      complianceItem.auditTrail = [];
    }

    complianceItem.auditTrail.push({
      timestamp: new Date(),
      action: validatedData.action,
      performedBy: validatedData.performedBy,
      details: validatedData.details,
      previousValue: validatedData.previousValue,
      newValue: validatedData.newValue
    });

    await complianceItem.save();

    res.json({
      success: true,
      message: 'Audit trail entry added successfully',
      data: complianceItem.auditTrail[complianceItem.auditTrail.length - 1]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 6: Data Privacy Compliance
router.get('/data-privacy', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Data Privacy Compliance', message: 'Database not connected' });
    }

    const privacyItems = await ComplianceItem.find({ 
      complianceType: 'Data Privacy',
      status: { $in: ['Active', 'Under Review', 'Non-Compliant'] }
    }).sort({ priority: 1 });

    const regulations = ['GDPR', 'CCPA', 'HIPAA', 'State Privacy Laws'];
    const complianceByRegulation = {};

    regulations.forEach(reg => {
      complianceByRegulation[reg] = {
        total: privacyItems.filter(i => i.title.includes(reg) || i.description?.includes(reg)).length,
        compliant: 0,
        nonCompliant: 0
      };
    });

    res.json({
      success: true,
      data: {
        items: privacyItems,
        complianceByRegulation,
        summary: {
          totalPrivacyItems: privacyItems.length,
          nonCompliant: privacyItems.filter(i => i.status === 'Non-Compliant').length,
          underReview: privacyItems.filter(i => i.status === 'Under Review').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 7: Professional Liability Management
router.get('/liability', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Professional Liability', message: 'Database not connected' });
    }

    const liabilityItems = await ComplianceItem.findAll({ where: { 
      complianceType: 'Professional Liability'
    } }).sort({ createdAt: -1 });

    const activeClaims = liabilityItems.filter(i => i.status === 'Active');
    const highRiskItems = liabilityItems.filter(i => i.riskLevel === 'Critical' || i.riskLevel === 'High');

    res.json({
      success: true,
      data: {
        allLiabilityItems: liabilityItems,
        activeClaims,
        highRiskItems,
        summary: {
          total: liabilityItems.length,
          active: activeClaims.length,
          highRisk: highRiskItems.length,
          resolved: liabilityItems.filter(i => i.status === 'Remediated').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 8: Compliance Reporting
router.post('/reports', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Compliance Reporting', message: 'Database not connected' });
    }

    const validatedData = validateRequest(complianceReportSchema, req.body);
    const filters = {};

    if (validatedData.complianceType) filters.complianceType = validatedData.complianceType;
    if (validatedData.status) filters.status = validatedData.status;
    if (validatedData.priority) filters.priority = validatedData.priority;

    if (validatedData.startDate || validatedData.endDate) {
      filters.createdAt = {};
      if (validatedData.startDate) filters.createdAt.$gte = new Date(validatedData.startDate);
      if (validatedData.endDate) filters.createdAt.$lte = new Date(validatedData.endDate);
    }

    if (!validatedData.includeResolved) {
      filters.status = { $ne: 'Remediated' };
    }

    const items = await ComplianceItem.find(filters);

    const report = {
      generatedAt: new Date(),
      filters: validatedData,
      summary: {
        totalItems: items.length,
        byType: {},
        byStatus: {},
        byPriority: {},
        byRiskLevel: {},
        avgRiskScore: 0
      },
      items: items.map(item => ({
        complianceNumber: item.complianceNumber,
        title: item.title,
        complianceType: item.complianceType,
        status: item.status,
        priority: item.priority,
        riskLevel: item.riskLevel,
        riskScore: item.riskScore,
        dueDate: item.dueDate,
        identifiedDate: item.identifiedDate
      }))
    };

    items.forEach(item => {
      report.summary.byType[item.complianceType] = (report.summary.byType[item.complianceType] || 0) + 1;
      report.summary.byStatus[item.status] = (report.summary.byStatus[item.status] || 0) + 1;
      report.summary.byPriority[item.priority] = (report.summary.byPriority[item.priority] || 0) + 1;
      report.summary.byRiskLevel[item.riskLevel] = (report.summary.byRiskLevel[item.riskLevel] || 0) + 1;
      report.summary.avgRiskScore += item.riskScore;
    });

    if (items.length > 0) {
      report.summary.avgRiskScore = report.summary.avgRiskScore / items.length;
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Compliance overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Compliance & Risk Management',
    description: 'Comprehensive compliance tracking and risk management system',
    subFeatures: [
      'Ethics & Compliance Tracking',
      'Risk Assessment Tools',
      'Malpractice Prevention',
      'Regulatory Compliance',
      'Audit Trail & Logging',
      'Data Privacy Compliance',
      'Professional Liability Management',
      'Compliance Reporting'
    ],
    endpoints: {
      create: 'POST /api/compliance/create',
      list: 'GET /api/compliance/list/all',
      getById: 'GET /api/compliance/:id',
      updateStatus: 'PUT /api/compliance/:id/status',
      addRiskFactor: 'POST /api/compliance/:id/risk-factor',
      setRemediation: 'POST /api/compliance/:id/remediation',
      ethics: 'GET /api/compliance/ethics/tracking',
      riskAssessment: 'POST /api/compliance/risk-assessment',
      malpracticePrevention: 'GET /api/compliance/malpractice-prevention',
      conflictCheck: 'POST /api/compliance/conflict-check',
      regulatory: 'GET /api/compliance/regulatory',
      auditTrail: 'GET /api/compliance/audit-trail',
      dataPrivacy: 'GET /api/compliance/data-privacy',
      liability: 'GET /api/compliance/liability',
      reports: 'POST /api/compliance/reports'
    }
  });
});

// Update compliance item by ID (Generic UPDATE)
router.put('/:id', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Update Compliance Item', message: 'Database not connected' });
    }

    const item = await ComplianceItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Compliance item not found'
      });
    }

    await item.update({
      ...req.body,
      lastModifiedBy: req.body.updatedBy || req.body.lastModifiedBy
    });

    res.json({
      success: true,
      message: 'Compliance item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete compliance item by ID
router.delete('/:id', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Delete Compliance Item', message: 'Database not connected' });
    }

    const item = await ComplianceItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Compliance item not found'
      });
    }

    // Only allow deletion if status is Pending or Draft
    if (!['Pending', 'Draft'].includes(item.status)) {
      return res.status(400).json({
        success: false,
        error: 'Can only delete compliance items in Pending or Draft status'
      });
    }

    await item.destroy();

    res.json({
      success: true,
      message: 'Compliance item deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
