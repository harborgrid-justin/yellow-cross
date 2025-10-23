/**
 * NotificationService - Multi-channel notification system
 * Adapted from Twenty CRM notification system for Yellow Cross
 * 
 * @module NotificationService
 * @see {@link https://github.com/twentyhq/twenty}
 */

import winston from 'winston';
import nodemailer from 'nodemailer';
import { Notification, NotificationPreference, User } from '../models/sequelize';
import { Op } from 'sequelize';

/**
 * Notification creation options
 */
interface CreateNotificationOptions {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  actionUrl?: string;
  metadata?: object;
  channels?: string[];
  expiresAt?: Date;
}

/**
 * NotificationService provides multi-channel notification delivery
 * 
 * Features:
 * - In-app notifications
 * - Email notifications
 * - Real-time Socket.IO updates
 * - User preferences management
 * - Notification batching/digests
 */
export class NotificationService {
  private logger: winston.Logger;
  private emailTransporter: nodemailer.Transporter | null = null;
  private socketIO: any = null; // Will be set by Socket.IO initialization

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    });

    // Initialize email transporter if configured
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        } : undefined
      });
    }
  }

  /**
   * Set Socket.IO instance for real-time notifications
   */
  setSocketIO(io: any): void {
    this.socketIO = io;
  }

  /**
   * Create and send a notification
   */
  async createNotification(options: CreateNotificationOptions): Promise<Notification> {
    const {
      userId,
      type,
      title,
      message,
      priority = 'medium',
      category = 'system',
      actionUrl,
      metadata,
      channels = ['in-app', 'socket'],
      expiresAt
    } = options;

    try {
      // Get user preferences
      const preferences = await NotificationPreference.getOrCreate(userId);

      // Filter channels based on preferences
      const allowedChannels = channels.filter(channel => 
        preferences.shouldSendNotification(type, category, channel)
      );

      // Create notification
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        priority,
        category,
        actionUrl,
        metadata,
        channels: allowedChannels,
        expiresAt
      });

      // Send through allowed channels
      const sendPromises: Promise<any>[] = [];

      if (allowedChannels.includes('socket')) {
        sendPromises.push(this.sendSocketNotification(userId, notification));
      }

      if (allowedChannels.includes('email') && preferences.emailFrequency === 'immediate') {
        sendPromises.push(this.sendEmailNotification(userId, notification));
      }

      await Promise.allSettled(sendPromises);

      this.logger.info('Notification created', {
        notificationId: notification.id,
        userId,
        type,
        channels: allowedChannels
      });

      return notification;
    } catch (error) {
      this.logger.error('Failed to create notification', { error, userId, type });
      throw error;
    }
  }

  /**
   * Send notification via Socket.IO
   */
  private async sendSocketNotification(userId: string, notification: Notification): Promise<void> {
    if (!this.socketIO) {
      this.logger.warn('Socket.IO not initialized, skipping socket notification');
      return;
    }

    try {
      this.socketIO.to(`user:${userId}`).emit('notification', {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        category: notification.category,
        actionUrl: notification.actionUrl,
        metadata: notification.metadata,
        createdAt: notification.createdAt
      });

      this.logger.debug('Socket notification sent', { userId, notificationId: notification.id });
    } catch (error) {
      this.logger.error('Failed to send socket notification', { error, userId });
    }
  }

  /**
   * Send notification via email
   */
  private async sendEmailNotification(userId: string, notification: Notification): Promise<void> {
    if (!this.emailTransporter) {
      this.logger.warn('Email transporter not configured, skipping email notification');
      return;
    }

    try {
      const user = await User.findByPk(userId);
      if (!user || !user.email) {
        this.logger.warn('User not found or has no email', { userId });
        return;
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@yellowcross.com',
        to: user.email,
        subject: `[Yellow Cross] ${notification.title}`,
        html: this.generateEmailHTML(notification, user),
        text: notification.message
      };

      await this.emailTransporter.sendMail(mailOptions);
      await notification.markEmailSent();

      this.logger.info('Email notification sent', { userId, email: user.email });
    } catch (error) {
      this.logger.error('Failed to send email notification', { error, userId });
    }
  }

  /**
   * Generate HTML for email notification
   */
  private generateEmailHTML(notification: Notification, user: User): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; margin: 20px 0; }
          .priority-high, .priority-urgent { border-left: 4px solid #dc2626; }
          .priority-medium { border-left: 4px solid #f59e0b; }
          .priority-low { border-left: 4px solid #10b981; }
          .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 4px; margin-top: 20px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Yellow Cross</h1>
          </div>
          <div class="content priority-${notification.priority}">
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            ${notification.actionUrl ? `
              <a href="${notification.actionUrl}" class="button">View Details</a>
            ` : ''}
          </div>
          <div class="footer">
            <p>You received this notification because you are a user of Yellow Cross.</p>
            <p>To manage your notification preferences, visit your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string,
    options: {
      isRead?: boolean;
      category?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ notifications: Notification[]; total: number }> {
    const { isRead, category, limit = 20, offset = 0 } = options;

    const where: any = { userId };
    
    if (isRead !== undefined) {
      where.isRead = isRead;
    }
    
    if (category) {
      where.category = category;
    }

    const { rows, count } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      notifications: rows,
      total: count
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await notification.markAsRead();
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<number> {
    return await Notification.markAllAsRead(userId);
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await Notification.getUnreadCount(userId);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const deleted = await Notification.destroy({
      where: { id: notificationId, userId }
    });

    if (deleted === 0) {
      throw new Error('Notification not found');
    }
  }

  /**
   * Get or create user notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreference> {
    return await NotificationPreference.getOrCreate(userId);
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(
    userId: string,
    updates: Partial<NotificationPreference>
  ): Promise<NotificationPreference> {
    const preferences = await NotificationPreference.getOrCreate(userId);
    
    Object.assign(preferences, updates);
    await preferences.save();

    this.logger.info('Notification preferences updated', { userId });
    return preferences;
  }

  /**
   * Clean up expired notifications (to be run as a cron job)
   */
  async cleanupExpired(): Promise<number> {
    const deleted = await Notification.deleteExpired();
    this.logger.info('Expired notifications cleaned up', { count: deleted });
    return deleted;
  }

  /**
   * Send notification to multiple users
   */
  async broadcastNotification(
    userIds: string[],
    options: Omit<CreateNotificationOptions, 'userId'>
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const userId of userIds) {
      try {
        const notification = await this.createNotification({ ...options, userId });
        notifications.push(notification);
      } catch (error) {
        this.logger.error('Failed to send notification to user', { error, userId });
      }
    }

    return notifications;
  }
}

export default new NotificationService();
