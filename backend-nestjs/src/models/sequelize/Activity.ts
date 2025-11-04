/**
 * Activity Model - Activity logging for timeline/activity feed
 * Tracks all user actions and system events for audit and timeline display
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
  tableName: 'activities',
  timestamps: true
})
export class Activity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Index
  @Column(DataType.UUID)
  userId?: string; // Null for system activities

  @BelongsTo(() => User)
  user?: User;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  action!: string; // 'created', 'updated', 'deleted', 'restored', 'assigned', etc.

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  entityType!: string; // 'case', 'document', 'task', 'client', etc.

  @Index
  @Column(DataType.STRING)
  entityId?: string; // ID of the affected entity

  @AllowNull(false)
  @Column(DataType.STRING)
  description!: string; // Human-readable description

  @Column(DataType.JSONB)
  metadata?: object; // Additional context data

  @Column(DataType.JSONB)
  changes?: object; // Before/after values for updates

  @Column(DataType.STRING)
  ipAddress?: string;

  @Column(DataType.STRING)
  userAgent?: string;

  @Index
  @Column(DataType.STRING)
  category?: string; // 'case_management', 'document', 'user', 'system', etc.

  @Column(DataType.STRING)
  severity?: string; // 'info', 'warning', 'error', 'critical'

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Instance methods
  toTimelineItem(): any {
    return {
      id: this.id,
      action: this.action,
      entityType: this.entityType,
      entityId: this.entityId,
      description: this.description,
      user: this.user ? {
        id: this.user.id,
        username: this.user.username,
        displayName: this.user.displayName
      } : null,
      category: this.category,
      severity: this.severity,
      createdAt: this.createdAt,
      metadata: this.metadata
    };
  }

  // Static methods
  static async logActivity(data: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    description: string;
    metadata?: object;
    changes?: object;
    category?: string;
    severity?: string;
    tags?: string[];
    ipAddress?: string;
    userAgent?: string;
  }): Promise<Activity> {
    return await Activity.create(data);
  }

  static async getTimeline(options: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    category?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ activities: Activity[]; total: number }> {
    const {
      userId,
      entityType,
      entityId,
      category,
      action,
      startDate,
      endDate,
      limit = 50,
      offset = 0
    } = options;

    const where: any = {};

    if (userId) where.userId = userId;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (category) where.category = category;
    if (action) where.action = action;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = startDate;
      if (endDate) where.createdAt[Op.lte] = endDate;
    }

    const { rows, count } = await Activity.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'fullName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      activities: rows,
      total: count
    };
  }

  static async getEntityHistory(
    entityType: string,
    entityId: string,
    limit: number = 50
  ): Promise<Activity[]> {
    return await Activity.findAll({
      where: { entityType, entityId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });
  }

  static async getUserActivity(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ activities: Activity[]; total: number }> {
    const { rows, count } = await Activity.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      activities: rows,
      total: count
    };
  }

  static async deleteOldActivities(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deleted = await Activity.destroy({
      where: {
        createdAt: {
          [Op.lt]: cutoffDate
        }
      }
    });

    return deleted;
  }
}

export default Activity;
