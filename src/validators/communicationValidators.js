/**
 * Communication Validation Schemas using Joi
 * Input validation for communication & collaboration operations
 */

const Joi = require('joi');

// Validation schema for sending internal message
const sendMessageSchema = Joi.object({
  messageType: Joi.string().valid('Direct', 'Group', 'Broadcast', 'System', 'Announcement').default('Direct'),
  subject: Joi.string().trim().max(200).allow(''),
  content: Joi.string().required().trim().max(10000),
  recipientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).when('messageType', {
    is: 'Direct',
    then: Joi.required()
  }),
  recipientName: Joi.string().trim().max(100),
  groupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).when('messageType', {
    is: 'Group',
    then: Joi.required()
  }),
  threadId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  priority: Joi.string().valid('Low', 'Normal', 'High', 'Urgent').default('Normal'),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  mentions: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  senderName: Joi.string().required().trim().min(2).max(100)
});

// Validation schema for email integration
const sendEmailSchema = Joi.object({
  from: Joi.object({
    email: Joi.string().required().email().lowercase(),
    name: Joi.string().trim().max(100)
  }).required(),
  to: Joi.array().items(
    Joi.object({
      email: Joi.string().required().email().lowercase(),
      name: Joi.string().trim().max(100)
    })
  ).required().min(1),
  cc: Joi.array().items(
    Joi.object({
      email: Joi.string().email().lowercase(),
      name: Joi.string().trim().max(100)
    })
  ).optional(),
  bcc: Joi.array().items(
    Joi.object({
      email: Joi.string().email().lowercase(),
      name: Joi.string().trim().max(100)
    })
  ).optional(),
  subject: Joi.string().required().trim().max(500),
  body: Joi.string().required(),
  bodyPlainText: Joi.string().optional(),
  bodyHtml: Joi.string().optional(),
  priority: Joi.string().valid('Low', 'Normal', 'High', 'Urgent').default('Normal'),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  templateId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  isConfidential: Joi.boolean().default(false),
  createdBy: Joi.string().required().trim()
});

// Validation schema for scheduling video conference
const scheduleConferenceSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().max(2000).allow(''),
  conferenceType: Joi.string().valid(
    'Team Meeting', 'Client Meeting', 'Deposition', 'Court Hearing', 
    'Consultation', 'Training', 'Other'
  ).default('Team Meeting'),
  scheduledStartTime: Joi.date().required().greater('now'),
  scheduledEndTime: Joi.date().required().greater(Joi.ref('scheduledStartTime')),
  duration: Joi.number().required().min(1).max(480),
  timezone: Joi.string().default('UTC'),
  hostName: Joi.string().required().trim().min(2).max(100),
  invitees: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().max(100),
      email: Joi.string().email().lowercase()
    })
  ).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  settings: Joi.object({
    isRecordingEnabled: Joi.boolean().default(false),
    isScreenSharingEnabled: Joi.boolean().default(true),
    isChatEnabled: Joi.boolean().default(true),
    isWaitingRoomEnabled: Joi.boolean().default(false),
    requiresPassword: Joi.boolean().default(false),
    password: Joi.string().min(6).max(50).when('requiresPassword', {
      is: true,
      then: Joi.required()
    })
  }).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for file sharing
const shareFileSchema = Joi.object({
  filename: Joi.string().required().trim().max(255),
  fileType: Joi.string().required().trim(),
  fileSize: Joi.number().required().min(1).max(100 * 1024 * 1024), // 100 MB max
  storagePath: Joi.string().required().trim(),
  shareType: Joi.string().valid('Internal', 'External', 'Client', 'Public Link', 'Private').default('Internal'),
  accessControl: Joi.string().valid('Private', 'Team', 'Organization', 'Public', 'Custom').default('Team'),
  sharedWith: Joi.array().items(
    Joi.object({
      username: Joi.string().trim().max(100),
      email: Joi.string().email().lowercase(),
      permission: Joi.string().valid('View', 'Download', 'Edit', 'Full Access').default('View')
    })
  ).optional(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  expiresAt: Joi.date().greater('now').optional(),
  maxDownloads: Joi.number().min(1).optional(),
  requiresPassword: Joi.boolean().default(false),
  password: Joi.string().min(6).max(50).when('requiresPassword', {
    is: true,
    then: Joi.required()
  }),
  description: Joi.string().trim().max(1000).allow(''),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  notifyOnDownload: Joi.boolean().default(false),
  isConfidential: Joi.boolean().default(false),
  ownerName: Joi.string().required().trim().min(2).max(100),
  createdBy: Joi.string().required().trim()
});

// Validation schema for creating workspace
const createWorkspaceSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().max(2000).allow(''),
  workspaceType: Joi.string().valid(
    'Case Workspace', 'Project', 'Department', 'Team', 
    'Client Portal', 'General', 'Template'
  ).default('Case Workspace'),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  members: Joi.array().items(
    Joi.object({
      username: Joi.string().trim().max(100),
      email: Joi.string().email().lowercase(),
      role: Joi.string().valid('Owner', 'Admin', 'Editor', 'Contributor', 'Viewer').default('Contributor')
    })
  ).optional(),
  visibility: Joi.string().valid('Private', 'Team', 'Organization', 'Public').default('Team'),
  isPublic: Joi.boolean().default(false),
  requiresApproval: Joi.boolean().default(false),
  settings: Joi.object({
    allowComments: Joi.boolean().default(true),
    allowFileUploads: Joi.boolean().default(true),
    allowInvitations: Joi.boolean().default(true),
    notifyOnActivity: Joi.boolean().default(true)
  }).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  ownerName: Joi.string().required().trim().min(2).max(100),
  createdBy: Joi.string().required().trim()
});

