/**
 * PrivilegeLog Model - Sequelize Model
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
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'privilege_logs',
  timestamps: true
})
export class PrivilegeLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseId!: string;

  @Column(DataType.UUID)
  documentId?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  privilegeType!: string;

  @Column(DataType.STRING)
  batesNumber?: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  documentDescription!: string;

  @Column(DataType.STRING)
  author?: string;

  @Column(DataType.STRING)
  recipient?: string;

  @Column(DataType.DATE)
  dateCreated?: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  privilegeBasis!: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  clawbackProtection!: boolean;

  @AllowNull(false)
  @Column(DataType.STRING)
  loggedBy!: string;

  @Column(DataType.STRING)
  reviewedBy?: string;

  @Column(DataType.DATE)
  reviewDate?: Date;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default PrivilegeLog;
