/**
 * Non-Profit Law Matter Model - Sequelize Model for Non-Profit Law Management
 * Tracks non-profit legal matters and compliance
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
  tableName: 'non_profit_law_matters',
  timestamps: true
})
export class NonProfitLawMatter extends Model {
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
  @Column(DataType.ENUM('formation', 'tax-exemption', 'governance', 'compliance', 'grant-management', 'dissolution', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  organizationName!: string;

  @Column(DataType.STRING)
  taxExemptStatus?: string;

  @Column(DataType.STRING)
  ein?: string;

  @Column(DataType.DATE)
  incorporationDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'formation', 'operational', 'compliance-review', 'audit', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  boardMembers?: object[];

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
