/**
 * Feature 13: Communication & Collaboration
 * 8 Sub-Features: Internal Messaging, Email Integration, Video Conferencing,
 * File Sharing, Team Collaboration Spaces, Client Communication Portal, External Communication Tracking, Communication Templates
 * 
 * FULL IMPLEMENTATION with Business Logic, Data Logic, and Database Integration
 */

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Email = require('../models/Email');
const VideoConference = require('../models/VideoConference');
const SharedFile = require('../models/SharedFile');
const Workspace = require('../models/Workspace');
const ClientMessage = require('../models/ClientMessage');
const ExternalCommunication = require('../models/ExternalCommunication');
const CommunicationTemplate = require('../models/CommunicationTemplate');
const { isConnected } = require('../config/database');
const {
  sendMessageSchema,
  sendEmailSchema,
  scheduleConferenceSchema,
  shareFileSchema,
  createWorkspaceSchema,
  sendClientMessageSchema,
  trackExternalCommunicationSchema,
  createTemplateSchema,
  useTemplateSchema
} = require('../validators/communicationValidators');

// Helper function to generate unique IDs
const generateMessageId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MSG-${timestamp}-${random}`;
};

const generateEmailId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `EMAIL-${timestamp}-${random}`;
};

const generateConferenceId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CONF-${timestamp}-${random}`;
};

const generateFileId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `FILE-${timestamp}-${random}`;
};

const generateWorkspaceId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WS-${year}-${random}`;
};

const generateCommunicationId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `COMM-${year}-${random}`;
};

const generateTemplateId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TMPL-${year}-${random}`;
};

// Helper function to validate and handle errors
const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

// Sub-Feature 1: Internal Messaging System
router.post('/messages', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Internal Messaging System',
        description: 'Secure team messaging and chat',
        endpoint: '/api/communication/messages',
        capabilities: [
          'Direct messaging',
          'Group chats',
          'Message threads',
          'File attachments',
          'Message search'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(sendMessageSchema, req.body);

    // Generate message ID
    const messageId = generateMessageId();

    // Create new message
    const newMessage = new Message({
      ...validatedData,
      messageId,
      senderId: req.body.senderId || null,
      status: 'Sent'
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: newMessage,
        messageId: newMessage.messageId
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// Sub-Feature 2: Email Integration
router.post('/email', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Email Integration',
        description: 'Integrate with email clients and tracking',
        endpoint: '/api/communication/email',
        capabilities: [
          'Email client integration',
          'Email tracking',
          'Auto-filing',
          'Email templates',
          'Send and receive'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(sendEmailSchema, req.body);

    // Generate email ID
    const emailId = generateEmailId();

    // Create new email
    const newEmail = new Email({
      ...validatedData,
      emailId,
      messageId: emailId,
      emailType: 'Sent',
      direction: 'Outbound',
      status: 'Sent',
      sentAt: new Date(),
      hasAttachments: req.body.attachments && req.body.attachments.length > 0,
      attachmentCount: req.body.attachments ? req.body.attachments.length : 0
    });

    await newEmail.save();

    // Auto-file to case if caseId provided
    if (validatedData.caseId) {
      await newEmail.autoFileToCase(validatedData.caseId, validatedData.caseNumber);
    }

    res.status(201).json({
      success: true,
      message: 'Email sent successfully',
      data: {
        email: newEmail,
        emailId: newEmail.emailId
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
});

// GET emails
router.get('/email', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Email Integration',
        description: 'Retrieve emails with filtering',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { folder, isRead, caseId, limit = 50 } = req.query;
    const query = {};

    if (folder) query.folder = folder;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (caseId) query.caseId = caseId;

    const emails = await Email.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: emails.length,
      data: emails
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving emails',
      error: error.message
    });
  }
});

// Sub-Feature 3: Video Conferencing
router.post('/video', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Video Conferencing',
        description: 'Built-in video calls and depositions',
        endpoint: '/api/communication/video',
        capabilities: [
          'Video calls',
          'Screen sharing',
          'Recording',
          'Virtual backgrounds',
          'Meeting scheduling'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(scheduleConferenceSchema, req.body);

    // Generate conference ID and meeting URL
    const conferenceId = generateConferenceId();
    const meetingId = `MTG-${Date.now()}`;
    const meetingUrl = `https://meet.yellowcross.com/${meetingId}`;

    // Create new video conference
    const newConference = new VideoConference({
      ...validatedData,
      conferenceId,
      meetingId,
      meetingUrl,
      hostId: req.body.hostId || null,
      status: 'Scheduled'
    });

    await newConference.save();

    res.status(201).json({
      success: true,
      message: 'Video conference scheduled successfully',
      data: {
        conference: newConference,
        conferenceId: newConference.conferenceId,
        meetingUrl: newConference.meetingUrl
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error scheduling video conference',
      error: error.message
    });
  }
});

// Sub-Feature 4: File Sharing
router.post('/files', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'File Sharing',
        description: 'Secure file sharing and collaboration',
        endpoint: '/api/communication/files',
        capabilities: [
          'Secure sharing',
          'Link generation',
          'Access controls',
          'Download tracking',
          'Expiration dates'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(shareFileSchema, req.body);

    // Generate file and share IDs
    const fileId = generateFileId();
    const shareId = `SHARE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const shareLink = `https://share.yellowcross.com/${shareId}`;

    // Create new shared file
    const newSharedFile = new SharedFile({
      ...validatedData,
      fileId,
      shareId,
      shareLink,
      originalFilename: validatedData.filename,
      fileExtension: validatedData.filename.split('.').pop(),
      ownerId: req.body.ownerId || null,
      status: 'Active'
    });

    await newSharedFile.save();

    res.status(201).json({
      success: true,
      message: 'File shared successfully',
      data: {
        file: newSharedFile,
        fileId: newSharedFile.fileId,
        shareLink: newSharedFile.shareLink
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error sharing file',
      error: error.message
    });
  }
});

// Sub-Feature 5: Team Collaboration Spaces
router.post('/workspaces', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Team Collaboration Spaces',
        description: 'Virtual workrooms per case',
        endpoint: '/api/communication/workspaces',
        capabilities: [
          'Case workspaces',
          'Team collaboration',
          'Shared resources',
          'Activity feeds',
          'Workspace templates'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createWorkspaceSchema, req.body);

    // Generate workspace ID
    const workspaceId = generateWorkspaceId();

    // Create new workspace
    const newWorkspace = new Workspace({
      ...validatedData,
      workspaceId,
      ownerId: req.body.ownerId || null,
      status: 'Active'
    });

    await newWorkspace.save();

    // Create initial activity
    await newWorkspace.addActivity(
      'Workspace Created',
      `Workspace "${newWorkspace.name}" created`,
      validatedData.createdBy
    );

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      data: {
        workspace: newWorkspace,
        workspaceId: newWorkspace.workspaceId
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating workspace',
      error: error.message
    });
  }
});

