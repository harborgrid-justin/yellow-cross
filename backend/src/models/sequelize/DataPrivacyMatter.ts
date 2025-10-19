/**
 * Data Privacy Matter Model - Sequelize Model for Data Privacy and GDPR Management
 * Tracks data privacy compliance and GDPR matters
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
  tableName: 'data_privacy_matters',
  timestamps: true
})
export class DataPrivacyMatter extends Model {
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
  @Column(DataType.ENUM('gdpr-compliance', 'ccpa-compliance', 'data-breach', 'privacy-policy', 'dpia', 'investigation', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  organizationName!: string;

  @Column(DataType.STRING)
  regulatoryAuthority?: string;

  @Column(DataType.STRING)
  jurisdiction?: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Column(DataType.DATE)
  notificationDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'assessment', 'remediation', 'reporting', 'investigation', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  affectedData?: object[];

  @Column(DataType.JSONB)
  remediationSteps?: object[];

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
