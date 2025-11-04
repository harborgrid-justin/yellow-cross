/**
 * Tax Law Matter Model - Sequelize Model for Tax Law
 * Tracks tax filings, audits, and tax disputes
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
  tableName: 'tax_law_matters',
  timestamps: true
})
export class TaxLawMatter extends Model {
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
  @Column(DataType.ENUM('filing', 'audit', 'dispute', 'planning', 'litigation', 'other'))
  matterType?: string;

  @Column(DataType.STRING)
  taxYear?: string;

  @Column(DataType.STRING)
  taxpayerName?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'audit', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.STRING)
  irsAgent?: string;

  @Column(DataType.DATE)
  filingDate?: Date;

  @Column(DataType.DATE)
  auditDate?: Date;

  @Column(DataType.DECIMAL(15, 2))
  taxAmount?: number;

  @Column(DataType.DECIMAL(15, 2))
  penaltiesAmount?: number;

  @Column(DataType.TEXT)
  issues?: string;

  @Column(DataType.TEXT)
  resolution?: string;

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
