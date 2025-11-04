/**
 * Consumer Protection Matter Model - Sequelize Model for Consumer Protection Management
 * Tracks consumer protection cases and disputes
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
  tableName: 'consumer_protection_matters',
  timestamps: true
})
export class ConsumerProtectionMatter extends Model {
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
  @Column(DataType.ENUM('fraud', 'deceptive-practices', 'product-liability', 'warranty', 'debt-collection', 'credit-reporting', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  consumerName!: string;

  @Column(DataType.STRING)
  businessName?: string;

  @Column(DataType.STRING)
  productService?: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'complaint-filed', 'mediation', 'litigation', 'settlement', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  violations?: object[];

  @Column(DataType.JSONB)
  damages?: object[];

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
