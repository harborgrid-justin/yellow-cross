/**
 * Maritime Law Matter Model - Sequelize Model for Maritime Law Management
 * Tracks admiralty and maritime legal matters
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
  tableName: 'maritime_law_matters',
  timestamps: true
})
export class MaritimeLawMatter extends Model {
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
  @Column(DataType.ENUM('collision', 'salvage', 'cargo-damage', 'personal-injury', 'charter-dispute', 'pollution', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  vesselName!: string;

  @Column(DataType.STRING)
  vesselType?: string;

  @Column(DataType.STRING)
  flag?: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Column(DataType.STRING)
  location?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'arbitration', 'litigation', 'settled', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  surveyReports?: object[];

  @Column(DataType.JSONB)
  claimDetails?: object[];

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
