/**
 * Authentication Feature
 * Comprehensive user authentication and authorization system
 */

import express from 'express';
const router = express.Router();
import { isConnected } from '../config/database';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { User } from '../models/sequelize/User';

// JWT Secret (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  jobTitle: Joi.string().optional(),
  department: Joi.string().optional()
});

const loginSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required()
}).xor('username', 'email').messages({
  'object.xor': 'Please provide either username or email'
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords must match'
  })
});

const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords must match'
  })
});

// Helper function to generate JWT tokens
const generateTokens = (user: User) => {
  const payload = {
    id: user.id,
    userId: user.userId,
    username: user.username,
    email: user.email,
    roles: user.roles || [],
    permissions: user.permissions || []
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });

  return { accessToken, refreshToken };
};

// Helper function to validate requests
const validateRequest = (schema: any, data: any) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Cannot register users at this time.'
      });
    }

    const validatedData = validateRequest(registerSchema, req.body);

    // Check if username already exists
    const existingUsername = await User.findByUsername(validatedData.username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findByEmail(validatedData.email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Generate unique userId
    const userId = `USR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // Create user
    const user = await User.create({
      userId,
      username: validatedData.username.toLowerCase(),
      email: validatedData.email.toLowerCase(),
      password: validatedData.password, // Will be hashed by BeforeCreate hook
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      fullName: validatedData.firstName && validatedData.lastName 
        ? `${validatedData.firstName} ${validatedData.lastName}`.trim()
        : validatedData.firstName || validatedData.lastName,
      phoneNumber: validatedData.phoneNumber,
      jobTitle: validatedData.jobTitle,
      department: validatedData.department,
      roles: ['User'], // Default role
      status: 'Active',
      isVerified: false
    });

    // Generate tokens
    const tokens = generateTokens(user);

    // Don't send password in response
    const userResponse = user.toJSON();
    delete (userResponse as any).password;
    delete (userResponse as any).passwordHistory;
    delete (userResponse as any).mfaSecret;
    delete (userResponse as any).mfaBackupCodes;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        ...tokens
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Cannot login at this time.'
      });
    }

    const validatedData = validateRequest(loginSchema, req.body);
    
    // Find user by username or email
    let user: User | null = null;
    if (validatedData.username) {
      user = await User.findByUsername(validatedData.username);
    } else if (validatedData.email) {
      user = await User.findByEmail(validatedData.email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.status === 'Locked' && user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if account is active
    if (user.status !== 'Active' && user.status !== 'Locked') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    
    // Get IP and user agent
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    if (!isPasswordValid) {
      // Record failed login attempt
      await user.recordLoginAttempt(false, ipAddress, userAgent, 'Invalid password');
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // If account was locked but lock time expired, unlock it
    if (user.status === 'Locked') {
      user.status = 'Active';
      user.lockedUntil = undefined;
    }

    // Record successful login
    await user.recordLoginAttempt(true, ipAddress, userAgent, null);
    
    // Create session
    const sessionId = user.createSession(ipAddress, userAgent);
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);

    // Don't send sensitive data in response
    const userResponse = user.toJSON();
    delete (userResponse as any).password;
    delete (userResponse as any).passwordHistory;
    delete (userResponse as any).mfaSecret;
    delete (userResponse as any).mfaBackupCodes;
    delete (userResponse as any).resetPasswordToken;
    delete (userResponse as any).verificationToken;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        sessionId,
        ...tokens
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * User logout
 */
router.post('/logout', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Logged out (client-side only - database not connected)'
      });
    }

    const { sessionId } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await User.findByPk(decoded.id);
    if (user && sessionId) {
      await user.endSession(sessionId);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Cannot refresh token at this time.'
      });
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const user = await User.findByPk(decoded.id);

    if (!user || user.status !== 'Active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token or user not active'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't send sensitive data
    const userResponse = user.toJSON();
    delete (userResponse as any).password;
    delete (userResponse as any).passwordHistory;
    delete (userResponse as any).mfaSecret;
    delete (userResponse as any).mfaBackupCodes;
    delete (userResponse as any).resetPasswordToken;
    delete (userResponse as any).verificationToken;

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
});

/**
 * PUT /api/auth/change-password
 * Change user password
 */
router.put('/change-password', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const validatedData = validateRequest(changePasswordSchema, req.body);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(validatedData.currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = validatedData.newPassword; // Will be hashed by BeforeUpdate hook
    user.mustChangePassword = false;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(requestPasswordResetSchema, req.body);

    const user = await User.findByEmail(validatedData.email);
    
    // Always return success even if user not found (security best practice)
    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists in our system, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = `RST-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`.toUpperCase();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // In production, send email with reset link
    // For now, return token (REMOVE IN PRODUCTION)
    res.json({
      success: true,
      message: 'If the email exists in our system, a password reset link has been sent.',
      // REMOVE IN PRODUCTION:
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error requesting password reset',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const validatedData = validateRequest(resetPasswordSchema, req.body);

    const user = await User.findOne({
      where: {
        resetPasswordToken: validatedData.token
      }
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = validatedData.newPassword; // Will be hashed by BeforeUpdate hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.mustChangePassword = false;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/verify/:token
 * Verify email with token
 */
router.get('/verify/:token', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const { token } = req.params;

    const user = await User.findOne({
      where: {
        verificationToken: token
      }
    });

    if (!user || !user.verificationExpires || user.verificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error verifying email',
      error: error.message
    });
  }
});

export default router;