// Validation schema for client portal message
const sendClientMessageSchema = Joi.object({
  messageType: Joi.string().valid(
    'Message', 'Document Request', 'Status Update', 
    'Appointment', 'Payment Request', 'System'
  ).default('Message'),
  subject: Joi.string().trim().max(200).allow(''),
  content: Joi.string().required().trim().max(10000),
  recipientName: Joi.string().required().trim().min(2).max(100),
  recipientType: Joi.string().required().valid('Attorney', 'Staff', 'Client'),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  caseNumber: Joi.string().required().trim(),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  clientName: Joi.string().required().trim().min(2).max(100),
  priority: Joi.string().valid('Low', 'Normal', 'High', 'Urgent').default('Normal'),
  requiresResponse: Joi.boolean().default(false),
  responseDeadline: Joi.date().greater('now').when('requiresResponse', {
    is: true,
    then: Joi.optional()
  }),
  appointment: Joi.object({
    proposedDate: Joi.date().required().greater('now'),
    proposedTime: Joi.string().required(),
    duration: Joi.number().min(15).max(480),
    location: Joi.string().trim().max(200),
    meetingType: Joi.string().valid('In Person', 'Video Conference', 'Phone Call')
  }).when('messageType', {
    is: 'Appointment',
    then: Joi.required()
  }),
  paymentRequest: Joi.object({
    amount: Joi.number().required().min(0),
    currency: Joi.string().default('USD'),
    description: Joi.string().required().trim().max(500),
    dueDate: Joi.date().greater('now')
  }).when('messageType', {
    is: 'Payment Request',
    then: Joi.required()
  }),
  senderName: Joi.string().required().trim().min(2).max(100),
  senderType: Joi.string().required().valid('Attorney', 'Staff', 'Client', 'System'),
  createdBy: Joi.string().required().trim()
});

// Validation schema for external communication tracking
const trackExternalCommunicationSchema = Joi.object({
  communicationType: Joi.string().required().valid(
    'Email', 'Phone Call', 'Letter', 'Fax', 'Meeting', 
    'Court Filing', 'Deposition', 'Hearing', 'Conference', 'Other'
  ),
  direction: Joi.string().required().valid('Inbound', 'Outbound'),
  subject: Joi.string().required().trim().min(3).max(500),
  description: Joi.string().trim().max(5000).allow(''),
  summary: Joi.string().trim().max(1000).allow(''),
  primaryContact: Joi.string().required().trim().min(2).max(100),
  externalParticipants: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim().max(100),
      organization: Joi.string().trim().max(200),
      role: Joi.string().trim().max(100),
      email: Joi.string().email().lowercase().allow(''),
      phone: Joi.string().trim().max(20),
      type: Joi.string().valid(
        'Opposing Counsel', 'Court', 'Client', 'Witness', 
        'Expert', 'Vendor', 'Government', 'Other'
      )
    })
  ).required().min(1),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  caseNumber: Joi.string().required().trim(),
  communicationDate: Joi.date().required(),
  duration: Joi.number().min(0).optional(),
  requiresFollowUp: Joi.boolean().default(false),
  followUpDate: Joi.date().greater('now').when('requiresFollowUp', {
    is: true,
    then: Joi.optional()
  }),
  requiresResponse: Joi.boolean().default(false),
  responseDeadline: Joi.date().greater('now').when('requiresResponse', {
    is: true,
    then: Joi.optional()
  }),
  priority: Joi.string().valid('Low', 'Normal', 'High', 'Critical').default('Normal'),
  isConfidential: Joi.boolean().default(false),
  isBillable: Joi.boolean().default(true),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for creating communication template
const createTemplateSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(200),
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().max(1000).allow(''),
  templateType: Joi.string().required().valid(
    'Email', 'Letter', 'SMS', 'Client Portal Message', 
    'Internal Message', 'Court Document', 'Form Letter', 'Other'
  ),
  category: Joi.string().required().valid(
    'Client Communication', 'Court Communication', 'Opposing Counsel', 
    'Internal', 'Administrative', 'Marketing', 'Billing', 'Other'
  ),
  subCategory: Joi.string().trim().max(100).allow(''),
  practiceArea: Joi.string().trim().max(100).allow(''),
  subject: Joi.string().trim().max(500).allow(''),
  body: Joi.string().required(),
  bodyFormat: Joi.string().valid('Plain Text', 'Rich Text', 'HTML', 'Markdown').default('Rich Text'),
  variables: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim(),
      label: Joi.string().required().trim(),
      type: Joi.string().valid(
        'Text', 'Number', 'Date', 'Email', 'Phone', 
        'Address', 'Select', 'Multiline', 'Boolean'
      ).default('Text'),
      description: Joi.string().trim().allow(''),
      defaultValue: Joi.string().allow(''),
      required: Joi.boolean().default(false),
      options: Joi.array().items(Joi.string()).optional()
    })
  ).optional(),
  visibility: Joi.string().valid('Public', 'Private', 'Team', 'Department', 'Organization').default('Organization'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  createdBy: Joi.string().required().trim()
});

// Validation schema for using template
const useTemplateSchema = Joi.object({
  templateId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  variables: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  recipientName: Joi.string().trim().max(100),
  recipientEmail: Joi.string().email().lowercase(),
  caseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  caseNumber: Joi.string().trim().optional(),
  usedBy: Joi.string().required().trim()
});

module.exports = {
  sendMessageSchema,
  sendEmailSchema,
  scheduleConferenceSchema,
  shareFileSchema,
  createWorkspaceSchema,
  sendClientMessageSchema,
  trackExternalCommunicationSchema,
  createTemplateSchema,
  useTemplateSchema
};
