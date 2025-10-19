/**
 * Securities Law Matter Model - Sequelize Model for Securities Law
 * Tracks SEC filings, securities compliance, and regulatory matters
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
  tableName: 'securities_law_matters',
  timestamps: true
})
export class SecuritiesLawMatter extends Model {
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
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Index
  @Column(DataType.ENUM('sec-filing', 'offering', 'compliance', 'investigation', 'litigation', 'other'))
  matterType?: string;

  @Column(DataType.STRING)
  secFilingType?: string;

  @Column(DataType.STRING)
  company?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'filed', 'investigation', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  filingDate?: Date;

  @Column(DataType.DATE)
  effectiveDate?: Date;

  @Column(DataType.DECIMAL(15, 2))
  offeringAmount?: number;

  @Column(DataType.TEXT)
  secureityType?: string;

  @Column(DataType.JSONB)
  regulatoryRequirements?: object[];

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
