/**
 * Construction Law Matter Model - Sequelize Model for Construction Law Management
 * Tracks construction disputes and contract matters
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
  tableName: 'construction_law_matters',
  timestamps: true
})
export class ConstructionLawMatter extends Model {
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
  @Column(DataType.ENUM('contract-dispute', 'defect-claim', 'delay-claim', 'lien', 'bond-claim', 'bid-protest', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  projectName!: string;

  @Column(DataType.STRING)
  contractorName?: string;

  @Column(DataType.STRING)
  ownerName?: string;

  @Column(DataType.DECIMAL(15, 2))
  contractAmount?: number;

  @Column(DataType.DATE)
  projectStartDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'mediation', 'arbitration', 'litigation', 'settled', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  claims?: object[];

  @Column(DataType.JSONB)
  changeOrders?: object[];

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
