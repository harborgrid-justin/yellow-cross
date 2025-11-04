/**
 * Education Law Matter Model - Sequelize Model for Education Law Management
 * Tracks education law matters and compliance
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
  tableName: 'education_law_matters',
  timestamps: true
})
export class EducationLawMatter extends Model {
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
  @Column(DataType.ENUM('special-education', 'title-ix', 'student-discipline', 'employee-dispute', 'compliance', 'policy', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  institutionName!: string;

  @Column(DataType.STRING)
  studentName?: string;

  @Column(DataType.STRING)
  regulatoryAgency?: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'mediation', 'hearing', 'appeal', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  complianceIssues?: object[];

  @Column(DataType.JSONB)
  proceedings?: object[];

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
