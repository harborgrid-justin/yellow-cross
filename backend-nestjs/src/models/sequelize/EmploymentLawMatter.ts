/**
 * Employment Law Matter Model - Sequelize Model for Employment Law
 * Tracks employment law cases, HR compliance, and employee matters
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
  tableName: 'employment_law_matters',
  timestamps: true
})
export class EmploymentLawMatter extends Model {
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
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Column(DataType.STRING)
  caseId?: string;

  @Index
  @Column(DataType.ENUM('discrimination', 'harassment', 'wrongful-termination', 'wage-dispute', 'contract-dispute', 'other'))
  matterType?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.STRING)
  employeeName?: string;

  @Column(DataType.STRING)
  employerName?: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Column(DataType.TEXT)
  details?: string;

  @Column(DataType.JSONB)
  documents?: object[];

  @Column(DataType.TEXT)
  resolution?: string;

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
