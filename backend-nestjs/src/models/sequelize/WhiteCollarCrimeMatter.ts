/**
 * White Collar Crime Matter Model - Sequelize Model for White Collar Crime Management
 * Tracks white collar crime defense matters
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
  tableName: 'white_collar_crime_matters',
  timestamps: true
})
export class WhiteCollarCrimeMatter extends Model {
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
  @Column(DataType.ENUM('fraud', 'embezzlement', 'money-laundering', 'securities-fraud', 'tax-evasion', 'corruption', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  defendantName!: string;

  @Column(DataType.STRING)
  prosecutingAgency?: string;

  @Column(DataType.STRING)
  allegations?: string;

  @Column(DataType.DATE)
  chargeDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'indictment', 'trial', 'plea-negotiation', 'sentencing', 'appeal', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  evidence?: object[];

  @Column(DataType.JSONB)
  legalStrategy?: object[];

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
