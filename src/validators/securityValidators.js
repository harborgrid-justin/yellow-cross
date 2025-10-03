/**
 * Security Validators - Joi validation schemas for Security & Access Control
 * Comprehensive validation for all security endpoints
 */

const Joi = require('joi');

// User Authentication & SSO Validators
const loginSchema = Joi.object({
  username: Joi.string().trim().min(3).max(100).required(),
  password: Joi.string().min(8).max(100).required(),
  mfaCode: Joi.string().trim().length(6).optional(),
  rememberMe: Joi.boolean().default(false)
});

const registerSchema = Joi.object({
  username: Joi.string().trim().lowercase().min(3).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(100).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain uppercase, lowercase, number and special character'),
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  phoneNumber: Joi.string().trim().optional(),
  role: Joi.string().valid('Admin', 'Partner', 'Attorney', 'Paralegal', 'Legal Assistant', 'Clerk', 'Client', 'Guest').default('Legal Assistant'),
  organization: Joi.string().trim().optional(),
  department: Joi.string().trim().optional(),
  createdBy: Joi.string().trim().required()
});

const ssoLoginSchema = Joi.object({
  provider: Joi.string().valid('SAML', 'OAuth', 'LDAP', 'Azure AD', 'Google').required(),
  ssoId: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().required(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  metadata: Joi.object().optional()
});

const mfaSetupSchema = Joi.object({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  enabled: Joi.boolean().required()
});

const verifyMfaSchema = Joi.object({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  code: Joi.string().trim().length(6).required()
});

const changePasswordSchema = Joi.object({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(100).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain uppercase, lowercase, number and special character')
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required()
});

// Role-Based Access Control Validators
const createRoleSchema = Joi.object({
  roleName: Joi.string().trim().min(2).max(100).required(),
  displayName: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500).optional(),
  roleType: Joi.string().valid('System', 'Custom', 'Inherited').default('Custom'),
  permissions: Joi.array().items(
    Joi.object({
      resource: Joi.string().trim().required(),
      actions: Joi.array().items(
        Joi.string().valid('create', 'read', 'update', 'delete', 'execute', 'manage', 'approve', 'export', 'share')
      ).required(),
      conditions: Joi.object().optional(),
      granted: Joi.boolean().default(true)
    })
  ).optional(),
  parentRole: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  inheritPermissions: Joi.boolean().default(true),
  priority: Joi.number().min(0).max(100).default(0),
  createdBy: Joi.string().trim().required()
});

const updateRoleSchema = Joi.object({
  displayName: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().max(500).optional(),
  permissions: Joi.array().items(
    Joi.object({
      resource: Joi.string().trim().required(),
      actions: Joi.array().items(
        Joi.string().valid('create', 'read', 'update', 'delete', 'execute', 'manage', 'approve', 'export', 'share')
      ).required(),
      conditions: Joi.object().optional(),
      granted: Joi.boolean().default(true)
    })
  ).optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Deprecated').optional(),
  updatedBy: Joi.string().trim().required()
});

const assignRoleSchema = Joi.object({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  roleId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  assignedBy: Joi.string().trim().required()
});

const checkPermissionSchema = Joi.object({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  resource: Joi.string().trim().required(),
  action: Joi.string().valid('create', 'read', 'update', 'delete', 'execute', 'manage', 'approve', 'export', 'share').required()
});

