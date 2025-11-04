/**
 * Healthcare Law Matter Model - Sequelize Model for Healthcare Law
 * Tracks HIPAA compliance, medical malpractice, and healthcare matters
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
  tableName: 'healthcare_law_matters',
  timestamps: true
})
export class HealthcareLawMatter extends Model {
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

  @Index
  @Column(DataType.ENUM('hipaa-compliance', 'medical-malpractice', 'licensing', 'regulatory', 'other'))
  matterType?: string;

  @Column(DataType.STRING)
  healthcareProvider?: string;

  @Column(DataType.STRING)
  facility?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'investigation', 'compliance', 'litigation', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Column(DataType.TEXT)
  complianceIssues?: string;

  @Column(DataType.JSONB)
  regulatoryRequirements?: object[];

  @Column(DataType.TEXT)
  resolution?: string;

  @Column(DataType.TEXT)
  notes?: string;

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
