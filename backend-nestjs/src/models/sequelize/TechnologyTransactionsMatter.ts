/**
 * Technology Transactions Matter Model - Sequelize Model for Technology Transactions Management
 * Tracks software licenses, tech contracts, and IT agreements
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
  tableName: 'technology_transactions_matters',
  timestamps: true
})
export class TechnologyTransactionsMatter extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  matterNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('software-license', 'saas-agreement', 'development', 'consulting', 'outsourcing', 'cloud-services', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  partyName!: string;

  @Column(DataType.STRING)
  vendorName?: string;

  @Column(DataType.STRING)
  technologyType?: string;

  @Column(DataType.DECIMAL(15, 2))
  contractValue?: number;

  @Column(DataType.DATE)
  effectiveDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'negotiation', 'execution', 'implementation', 'operational', 'renewal', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  serviceLevel?: object[];

  @Column(DataType.JSONB)
  ipRights?: object[];

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  updatedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
