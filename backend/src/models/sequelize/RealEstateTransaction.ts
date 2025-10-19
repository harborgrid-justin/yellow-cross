/**
 * Real Estate Transaction Model - Sequelize Model for Real Estate Transactions
 * Tracks property transactions, closings, and title work
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
  tableName: 'real_estate_transactions',
  timestamps: true
})
export class RealEstateTransaction extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  transactionNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  propertyAddress!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('purchase', 'sale', 'lease', 'refinance'))
  transactionType!: string;

  @Column(DataType.DECIMAL(15, 2))
  purchasePrice?: number;

  @Column(DataType.DATE)
  closingDate?: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  clientId!: string;

  @Default('pending')
  @Index
  @Column(DataType.ENUM('pending', 'in-progress', 'completed', 'cancelled'))
  status!: string;

  @Column(DataType.STRING)
  buyerName?: string;

  @Column(DataType.STRING)
  sellerName?: string;

  @Column(DataType.TEXT)
  propertyDescription?: string;

  @Column(DataType.JSONB)
  documents?: object[];

  @Column(DataType.JSONB)
  checklist?: object[];

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
