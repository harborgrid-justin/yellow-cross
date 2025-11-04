/**
 * International Trade Matter Model - Sequelize Model for International Trade Management
 * Tracks international trade compliance and disputes
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
  tableName: 'international_trade_matters',
  timestamps: true
})
export class InternationalTradeMatter extends Model {
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
  @Column(DataType.ENUM('customs', 'export-controls', 'sanctions', 'tariffs', 'trade-agreement', 'dispute', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  companyName!: string;

  @Column(DataType.STRING)
  countries?: string;

  @Column(DataType.STRING)
  commodities?: string;

  @Column(DataType.DATE)
  transactionDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'review', 'clearance', 'investigation', 'appeal', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  regulatoryRequirements?: object[];

  @Column(DataType.JSONB)
  classifications?: object[];

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
