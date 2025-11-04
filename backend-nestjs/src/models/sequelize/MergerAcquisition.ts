/**
 * Merger and Acquisition Model - Sequelize Model for M&A Transactions
 * Tracks M&A deals, due diligence, and integration planning
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
  tableName: 'mergers_acquisitions',
  timestamps: true
})
export class MergerAcquisition extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  dealNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  dealName!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('merger', 'acquisition', 'divestiture', 'joint-venture'))
  dealType!: string;

  @Column(DataType.STRING)
  targetCompany?: string;

  @Column(DataType.STRING)
  acquiringCompany?: string;

  @Column(DataType.DECIMAL(15, 2))
  dealValue?: number;

  @Column(DataType.DATE)
  announcementDate?: Date;

  @Column(DataType.DATE)
  expectedClosingDate?: Date;

  @Default('pending')
  @Index
  @Column(DataType.ENUM('pending', 'due-diligence', 'negotiation', 'closing', 'completed', 'cancelled'))
  status!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.JSONB)
  dueDiligenceItems?: object[];

  @Column(DataType.JSONB)
  integrationPlan?: object;

  @Column(DataType.ARRAY(DataType.STRING))
  documents?: string[];

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
