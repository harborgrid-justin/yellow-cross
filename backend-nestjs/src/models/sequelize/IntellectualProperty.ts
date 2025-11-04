/**
 * Intellectual Property Model - Sequelize Model for IP Management
 * Tracks patents, trademarks, copyrights, and trade secrets
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
  tableName: 'intellectual_properties',
  timestamps: true
})
export class IntellectualProperty extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  ipNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('patent', 'trademark', 'copyright', 'trade-secret'))
  ipType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  applicationNumber?: string;

  @Column(DataType.DATE)
  filingDate?: Date;

  @Column(DataType.DATE)
  grantDate?: Date;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  owner!: string;

  @Default('pending')
  @Index
  @Column(DataType.ENUM('pending', 'granted', 'rejected', 'expired', 'abandoned'))
  status!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.STRING)
  jurisdiction?: string;

  @Column(DataType.JSONB)
  filingHistory?: object[];

  @Column(DataType.ARRAY(DataType.STRING))
  relatedDocuments?: string[];

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
