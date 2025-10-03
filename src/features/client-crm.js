/**
 * Feature 2: Client Relationship Management (CRM)
 * 8 Sub-Features: Database Management, Communication History, Portal Access,
 * Intake & Onboarding, Billing Information, Conflict Checking, Retention & Feedback, Analytics
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const ClientCommunication = require('../models/ClientCommunication');
const ClientBilling = require('../models/ClientBilling');
const ClientFeedback = require('../models/ClientFeedback');
const ClientConflict = require('../models/ClientConflict');
const { isConnected } = require('../config/database');
const {
  createClientSchema,
  clientIntakeSchema,
  logCommunicationSchema,
  updateBillingSchema,
  conflictCheckSchema,
  submitFeedbackSchema,
  portalAccessSchema,
  updateClientSchema
} = require('../validators/clientValidators');

// Helper function to generate client number
const generateClientNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CLT-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Client Database Management - List Clients with Advanced Search
router.get('/database', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Database Management',
        description: 'Comprehensive client database with custom fields and search',
        endpoint: '/api/clients/database',
        capabilities: [
          'Complete client profiles',
          'Custom fields',
          'Advanced search',
          'Client categorization',
          'Data import/export'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.clientType) {
      filter.clientType = req.query.clientType;
    }
    
    if (req.query.clientCategory) {
      filter.clientCategory = req.query.clientCategory;
    }
    
    if (req.query.primaryAttorney) {
      filter.primaryAttorney = req.query.primaryAttorney;
    }
    
    // Text search
    if (req.query.search) {
      filter.$or = [
        { clientNumber: { $regex: req.query.search, $options: 'i' } },
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-customFields'); // Exclude custom fields for list view

    const totalClients = await Client.countDocuments(filter);
    const totalPages = Math.ceil(totalClients / limit);

    res.json({
      success: true,
      data: {
        clients,
        pagination: {
          currentPage: page,
          totalPages,
          totalClients,
          clientsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
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

// Create new client
router.post('/database', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    // Validate input
    const validatedData = validateRequest(createClientSchema, req.body);

    // Generate client number
    const clientNumber = generateClientNumber();

    // Create new client
    const newClient = new Client({
      ...validatedData,
      clientNumber,
      status: 'Prospective',
      intakeDate: new Date()
    });

    await newClient.save();

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: {
        client: newClient,
        clientNumber: newClient.clientNumber,
        clientId: newClient._id
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get single client details
router.get('/database/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update client
router.put('/database/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    // Validate input
    const validatedData = validateRequest(updateClientSchema, req.body);
    const { updatedBy, ...updateFields } = validatedData;

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Track status change if status is being updated
    if (updateFields.status && updateFields.status !== client.status) {
      client.updateStatus(updateFields.status, updatedBy, 'Status updated via API');
    }

    // Update other fields
    Object.assign(client, updateFields);
    client.lastModifiedBy = updatedBy;

    await client.save();

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 2: Client Communication History - Get Communications
router.get('/:id/communications', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Communication History',
        description: 'Track all client interactions, emails, and calls',
        endpoint: '/api/clients/:id/communications',
        capabilities: [
          'Email tracking',
          'Call logs',
          'Meeting notes',
          'Communication timeline',
          'Interaction analysis'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { clientId: req.params.id };
    
    if (req.query.type) {
      filter.communicationType = req.query.type;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Get communications
    const communications = await ClientCommunication.find(filter)
      .sort({ communicationDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalCommunications = await ClientCommunication.countDocuments(filter);
    
    // Calculate summary statistics
    const stats = await ClientCommunication.aggregate([
      { $match: { clientId: client._id } },
      {
        $group: {
          _id: '$communicationType',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        client: {
          id: client._id,
          name: client.fullName,
          clientNumber: client.clientNumber
        },
        communications,
        statistics: {
          total: totalCommunications,
          byType: stats,
          lastContact: client.lastContactDate
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCommunications / limit),
          totalCommunications
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

// Log new communication
router.post('/:id/communications', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Validate input
    const validatedData = validateRequest(logCommunicationSchema, {
      ...req.body,
      clientId: req.params.id
    });

    // Create new communication record
    const communication = new ClientCommunication({
      ...validatedData,
      clientNumber: client.clientNumber
    });

    await communication.save();

    // Update client's last contact date
    client.updateLastContact();
    await client.save();

    res.status(201).json({
      success: true,
      message: 'Communication logged successfully',
      data: communication
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 3: Client Portal Access - Manage Portal Access
router.post('/:id/portal', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Portal Access',
        description: 'Secure client portal for case access and updates',
        endpoint: '/api/clients/:id/portal',
        capabilities: [
          'Secure login',
          'Case document access',
          'Real-time updates',
          'Secure messaging',
          'Invoice viewing'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Validate input
    const validatedData = validateRequest(portalAccessSchema, {
      ...req.body,
      clientId: req.params.id
    });

    const { action, email, sendInvitation, updatedBy } = validatedData;

    switch (action) {
      case 'enable':
        client.portalAccess.enabled = true;
        client.portalAccess.credentialsSetup = false;
        if (email) {
          client.email = email;
        }
        break;
        
      case 'disable':
        client.portalAccess.enabled = false;
        break;
        
      case 'reset':
        client.portalAccess.credentialsSetup = false;
        break;
        
      case 'update':
        if (email) {
          client.email = email;
        }
        break;
    }

    client.lastModifiedBy = updatedBy;
    await client.save();

    res.json({
      success: true,
      message: `Portal access ${action}d successfully`,
      data: {
        clientId: client._id,
        clientNumber: client.clientNumber,
        portalAccess: client.portalAccess,
        invitationSent: action === 'enable' && sendInvitation
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get portal access status
router.get('/:id/portal', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: {
        clientId: client._id,
        clientNumber: client.clientNumber,
        email: client.email,
        portalAccess: client.portalAccess
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 4: Client Intake & Onboarding - Process New Client Intake
router.post('/intake', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Intake & Onboarding',
        description: 'New client onboarding workflows and intake forms',
        endpoint: '/api/clients/intake',
        capabilities: [
          'Digital intake forms',
          'Automated workflows',
          'Document collection',
          'Identity verification',
          'Engagement letters'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(clientIntakeSchema, req.body);

    // Generate client number
    const clientNumber = generateClientNumber();

    // Create new client with intake data
    const newClient = new Client({
      clientNumber,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      clientType: validatedData.clientType,
      referralSource: validatedData.referralSource,
      referredBy: validatedData.referredBy,
      status: 'Prospective',
      intakeDate: new Date(),
      firstContactDate: new Date(),
      createdBy: validatedData.createdBy,
      notes: `Initial Matter: ${validatedData.matterType}\n${validatedData.matterDescription}`
    });

    // Store intake form data in custom fields
    if (validatedData.intakeFormData) {
      newClient.customFields = new Map(Object.entries(validatedData.intakeFormData));
    }

    await newClient.save();

    // Perform initial conflict check
    const conflictCheck = new ClientConflict({
      clientId: newClient._id,
      clientNumber: newClient.clientNumber,
      checkType: 'Initial Intake',
      checkDate: new Date(),
      relatedParties: [],
      conflictStatus: 'Under Review',
      performedBy: validatedData.createdBy,
      notes: 'Automatic conflict check during intake'
    });

    await conflictCheck.save();

    // Log initial communication
    const initialCommunication = new ClientCommunication({
      clientId: newClient._id,
      clientNumber: newClient.clientNumber,
      communicationType: 'Meeting',
      direction: 'Inbound',
      subject: 'Initial Consultation',
      description: validatedData.matterDescription,
      communicationDate: new Date(),
      initiatedBy: validatedData.createdBy,
      category: 'Consultation',
      priority: 'High',
      createdBy: validatedData.createdBy
    });

    await initialCommunication.save();

    res.status(201).json({
      success: true,
      message: 'Client intake completed successfully',
      data: {
        client: newClient,
        clientNumber: newClient.clientNumber,
        clientId: newClient._id,
        conflictCheckId: conflictCheck._id,
        nextSteps: [
          'Complete conflict check',
          'Send engagement letter',
          'Schedule onboarding meeting',
          'Collect required documents'
        ]
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 5: Client Billing Information - Get Billing Info
router.get('/:id/billing', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Billing Information',
        description: 'Payment methods, billing preferences, and credit status',
        endpoint: '/api/clients/:id/billing',
        capabilities: [
          'Payment methods',
          'Billing preferences',
          'Credit status',
          'Payment history',
          'Auto-billing setup'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Get billing information
    const billingInfo = await ClientBilling.findOne({ clientId: req.params.id });

    res.json({
      success: true,
      data: {
        client: {
          id: client._id,
          name: client.fullName,
          clientNumber: client.clientNumber
        },
        billingPreferences: client.billingPreferences,
        billingDetails: billingInfo || null,
        metrics: {
          totalRevenue: client.metrics.totalRevenue,
          outstandingBalance: client.metrics.outstandingBalance,
          creditStatus: client.billingPreferences.creditStatus
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

// Update billing information
router.post('/:id/billing', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Validate input
    const validatedData = validateRequest(updateBillingSchema, {
      ...req.body,
      clientId: req.params.id
    });

    const { updatedBy, ...billingData } = validatedData;

    // Update or create billing record
    let billingInfo = await ClientBilling.findOne({ clientId: req.params.id });

    if (!billingInfo) {
      billingInfo = new ClientBilling({
        clientId: req.params.id,
        clientNumber: client.clientNumber,
        ...billingData,
        createdBy: updatedBy
      });
    } else {
      Object.assign(billingInfo, billingData);
      billingInfo.lastModifiedBy = updatedBy;
    }

    await billingInfo.save();

    // Update client billing preferences
    if (billingData.paymentMethod || billingData.billingCycle) {
      if (billingData.paymentMethod) {
        client.billingPreferences.paymentMethod = billingData.paymentMethod.type;
      }
      if (billingData.billingCycle) {
        client.billingPreferences.billingCycle = billingData.billingCycle;
      }
      if (billingData.creditLimit !== undefined) {
        client.billingPreferences.creditLimit = billingData.creditLimit;
      }
      
      client.lastModifiedBy = updatedBy;
      await client.save();
    }

    res.json({
      success: true,
      message: 'Billing information updated successfully',
      data: billingInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 6: Client Conflict Checking - Run Conflict Check
router.post('/:id/conflict-check', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Conflict Checking',
        description: 'Automated conflict of interest checks',
        endpoint: '/api/clients/:id/conflict-check',
        capabilities: [
          'Automated conflict detection',
          'Related party search',
          'Historical conflict review',
          'Ethics compliance',
          'Conflict resolution workflow'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Validate input
    const validatedData = validateRequest(conflictCheckSchema, {
      ...req.body,
      clientId: req.params.id
    });

    // Perform automated conflict search
    const potentialMatches = [];
    
    // Search for conflicts based on related parties
    for (const party of validatedData.relatedParties) {
      const matches = await Client.find({
        $or: [
          { firstName: { $regex: party.name, $options: 'i' } },
          { lastName: { $regex: party.name, $options: 'i' } },
          { fullName: { $regex: party.name, $options: 'i' } }
        ],
        _id: { $ne: client._id } // Exclude current client
      }).limit(10);

      matches.forEach(match => {
        potentialMatches.push({
          clientId: match._id,
          clientName: match.fullName,
          matchScore: 0.8, // Simplified score
          matchReason: `Potential match with related party: ${party.name}`
        });
      });
    }

    // Create conflict check record
    const conflictCheck = new ClientConflict({
      clientId: req.params.id,
      clientNumber: client.clientNumber,
      checkType: validatedData.checkType,
      checkDate: new Date(),
      relatedParties: validatedData.relatedParties,
      opposingParties: validatedData.opposingParties || [],
      conflictStatus: potentialMatches.length > 0 ? 'Potential Conflict' : 'Clear',
      automatedCheck: {
        performed: true,
        algorithm: 'Name Matching v1.0',
        matchScore: potentialMatches.length > 0 ? 0.8 : 0,
        potentialMatches
      },
      relatedMatterId: validatedData.relatedMatterId,
      matterDescription: validatedData.matterDescription,
      performedBy: validatedData.performedBy,
      notes: validatedData.notes,
      status: 'Open'
    });

    await conflictCheck.save();

    // Update client conflict check status
    client.conflictCheckStatus = {
      status: conflictCheck.conflictStatus,
      lastCheckedDate: new Date(),
      checkedBy: validatedData.performedBy
    };
    await client.save();

    res.status(201).json({
      success: true,
      message: 'Conflict check completed',
      data: {
        conflictCheck,
        summary: {
          status: conflictCheck.conflictStatus,
          potentialConflicts: potentialMatches.length,
          requiresReview: potentialMatches.length > 0,
          nextSteps: potentialMatches.length > 0 
            ? ['Manual review required', 'Contact ethics committee', 'Document review']
            : ['No conflicts detected', 'Proceed with engagement']
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

// Get conflict check history
router.get('/:id/conflict-check', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    const conflictChecks = await ClientConflict.find({ clientId: req.params.id })
      .sort({ checkDate: -1 });

    res.json({
      success: true,
      data: {
        client: {
          id: client._id,
          name: client.fullName,
          clientNumber: client.clientNumber
        },
        currentStatus: client.conflictCheckStatus,
        conflictChecks,
        summary: {
          totalChecks: conflictChecks.length,
          lastCheck: conflictChecks[0]?.checkDate,
          conflictsFound: conflictChecks.filter(c => c.conflictStatus === 'Confirmed Conflict').length
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

// Sub-Feature 7: Client Retention & Feedback - Submit Feedback
router.post('/:id/feedback', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Retention & Feedback',
        description: 'Client satisfaction surveys and retention tracking',
        endpoint: '/api/clients/:id/feedback',
        capabilities: [
          'Satisfaction surveys',
          'NPS scoring',
          'Feedback analysis',
          'Retention metrics',
          'Client loyalty programs'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Validate input
    const validatedData = validateRequest(submitFeedbackSchema, {
      ...req.body,
      clientId: req.params.id
    });

    // Create feedback record
    const feedback = new ClientFeedback({
      ...validatedData,
      clientNumber: client.clientNumber,
      surveyDate: new Date(),
      status: 'Completed'
    });

    await feedback.save();

    // Update client metrics
    if (feedback.overallSatisfaction) {
      client.metrics.satisfactionScore = feedback.overallSatisfaction;
    }
    
    if (feedback.npsScore !== undefined) {
      client.metrics.npsScore = (feedback.npsScore - 5) * 20; // Convert 0-10 to -100 to 100
    }

    await client.save();

    // Determine if follow-up is needed
    const requiresFollowUp = 
      feedback.npsScore < 7 || 
      feedback.overallSatisfaction < 6 ||
      feedback.feedbackType === 'Complaint';

    if (requiresFollowUp) {
      feedback.requiresFollowUp = true;
      feedback.followUpStatus = 'Pending';
      await feedback.save();
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        feedback,
        summary: {
          npsCategory: feedback.npsCategory,
          requiresFollowUp,
          actionItems: requiresFollowUp 
            ? ['Schedule follow-up call', 'Review client concerns', 'Escalate to management']
            : ['No action required', 'Send thank you note']
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

// Get feedback history
router.get('/:id/feedback', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    const feedbacks = await ClientFeedback.find({ clientId: req.params.id })
      .sort({ surveyDate: -1 });

    // Calculate aggregate metrics
    const totalFeedbacks = feedbacks.length;
    const avgSatisfaction = totalFeedbacks > 0
      ? feedbacks.reduce((sum, f) => sum + (f.overallSatisfaction || 0), 0) / totalFeedbacks
      : 0;

    const npsBreakdown = {
      promoters: feedbacks.filter(f => f.npsCategory === 'Promoter').length,
      passives: feedbacks.filter(f => f.npsCategory === 'Passive').length,
      detractors: feedbacks.filter(f => f.npsCategory === 'Detractor').length
    };

    res.json({
      success: true,
      data: {
        client: {
          id: client._id,
          name: client.fullName,
          clientNumber: client.clientNumber
        },
        feedbacks,
        metrics: {
          totalFeedbacks,
          averageSatisfaction: avgSatisfaction.toFixed(2),
          npsScore: client.metrics.npsScore,
          npsBreakdown,
          latestFeedback: feedbacks[0]?.surveyDate
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

// Sub-Feature 8: Client Relationship Analytics - Get Analytics
router.get('/analytics', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Relationship Analytics',
        description: 'Client lifetime value and engagement metrics',
        endpoint: '/api/clients/analytics',
        capabilities: [
          'Client lifetime value',
          'Engagement metrics',
          'Revenue per client',
          'Client acquisition cost',
          'Churn analysis'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Overall client statistics
    const totalClients = await Client.countDocuments();
    const activeClients = await Client.countDocuments({ status: 'Active' });
    const prospectiveClients = await Client.countDocuments({ status: 'Prospective' });
    const formerClients = await Client.countDocuments({ status: 'Former' });

    // Revenue metrics
    const revenueStats = await Client.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$metrics.totalRevenue' },
          totalOutstanding: { $sum: '$metrics.outstandingBalance' },
          avgLifetimeValue: { $avg: '$metrics.lifetimeValue' },
          avgRevenue: { $avg: '$metrics.totalRevenue' }
        }
      }
    ]);

    // Client type distribution
    const clientsByType = await Client.aggregate([
      {
        $group: {
          _id: '$clientType',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$metrics.totalRevenue' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Client category distribution
    const clientsByCategory = await Client.aggregate([
      {
        $group: {
          _id: '$clientCategory',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$metrics.totalRevenue' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // NPS metrics
    const npsStats = await Client.aggregate([
      {
        $match: { 'metrics.npsScore': { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: null,
          avgNPS: { $avg: '$metrics.npsScore' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Satisfaction metrics
    const satisfactionStats = await Client.aggregate([
      {
        $match: { 'metrics.satisfactionScore': { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: null,
          avgSatisfaction: { $avg: '$metrics.satisfactionScore' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Communication activity
    const communicationStats = await ClientCommunication.aggregate([
      {
        $group: {
          _id: '$communicationType',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recent client growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newClients30Days = await Client.countDocuments({
      intakeDate: { $gte: thirtyDaysAgo }
    });

    // Churn analysis
    const churnRate = totalClients > 0 
      ? ((formerClients / totalClients) * 100).toFixed(2)
      : 0;

    // Top clients by revenue
    const topClients = await Client.find()
      .sort({ 'metrics.totalRevenue': -1 })
      .limit(10)
      .select('clientNumber fullName metrics.totalRevenue metrics.lifetimeValue');

    // At-risk clients (low satisfaction or NPS)
    const atRiskClients = await Client.find({
      $or: [
        { 'metrics.satisfactionScore': { $lt: 6 } },
        { 'metrics.npsScore': { $lt: 0 } }
      ]
    })
    .limit(10)
    .select('clientNumber fullName metrics.satisfactionScore metrics.npsScore');

    res.json({
      success: true,
      data: {
        overview: {
          totalClients,
          activeClients,
          prospectiveClients,
          formerClients,
          newClientsLast30Days: newClients30Days,
          churnRate: parseFloat(churnRate)
        },
        revenue: {
          totalRevenue: revenueStats[0]?.totalRevenue || 0,
          totalOutstanding: revenueStats[0]?.totalOutstanding || 0,
          averageLifetimeValue: revenueStats[0]?.avgLifetimeValue || 0,
          averageRevenuePerClient: revenueStats[0]?.avgRevenue || 0
        },
        satisfaction: {
          averageNPS: npsStats[0]?.avgNPS || 0,
          averageSatisfaction: satisfactionStats[0]?.avgSatisfaction || 0,
          clientsWithFeedback: npsStats[0]?.count || 0
        },
        distribution: {
          byType: clientsByType,
          byCategory: clientsByCategory
        },
        engagement: {
          communicationActivity: communicationStats,
          totalCommunications: communicationStats.reduce((sum, s) => sum + s.count, 0)
        },
        insights: {
          topClients,
          atRiskClients,
          retentionRate: (100 - parseFloat(churnRate)).toFixed(2)
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

// Client CRM overview - lists all 8 sub-features
router.get('/', (req, res) => {
  res.json({
    feature: 'Client Relationship Management (CRM)',
    subFeatures: [
      'Client Database Management',
      'Client Communication History',
      'Client Portal Access',
      'Client Intake & Onboarding',
      'Client Billing Information',
      'Client Conflict Checking',
      'Client Retention & Feedback',
      'Client Relationship Analytics'
    ]
  });
});

module.exports = router;
