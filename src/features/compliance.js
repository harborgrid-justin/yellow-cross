/**
 * Feature 11: Compliance & Risk Management
 * 8 Sub-Features: Ethics & Compliance Tracking, Risk Assessment Tools, Malpractice Prevention,
 * Regulatory Compliance, Audit Trail & Logging, Data Privacy Compliance, Professional Liability, Compliance Reporting
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const ComplianceRecord = require('../models/ComplianceRecord');
const RiskAssessment = require('../models/RiskAssessment');
const MalpracticeCheck = require('../models/MalpracticeCheck');
const RegulatoryCompliance = require('../models/RegulatoryCompliance');
const AuditLog = require('../models/AuditLog');
const PrivacyCompliance = require('../models/PrivacyCompliance');
const LiabilityInsurance = require('../models/LiabilityInsurance');
const { isConnected } = require('../config/database');
const {
  createComplianceRecordSchema,
  createRiskAssessmentSchema,
  createMalpracticeCheckSchema,
  createRegulatoryComplianceSchema,
  createPrivacyComplianceSchema,
  createLiabilityInsuranceSchema,
  auditLogQuerySchema,
  generateComplianceReportSchema
} = require('../validators/complianceValidators');

// Helper function to generate record numbers
const generateRecordNumber = (prefix) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Ethics & Compliance Tracking
router.get('/ethics', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Ethics & Compliance Tracking',
        description: 'Monitor ethical obligations and CLE requirements',
        endpoint: '/api/compliance/ethics',
        capabilities: [
          'Ethics rules tracking',
          'Compliance monitoring',
          'CLE tracking',
          'Ethics alerts',
          'Violation reporting'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { status, assignedTo, recordType } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (recordType) query.recordType = recordType;
    
    const records = await ComplianceRecord.find(query)
      .sort({ priority: -1, dueDate: 1 })
      .limit(100);

    // Get upcoming CLE deadlines
    const upcomingCLE = await ComplianceRecord.find({
      recordType: 'CLE Requirement',
      status: { $in: ['Active', 'Pending'] },
      dueDate: { $exists: true }
    }).sort({ dueDate: 1 }).limit(10);

    res.json({
      success: true,
      data: {
        records,
        upcomingCLE,
        totalRecords: records.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving ethics & compliance records',
      error: error.message
    });
  }
});

router.post('/ethics', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Ethics & Compliance Tracking',
        description: 'Create new ethics & compliance record',
        endpoint: 'POST /api/compliance/ethics',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createComplianceRecordSchema, req.body);
    const recordNumber = generateRecordNumber('COMP');

    const newRecord = new ComplianceRecord({
      ...validatedData,
      recordNumber
    });

    await newRecord.save();

    // Log the action
    await AuditLog.logUserAction({
      userId: null,
      username: validatedData.createdBy,
      eventType: 'Compliance Record Created',
      action: 'Create',
      actionCategory: 'Create',
      resourceType: 'ComplianceRecord',
      resourceId: newRecord._id.toString(),
      description: `Created compliance record: ${newRecord.title}`
    });

    res.status(201).json({
      success: true,
      message: 'Compliance record created successfully',
      data: newRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating compliance record',
      error: error.message
    });
  }
});

// Sub-Feature 2: Risk Assessment Tools
router.post('/risk-assessment', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Risk Assessment Tools',
        description: 'Identify and assess case risks',
        endpoint: 'POST /api/compliance/risk-assessment',
        capabilities: [
          'Risk identification',
          'Risk scoring',
          'Mitigation strategies',
          'Risk monitoring',
          'Risk reporting'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createRiskAssessmentSchema, req.body);
    const assessmentNumber = generateRecordNumber('RISK');

    const newAssessment = new RiskAssessment({
      ...validatedData,
      assessmentNumber,
      lastReviewDate: new Date()
    });

    // Calculate next review date based on risk level
    const daysMap = {
      'Critical': 7,
      'High': 30,
      'Medium': 90,
      'Low': 180,
      'Very Low': 365
    };
    const days = daysMap[newAssessment.riskLevel] || 90;
    newAssessment.nextReviewDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await newAssessment.save();

    // Log the action
    await AuditLog.logUserAction({
      userId: null,
      username: validatedData.assessedBy,
      eventType: 'Risk Assessment Created',
      action: 'Create',
      actionCategory: 'Create',
      resourceType: 'RiskAssessment',
      resourceId: newAssessment._id.toString(),
      description: `Created risk assessment: ${newAssessment.title}`,
      severity: newAssessment.riskLevel === 'Critical' || newAssessment.riskLevel === 'High' ? 'High' : 'Medium'
    });

    res.status(201).json({
      success: true,
      message: 'Risk assessment created successfully',
      data: newAssessment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating risk assessment',
      error: error.message
    });
  }
});

router.get('/risk-assessment', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Risk Assessment Tools',
        description: 'View risk assessments',
        endpoint: 'GET /api/compliance/risk-assessment',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { riskLevel, status, caseNumber } = req.query;
    
    const query = {};
    if (riskLevel) query.riskLevel = riskLevel;
    if (status) query.status = status;
    if (caseNumber) query.caseNumber = caseNumber;
    
    const assessments = await RiskAssessment.find(query)
      .sort({ overallRiskScore: -1, assessmentDate: -1 })
      .limit(100);

    // Get high risk assessments
    const highRisks = await RiskAssessment.findHighRisks();

    // Get risk analytics
    const analytics = await RiskAssessment.getRiskAnalytics(query);

    res.json({
      success: true,
      data: {
        assessments,
        highRisks: highRisks.slice(0, 10),
        analytics,
        totalAssessments: assessments.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving risk assessments',
      error: error.message
    });
  }
});

// Sub-Feature 3: Malpractice Prevention
router.get('/malpractice-prevention', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Malpractice Prevention',
        description: 'Conflict checks and deadline monitoring',
        endpoint: '/api/compliance/malpractice-prevention',
        capabilities: [
          'Conflict checking',
          'Deadline monitoring',
          'Statute of limitations',
          'Best practice alerts',
          'Quality checks'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { checkType, status, severity } = req.query;
    
    const query = {};
    if (checkType) query.checkType = checkType;
    if (status) query.status = status;
    if (severity) query.severity = severity;
    
    const checks = await MalpracticeCheck.find(query)
      .sort({ severity: -1, checkDate: -1 })
      .limit(100);

    // Get active conflicts
    const conflicts = await MalpracticeCheck.findConflicts();

    // Get upcoming deadlines
    const upcomingDeadlines = await MalpracticeCheck.findUpcomingDeadlines(30);

    // Get critical issues
    const criticalIssues = await MalpracticeCheck.findCriticalIssues();

    res.json({
      success: true,
      data: {
        checks,
        conflicts: conflicts.slice(0, 10),
        upcomingDeadlines: upcomingDeadlines.slice(0, 10),
        criticalIssues: criticalIssues.slice(0, 10),
        totalChecks: checks.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving malpractice prevention checks',
      error: error.message
    });
  }
});

router.post('/malpractice-prevention', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Malpractice Prevention',
        description: 'Create new malpractice check',
        endpoint: 'POST /api/compliance/malpractice-prevention',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createMalpracticeCheckSchema, req.body);
    const checkNumber = generateRecordNumber('MPC');

    const newCheck = new MalpracticeCheck({
      ...validatedData,
      checkNumber
    });

    await newCheck.save();

    // Log the action
    await AuditLog.logUserAction({
      userId: null,
      username: validatedData.performedBy,
      eventType: 'Malpractice Check Created',
      action: 'Create',
      actionCategory: 'Create',
      resourceType: 'MalpracticeCheck',
      resourceId: newCheck._id.toString(),
      description: `Created malpractice check: ${newCheck.checkType}`,
      severity: newCheck.severity
    });

    res.status(201).json({
      success: true,
      message: 'Malpractice check created successfully',
      data: newCheck
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating malpractice check',
      error: error.message
    });
  }
});

// Sub-Feature 4: Regulatory Compliance
router.get('/regulatory', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Regulatory Compliance',
        description: 'ABA and state bar compliance',
        endpoint: '/api/compliance/regulatory',
        capabilities: [
          'ABA compliance',
          'State bar rules',
          'Trust accounting rules',
          'Advertising compliance',
          'Regulatory updates'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { jurisdiction, complianceType, status } = req.query;
    
    const query = {};
    if (jurisdiction) query.jurisdiction = jurisdiction;
    if (complianceType) query.complianceType = complianceType;
    if (status) query.status = status;
    
    const records = await RegulatoryCompliance.find(query)
      .sort({ severity: -1, complianceDeadline: 1 })
      .limit(100);

    // Get non-compliant items
    const nonCompliant = await RegulatoryCompliance.findNonCompliant();

    // Get upcoming renewals
    const upcomingRenewals = await RegulatoryCompliance.findUpcomingRenewals(60);

    res.json({
      success: true,
      data: {
        records,
        nonCompliant: nonCompliant.slice(0, 10),
        upcomingRenewals: upcomingRenewals.slice(0, 10),
        totalRecords: records.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving regulatory compliance records',
      error: error.message
    });
  }
});

router.post('/regulatory', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Regulatory Compliance',
        description: 'Create new regulatory compliance record',
        endpoint: 'POST /api/compliance/regulatory',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createRegulatoryComplianceSchema, req.body);
    const complianceNumber = generateRecordNumber('REG');

    const newRecord = new RegulatoryCompliance({
      ...validatedData,
      complianceNumber
    });

    await newRecord.save();

    // Log the action
    await AuditLog.logUserAction({
      userId: null,
      username: validatedData.createdBy,
      eventType: 'Regulatory Compliance Created',
      action: 'Create',
      actionCategory: 'Create',
      resourceType: 'RegulatoryCompliance',
      resourceId: newRecord._id.toString(),
      description: `Created regulatory compliance record: ${newRecord.title}`
    });

    res.status(201).json({
      success: true,
      message: 'Regulatory compliance record created successfully',
      data: newRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating regulatory compliance record',
      error: error.message
    });
  }
});

// Sub-Feature 5: Audit Trail & Logging
router.get('/audit-trail', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Audit Trail & Logging',
        description: 'Comprehensive activity logging',
        endpoint: '/api/compliance/audit-trail',
        capabilities: [
          'Activity logging',
          'User actions',
          'Data access logs',
          'Change history',
          'Audit reports'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedQuery = validateRequest(auditLogQuerySchema, req.query);
    
    const query = {};
    if (validatedQuery.logType) query.logType = validatedQuery.logType;
    if (validatedQuery.userId) query.userId = validatedQuery.userId;
    if (validatedQuery.username) query.username = validatedQuery.username;
    if (validatedQuery.resourceType) query.resourceType = validatedQuery.resourceType;
    if (validatedQuery.severity) query.severity = validatedQuery.severity;
    if (validatedQuery.status) query.status = validatedQuery.status;
    
    if (validatedQuery.startDate || validatedQuery.endDate) {
      query.timestamp = {};
      if (validatedQuery.startDate) query.timestamp.$gte = new Date(validatedQuery.startDate);
      if (validatedQuery.endDate) query.timestamp.$lte = new Date(validatedQuery.endDate);
    }
    
    const skip = (validatedQuery.page - 1) * validatedQuery.limit;
    
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(validatedQuery.limit);

    const totalLogs = await AuditLog.countDocuments(query);

    // Get security events
    const securityEvents = await AuditLog.getSecurityEvents(7);

    // Get audit report
    const report = await AuditLog.getAuditReport(
      query,
      validatedQuery.startDate ? new Date(validatedQuery.startDate) : undefined,
      validatedQuery.endDate ? new Date(validatedQuery.endDate) : undefined
    );

    res.json({
      success: true,
      data: {
        logs,
        securityEvents: securityEvents.slice(0, 10),
        report,
        pagination: {
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          totalLogs,
          totalPages: Math.ceil(totalLogs / validatedQuery.limit)
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving audit logs',
      error: error.message
    });
  }
});

// Sub-Feature 6: Data Privacy Compliance
router.get('/privacy', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Data Privacy Compliance',
        description: 'GDPR and CCPA compliance tools',
        endpoint: '/api/compliance/privacy',
        capabilities: [
          'GDPR compliance',
          'CCPA compliance',
          'Data subject requests',
          'Privacy policies',
          'Consent management'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { complianceType, status, subjectId } = req.query;
    
    const query = {};
    if (complianceType) query.complianceType = complianceType;
    if (status) query.status = status;
    if (subjectId) query['dataSubject.subjectId'] = subjectId;
    
    const records = await PrivacyCompliance.find(query)
      .sort({ priority: -1, submittedDate: -1 })
      .limit(100);

    // Get pending data subject requests
    const pendingRequests = await PrivacyCompliance.findPendingRequests();

    // Get overdue requests
    const overdueRequests = await PrivacyCompliance.findOverdueRequests();

    // Get compliance metrics
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3); // Last 3 months
    const metrics = await PrivacyCompliance.getComplianceMetrics(startDate, new Date());

    res.json({
      success: true,
      data: {
        records,
        pendingRequests: pendingRequests.slice(0, 10),
        overdueRequests: overdueRequests.slice(0, 10),
        metrics,
        totalRecords: records.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving privacy compliance records',
      error: error.message
    });
  }
});

router.post('/privacy', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Data Privacy Compliance',
        description: 'Create new privacy compliance record',
        endpoint: 'POST /api/compliance/privacy',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createPrivacyComplianceSchema, req.body);
    const privacyNumber = generateRecordNumber('PRIV');

    const newRecord = new PrivacyCompliance({
      ...validatedData,
      privacyNumber
    });

    // Set response deadline for data subject requests (30 days for GDPR, 45 days for CCPA)
    if (newRecord.complianceType === 'Data Subject Request' && newRecord.dataSubjectRequest) {
      if (!newRecord.dataSubjectRequest.responseDeadline) {
        const days = newRecord.gdprCompliance ? 30 : 45;
        newRecord.dataSubjectRequest.responseDeadline = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      }
    }

    await newRecord.save();

    // Log the action
    await AuditLog.logUserAction({
      userId: null,
      username: validatedData.createdBy,
      eventType: 'Privacy Compliance Created',
      action: 'Create',
      actionCategory: 'Create',
      resourceType: 'PrivacyCompliance',
      resourceId: newRecord._id.toString(),
      description: `Created privacy compliance record: ${newRecord.title}`,
      complianceCategory: 'Data Privacy'
    });

    res.status(201).json({
      success: true,
      message: 'Privacy compliance record created successfully',
      data: newRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating privacy compliance record',
      error: error.message
    });
  }
});

// Sub-Feature 7: Professional Liability Management
router.get('/liability', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Professional Liability Management',
        description: 'Track insurance and claims',
        endpoint: '/api/compliance/liability',
        capabilities: [
          'Insurance tracking',
          'Claims management',
          'Coverage verification',
          'Policy renewals',
          'Incident reporting'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { recordType, status } = req.query;
    
    const query = {};
    if (recordType) query.recordType = recordType;
    if (status) query.status = status;
    
    const records = await LiabilityInsurance.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(100);

    // Get active policies
    const activePolicies = await LiabilityInsurance.findActivePolicies();

    // Get expiring policies
    const expiringPolicies = await LiabilityInsurance.findExpiringPolicies(60);

    // Get open claims
    const openClaims = await LiabilityInsurance.findOpenClaims();

    // Get claims analytics
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // Last year
    const claimsAnalytics = await LiabilityInsurance.getClaimsAnalytics(startDate, new Date());

    res.json({
      success: true,
      data: {
        records,
        activePolicies: activePolicies.slice(0, 10),
        expiringPolicies: expiringPolicies.slice(0, 10),
        openClaims: openClaims.slice(0, 10),
        claimsAnalytics,
        totalRecords: records.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving liability insurance records',
      error: error.message
    });
  }
});

router.post('/liability', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Professional Liability Management',
        description: 'Create new liability insurance record',
        endpoint: 'POST /api/compliance/liability',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(createLiabilityInsuranceSchema, req.body);
    const recordNumber = generateRecordNumber('LI');

    const newRecord = new LiabilityInsurance({
      ...validatedData,
      recordNumber
    });

    await newRecord.save();

    // Log the action
    await AuditLog.logUserAction({
      userId: null,
      username: validatedData.createdBy,
      eventType: 'Liability Insurance Record Created',
      action: 'Create',
      actionCategory: 'Create',
      resourceType: 'LiabilityInsurance',
      resourceId: newRecord._id.toString(),
      description: `Created liability insurance record: ${newRecord.recordType}`,
      severity: newRecord.recordType === 'Claim' ? 'High' : 'Medium'
    });

    res.status(201).json({
      success: true,
      message: 'Liability insurance record created successfully',
      data: newRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating liability insurance record',
      error: error.message
    });
  }
});

// Sub-Feature 8: Compliance Reporting
router.get('/reports', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Compliance Reporting',
        description: 'Generate compliance reports and attestations',
        endpoint: '/api/compliance/reports',
        capabilities: [
          'Compliance reports',
          'Attestations',
          'Certification tracking',
          'Audit documentation',
          'Regulatory filings'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Generate comprehensive compliance overview
    const ethicsRecords = await ComplianceRecord.countDocuments({ status: { $in: ['Active', 'Pending'] } });
    const riskAssessments = await RiskAssessment.countDocuments({ status: { $in: ['Open', 'Under Review'] } });
    const malpracticeChecks = await MalpracticeCheck.countDocuments({ status: { $nin: ['Resolved', 'Closed'] } });
    const regulatoryRecords = await RegulatoryCompliance.countDocuments({ status: { $nin: ['Compliant', 'Archived'] } });
    const privacyRecords = await PrivacyCompliance.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });
    const liabilityRecords = await LiabilityInsurance.countDocuments({ status: 'Active' });

    // Get critical items
    const highRisks = await RiskAssessment.findHighRisks();
    const criticalMalpractice = await MalpracticeCheck.findCriticalIssues();
    const overduePrivacy = await PrivacyCompliance.findOverdueRequests();

    res.json({
      success: true,
      data: {
        summary: {
          ethicsRecords,
          riskAssessments,
          malpracticeChecks,
          regulatoryRecords,
          privacyRecords,
          liabilityRecords
        },
        criticalItems: {
          highRisks: highRisks.slice(0, 5),
          criticalMalpractice: criticalMalpractice.slice(0, 5),
          overduePrivacy: overduePrivacy.slice(0, 5)
        },
        reportGeneratedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error generating compliance report',
      error: error.message
    });
  }
});

router.post('/reports', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Compliance Reporting',
        description: 'Generate custom compliance report',
        endpoint: 'POST /api/compliance/reports',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const validatedData = validateRequest(generateComplianceReportSchema, req.body);

    const startDate = validatedData.startDate ? new Date(validatedData.startDate) : null;
    const endDate = validatedData.endDate ? new Date(validatedData.endDate) : null;

    const report = {
      reportType: validatedData.reportType,
      generatedBy: validatedData.generatedBy,
      generatedAt: new Date(),
      dateRange: { startDate, endDate },
      data: {}
    };

    // Generate report based on type
    if (validatedData.reportType === 'Ethics Compliance' || validatedData.reportType === 'Comprehensive') {
      const query = {};
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = startDate;
        if (endDate) query.createdAt.$lte = endDate;
      }
      report.data.ethicsCompliance = await ComplianceRecord.find(query);
    }

    if (validatedData.reportType === 'Risk Assessment' || validatedData.reportType === 'Comprehensive') {
      report.data.riskAnalytics = await RiskAssessment.getRiskAnalytics(validatedData.filters || {});
    }

    if (validatedData.reportType === 'Privacy Compliance' || validatedData.reportType === 'Comprehensive') {
      report.data.privacyMetrics = await PrivacyCompliance.getComplianceMetrics(startDate, endDate);
    }

    if (validatedData.reportType === 'Liability Management' || validatedData.reportType === 'Comprehensive') {
      report.data.claimsAnalytics = await LiabilityInsurance.getClaimsAnalytics(startDate, endDate);
    }

    if (validatedData.reportType === 'Audit Trail' || validatedData.reportType === 'Comprehensive') {
      report.data.auditReport = await AuditLog.getAuditReport({}, startDate, endDate);
    }

    // Log the report generation
    await AuditLog.logUserAction({
      userId: null,
      username: validatedData.generatedBy,
      eventType: 'Compliance Report Generated',
      action: 'Generate',
      actionCategory: 'Create',
      resourceType: 'ComplianceReport',
      description: `Generated ${validatedData.reportType} report`,
      complianceCategory: 'Compliance'
    });

    res.json({
      success: true,
      message: 'Compliance report generated successfully',
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error generating compliance report',
      error: error.message
    });
  }
});

// Compliance overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Compliance & Risk Management',
    description: 'Comprehensive compliance and risk management system',
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
      ethics: {
        get: '/api/compliance/ethics',
        post: '/api/compliance/ethics'
      },
      riskAssessment: {
        get: '/api/compliance/risk-assessment',
        post: '/api/compliance/risk-assessment'
      },
      malpracticePrevention: {
        get: '/api/compliance/malpractice-prevention',
        post: '/api/compliance/malpractice-prevention'
      },
      regulatory: {
        get: '/api/compliance/regulatory',
        post: '/api/compliance/regulatory'
      },
      auditTrail: {
        get: '/api/compliance/audit-trail'
      },
      privacy: {
        get: '/api/compliance/privacy',
        post: '/api/compliance/privacy'
      },
      liability: {
        get: '/api/compliance/liability',
        post: '/api/compliance/liability'
      },
      reports: {
        get: '/api/compliance/reports',
        post: '/api/compliance/reports'
      }
    }
  });
});

module.exports = router;
