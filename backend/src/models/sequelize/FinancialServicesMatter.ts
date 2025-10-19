/**
 * Financial Services Matter Model - Sequelize Model for Financial Services Management
 * Tracks banking regulatory compliance and financial services legal matters
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
  tableName: 'financial_services_matters',
  timestamps: true
})
export class FinancialServicesMatter extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  matterNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('compliance', 'regulatory-filing', 'investigation', 'advisory', 'litigation', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  institutionName!: string;

  @Column(DataType.STRING)
  regulatoryAgency?: string;

  @Column(DataType.STRING)
  complianceArea?: string;

  @Column(DataType.DATE)
  filingDeadline?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'compliant', 'under-review', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  regulatoryRequirements?: object[];

  @Column(DataType.JSONB)
  filings?: object[];

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
