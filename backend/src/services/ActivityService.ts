/**
 * ActivityService - Activity logging and timeline management
 * Adapted from Twenty CRM activity system for Yellow Cross
 * 
 * @module ActivityService
 * @see {@link https://github.com/twentyhq/twenty}
 */

import winston from 'winston';
import { Activity, User } from '../models/sequelize';
import { Request } from 'express';

/**
 * Activity logging options
 */
interface LogActivityOptions {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: object;
  changes?: object;
  category?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  tags?: string[];
  req?: Request;
}

/**
 * Timeline query options
 */
interface TimelineOptions {
  userId?: string;
  entityType?: string;
  entityId?: string;
  category?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * ActivityService provides comprehensive activity logging and timeline functionality
 * 
 * Features:
 * - Automatic activity logging
 * - Timeline views by user, entity, or global
 * - Activity filtering and search
 * - Change tracking
 * - Audit trail
 */
export class ActivityService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    });
  }

  /**
   * Log an activity
   */
  async logActivity(options: LogActivityOptions): Promise<Activity> {
    try {
      const {
        userId,
        action,
        entityType,
        entityId,
        description,
        metadata,
        changes,
        category,
        severity = 'info',
        tags,
        req
      } = options;

      // Extract request information if provided
      const ipAddress = req ? this.getIpAddress(req) : undefined;
      const userAgent = req ? req.headers['user-agent'] : undefined;

      const activity = await Activity.logActivity({
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
        ipAddress,
        userAgent
      });

      this.logger.info('Activity logged', {
        activityId: activity.id,
        action,
        entityType,
        userId
      });

      return activity;
    } catch (error) {
      this.logger.error('Failed to log activity', { error, options });
      throw error;
    }
  }

  /**
   * Get timeline/activity feed
   */
  async getTimeline(options: TimelineOptions): Promise<{
    activities: any[];
    total: number;
    pagination: {
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    try {
      const limit = options.limit || 50;
      const offset = options.offset || 0;

      const { activities, total } = await Activity.getTimeline({
        ...options,
        limit,
        offset
      });

      return {
        activities: activities.map(a => a.toTimelineItem()),
        total,
        pagination: {
          limit,
          offset,
          hasMore: total > offset + limit
        }
      };
    } catch (error) {
      this.logger.error('Failed to get timeline', { error, options });
      throw error;
    }
  }

  /**
   * Get activity history for a specific entity
   */
  async getEntityHistory(
    entityType: string,
    entityId: string,
    limit: number = 50
  ): Promise<Activity[]> {
    try {
      return await Activity.getEntityHistory(entityType, entityId, limit);
    } catch (error) {
      this.logger.error('Failed to get entity history', { error, entityType, entityId });
      throw error;
    }
  }

  /**
   * Get user's activity history
   */
  async getUserActivity(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ activities: Activity[]; total: number }> {
    try {
      return await Activity.getUserActivity(userId, limit, offset);
    } catch (error) {
      this.logger.error('Failed to get user activity', { error, userId });
      throw error;
    }
  }

  /**
   * Log case activity
   */
  async logCaseActivity(
    caseId: string,
    action: string,
    description: string,
    userId?: string,
    changes?: object,
    req?: Request
  ): Promise<Activity> {
    return await this.logActivity({
      userId,
      action,
      entityType: 'case',
      entityId: caseId,
      description,
      category: 'case_management',
      changes,
      req
    });
  }

  /**
   * Log document activity
   */
  async logDocumentActivity(
    documentId: string,
    action: string,
    description: string,
    userId?: string,
    changes?: object,
    req?: Request
  ): Promise<Activity> {
    return await this.logActivity({
      userId,
      action,
      entityType: 'document',
      entityId: documentId,
      description,
      category: 'document_management',
      changes,
      req
    });
  }

  /**
   * Log task activity
   */
  async logTaskActivity(
    taskId: string,
    action: string,
    description: string,
    userId?: string,
    changes?: object,
    req?: Request
  ): Promise<Activity> {
    return await this.logActivity({
      userId,
      action,
      entityType: 'task',
      entityId: taskId,
      description,
      category: 'task_management',
      changes,
      req
    });
  }

  /**
   * Log client activity
   */
  async logClientActivity(
    clientId: string,
    action: string,
    description: string,
    userId?: string,
    changes?: object,
    req?: Request
  ): Promise<Activity> {
    return await this.logActivity({
      userId,
      action,
      entityType: 'client',
      entityId: clientId,
      description,
      category: 'client_management',
      changes,
      req
    });
  }

  /**
   * Log user activity
   */
  async logUserActivity(
    targetUserId: string,
    action: string,
    description: string,
    userId?: string,
    changes?: object,
    req?: Request
  ): Promise<Activity> {
    return await this.logActivity({
      userId,
      action,
      entityType: 'user',
      entityId: targetUserId,
      description,
      category: 'user_management',
      changes,
      req
    });
  }

  /**
   * Log system activity
   */
  async logSystemActivity(
    action: string,
    description: string,
    metadata?: object,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ): Promise<Activity> {
    return await this.logActivity({
      action,
      entityType: 'system',
      description,
      category: 'system',
      severity,
      metadata
    });
  }

  /**
   * Get activity statistics
   */
  async getActivityStats(options: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    totalActivities: number;
    byAction: Record<string, number>;
    byEntityType: Record<string, number>;
    byCategory: Record<string, number>;
  }> {
    try {
      const where: any = {};

      if (options.userId) where.userId = options.userId;

      if (options.startDate || options.endDate) {
        where.createdAt = {};
        if (options.startDate) where.createdAt.gte = options.startDate;
        if (options.endDate) where.createdAt.lte = options.endDate;
      }

      const activities = await Activity.findAll({ where });

      const stats = {
        totalActivities: activities.length,
        byAction: {} as Record<string, number>,
        byEntityType: {} as Record<string, number>,
        byCategory: {} as Record<string, number>
      };

      activities.forEach(activity => {
        // Count by action
        stats.byAction[activity.action] = (stats.byAction[activity.action] || 0) + 1;

        // Count by entity type
        stats.byEntityType[activity.entityType] = (stats.byEntityType[activity.entityType] || 0) + 1;

        // Count by category
        if (activity.category) {
          stats.byCategory[activity.category] = (stats.byCategory[activity.category] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      this.logger.error('Failed to get activity stats', { error });
      throw error;
    }
  }

  /**
   * Clean up old activities (to be run as a cron job)
   */
  async cleanupOldActivities(daysToKeep: number = 90): Promise<number> {
    try {
      const deleted = await Activity.deleteOldActivities(daysToKeep);
      this.logger.info('Old activities cleaned up', { deleted, daysToKeep });
      return deleted;
    } catch (error) {
      this.logger.error('Failed to cleanup old activities', { error });
      throw error;
    }
  }

  /**
   * Extract IP address from request
   */
  private getIpAddress(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Create middleware for automatic activity logging
   */
  createLoggingMiddleware() {
    return async (req: Request, res: any, next: any) => {
      // Store original methods
      const originalJson = res.json;
      const originalSend = res.send;

      // Track response
      let responseLogged = false;

      const logResponse = async (statusCode: number, action: string) => {
        if (responseLogged) return;
        responseLogged = true;

        // Only log successful mutations (POST, PUT, DELETE, PATCH)
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          const user = (req as any).user;
          const userId = user?.id;

          // Determine entity type and action from URL
          const pathParts = req.path.split('/').filter(p => p);
          const entityType = pathParts[1] || 'unknown'; // e.g., /api/cases -> 'cases'

          let description = `${req.method} ${req.path}`;

          try {
            await this.logActivity({
              userId,
              action,
              entityType,
              description,
              category: entityType,
              severity: statusCode >= 400 ? 'error' : 'info',
              metadata: {
                method: req.method,
                path: req.path,
                statusCode
              },
              req
            });
          } catch (error) {
            // Don't fail the request if activity logging fails
            this.logger.error('Failed to log activity in middleware', { error });
          }
        }
      };

      // Override json method
      res.json = function (body: any) {
        logResponse(res.statusCode, 'api_request');
        return originalJson.call(this, body);
      };

      // Override send method
      res.send = function (body: any) {
        logResponse(res.statusCode, 'api_request');
        return originalSend.call(this, body);
      };

      next();
    };
  }
}

export default new ActivityService();
