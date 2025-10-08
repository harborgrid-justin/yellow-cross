/**
 * Feature 9: Contract Management
 * 8 Sub-Features: Contract Creation & Drafting, Contract Repository, Review Workflow,
 * Negotiation Tracking, Lifecycle Management, Renewal Management, Compliance Monitoring, Contract Analytics
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

import express from 'express';
const router = express.Router();
import Contract from '../models/Contract';
import { isConnected } from '../config/database';
import {
  createContractSchema,
  updateContractSchema,
  addVersionSchema,
  addNegotiationSchema,
  approveContractSchema,
  addObligationSchema,
  addSignatureSchema
} from '../validators/contractValidators';

// Helper function to generate contract number
const generateContractNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CTR-${year}-${random}`;
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
    const { error, value: validatedData } = createContractSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    validatedData.contractNumber = generateContractNumber();

    // Create initial version
    validatedData.versions = [{
      versionNumber: '1.0',
      createdDate: new Date(),
      createdBy: validatedData.createdBy,
      changes: 'Initial draft',
      isCurrent: true
    }];
    validatedData.currentVersion = '1.0';

    // Create contract
    const contract = new Contract(validatedData);
    await contract.save();

    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      data: {
        contract,
        contractNumber: contract.contractNumber,
        contractId: contract._id
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
      return res.json({
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

    const { status, contractType, partyName, expiring, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (contractType) query.contractType = contractType;
    if (partyName) query['parties.name'] = new RegExp(partyName, 'i');

    let contracts;
    if (expiring) {
      const days = parseInt(expiring) || 30;
      contracts = await Contract.findExpiringSoon(days);
    } else {
      contracts = await Contract.find(query)
        .sort({ effectiveDate: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }

    const total = await Contract.countDocuments(query);

    res.json({
      success: true,
      data: {
        contracts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get single contract
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

    res.json({
      success: true,
      data: { contract }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update contract
router.put('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { error, value: validatedData } = updateContractSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    res.json({
      success: true,
      message: 'Contract updated successfully',
      data: { contract }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 3: Contract Review Workflow
router.post('/:id/review', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({
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

    const { error, value: validatedData } = approveContractSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    await contract.approve(
      validatedData.userId,
      validatedData.userName,
      validatedData.comments
    );

    res.json({
      success: true,
      message: 'Contract reviewed successfully',
      data: { contract }
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
    if (!isConnected()) {
      return res.json({
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

    const { error, value: validatedData } = addNegotiationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    await contract.addNegotiation(validatedData);

    res.json({
      success: true,
      message: 'Negotiation recorded successfully',
      data: { contract }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add version to contract
router.post('/:id/versions', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Add Contract Version', message: 'Database not connected' });
    }

    const { error, value: validatedData } = addVersionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Add new version
    if (!contract.versions) {
      contract.versions = [];
    }

    const versionNumber = contract.versions.length + 1;
    contract.versions.push({
      versionNumber,
      changes: validatedData.changes,
      documentUrl: validatedData.documentUrl || '',
      createdBy: validatedData.createdBy,
      createdAt: new Date()
    });

    await contract.save();

    res.json({
      success: true,
      message: 'Contract version added successfully',
      data: contract.versions[contract.versions.length - 1]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add obligation to contract
router.post('/:id/obligations', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Add Contract Obligation', message: 'Database not connected' });
    }

    const { error, value: validatedData } = addObligationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Add obligation
    if (!contract.obligations) {
      contract.obligations = [];
    }

    contract.obligations.push({
      obligationType: validatedData.obligationType,
      description: validatedData.description,
      responsibleParty: validatedData.responsibleParty,
      dueDate: validatedData.dueDate,
      status: validatedData.status || 'Not Started',
      createdAt: new Date()
    });

    await contract.save();

    res.json({
      success: true,
      message: 'Contract obligation added successfully',
      data: contract.obligations[contract.obligations.length - 1]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add signature to contract
router.post('/:id/signatures', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.json({ feature: 'Add Contract Signature', message: 'Database not connected' });
    }

    const { error, value: validatedData } = addSignatureSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Add signature
    if (!contract.signatures) {
      contract.signatures = [];
    }

    contract.signatures.push({
      signerName: validatedData.signerName,
      signerRole: validatedData.signerRole || '',
      signerEmail: validatedData.signerEmail,
      signatureMethod: validatedData.signatureMethod,
      signatureUrl: validatedData.signatureUrl || '',
      signedAt: new Date(),
      ipAddress: validatedData.ipAddress || ''
    });

    // Update contract status if all parties have signed
    const allPartiesSigned = contract.parties.every(party => 
      contract.signatures.some(sig => sig.signerName === party.name)
    );
    
    if (allPartiesSigned && contract.status === 'Pending Signature') {
      contract.status = 'Active';
    }

    await contract.save();

    res.json({
      success: true,
      message: 'Contract signature added successfully',
      data: contract.signatures[contract.signatures.length - 1]
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
    if (!isConnected()) {
      return res.json({
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

    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    // Calculate lifecycle metrics
    const daysUntilExpiration = contract.daysUntilExpiration;
    const isExpiringSoon = contract.isExpiringSoon;
    const isExpired = contract.isExpired;

    res.json({
      success: true,
      data: {
        contract,
        lifecycle: {
          status: contract.status,
          effectiveDate: contract.effectiveDate,
          expirationDate: contract.expirationDate,
          daysUntilExpiration,
          isExpiringSoon,
          isExpired,
          currentStage: contract.workflow ? contract.workflow.currentStage : 'Drafting',
          versions: contract.versions.length,
          currentVersion: contract.currentVersion
        }
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
    if (!isConnected()) {
      return res.json({
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

    const days = parseInt(req.query.days) || 30;
    const expiring = await Contract.findExpiringSoon(days);

    // Group by auto-renew status
    const autoRenew = expiring.filter(c => c.renewal && c.renewal.autoRenew);
    const manualRenew = expiring.filter(c => !c.renewal || !c.renewal.autoRenew);

    res.json({
      success: true,
      data: {
        expiringSoon: expiring,
        total: expiring.length,
        autoRenew: autoRenew.length,
        manualRenew: manualRenew.length,
        days
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
    if (!isConnected()) {
      return res.json({
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

    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    const obligations = contract.obligations || [];
    const completed = obligations.filter(o => o.status === 'Completed').length;
    const overdue = obligations.filter(o => 
      o.status !== 'Completed' && o.dueDate < new Date()
    ).length;
    const inProgress = obligations.filter(o => o.status === 'In Progress').length;

    res.json({
      success: true,
      data: {
        obligations,
        summary: {
          total: obligations.length,
          completed,
          overdue,
          inProgress,
          complianceRate: obligations.length > 0 
            ? Math.round((completed / obligations.length) * 100) 
            : 100
        },
        riskLevel: contract.compliance ? contract.compliance.riskLevel : 'Medium'
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
    if (!isConnected()) {
      return res.json({
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

    const totalContracts = await Contract.countDocuments();
    const activeContracts = await Contract.countDocuments({ status: 'Active' });
    
    // Value analysis
    const valueAnalysis = await Contract.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$financialTerms.value' },
          avgValue: { $avg: '$financialTerms.value' }
        }
      }
    ]);

    // By type
    const byType = await Contract.aggregate([
      { $group: { _id: '$contractType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Risk levels
    const riskLevels = await Contract.aggregate([
      { $group: { _id: '$compliance.riskLevel', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          total: totalContracts,
          active: activeContracts,
          totalValue: valueAnalysis[0]?.totalValue || 0,
          avgValue: valueAnalysis[0]?.avgValue || 0
        },
        byType,
        riskLevels,
        timestamp: new Date()
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
    subFeatures: [
      'Contract Creation & Drafting',
      'Contract Repository',
      'Contract Review Workflow',
      'Contract Negotiation Tracking',
      'Contract Lifecycle Management',
      'Contract Renewal Management',
      'Contract Compliance Monitoring',
      'Contract Analytics'
    ]
  });
});

export default router;
