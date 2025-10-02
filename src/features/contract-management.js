/**
 * Feature 9: Contract Management
 * 8 Sub-Features: Contract Creation & Drafting, Contract Repository, Review Workflow,
 * Negotiation Tracking, Lifecycle Management, Renewal Management, Compliance Monitoring, Contract Analytics
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const ContractClause = require('../models/ContractClause');
const ContractNegotiation = require('../models/ContractNegotiation');
const ContractObligation = require('../models/ContractObligation');
const { isConnected } = require('../config/database');
const {
  createContractSchema,
  submitReviewSchema,
  approveContractSchema,
  createNegotiationSchema,
  respondNegotiationSchema,
  updateContractStatusSchema,
  updateLifecycleStageSchema,
  renewContractSchema,
  addObligationSchema,
  updateObligationStatusSchema,
  checkComplianceSchema,
  createClauseSchema,
  analyticsFiltersSchema,
  addAmendmentSchema,
  addRiskFactorSchema
} = require('../validators/contractValidators');

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Contract Creation & Drafting
router.post('/create', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Contract Creation & Drafting',
        description: 'Create contracts from templates',
        endpoint: '/api/contracts/create',
        capabilities: [
          'Template-based creation',
          'Clause library',
          'Custom drafting',
          'Smart fields',
          'Version drafting'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createContractSchema, req.body);

    // Create new contract
    const newContract = new Contract({
      ...validatedData,
      status: 'Draft',
      lifecycleStage: 'Pre-Execution',
      createdDate: new Date(),
      lastActivityDate: new Date(),
      lastActivityBy: validatedData.createdBy
    });

    // Add initial status to history
    newContract.statusHistory.push({
      status: 'Draft',
      changedBy: validatedData.createdBy,
      changedAt: new Date(),
      notes: 'Contract created'
    });

    // Save contract to database
    const savedContract = await newContract.save();

    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      data: {
        contractId: savedContract._id,
        contractNumber: savedContract.contractNumber,
        title: savedContract.title,
        status: savedContract.status,
        contractType: savedContract.contractType,
        effectiveDate: savedContract.effectiveDate,
        expirationDate: savedContract.expirationDate,
        createdDate: savedContract.createdDate
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 2: Contract Repository
router.get('/repository', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Contract Repository',
        description: 'Centralized contract storage',
        endpoint: '/api/contracts/repository',
        capabilities: [
          'Centralized storage',
          'Contract categorization',
          'Search and filter',
          'Metadata management',
          'Access control'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Extract query parameters for filtering
    const {
      status,
      contractType,
      practiceArea,
      assignedTo,
      partyName,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdDate',
      sortOrder = 'desc'
    } = req.query;

    // Build query filter
    const filter = { archived: false };
    
    if (status) filter.status = status;
    if (contractType) filter.contractType = contractType;
    if (practiceArea) filter.practiceArea = practiceArea;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (partyName) filter['parties.name'] = { $regex: partyName, $options: 'i' };
    
    if (startDate || endDate) {
      filter.createdDate = {};
      if (startDate) filter.createdDate.$gte = new Date(startDate);
      if (endDate) filter.createdDate.$lte = new Date(endDate);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { contractNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const contracts = await Contract.find(filter)
      .select('contractNumber title contractType status effectiveDate expirationDate parties contractValue assignedTo createdDate')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Contract.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        contracts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalContracts: totalCount,
          contractsPerPage: parseInt(limit)
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

// Sub-Feature 3: Contract Review Workflow
router.post('/:id/review', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Contract Review Workflow',
        description: 'Approval workflows and routing',
        endpoint: '/api/contracts/:id/review',
        capabilities: [
          'Approval workflows',
          'Review routing',
          'Stakeholder notifications',
          'Approval tracking',
          'Conditional approvals'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(submitReviewSchema, req.body);

    // Find contract
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Add reviewers to approvers list
    validatedData.assignedReviewers.forEach(reviewer => {
      contract.approvers.push({
        username: reviewer,
        role: validatedData.reviewType,
        status: 'Pending',
        reviewedAt: null,
        comments: ''
      });
    });

    // Update contract status
    await contract.updateStatus('Under Review', validatedData.submittedBy, 
      `Submitted for ${validatedData.reviewType}`);

    contract.approvalStatus = 'In Progress';
    await contract.save();

    res.status(200).json({
      success: true,
      message: 'Contract submitted for review successfully',
      data: {
        contractId: contract._id,
        contractNumber: contract.contractNumber,
        status: contract.status,
        approvalStatus: contract.approvalStatus,
        reviewers: validatedData.assignedReviewers,
        dueDate: validatedData.dueDate
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Approve or reject contract
router.post('/:id/approve', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(approveContractSchema, req.body);
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Find and update approver record
    const approver = contract.approvers.find(a => a.username === validatedData.approvedBy);
    if (approver) {
      approver.status = validatedData.decision;
      approver.reviewedAt = new Date();
      approver.comments = validatedData.comments || '';
      approver.conditions = validatedData.conditions || '';
    } else {
      contract.approvers.push({
        username: validatedData.approvedBy,
        status: validatedData.decision,
        reviewedAt: new Date(),
        comments: validatedData.comments || '',
        conditions: validatedData.conditions || ''
      });
    }

    // Determine overall approval status
    const allApproved = contract.approvers.every(a => a.status === 'Approved');
    const anyRejected = contract.approvers.some(a => a.status === 'Rejected');
    const anyConditional = contract.approvers.some(a => a.status === 'Conditional');

    if (allApproved) {
      contract.approvalStatus = 'Approved';
      await contract.updateStatus('Awaiting Signature', validatedData.approvedBy, 
        'All approvals received');
    } else if (anyRejected) {
      contract.approvalStatus = 'Rejected';
      await contract.updateStatus('Draft', validatedData.approvedBy, 
        'Contract rejected - requires revision');
    } else if (anyConditional) {
      contract.approvalStatus = 'Conditional';
    }

    await contract.save();

    res.status(200).json({
      success: true,
      message: `Contract ${validatedData.decision.toLowerCase()} successfully`,
      data: {
        contractId: contract._id,
        contractNumber: contract.contractNumber,
        decision: validatedData.decision,
        approvalStatus: contract.approvalStatus,
        status: contract.status
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 4: Contract Negotiation Tracking
router.post('/:id/negotiations', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Contract Negotiation Tracking',
        description: 'Track changes and negotiations',
        endpoint: '/api/contracts/:id/negotiations',
        capabilities: [
          'Redline tracking',
          'Negotiation history',
          'Comment management',
          'Change comparison',
          'Negotiation analytics'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createNegotiationSchema, req.body);

    // Find contract
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Increment negotiation round
    const roundNumber = contract.negotiationRounds + 1;
    contract.negotiationRounds = roundNumber;
    contract.negotiationStatus = 'In Progress';

    // Update contract status if not already in negotiation
    if (contract.status === 'Draft' || contract.status === 'Under Review') {
      await contract.updateStatus('In Negotiation', validatedData.proposedBy, 
        'Negotiation initiated');
    }

    await contract.save();

    // Create negotiation record
    const negotiation = new ContractNegotiation({
      contractId: contract._id,
      contractNumber: contract.contractNumber,
      roundNumber,
      ...validatedData,
      createdDate: new Date(),
      lastActivityDate: new Date(),
      lastActivityBy: validatedData.proposedBy
    });

    const savedNegotiation = await negotiation.save();

    res.status(201).json({
      success: true,
      message: 'Negotiation created successfully',
      data: {
        negotiationId: savedNegotiation._id,
        negotiationNumber: savedNegotiation.negotiationId,
        contractNumber: contract.contractNumber,
        roundNumber,
        subject: savedNegotiation.subject,
        status: savedNegotiation.status,
        proposedBy: savedNegotiation.proposedBy
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get negotiations for a contract
router.get('/:id/negotiations', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const negotiations = await ContractNegotiation.findByContract(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        contractId: req.params.id,
        totalNegotiations: negotiations.length,
        negotiations
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Respond to a negotiation
router.post('/negotiations/:negotiationId/respond', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(respondNegotiationSchema, req.body);
    const negotiation = await ContractNegotiation.findById(req.params.negotiationId);
    
    if (!negotiation) {
      return res.status(404).json({
        success: false,
        error: 'Negotiation not found'
      });
    }

    // Add counter proposal if provided
    if (validatedData.counterProposal) {
      negotiation.counterProposal = {
        ...validatedData.counterProposal,
        proposedBy: validatedData.respondedBy,
        proposedAt: new Date()
      };
    }

    // Respond to negotiation
    await negotiation.respond(
      validatedData.respondedBy,
      validatedData.responseText,
      validatedData.decision
    );

    res.status(200).json({
      success: true,
      message: 'Response submitted successfully',
      data: {
        negotiationId: negotiation._id,
        negotiationNumber: negotiation.negotiationId,
        decision: validatedData.decision,
        status: negotiation.status
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 5: Contract Lifecycle Management
router.get('/:id/lifecycle', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Contract Lifecycle Management',
        description: 'Manage from draft to execution',
        endpoint: '/api/contracts/:id/lifecycle',
        capabilities: [
          'Lifecycle stages',
          'Status tracking',
          'Milestone management',
          'Amendment tracking',
          'Termination workflow'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Find contract
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Get lifecycle information
    const lifecycle = {
      contractNumber: contract.contractNumber,
      title: contract.title,
      currentStatus: contract.status,
      lifecycleStage: contract.lifecycleStage,
      statusHistory: contract.statusHistory,
      amendments: contract.amendments,
      renewalHistory: contract.renewalHistory,
      timeline: {
        createdDate: contract.createdDate,
        effectiveDate: contract.effectiveDate,
        executionDate: contract.executionDate,
        expirationDate: contract.expirationDate,
        terminationDate: contract.terminationDate,
        daysUntilExpiration: contract.daysUntilExpiration,
        contractAge: contract.contractAge,
        isActive: contract.isActive
      },
      parties: contract.parties.map(p => ({
        name: p.name,
        partyType: p.partyType,
        signed: !!p.signedDate,
        signedDate: p.signedDate
      }))
    };

    res.status(200).json({
      success: true,
      data: lifecycle
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update contract lifecycle stage
router.put('/:id/lifecycle/stage', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(updateLifecycleStageSchema, req.body);
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    contract.lifecycleStage = validatedData.lifecycleStage;
    contract.lastModifiedBy = validatedData.updatedBy;
    contract.lastModifiedDate = new Date();
    contract.lastActivityDate = new Date();
    contract.lastActivityBy = validatedData.updatedBy;

    await contract.save();

    res.status(200).json({
      success: true,
      message: 'Lifecycle stage updated successfully',
      data: {
        contractId: contract._id,
        contractNumber: contract.contractNumber,
        lifecycleStage: contract.lifecycleStage
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add amendment to contract
router.post('/:id/amendments', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(addAmendmentSchema, req.body);
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    await contract.addAmendment(validatedData);

    res.status(201).json({
      success: true,
      message: 'Amendment added successfully',
      data: {
        contractId: contract._id,
        contractNumber: contract.contractNumber,
        amendmentNumber: contract.amendments.length,
        effectiveDate: validatedData.effectiveDate
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 6: Contract Renewal Management
router.get('/renewals', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Contract Renewal Management',
        description: 'Track renewals and expirations',
        endpoint: '/api/contracts/renewals',
        capabilities: [
          'Renewal tracking',
          'Expiration alerts',
          'Auto-renewal flags',
          'Renewal workflow',
          'Renewal history'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Get expiring contracts (default 90 days)
    const days = parseInt(req.query.days) || 90;
    const expiringContracts = await Contract.findExpiringSoon(days);

    // Get auto-renewal contracts
    const autoRenewalContracts = await Contract.find({
      autoRenewal: true,
      status: { $in: ['Active', 'Executed'] },
      archived: false
    }).select('contractNumber title expirationDate autoRenewal renewalStatus');

    // Get recently renewed contracts
    const recentlyRenewed = await Contract.find({
      status: 'Renewed',
      archived: false
    })
      .sort({ 'renewalHistory.renewedDate': -1 })
      .limit(10)
      .select('contractNumber title renewalHistory');

    res.status(200).json({
      success: true,
      data: {
        expiringSoon: {
          count: expiringContracts.length,
          contracts: expiringContracts.map(c => ({
            contractId: c._id,
            contractNumber: c.contractNumber,
            title: c.title,
            expirationDate: c.expirationDate,
            daysUntilExpiration: c.daysUntilExpiration,
            autoRenewal: c.autoRenewal,
            renewalStatus: c.renewalStatus
          }))
        },
        autoRenewal: {
          count: autoRenewalContracts.length,
          contracts: autoRenewalContracts
        },
        recentlyRenewed: {
          count: recentlyRenewed.length,
          contracts: recentlyRenewed
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

// Renew a contract
router.post('/:id/renew', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(renewContractSchema, req.body);
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Update contract value if provided
    if (validatedData.contractValue) {
      contract.contractValue = validatedData.contractValue;
    }

    // Update auto-renewal if provided
    if (validatedData.autoRenewal !== undefined) {
      contract.autoRenewal = validatedData.autoRenewal;
    }

    // Renew the contract
    await contract.renew(
      validatedData.newExpirationDate,
      validatedData.renewedBy,
      validatedData.terms
    );

    res.status(200).json({
      success: true,
      message: 'Contract renewed successfully',
      data: {
        contractId: contract._id,
        contractNumber: contract.contractNumber,
        previousExpirationDate: contract.renewalHistory[contract.renewalHistory.length - 1].previousExpirationDate,
        newExpirationDate: contract.expirationDate,
        renewalStatus: contract.renewalStatus
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 7: Contract Compliance Monitoring
router.get('/:id/compliance', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Contract Compliance Monitoring',
        description: 'Monitor obligations and deliverables',
        endpoint: '/api/contracts/:id/compliance',
        capabilities: [
          'Obligation tracking',
          'Deliverable monitoring',
          'Compliance alerts',
          'Performance metrics',
          'Breach detection'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Find contract
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Get all obligations for this contract
    const obligations = await ContractObligation.findByContract(req.params.id);

    // Calculate compliance metrics
    const totalObligations = obligations.length;
    const completedObligations = obligations.filter(o => o.status === 'Completed').length;
    const overdueObligations = obligations.filter(o => o.isOverdue).length;
    const pendingObligations = obligations.filter(o => o.status === 'Pending' || o.status === 'In Progress').length;
    const dueSoonObligations = obligations.filter(o => o.isDueSoon).length;

    // Check compliance
    await contract.checkCompliance();

    const complianceReport = {
      contractNumber: contract.contractNumber,
      title: contract.title,
      complianceStatus: contract.complianceStatus,
      lastComplianceCheck: contract.lastComplianceCheck,
      metrics: {
        totalObligations,
        completed: completedObligations,
        overdue: overdueObligations,
        pending: pendingObligations,
        dueSoon: dueSoonObligations,
        completionRate: totalObligations > 0 ? 
          ((completedObligations / totalObligations) * 100).toFixed(2) + '%' : '0%'
      },
      obligations: obligations.map(o => ({
        obligationId: o._id,
        obligationNumber: o.obligationId,
        title: o.title,
        obligationType: o.obligationType,
        status: o.status,
        dueDate: o.dueDate,
        daysUntilDue: o.daysUntilDue,
        isOverdue: o.isOverdue,
        responsibleParty: o.responsibleParty,
        priority: o.priority
      })),
      riskFactors: contract.riskFactors,
      alerts: contract.alerts.filter(a => a.alertType === 'Compliance' || a.alertType === 'Obligation Due')
    };

    res.status(200).json({
      success: true,
      data: complianceReport
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add obligation to contract
router.post('/:id/obligations', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(addObligationSchema, req.body);
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Create obligation
    const obligation = new ContractObligation({
      contractId: contract._id,
      contractNumber: contract.contractNumber,
      ...validatedData,
      createdDate: new Date(),
      lastActivityDate: new Date()
    });

    const savedObligation = await obligation.save();

    // Add to contract obligations array
    await contract.addObligation({
      obligationType: validatedData.obligationType,
      description: validatedData.description,
      responsibleParty: validatedData.responsibleParty,
      dueDate: validatedData.dueDate,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Obligation added successfully',
      data: {
        obligationId: savedObligation._id,
        obligationNumber: savedObligation.obligationId,
        contractNumber: contract.contractNumber,
        title: savedObligation.title,
        dueDate: savedObligation.dueDate
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update obligation status
router.put('/obligations/:obligationId/status', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(updateObligationStatusSchema, req.body);
    const obligation = await ContractObligation.findById(req.params.obligationId);
    
    if (!obligation) {
      return res.status(404).json({
        success: false,
        error: 'Obligation not found'
      });
    }

    // Update obligation status
    await obligation.updateStatus(
      validatedData.status,
      validatedData.updatedBy,
      validatedData.notes
    );

    // Update completion percentage if provided
    if (validatedData.completionPercentage !== undefined) {
      obligation.completionPercentage = validatedData.completionPercentage;
    }

    // Mark as complete with verification if provided
    if (validatedData.status === 'Completed' && validatedData.verifiedBy) {
      await obligation.markComplete(
        validatedData.updatedBy,
        validatedData.verifiedBy,
        validatedData.verificationNotes
      );
    }

    await obligation.save();

    // Update contract compliance
    const contract = await Contract.findById(obligation.contractId);
    if (contract) {
      await contract.checkCompliance();
    }

    res.status(200).json({
      success: true,
      message: 'Obligation status updated successfully',
      data: {
        obligationId: obligation._id,
        obligationNumber: obligation.obligationId,
        status: obligation.status,
        completionPercentage: obligation.completionPercentage
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 8: Contract Analytics
router.get('/analytics', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Contract Analytics',
        description: 'Contract value analysis and risk assessment',
        endpoint: '/api/contracts/analytics',
        capabilities: [
          'Value analysis',
          'Risk assessment',
          'Contract metrics',
          'Cycle time analysis',
          'Vendor performance'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate filters
    const filters = req.query;
    const validatedFilters = filters.startDate || filters.endDate ? 
      validateRequest(analyticsFiltersSchema, filters) : {};

    // Build filter query
    const matchFilter = { archived: validatedFilters.includeArchived || false };
    
    if (validatedFilters.startDate || validatedFilters.endDate) {
      matchFilter.createdDate = {};
      if (validatedFilters.startDate) matchFilter.createdDate.$gte = new Date(validatedFilters.startDate);
      if (validatedFilters.endDate) matchFilter.createdDate.$lte = new Date(validatedFilters.endDate);
    }

    // Get analytics by status
    const statusAnalytics = await Contract.getAnalytics(matchFilter);

    // Get contracts by type
    const typeAnalytics = await Contract.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$contractType',
          count: { $sum: 1 },
          totalValue: { $sum: '$contractValue.amount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get risk distribution
    const riskAnalytics = await Contract.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get lifecycle analytics
    const lifecycleAnalytics = await Contract.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$lifecycleStage',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get expiring contracts count
    const expiringCount = await Contract.findExpiringSoon(30);

    // Get compliance metrics
    const complianceMetrics = await Contract.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$complianceStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get negotiation analytics
    const negotiationMetrics = await Contract.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalNegotiations: { $sum: '$negotiationRounds' },
          avgNegotiationRounds: { $avg: '$negotiationRounds' },
          inNegotiation: {
            $sum: { $cond: [{ $eq: ['$negotiationStatus', 'In Progress'] }, 1, 0] }
          }
        }
      }
    ]);

    // Calculate average contract value
    const valueMetrics = await Contract.aggregate([
      { $match: { ...matchFilter, 'contractValue.amount': { $exists: true } } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$contractValue.amount' },
          avgValue: { $avg: '$contractValue.amount' },
          minValue: { $min: '$contractValue.amount' },
          maxValue: { $max: '$contractValue.amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get renewal analytics
    const renewalMetrics = await Contract.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          autoRenewalCount: {
            $sum: { $cond: ['$autoRenewal', 1, 0] }
          },
          renewedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Renewed'] }, 1, 0] }
          },
          totalRenewals: { $sum: { $size: { $ifNull: ['$renewalHistory', []] } } }
        }
      }
    ]);

    // Get party analytics (top parties)
    const partyAnalytics = await Contract.aggregate([
      { $match: matchFilter },
      { $unwind: '$parties' },
      {
        $group: {
          _id: '$parties.name',
          contractCount: { $sum: 1 },
          partyType: { $first: '$parties.partyType' }
        }
      },
      { $sort: { contractCount: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalContracts: await Contract.countDocuments(matchFilter),
          activeContracts: await Contract.countDocuments({ ...matchFilter, status: { $in: ['Active', 'Executed'] } }),
          expiringIn30Days: expiringCount.length,
          inNegotiation: await Contract.countDocuments({ ...matchFilter, negotiationStatus: 'In Progress' })
        },
        byStatus: statusAnalytics,
        byType: typeAnalytics,
        byRisk: riskAnalytics,
        byLifecycleStage: lifecycleAnalytics,
        complianceMetrics,
        negotiationMetrics: negotiationMetrics[0] || {
          totalNegotiations: 0,
          avgNegotiationRounds: 0,
          inNegotiation: 0
        },
        valueMetrics: valueMetrics[0] || {
          totalValue: 0,
          avgValue: 0,
          minValue: 0,
          maxValue: 0,
          count: 0
        },
        renewalMetrics: renewalMetrics[0] || {
          autoRenewalCount: 0,
          renewedCount: 0,
          totalRenewals: 0
        },
        topParties: partyAnalytics
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clause library management
router.post('/clauses/create', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(createClauseSchema, req.body);

    const clause = new ContractClause({
      ...validatedData,
      createdDate: new Date()
    });

    const savedClause = await clause.save();

    res.status(201).json({
      success: true,
      message: 'Clause created successfully',
      data: {
        clauseId: savedClause._id,
        clauseNumber: savedClause.clauseId,
        title: savedClause.title,
        category: savedClause.category,
        status: savedClause.status
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get clauses from library
router.get('/clauses', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { category, practiceArea, status = 'Approved' } = req.query;
    const filter = { status, isLatestVersion: true };
    
    if (category) filter.category = category;
    if (practiceArea) filter.practiceArea = practiceArea;

    const clauses = await ContractClause.find(filter)
      .sort({ popularity: -1, usageCount: -1 })
      .select('clauseId title category practiceArea usageCount popularity');

    res.status(200).json({
      success: true,
      data: {
        count: clauses.length,
        clauses
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single contract by ID
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contract
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update contract status
router.put('/:id/status', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(updateContractStatusSchema, req.body);
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    await contract.updateStatus(
      validatedData.status,
      validatedData.updatedBy,
      validatedData.notes
    );

    res.status(200).json({
      success: true,
      message: 'Contract status updated successfully',
      data: {
        contractId: contract._id,
        contractNumber: contract.contractNumber,
        status: contract.status
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add risk factor to contract
router.post('/:id/risks', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const validatedData = validateRequest(addRiskFactorSchema, req.body);
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    contract.riskFactors.push({
      ...validatedData,
      identifiedDate: new Date()
    });

    // Update contract risk level if this is higher
    if (validatedData.severity === 'Critical' || 
        (validatedData.severity === 'High' && contract.riskLevel !== 'Critical')) {
      contract.riskLevel = validatedData.severity;
    }

    await contract.save();

    res.status(201).json({
      success: true,
      message: 'Risk factor added successfully',
      data: {
        contractId: contract._id,
        contractNumber: contract.contractNumber,
        riskLevel: contract.riskLevel,
        riskFactorCount: contract.riskFactors.length
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Contract overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Contract Management',
    description: 'Complete contract lifecycle management system',
    implementation: 'Full business logic with MongoDB integration',
    subFeatures: [
      'Contract Creation & Drafting',
      'Contract Repository',
      'Contract Review Workflow',
      'Contract Negotiation Tracking',
      'Contract Lifecycle Management',
      'Contract Renewal Management',
      'Contract Compliance Monitoring',
      'Contract Analytics'
    ],
    models: [
      'Contract - Main contract entity',
      'ContractClause - Reusable clause library',
      'ContractNegotiation - Negotiation tracking',
      'ContractObligation - Obligation and compliance monitoring'
    ],
    capabilities: {
      creation: 'Template-based contract creation with clause library',
      repository: 'Centralized storage with advanced search and filtering',
      review: 'Multi-stage approval workflows with conditional approvals',
      negotiation: 'Redline tracking with change comparison and history',
      lifecycle: 'Complete lifecycle management from draft to termination',
      renewal: 'Automated renewal tracking with expiration alerts',
      compliance: 'Obligation tracking with compliance monitoring',
      analytics: 'Comprehensive analytics and reporting'
    }
  });
});

module.exports = router;
