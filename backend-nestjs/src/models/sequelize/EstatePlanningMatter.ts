/**
 * Estate Planning Matter Model - Sequelize Model for Estate Planning
 * Tracks wills, trusts, probate, and estate planning matters
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
  tableName: 'estate_planning_matters',
  timestamps: true
})
export class EstatePlanningMatter extends Model {
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
  @Column(DataType.ENUM('will', 'trust', 'probate', 'power-of-attorney', 'healthcare-directive', 'other'))
  planType?: string;

  @Column(DataType.STRING)
  testatorName?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'draft', 'executed', 'probate', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  executionDate?: Date;

  @Column(DataType.DECIMAL(15, 2))
  estateValue?: number;

  @Column(DataType.JSONB)
  beneficiaries?: object[];

  @Column(DataType.JSONB)
  assets?: object[];

  @Column(DataType.STRING)
  executor?: string;

  @Column(DataType.TEXT)
  specialInstructions?: string;

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
