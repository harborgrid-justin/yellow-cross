/**
 * EXAMPLE: Protected Feature with Authentication
 * 
 * This file demonstrates how to properly protect API endpoints with authentication.
 * Copy this pattern to other features to secure them.
 */

import express from 'express';
const router = express.Router();
import { isConnected } from '../config/database';
import Joi from 'joi';
import { Mediation } from '../models/sequelize/Mediation';

// Import authentication middleware
import { 
  authenticate, 
  requireRole, 
  requirePermission,
  requireActiveAccount 
} from '../middleware/auth';

// SECURITY: Consider adding rate limiting to prevent abuse
// import rateLimit from 'express-rate-limit';
// const createLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 10, // 10 requests per minute
//   message: 'Too many requests, please try again later'
// });

// Validation schemas
const createMediationSchema = Joi.object({
  caseId: Joi.string().required(),
  mediationType: Joi.string().valid('mediation', 'arbitration', 'negotiation').required(),
  mediatorName: Joi.string().required(),
  scheduledDate: Joi.date().required(),
  location: Joi.string().optional(),
  notes: Joi.string().optional()
  // Note: createdBy is now automatically set from req.user
});

const updateMediationSchema = Joi.object({
  status: Joi.string().valid('scheduled', 'in-progress', 'completed', 'cancelled').optional(),
  outcome: Joi.string().optional(),
  notes: Joi.string().optional()
  // Note: updatedBy is now automatically set from req.user
});

const validateRequest = (schema: any, data: any) => {
  const { error, value } = schema.validate(data);
  if (error) throw new Error(error.details[0].message);
  return value;
};

// ============================================================================
// APPLY AUTHENTICATION TO ALL ROUTES
// This protects every endpoint in this router
// ============================================================================
router.use(authenticate);
router.use(requireActiveAccount); // Only active accounts can use this feature

/**
 * POST /api/mediation/create
 * Create new mediation session
 * 
 * Access: Admin, Attorney only
 * Requires: mediation:create permission OR Admin/Attorney role
 */
