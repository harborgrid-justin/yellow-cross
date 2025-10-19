/**
 * Authentication Middleware
 * JWT-based authentication and authorization middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/sequelize/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        username: string;
        email: string;
        roles: string[];
        permissions: string[];
      };
    }
  }
}

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format. Use: Bearer <token>'
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Attach user info to request
    req.user = {
      id: decoded.id,
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      roles: decoded.roles || [],
      permissions: decoded.permissions || []
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please refresh your token.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/**
 * Require specific role(s)
 * Usage: requireRole('Admin') or requireRole(['Admin', 'Attorney'])
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const userRoles = req.user.roles || [];

    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${requiredRoles.join(' or ')}`,
        requiredRoles,
        userRoles
      });
    }

    next();
  };
};

/**
 * Require specific permission(s)
 * Usage: requirePermission('cases:create') or requirePermission(['cases:create', 'cases:update'])
 */
export const requirePermission = (permissions: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    const userPermissions = req.user.permissions || [];
    const userRoles = req.user.roles || [];

    // Admin has all permissions
    if (userRoles.includes('Admin')) {
      return next();
    }

    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission(s): ${requiredPermissions.join(' or ')}`,
        requiredPermissions,
        userPermissions
      });
    }

    next();
  };
};

/**
 * Optional authentication - attaches user if token provided but doesn't require it
 */
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    req.user = {
      id: decoded.id,
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      roles: decoded.roles || [],
      permissions: decoded.permissions || []
    };

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

/**
 * Check if user is self or has admin role
 * Useful for endpoints where users can only access their own data unless they're admin
 */
export const requireSelfOrAdmin = (userIdParam: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const targetUserId = req.params[userIdParam];
    const isAdmin = req.user.roles.includes('Admin');
    const isSelf = req.user.id === targetUserId || req.user.userId === targetUserId;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own data.'
      });
    }

    next();
  };
};

/**
 * Rate limiting by user
 * More sophisticated than global rate limiting
 */
export const userRateLimit = (maxRequests: number, windowMs: number) => {
  const userRequests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(); // Let authenticate middleware handle this
    }

    const userId = req.user.id;
    const now = Date.now();
    const userLimit = userRequests.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      userRequests.set(userId, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      const resetIn = Math.ceil((userLimit.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
        resetIn
      });
    }

    userLimit.count++;
    next();
  };
};

/**
 * Verify user account is active
 */
export const requireActiveAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact administrator.',
        accountStatus: user.status
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying account status',
      error: error.message
    });
  }
};

/**
 * Require email verification
 */
export const requireVerifiedEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email verification required. Please verify your email address.',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying email status',
      error: error.message
    });
  }
};

export default {
  authenticate,
  requireRole,
  requirePermission,
  optionalAuthenticate,
  requireSelfOrAdmin,
  userRateLimit,
  requireActiveAccount,
  requireVerifiedEmail
};
