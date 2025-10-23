/**
 * Activity Feature - Timeline and activity feed endpoints
 * Provides activity logging, timeline views, and audit trail
 */

import { Router, Request, Response } from 'express';
import ActivityService from '../services/ActivityService';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @route GET /api/activity/timeline
 * @desc Get activity timeline with filtering
 */
router.get('/timeline', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      userId,
      entityType,
      entityId,
      category,
      action,
      startDate,
      endDate,
      limit = '50',
      offset = '0'
    } = req.query;

    const options = {
      userId: userId as string | undefined,
      entityType: entityType as string | undefined,
      entityId: entityId as string | undefined,
      category: category as string | undefined,
      action: action as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    };

    const result = await ActivityService.getTimeline(options);

    res.json({
      success: true,
      data: result.activities,
      total: result.total,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timeline',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/activity/my-activity
 * @desc Get current user's activity history
 */
router.get('/my-activity', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { limit = '50', offset = '0' } = req.query;

    const result = await ActivityService.getUserActivity(
      userId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.json({
      success: true,
      data: result.activities,
      total: result.total,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: result.total > parseInt(offset as string) + parseInt(limit as string)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/activity/entity/:entityType/:entityId
 * @desc Get activity history for a specific entity
 */
router.get('/entity/:entityType/:entityId', authenticate, async (req: Request, res: Response) => {
  try {
    const { entityType, entityId } = req.params;
    const { limit = '50' } = req.query;

    const activities = await ActivityService.getEntityHistory(
      entityType,
      entityId,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entity history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/activity/log
 * @desc Manually log an activity (for system or special cases)
 */
router.post('/log', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      action,
      entityType,
      entityId,
      description,
      metadata,
      changes,
      category,
      severity,
      tags
    } = req.body;

    if (!action || !entityType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: action, entityType, description'
      });
    }

    const activity = await ActivityService.logActivity({
      userId,
      action,
      entityType,
      entityId,
      description,
      metadata,
      changes,
      category,
      severity,
      tags,
      req
    });

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to log activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/activity/stats
 * @desc Get activity statistics
 */
router.get('/stats', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const stats = await ActivityService.getActivityStats({
      userId: userId as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get activity stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/activity/case/:caseId
 * @desc Get activity history for a case
 */
router.get('/case/:caseId', authenticate, async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;
    const { limit = '50' } = req.query;

    const activities = await ActivityService.getEntityHistory(
      'case',
      caseId,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/activity/document/:documentId
 * @desc Get activity history for a document
 */
router.get('/document/:documentId', authenticate, async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { limit = '50' } = req.query;

    const activities = await ActivityService.getEntityHistory(
      'document',
      documentId,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document activity',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route DELETE /api/activity/cleanup
 * @desc Clean up old activities (admin only)
 */
router.delete('/cleanup', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const { daysToKeep = '90' } = req.query;

    const deleted = await ActivityService.cleanupOldActivities(parseInt(daysToKeep as string));

    res.json({
      success: true,
      message: `Deleted ${deleted} old activities`,
      deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