router.post('/create', 
  requireRole(['Admin', 'Attorney']), // Only admins and attorneys can create mediations
  async (req, res) => {
    try {
      if (!isConnected()) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected'
        });
      }

      const validatedData = validateRequest(createMediationSchema, req.body);
      
      // Automatically track who created this
      // Since authenticate middleware is applied, req.user should always be defined
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      const createdBy = req.user.userId;
      
      const mediationNumber = `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
      
      const mediation = await Mediation.create({ 
        mediationNumber, 
        ...validatedData, 
        status: 'scheduled',
        createdBy
      });

      res.status(201).json({ 
        success: true, 
        message: 'Mediation created successfully', 
        data: mediation 
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        message: 'Error creating mediation', 
        error: error.message 
      });
    }
  }
);

/**
 * GET /api/mediation/:id
 * Get mediation details
 * 
 * Access: All authenticated users
 * Any logged-in user can view mediation details
 */
router.get('/:id', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const mediation = await Mediation.findByPk(req.params.id);
    
    if (!mediation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Mediation not found' 
      });
    }

    res.json({ 
      success: true, 
      data: mediation,
      // Include who is viewing (for audit trail)
      viewedBy: req.user?.userId
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * PUT /api/mediation/:id
 * Update mediation session
 * 
 * Access: Admin, Attorney only
 * Only authorized users can update mediations
 */
router.put('/:id',
  requireRole(['Admin', 'Attorney']),
  async (req, res) => {
    try {
      if (!isConnected()) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected'
        });
      }

      const validatedData = validateRequest(updateMediationSchema, req.body);
      
      const mediation = await Mediation.findByPk(req.params.id);
      
      if (!mediation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Mediation not found' 
        });
      }

      // Automatically track who updated this
      // Since authenticate middleware is applied, req.user should always be defined
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }
      const updatedBy = req.user.userId;
      
      await mediation.update({
        ...validatedData,
        updatedBy
      });

      res.json({ 
        success: true, 
        message: 'Mediation updated successfully', 
        data: mediation 
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        message: 'Error updating mediation', 
        error: error.message 
      });
    }
  }
);

/**
 * GET /api/mediation
 * List all mediations
 * 
 * Access: All authenticated users
 * List is filtered based on user role:
 * - Admins see all mediations
 * - Attorneys see their own mediations
 * - Others see limited info
 */
router.get('/', async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const userRoles = req.user?.roles || [];
    const isAdmin = userRoles.includes('Admin');
    const userId = req.user?.userId;

    // Build query based on role
    let whereClause: any = {};
    
    if (!isAdmin) {
      // Non-admins only see their own mediations
      whereClause.createdBy = userId;
    }

    const mediations = await Mediation.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json({ 
      success: true, 
      data: mediations,
      total: mediations.length,
      filtered: !isAdmin // Indicate if results are filtered
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: 'Error listing mediations', 
      error: error.message 
    });
  }
});

/**
 * DELETE /api/mediation/:id
 * Delete/archive mediation
 * 
 * Access: Admin only
 * Only admins can delete mediations
 */
router.delete('/:id',
  requireRole('Admin'), // Admins only
  async (req, res) => {
    try {
      if (!isConnected()) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected'
        });
      }

      const mediation = await Mediation.findByPk(req.params.id);
      
      if (!mediation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Mediation not found' 
        });
      }

      // Soft delete - just mark as deleted
      await mediation.destroy();

      res.json({ 
        success: true, 
        message: 'Mediation deleted successfully',
        deletedBy: req.user?.userId
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        message: 'Error deleting mediation', 
        error: error.message 
      });
    }
  }
);

/**
 * GET /api/mediation/stats/summary
 * Get mediation statistics
 * 
 * Access: Admin, Attorney only
 * Provides summary statistics for mediations
 */
router.get('/stats/summary',
  requireRole(['Admin', 'Attorney']),
  async (req, res) => {
    try {
      if (!isConnected()) {
        return res.status(503).json({
          success: false,
          message: 'Database not connected'
        });
      }

      const isAdmin = req.user?.roles.includes('Admin');
      const userId = req.user?.userId;

      // Filter by user if not admin
      const whereClause = isAdmin ? {} : { createdBy: userId };

      const [total, scheduled, inProgress, completed, cancelled] = await Promise.all([
        Mediation.count({ where: whereClause }),
        Mediation.count({ where: { ...whereClause, status: 'scheduled' } }),
        Mediation.count({ where: { ...whereClause, status: 'in-progress' } }),
        Mediation.count({ where: { ...whereClause, status: 'completed' } }),
        Mediation.count({ where: { ...whereClause, status: 'cancelled' } })
      ]);

      res.json({
        success: true,
        data: {
          total,
          byStatus: {
            scheduled,
            inProgress,
            completed,
            cancelled
          },
          scope: isAdmin ? 'all' : 'user'
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Error getting statistics',
        error: error.message
      });
    }
  }
);

export default router;

// ============================================================================
// MIGRATION NOTES FOR OTHER FEATURES
// ============================================================================
/*

To apply this pattern to other features:

1. Add imports at the top:
   import { authenticate, requireRole, requirePermission, requireActiveAccount } from '../middleware/auth';

2. Add router.use(authenticate) after router creation to protect all routes

3. For each endpoint, decide the access level:
   - Public (rare): Don't use authentication
   - Authenticated only: Just use authenticate
   - Role-based: Add requireRole(['Admin', 'Attorney'])
   - Permission-based: Add requirePermission('resource:action')

4. Remove 'createdBy' and 'updatedBy' from validation schemas - set them automatically:
   // Always check that req.user is defined first
   if (!req.user?.userId) {
     return res.status(401).json({ success: false, message: 'User authentication required' });
   }
   const createdBy = req.user.userId;
   
5. Use req.user to access current user info:
   - req.user.id - User UUID
   - req.user.userId - User ID (USR-xxx)
   - req.user.username
   - req.user.email
   - req.user.roles - Array of roles
   - req.user.permissions - Array of permissions

6. Filter data based on user role when appropriate:
   if (!req.user.roles.includes('Admin')) {
     // Filter to user's own data
   }

7. Test the protected endpoints:
   - Without token (should fail with 401)
   - With valid token (should work)
   - With wrong role (should fail with 403)

*/
