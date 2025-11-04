/**
 * Cybersecurity Legal Matter Model - Sequelize Model for Cybersecurity Legal Management
 * Tracks cybersecurity incidents and legal matters
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
  tableName: 'cybersecurity_legal_matters',
  timestamps: true
})
export class CybersecurityLegalMatter extends Model {
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
  @Column(DataType.ENUM('data-breach', 'cyber-attack', 'compliance', 'incident-response', 'litigation', 'insurance-claim', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  organizationName!: string;

  @Column(DataType.STRING)
  incidentType?: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Column(DataType.DATE)
  discoveryDate?: Date;

  @Column(DataType.INTEGER)
  affectedRecords?: number;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'containment', 'notification', 'remediation', 'litigation', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  forensicFindings?: object[];

  @Column(DataType.JSONB)
  notifications?: object[];

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
