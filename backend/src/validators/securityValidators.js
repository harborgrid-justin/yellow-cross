/**
 * Security Validation Schemas using Joi
 * Input validation for security and access control operations
 */

const Joi = require('joi');

// Validation schema for user registration
const registerUserSchema = Joi.object({
  username: Joi.string().required().trim().lowercase().min(3).max(50).alphanum(),
  email: Joi.string().required().trim().lowercase().email(),
  password: Joi.string().required().min(8).max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  firstName: Joi.string().required().trim().min(1).max(100),
  lastName: Joi.string().required().trim().min(1).max(100),
  jobTitle: Joi.string().trim().allow('').max(100),
  department: Joi.string().trim().allow('').max(100),
  phoneNumber: Joi.string().trim().allow('').pattern(/^\+?[\d\s()-]+$/),
  roles: Joi.array().items(Joi.string().valid('Admin', 'Attorney', 'Paralegal', 'Staff', 'Client', 'Guest')).min(1).required()
});

// Validation schema for user login
const loginSchema = Joi.object({
  username: Joi.string().trim().lowercase().optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  password: Joi.string().required(),
  mfaCode: Joi.string().length(6).pattern(/^\d+$/).optional()
}).xor('username', 'email'); // Either username or email required

// Validation schema for password change
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(8).max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
    .message('Passwords must match')
});

// Validation schema for password reset request
const resetPasswordRequestSchema = Joi.object({
  email: Joi.string().required().trim().lowercase().email()
});

// Validation schema for password reset
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().required().min(8).max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
    .message('Passwords must match')
});

// Validation schema for role assignment
const assignRoleSchema = Joi.object({
  userId: Joi.string().required(),
  roles: Joi.array().items(Joi.string().valid('Admin', 'Attorney', 'Paralegal', 'Staff', 'Client', 'Guest')).min(1).required(),
  modifiedBy: Joi.string().required()
});

// Validation schema for permission management
const managePermissionSchema = Joi.object({
  userId: Joi.string().required(),
  permissions: Joi.array().items(Joi.string()).required(),
  action: Joi.string().required().valid('add', 'remove', 'replace'),
  modifiedBy: Joi.string().required()
});

// Validation schema for IP whitelist
const ipWhitelistSchema = Joi.object({
  ipAddress: Joi.string().required().ip({ version: ['ipv4', 'ipv6'] }),
  description: Joi.string().trim().allow('').max(200),
  userId: Joi.string().optional()
});

// Validation schema for session management
const sessionSchema = Joi.object({
  userId: Joi.string().required(),
  ipAddress: Joi.string().required().ip({ version: ['ipv4', 'ipv6'] }),
  userAgent: Joi.string().required().max(500)
});

// Validation schema for MFA setup
const mfaSetupSchema = Joi.object({
  userId: Joi.string().required(),
  enabled: Joi.boolean().required()
});

// Validation schema for MFA verification
const mfaVerifySchema = Joi.object({
  userId: Joi.string().required(),
  code: Joi.string().required().length(6).pattern(/^\d+$/)
});

// Validation schema for security audit log
const auditLogSchema = Joi.object({
  eventType: Joi.string().required().valid(
    'Login', 'Logout', 'Failed Login', 'Password Change', 'Password Reset',
    'User Created', 'User Updated', 'User Deleted', 'User Suspended',
    'Permission Changed', 'Role Changed', 'MFA Enabled', 'MFA Disabled',
    'Session Created', 'Session Ended', 'Access Denied', 'Unauthorized Access',
    'Data Access', 'Data Modified', 'Data Deleted', 'Data Exported',
    'Security Alert', 'Suspicious Activity', 'Compliance Violation',
    'System Config Changed', 'Backup Created', 'Backup Restored'
  ),
  severity: Joi.string().valid('Critical', 'High', 'Medium', 'Low', 'Info').default('Info'),
  userId: Joi.string().optional(),
  username: Joi.string().optional(),
  action: Joi.string().required().max(200),
  resource: Joi.string().optional(),
  resourceId: Joi.string().optional(),
  ipAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
  userAgent: Joi.string().max(500).optional(),
  status: Joi.string().valid('Success', 'Failed', 'Blocked', 'Pending').default('Success'),
  statusMessage: Joi.string().max(500).optional(),
  context: Joi.object().optional()
});

// Validation schema for user update
const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).optional(),
  lastName: Joi.string().trim().min(1).max(100).optional(),
  jobTitle: Joi.string().trim().allow('').max(100).optional(),
  department: Joi.string().trim().allow('').max(100).optional(),
  phoneNumber: Joi.string().trim().allow('').pattern(/^\+?[\d\s()-]+$/).optional(),
  status: Joi.string().valid('Active', 'Inactive', 'Suspended', 'Locked', 'Pending').optional(),
  preferences: Joi.object({
    language: Joi.string().optional(),
    timezone: Joi.string().optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      sms: Joi.boolean().optional(),
      push: Joi.boolean().optional()
    }).optional()
  }).optional(),
  lastModifiedBy: Joi.string().required()
});

module.exports = {
  registerUserSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  assignRoleSchema,
  managePermissionSchema,
  ipWhitelistSchema,
  sessionSchema,
  mfaSetupSchema,
  mfaVerifySchema,
  auditLogSchema,
  updateUserSchema
};
