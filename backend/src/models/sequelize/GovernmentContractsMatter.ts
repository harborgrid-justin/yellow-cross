/**
 * Government Contracts Matter Model - Sequelize Model for Government Contracts Management
 * Tracks government contract matters and compliance
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
  tableName: 'government_contracts_matters',
  timestamps: true
})
export class GovernmentContractsMatter extends Model {
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
  @Column(DataType.ENUM('bid-preparation', 'contract-negotiation', 'compliance', 'claim', 'protest', 'audit', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  contractorName!: string;

  @Column(DataType.STRING)
  governmentAgency?: string;

  @Column(DataType.STRING)
  contractNumber?: string;

  @Column(DataType.DECIMAL(15, 2))
  contractValue?: number;

  @Column(DataType.DATE)
  awardDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'bidding', 'awarded', 'performance', 'audit', 'dispute', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  complianceRequirements?: object[];

  @Column(DataType.JSONB)
  modifications?: object[];

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