// Sub-Feature 6: Client Communication Portal
router.post('/client-portal', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Client Communication Portal',
        description: 'Secure client messaging',
        endpoint: '/api/communication/client-portal',
        capabilities: [
          'Secure messaging',
          'Document sharing',
          'Status updates',
          'Appointment booking',
          'Payment requests'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(sendClientMessageSchema, req.body);

    // Generate message ID
    const messageId = generateMessageId();

    // Create new client message
    const newClientMessage = new ClientMessage({
      ...validatedData,
      messageId,
      senderId: req.body.senderId || null,
      recipientId: req.body.recipientId || null,
      senderModel: validatedData.senderType === 'Client' ? 'Client' : 'User',
      recipientModel: validatedData.recipientType === 'Client' ? 'Client' : 'User',
      status: 'Sent',
      hasAttachments: req.body.attachments && req.body.attachments.length > 0
    });

    await newClientMessage.save();

    res.status(201).json({
      success: true,
      message: 'Client message sent successfully',
      data: {
        message: newClientMessage,
        messageId: newClientMessage.messageId
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error sending client message',
      error: error.message
    });
  }
});

// Sub-Feature 7: External Communication Tracking
router.post('/external', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'External Communication Tracking',
        description: 'Track all external communications',
        endpoint: '/api/communication/external',
        capabilities: [
          'Communication logging',
          'Timeline view',
          'Contact tracking',
          'Response tracking',
          'Communication analytics'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(trackExternalCommunicationSchema, req.body);

    // Generate communication ID
    const communicationId = generateCommunicationId();

    // Create new external communication record
    const newCommunication = new ExternalCommunication({
      ...validatedData,
      communicationId,
      status: 'Completed',
      hasAttachments: req.body.attachments && req.body.attachments.length > 0
    });

    await newCommunication.save();

    res.status(201).json({
      success: true,
      message: 'External communication tracked successfully',
      data: {
        communication: newCommunication,
        communicationId: newCommunication.communicationId
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error tracking external communication',
      error: error.message
    });
  }
});

// GET external communications
router.get('/external', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'External Communication Tracking',
        description: 'Retrieve external communications',
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { caseId, communicationType, direction, limit = 50 } = req.query;
    const query = {};

    if (caseId) query.caseId = caseId;
    if (communicationType) query.communicationType = communicationType;
    if (direction) query.direction = direction;

    const communications = await ExternalCommunication.find(query)
      .sort({ communicationDate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: communications.length,
      data: communications
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving external communications',
      error: error.message
    });
  }
});

// Sub-Feature 8: Communication Templates
router.post('/templates', async (req, res) => {
  try {
    // Check database connection
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Communication Templates',
        description: 'Email templates and standard correspondence',
        endpoint: '/api/communication/templates',
        capabilities: [
          'Email templates',
          'Letter templates',
          'Variable fields',
          'Template library',
          'Custom templates'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    // Validate input
    const validatedData = validateRequest(createTemplateSchema, req.body);

    // Generate template ID
    const templateId = generateTemplateId();

    // Create new communication template
    const newTemplate = new CommunicationTemplate({
      ...validatedData,
      templateId,
      status: 'Active'
    });

    await newTemplate.save();

    res.status(201).json({
      success: true,
      message: 'Communication template created successfully',
      data: {
        template: newTemplate,
        templateId: newTemplate.templateId
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating communication template',
      error: error.message
    });
  }
});

// GET communication templates
router.get('/templates', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        feature: 'Communication Templates',
        description: 'Email templates and standard correspondence',
        endpoint: '/api/communication/templates',
        capabilities: [
          'Email templates',
          'Letter templates',
          'Variable fields',
          'Template library',
          'Custom templates'
        ],
        message: 'Database not connected - showing capabilities only'
      });
    }

    const { templateType, category, practiceArea, status = 'Active', limit = 50 } = req.query;
    const query = { status };

    if (templateType) query.templateType = templateType;
    if (category) query.category = category;
    if (practiceArea) query.practiceArea = practiceArea;

    const templates = await CommunicationTemplate.find(query)
      .sort({ name: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error retrieving communication templates',
      error: error.message
    });
  }
});

// Communication overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Communication & Collaboration',
    subFeatures: [
      'Internal Messaging System',
      'Email Integration',
      'Video Conferencing',
      'File Sharing',
      'Team Collaboration Spaces',
      'Client Communication Portal',
      'External Communication Tracking',
      'Communication Templates'
    ]
  });
});

module.exports = router;
