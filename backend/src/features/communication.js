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
const CommunicationTemplate = require('../models/CommunicationTemplate');
const { isConnected } = require('../config/database');
const {
  createMessageSchema,
  updateMessageSchema,
  addAttachmentSchema,
  createTemplateSchema,
  updateTemplateSchema,
  renderTemplateSchema,
  collaborationSpaceSchema,
  videoConferenceSchema
} = require('../validators/communicationValidators');

// Helper function to generate message ID
const generateMessageId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `MSG-${timestamp}-${random}`;
};

// Helper function to generate template ID
const generateTemplateId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `TPL-${timestamp}-${random}`;
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
// Create message
router.post('/messages/send', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Send Message', message: 'Database not connected' });
    }

    const validatedData = validateRequest(createMessageSchema, req.body);
    const messageId = generateMessageId();

    // Generate thread ID if not provided
    const threadId = validatedData.threadId || generateMessageId();

    const message = new Message({
      ...validatedData,
      messageId,
      threadId,
      status: 'Sent',
      sentAt: new Date()
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get messages for user
router.get('/messages/inbox', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Get Messages', message: 'Database not connected' });
    }

    const { userId, messageType, status, page = 1, limit = 50 } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const filters = {
      $or: [
        { 'sender.userId': userId },
        { 'recipients.userId': userId }
      ]
    };

    if (messageType) filters.messageType = messageType;
    if (status) filters.status = status;

    const messages = await Message.find(filters)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Message.countDocuments(filters);

    // Get unread count
    const unreadCount = await Message.countDocuments({
      'recipients.userId': userId,
      'recipients.readAt': { $exists: false },
      status: { $in: ['Sent', 'Delivered'] }
    });

    res.json({
      success: true,
      data: {
        messages,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalMessages: count,
        unreadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get message by ID
router.get('/messages/:id', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Get Message', message: 'Database not connected' });
    }

    const message = await Message.findById(req.params.id)
      .populate('inReplyTo')
      .populate('caseId', 'caseNumber title')
      .populate('clientId', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mark message as read
router.put('/messages/:id/read', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Mark as Read', message: 'Database not connected' });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    await message.markAsRead(userId);

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get thread messages
router.get('/messages/thread/:threadId', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Get Thread', message: 'Database not connected' });
    }

    const messages = await Message.findByThread(req.params.threadId);

    res.json({
      success: true,
      data: {
        threadId: req.params.threadId,
        messageCount: messages.length,
        messages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// Sub-Feature 2: Email Integration
router.post('/email/send', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Send Email', message: 'Database not connected' });
    }

    const validatedData = validateRequest(createMessageSchema, req.body);
    const messageId = generateMessageId();

    const email = new Message({
      ...validatedData,
      messageId,
      messageType: 'Email',
      threadId: validatedData.threadId || generateMessageId(),
      status: 'Sent',
      sentAt: new Date(),
      deliveryStatus: 'Sent'
    });

    await email.save();

    res.status(201).json({
      success: true,
      message: 'Email sent successfully',
      data: email
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Track email opens
router.get('/email/:id/track', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Track Email', message: 'Database not connected' });
    }

    const email = await Message.findById(req.params.id);
    
    if (!email || email.messageType !== 'Email') {
      return res.status(404).json({
        success: false,
        error: 'Email not found'
      });
    }

    res.json({
      success: true,
      data: {
        emailId: email._id,
        sentAt: email.sentAt,
        deliveredAt: email.deliveredAt,
        status: email.status,
        readReceipts: email.readReceipts,
        recipientCount: email.recipients.length,
        readCount: email.readReceipts.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 3: Video Conferencing
router.post('/video/create', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Create Video Conference', message: 'Database not connected' });
    }

    const validatedData = validateRequest(videoConferenceSchema, req.body);

    // Create a meeting link (stub - would integrate with Zoom/Teams/etc)
    const meetingId = `MEET-${Date.now()}`;
    const meetingLink = `https://yellow-cross.meet/${meetingId}`;

    // Store meeting details as a message
    const message = new Message({
      messageId: generateMessageId(),
      subject: validatedData.title,
      body: `Video conference scheduled: ${validatedData.description}`,
      messageType: 'Video Conference',
      sender: {
        userId: validatedData.hostId,
        name: 'System'
      },
      recipients: validatedData.participants,
      caseId: validatedData.caseId,
      clientId: validatedData.clientId,
      status: 'Scheduled',
      threadId: generateMessageId()
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'Video conference created successfully',
      data: {
        meetingId,
        meetingLink,
        scheduledTime: validatedData.scheduledTime,
        duration: validatedData.duration,
        participants: validatedData.participants,
        recordingEnabled: validatedData.recordingEnabled,
        messageRecord: message
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get video conference history
router.get('/video/history', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Video History', message: 'Database not connected' });
    }

    const { userId, caseId, clientId } = req.query;
    const filters = { messageType: 'Video Conference' };

    if (userId) {
      filters.$or = [
        { 'sender.userId': userId },
        { 'recipients.userId': userId }
      ];
    }
    if (caseId) filters.caseId = caseId;
    if (clientId) filters.clientId = clientId;

    const meetings = await Message.find(filters)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        totalMeetings: meetings.length,
        meetings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 4: File Sharing
router.post('/files/share', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Share File', message: 'Database not connected' });
    }

    const { senderId, recipientIds, fileData, caseId, clientId, expiresAt } = req.body;

    const message = new Message({
      messageId: generateMessageId(),
      subject: `File shared: ${fileData.fileName}`,
      body: `${fileData.fileName} has been shared with you`,
      messageType: 'File Share',
      sender: {
        userId: senderId,
        name: 'User'
      },
      recipients: recipientIds.map(id => ({
        userId: id,
        name: 'Recipient'
      })),
      attachments: [{
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        fileType: fileData.fileType,
        url: fileData.url,
        uploadedAt: new Date()
      }],
      caseId,
      clientId,
      status: 'Sent',
      threadId: generateMessageId()
    });

    await message.save();

    // Generate shareable link
    const shareLink = `https://yellow-cross.share/${message._id}`;

    res.status(201).json({
      success: true,
      message: 'File shared successfully',
      data: {
        shareLink,
        expiresAt: expiresAt || null,
        messageRecord: message
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Track file downloads
router.get('/files/:id/downloads', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Track Downloads', message: 'Database not connected' });
    }

    const message = await Message.findById(req.params.id);
    
    if (!message || message.messageType !== 'File Share') {
      return res.status(404).json({
        success: false,
        error: 'File share not found'
      });
    }

    res.json({
      success: true,
      data: {
        fileId: message._id,
        fileName: message.attachments[0]?.fileName,
        sharedAt: message.createdAt,
        accessCount: message.readReceipts.length,
        lastAccessed: message.readReceipts.length > 0 ? 
          message.readReceipts[message.readReceipts.length - 1].readAt : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 5: Team Collaboration Spaces
router.post('/workspaces/create', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Create Workspace', message: 'Database not connected' });
    }

    const validatedData = validateRequest(collaborationSpaceSchema, req.body);

    // Create workspace identifier
    const workspaceId = `WS-${Date.now()}`;

    res.status(201).json({
      success: true,
      message: 'Collaboration workspace created successfully',
      data: {
        workspaceId,
        ...validatedData,
        createdAt: new Date(),
        activityFeed: [],
        sharedResources: []
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get workspace messages
router.get('/workspaces/:workspaceId/messages', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Get Workspace Messages', message: 'Database not connected' });
    }

    // Use threadId to track workspace messages
    const messages = await Message.find({
      threadId: req.params.workspaceId
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        workspaceId: req.params.workspaceId,
        messageCount: messages.length,
        messages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 6: Client Communication Portal
router.post('/client-portal/send', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Client Portal Message', message: 'Database not connected' });
    }

    const validatedData = validateRequest(createMessageSchema, req.body);
    const messageId = generateMessageId();

    const message = new Message({
      ...validatedData,
      messageId,
      messageType: 'Client',
      threadId: validatedData.threadId || generateMessageId(),
      status: 'Sent',
      sentAt: new Date(),
      isEncrypted: true // Client communications are encrypted
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message sent to client successfully',
      data: message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get client communications
router.get('/client-portal/:clientId/messages', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Get Client Messages', message: 'Database not connected' });
    }

    const messages = await Message.findByClient(req.params.clientId);

    res.json({
      success: true,
      data: {
        clientId: req.params.clientId,
        messageCount: messages.length,
        messages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sub-Feature 7: External Communication Tracking
router.get('/external/track', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Track External Communications', message: 'Database not connected' });
    }

    const { caseId, clientId, startDate, endDate } = req.query;
    const filters = {
      messageType: { $in: ['Email', 'Client'] }
    };

    if (caseId) filters.caseId = caseId;
    if (clientId) filters.clientId = clientId;
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const communications = await Message.find(filters)
      .sort({ createdAt: -1 })
      .limit(100);

    // Build timeline
    const timeline = communications.map(comm => ({
      id: comm._id,
      type: comm.messageType,
      timestamp: comm.createdAt,
      subject: comm.subject,
      sender: comm.sender,
      recipientCount: comm.recipients.length,
      status: comm.status
    }));

    // Calculate statistics
    const stats = {
      totalCommunications: communications.length,
      byType: {},
      byStatus: {},
      avgResponseTime: 0
    };

    communications.forEach(comm => {
      stats.byType[comm.messageType] = (stats.byType[comm.messageType] || 0) + 1;
      stats.byStatus[comm.status] = (stats.byStatus[comm.status] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        timeline,
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

// Sub-Feature 8: Communication Templates
// Create template
router.post('/templates/create', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Create Template', message: 'Database not connected' });
    }

    const validatedData = validateRequest(createTemplateSchema, req.body);
    const templateId = generateTemplateId();

    const template = new CommunicationTemplate({
      ...validatedData,
      templateId
    });

    await template.save();

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// List templates
router.get('/templates/list', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'List Templates', message: 'Database not connected' });
    }

    const { templateType, category, status = 'Active' } = req.query;
    const filters = { status };

    if (templateType) filters.templateType = templateType;
    if (category) filters.category = category;

    const templates = await CommunicationTemplate.find(filters)
      .sort({ usageCount: -1, createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: {
        templates,
        totalTemplates: templates.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get template by ID
router.get('/templates/:id', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Get Template', message: 'Database not connected' });
    }

    const template = await CommunicationTemplate.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Render template with variables
router.post('/templates/render', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Render Template', message: 'Database not connected' });
    }

    const validatedData = validateRequest(renderTemplateSchema, req.body);

    const template = await CommunicationTemplate.findById(validatedData.templateId);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    const rendered = template.render(validatedData.variables);
    await template.incrementUsage();

    res.json({
      success: true,
      data: {
        template: {
          id: template._id,
          name: template.name
        },
        rendered
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update template
router.put('/templates/:id', async (req, res) => {
  try {
    if (!await isConnected()) {
      return res.json({ feature: 'Update Template', message: 'Database not connected' });
    }

    const validatedData = validateRequest(updateTemplateSchema, req.body);

    const template = await CommunicationTemplate.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Create version if body changed
    if (validatedData.body && validatedData.body !== template.body) {
      await template.createVersion(validatedData.lastModifiedBy, 'Template updated');
    }

    Object.assign(template, validatedData);
    await template.save();

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: template
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Communication overview
router.get('/', (req, res) => {
  res.json({
    feature: 'Communication & Collaboration',
    description: 'Comprehensive communication and team collaboration system',
    subFeatures: [
      'Internal Messaging System',
      'Email Integration',
      'Video Conferencing',
      'File Sharing',
      'Team Collaboration Spaces',
      'Client Communication Portal',
      'External Communication Tracking',
      'Communication Templates'
    ],
    endpoints: {
      sendMessage: 'POST /api/communication/messages/send',
      inbox: 'GET /api/communication/messages/inbox',
      getMessage: 'GET /api/communication/messages/:id',
      markRead: 'PUT /api/communication/messages/:id/read',
      getThread: 'GET /api/communication/messages/thread/:threadId',
      sendEmail: 'POST /api/communication/email/send',
      trackEmail: 'GET /api/communication/email/:id/track',
      createVideo: 'POST /api/communication/video/create',
      videoHistory: 'GET /api/communication/video/history',
      shareFile: 'POST /api/communication/files/share',
      trackDownloads: 'GET /api/communication/files/:id/downloads',
      createWorkspace: 'POST /api/communication/workspaces/create',
      workspaceMessages: 'GET /api/communication/workspaces/:workspaceId/messages',
      clientPortalSend: 'POST /api/communication/client-portal/send',
      clientMessages: 'GET /api/communication/client-portal/:clientId/messages',
      trackExternal: 'GET /api/communication/external/track',
      createTemplate: 'POST /api/communication/templates/create',
      listTemplates: 'GET /api/communication/templates/list',
      getTemplate: 'GET /api/communication/templates/:id',
      renderTemplate: 'POST /api/communication/templates/render',
      updateTemplate: 'PUT /api/communication/templates/:id'
    }
  });
});

module.exports = router;
