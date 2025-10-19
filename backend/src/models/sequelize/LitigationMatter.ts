/**
 * Litigation Matter Model - Sequelize Model for Litigation Management
 * Tracks litigation matters with pleadings, discovery, and trial management
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  Default,
  Unique,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

@Table({
  tableName: 'litigation_matters',
  timestamps: true
})
export class LitigationMatter extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  litigationNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  caseId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('civil', 'criminal', 'administrative'))
  litigationType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  court!: string;

  @Column(DataType.STRING)
  judgeAssigned?: string;

  @Column(DataType.STRING)
  plaintiffCounsel?: string;

  @Column(DataType.STRING)
  defendantCounsel?: string;

  @Column(DataType.DATE)
  filingDate?: Date;

  @Column(DataType.DATE)
  trialDate?: Date;

  @Default('pending')
  @Index
  @Column(DataType.ENUM('pending', 'discovery', 'trial', 'settled', 'dismissed', 'judgment'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  pleadings?: object[];

  @Column(DataType.JSONB)
  discoveries?: object[];

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  updatedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}
