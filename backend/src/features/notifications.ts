/**
 * Notification Feature - Complete notification system endpoints
 * Provides real-time and email notifications with user preferences
 */

import { Router, Request, Response } from 'express';
import NotificationService from '../services/NotificationService';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route GET /api/notifications
 * @desc Get user notifications with pagination and filtering
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      isRead,
      category,
      limit = '20',
      offset = '0'
    } = req.query;

    const options = {
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
      category: category as string | undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    };

    const result = await NotificationService.getUserNotifications(userId, options);

    res.json({
      success: true,
      data: result.notifications,
      pagination: {
        total: result.total,
        limit: options.limit,
        offset: options.offset,
        hasMore: result.total > options.offset + options.limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/notifications/unread-count
 * @desc Get count of unread notifications
 */
router.get('/unread-count', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const count = await NotificationService.getUnreadCount(userId);

    res.json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/notifications
 * @desc Create a new notification (admin/system use)
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      userId,
      type,
      title,
      message,
      priority,
      category,
      actionUrl,
      metadata,
      channels,
      expiresAt
    } = req.body;

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, type, title, message'
      });
    }

    const notification = await NotificationService.createNotification({
      userId,
      type,
      title,
      message,
      priority,
      category,
      actionUrl,
      metadata,
      channels,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route PUT /api/notifications/:id/read
 * @desc Mark a notification as read
 */
router.put('/:id/read', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const notification = await NotificationService.markAsRead(id, userId);

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route PUT /api/notifications/mark-all-read
 * @desc Mark all notifications as read for current user
 */
router.put('/mark-all-read', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const count = await NotificationService.markAllAsRead(userId);

    res.json({
      success: true,
      message: `Marked ${count} notifications as read`,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete a notification
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await NotificationService.deleteNotification(id, userId);

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/notifications/preferences
 * @desc Get user notification preferences
 */
router.get('/preferences', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const preferences = await NotificationService.getUserPreferences(userId);

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get preferences',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route PUT /api/notifications/preferences
 * @desc Update user notification preferences
 */
router.put('/preferences', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const updates = req.body;

    const preferences = await NotificationService.updateUserPreferences(userId, updates);

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/notifications/broadcast
 * @desc Send notification to multiple users (admin only)
 */
router.post('/broadcast', authenticate, async (req: Request, res: Response) => {
  try {
    // Check if user has admin role
    const currentUser = (req as any).user;
    if (!currentUser.roles || !currentUser.roles.includes('Admin')) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Admin role required'
      });
    }

    const { userIds, ...notificationOptions } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'userIds array is required'
      });
    }

    const notifications = await NotificationService.broadcastNotification(
      userIds,
      notificationOptions
    );

    res.json({
      success: true,
      message: `Sent ${notifications.length} notifications`,
      count: notifications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to broadcast notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
