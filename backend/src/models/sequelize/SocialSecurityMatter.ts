/**
 * Social Security Matter Model - Sequelize Model for Social Security Management
 * Tracks social security disability and benefits claims
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
  tableName: 'social_security_matters',
  timestamps: true
})
export class SocialSecurityMatter extends Model {
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
  @Column(DataType.ENUM('ssdi', 'ssi', 'retirement', 'survivors', 'medicare', 'appeal', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  claimantName!: string;

  @Column(DataType.STRING)
  ssnLast4?: string;

  @Column(DataType.STRING)
  disabilityType?: string;

  @Column(DataType.DATE)
  applicationDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'initial', 'reconsideration', 'hearing', 'appeals-council', 'federal-court', 'approved', 'denied', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  medicalRecords?: object[];

  @Column(DataType.JSONB)
  appealHistory?: object[];

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
