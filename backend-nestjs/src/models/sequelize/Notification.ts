/**
 * Notification Model - Sequelize Model for User Notifications
 * Supports multi-channel notifications (in-app, email, Socket.IO)
 */

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
  Default,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { User } from './User';

@Table({
  tableName: 'notifications',
  timestamps: true
})
export class Notification extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user?: User;

  @AllowNull(false)
  @Column(DataType.STRING)
  type!: string; // 'case_update', 'task_assigned', 'deadline_approaching', etc.

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  message!: string;

  @Column(DataType.STRING)
  priority!: string; // 'low', 'medium', 'high', 'urgent'

  @Column(DataType.STRING)
  category!: string; // 'case', 'task', 'document', 'system', etc.

  @Default(false)
  @Column(DataType.BOOLEAN)
  isRead!: boolean;

  @Column(DataType.DATE)
  readAt?: Date;

  @Column(DataType.STRING)
  actionUrl?: string; // Link to related resource

  @Column(DataType.JSONB)
  metadata?: object; // Additional data (e.g., caseId, taskId, etc.)

  @Column(DataType.ARRAY(DataType.STRING))
  channels?: string[]; // ['in-app', 'email', 'socket']

  @Default(false)
  @Column(DataType.BOOLEAN)
  emailSent!: boolean;

  @Column(DataType.DATE)
  emailSentAt?: Date;

  @Column(DataType.DATE)
  expiresAt?: Date;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Instance methods
  async markAsRead(): Promise<Notification> {
    this.isRead = true;
    this.readAt = new Date();
    return await this.save();
  }

  async markEmailSent(): Promise<Notification> {
    this.emailSent = true;
    this.emailSentAt = new Date();
    return await this.save();
  }

  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  // Static methods
  static async markAllAsRead(userId: string): Promise<number> {
    const [affectedCount] = await Notification.update(
      { isRead: true, readAt: new Date() },
      { where: { userId, isRead: false } }
    );
    return affectedCount;
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return await Notification.count({ where: { userId, isRead: false } });
  }

  static async deleteExpired(): Promise<number> {
    const now = new Date();
    const deleted = await Notification.destroy({
      where: {
        expiresAt: {
          [Op.lt]: now
        }
      }
    });
    return deleted;
  }
}

export default Notification;
