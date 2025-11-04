/**
 * Sports and Entertainment Law Matter Model - Sequelize Model for Sports and Entertainment Law Management
 * Tracks sports contracts, entertainment deals, and related legal matters
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
  tableName: 'sports_entertainment_matters',
  timestamps: true
})
export class SportsEntertainmentMatter extends Model {
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
  @Column(DataType.ENUM('athlete-contract', 'endorsement', 'media-rights', 'licensing', 'talent-agreement', 'dispute', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  clientName!: string;

  @Column(DataType.STRING)
  counterpartyName?: string;

  @Column(DataType.STRING)
  dealType?: string;

  @Column(DataType.DECIMAL(15, 2))
  dealValue?: number;

  @Column(DataType.DATE)
  effectiveDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'negotiation', 'execution', 'performance', 'dispute', 'completed', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  contractTerms?: object[];

  @Column(DataType.JSONB)
  rightsGranted?: object[];

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
