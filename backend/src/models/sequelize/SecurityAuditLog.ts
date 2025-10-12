/**
 * SecurityAuditLog Model - Sequelize Model for Security Audit Trail
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  Default,
  AllowNull,
  PrimaryKey,
  CreatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'security_audit_logs',
  timestamps: true,
  updatedAt: false
})
export class SecurityAuditLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  userId!: string;

  @Column(DataType.STRING)
  username?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  action!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  resource!: string;

  @Column(DataType.STRING)
  resourceId?: string;

  @Default('Success')
  @Index
  @Column(DataType.STRING)
  result!: string;

  @Column(DataType.STRING)
  ipAddress?: string;

  @Column(DataType.STRING)
  userAgent?: string;

  @Column(DataType.JSONB)
  details?: object;

  @Column(DataType.JSONB)
  changes?: object;

  @Column(DataType.STRING)
  severity?: string;

  @Column(DataType.TEXT)
  message?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  timestamp!: Date;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  // Static method to log action
  static async logAction(data: {
    userId: string;
    username?: string;
    action: string;
    resource: string;
    resourceId?: string;
    result?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: object;
    changes?: object;
    severity?: string;
    message?: string;
  }): Promise<SecurityAuditLog> {
    return await SecurityAuditLog.create({
      ...data,
      timestamp: new Date()
    });
  }
}

export default SecurityAuditLog;
