/**
 * Civil Rights Matter Model - Sequelize Model for Civil Rights Management
 * Tracks civil rights cases and discrimination matters
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
  tableName: 'civil_rights_matters',
  timestamps: true
})
export class CivilRightsMatter extends Model {
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
  @Column(DataType.ENUM('discrimination', 'police-misconduct', 'voting-rights', 'housing-discrimination', 'constitutional-violation', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  plaintiffName!: string;

  @Column(DataType.STRING)
  defendantName?: string;

  @Column(DataType.STRING)
  violationType?: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'complaint-filed', 'discovery', 'mediation', 'trial', 'appeal', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  allegations?: object[];

  @Column(DataType.JSONB)
  remediesSought?: object[];

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