// Audit Trail Validators
const createAuditLogSchema = Joi.object({
  eventType: Joi.string().valid(
    'Login', 'Logout', 'Login Failed', 'Password Change', 'Password Reset',
    'User Created', 'User Updated', 'User Deleted', 'User Suspended',
    'Role Assigned', 'Role Revoked', 'Permission Changed',
    'Data Access', 'Data Create', 'Data Update', 'Data Delete',
    'File Upload', 'File Download', 'File Delete',
    'Security Alert', 'IP Block', 'Session Terminated',
    'MFA Enabled', 'MFA Disabled', 'Backup Created', 'Backup Restored',
    'Configuration Change', 'System Event', 'API Access', 'Other'
  ).required(),
  eventCategory: Joi.string().valid('Authentication', 'Authorization', 'Data Access', 'Configuration', 'Security', 'System').required(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  username: Joi.string().trim().optional(),
  userRole: Joi.string().trim().optional(),
  action: Joi.string().trim().required(),
  resource: Joi.string().trim().optional(),
  resourceId: Joi.string().trim().optional(),
  method: Joi.string().valid('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD').optional(),
  endpoint: Joi.string().trim().optional(),
  success: Joi.boolean().default(true),
  statusCode: Joi.number().optional(),
  errorMessage: Joi.string().trim().optional(),
  changesBefore: Joi.object().optional(),
  changesAfter: Joi.object().optional(),
  changedFields: Joi.array().items(Joi.string()).optional(),
  ipAddress: Joi.string().trim().required(),
  userAgent: Joi.string().trim().optional(),
  deviceInfo: Joi.string().trim().optional(),
  sessionId: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  metadata: Joi.object().optional(),
  severity: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Low')
});

const queryAuditLogsSchema = Joi.object({
  eventType: Joi.string().optional(),
  eventCategory: Joi.string().valid('Authentication', 'Authorization', 'Data Access', 'Configuration', 'Security', 'System').optional(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  username: Joi.string().trim().optional(),
  resource: Joi.string().trim().optional(),
  success: Joi.boolean().optional(),
  severity: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(50)
});

// IP Whitelisting Validators
const addIPWhitelistSchema = Joi.object({
  ipAddress: Joi.string().trim().when('entryType', {
    is: 'Single IP',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  ipRange: Joi.object({
    start: Joi.string().trim().required(),
    end: Joi.string().trim().required()
  }).when('entryType', {
    is: 'IP Range',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  cidrNotation: Joi.string().trim().when('entryType', {
    is: 'CIDR',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  entryType: Joi.string().valid('Single IP', 'IP Range', 'CIDR', 'Dynamic').default('Single IP'),
  scope: Joi.string().valid('Global', 'User', 'Role', 'Organization', 'Department').default('Global'),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  username: Joi.string().trim().optional(),
  roleId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  roleName: Joi.string().trim().optional(),
  organization: Joi.string().trim().optional(),
  department: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  purpose: Joi.string().trim().optional(),
  validFrom: Joi.date().optional(),
  validUntil: Joi.date().optional(),
  createdBy: Joi.string().trim().required()
});

const updateIPWhitelistSchema = Joi.object({
  status: Joi.string().valid('Active', 'Inactive', 'Expired', 'Suspended').optional(),
  description: Joi.string().trim().optional(),
  validUntil: Joi.date().optional(),
  updatedBy: Joi.string().trim().required()
});

const checkIPWhitelistSchema = Joi.object({
  ipAddress: Joi.string().trim().required(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  role: Joi.string().trim().optional()
});

// Session Management Validators
const createSessionSchema = Joi.object({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  deviceInfo: Joi.string().trim().optional(),
  ipAddress: Joi.string().trim().required()
});

const updateSessionSchema = Joi.object({
  sessionId: Joi.string().trim().required(),
  lastActivity: Joi.date().default(() => new Date())
});

const terminateSessionSchema = Joi.object({
  sessionId: Joi.string().trim().required(),
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  terminatedBy: Joi.string().trim().required()
});

// Backup & Recovery Validators
const createBackupSchema = Joi.object({
  backupName: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().max(500).optional(),
  backupType: Joi.string().valid('Full', 'Incremental', 'Differential', 'Transaction Log').default('Full'),
  scope: Joi.string().valid('System', 'Database', 'Collection', 'Documents', 'Users', 'Configuration').default('Database'),
  collections: Joi.array().items(Joi.string().trim()).optional(),
  scheduled: Joi.boolean().default(false),
  scheduleFrequency: Joi.string().valid('Hourly', 'Daily', 'Weekly', 'Monthly', 'Custom', null).optional(),
  storageLocation: Joi.string().valid('Local', 'S3', 'Azure', 'Google Cloud', 'Network Drive', 'Other').default('Local'),
  encrypted: Joi.boolean().default(true),
  compressed: Joi.boolean().default(true),
  retentionPolicy: Joi.string().valid('7 Days', '30 Days', '90 Days', '1 Year', '7 Years', 'Indefinite').default('90 Days'),
  createdBy: Joi.string().trim().required()
});

const restoreBackupSchema = Joi.object({
  backupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  restoreType: Joi.string().valid('Full', 'Partial', 'Point-in-Time').default('Full'),
  targetLocation: Joi.string().trim().optional(),
  collections: Joi.array().items(Joi.string().trim()).optional(),
  restoredBy: Joi.string().trim().required()
});

const verifyBackupSchema = Joi.object({
  backupId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  verifiedBy: Joi.string().trim().required()
});

// Security Monitoring & Alerts Validators
const createSecurityAlertSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().max(1000).optional(),
  alertType: Joi.string().valid(
    'Threat Detection', 'Intrusion Detection', 'Anomaly Detection',
    'Brute Force Attack', 'Unauthorized Access', 'Data Breach',
    'Malware Detection', 'Suspicious Activity', 'Policy Violation',
    'Configuration Change', 'Failed Login', 'Account Lockout',
    'Privilege Escalation', 'Data Exfiltration', 'DDoS Attack',
    'SQL Injection', 'XSS Attack', 'CSRF Attack', 'Session Hijacking', 'Other'
  ).required(),
  severity: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  sourceIP: Joi.string().trim().optional(),
  targetUserId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  targetUsername: Joi.string().trim().optional(),
  targetResource: Joi.string().trim().optional(),
  targetEndpoint: Joi.string().trim().optional(),
  detectionMethod: Joi.string().valid('Rule-Based', 'ML-Based', 'Signature-Based', 'Behavior-Based', 'Heuristic', 'Manual').default('Rule-Based'),
  detectionRule: Joi.string().trim().optional(),
  confidence: Joi.number().min(0).max(100).default(100),
  evidence: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('Log Entry', 'Network Traffic', 'File', 'Screenshot', 'Memory Dump', 'Other').required(),
      description: Joi.string().trim().optional(),
      reference: Joi.string().trim().optional(),
      data: Joi.any().optional()
    })
  ).optional(),
  createdBy: Joi.string().trim().optional()
});

const updateSecurityAlertSchema = Joi.object({
  status: Joi.string().valid('New', 'Investigating', 'Confirmed', 'False Positive', 'Resolved', 'Ignored').optional(),
  investigationNote: Joi.string().trim().optional(),
  resolution: Joi.string().trim().optional(),
  updatedBy: Joi.string().trim().required()
});

const querySecurityAlertsSchema = Joi.object({
  alertType: Joi.string().optional(),
  severity: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  status: Joi.string().valid('New', 'Investigating', 'Confirmed', 'False Positive', 'Resolved', 'Ignored').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(50)
});

module.exports = {
  // Authentication
  loginSchema,
  registerSchema,
  ssoLoginSchema,
  mfaSetupSchema,
  verifyMfaSchema,
  changePasswordSchema,
  resetPasswordSchema,
  
  // RBAC
  createRoleSchema,
  updateRoleSchema,
  assignRoleSchema,
  checkPermissionSchema,
  
  // Audit
  createAuditLogSchema,
  queryAuditLogsSchema,
  
  // IP Whitelist
  addIPWhitelistSchema,
  updateIPWhitelistSchema,
  checkIPWhitelistSchema,
  
  // Session
  createSessionSchema,
  updateSessionSchema,
  terminateSessionSchema,
  
  // Backup
  createBackupSchema,
  restoreBackupSchema,
  verifyBackupSchema,
  
  // Alerts
  createSecurityAlertSchema,
  updateSecurityAlertSchema,
  querySecurityAlertsSchema
};
