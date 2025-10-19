/**
 * Bankruptcy Case Model - Sequelize Model for Bankruptcy Management
 * Tracks bankruptcy filings, creditors, and asset schedules
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
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'bankruptcy_cases',
  timestamps: true
})
export class BankruptcyCase extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Index
  @Column(DataType.ENUM('chapter-7', 'chapter-11', 'chapter-13'))
  chapter?: string;

  @Column(DataType.STRING)
  debtorName?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'discharged', 'dismissed', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  filingDate?: Date;

  @Column(DataType.DATE)
  meetingDate?: Date;

  @Column(DataType.STRING)
  trustee?: string;

  @Column(DataType.DECIMAL(15, 2))
  totalDebt?: number;

  @Column(DataType.DECIMAL(15, 2))
  totalAssets?: number;

  @Column(DataType.JSONB)
  creditors?: object[];

  @Column(DataType.JSONB)
  assetSchedule?: object[];

  @Column(DataType.TEXT)
  notes?: string;

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
