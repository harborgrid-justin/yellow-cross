/**
 * Franchise Law Matter Model - Sequelize Model for Franchise Law Management
 * Tracks franchise agreements and disputes
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
  tableName: 'franchise_law_matters',
  timestamps: true
})
export class FranchiseLawMatter extends Model {
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
  @Column(DataType.ENUM('agreement-drafting', 'disclosure', 'termination', 'renewal', 'dispute', 'compliance', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  franchisorName!: string;

  @Column(DataType.STRING)
  franchiseeName?: string;

  @Column(DataType.STRING)
  brandName?: string;

  @Column(DataType.DATE)
  agreementDate?: Date;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'negotiation', 'execution', 'operational', 'dispute', 'terminated', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  territories?: object[];

  @Column(DataType.JSONB)
  fddHistory?: object[];

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
