/**
 * ComplianceItem Model - Sequelize Model for Compliance Tracking
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  Default,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'compliance_items',
  timestamps: true
})
export class ComplianceItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  complianceNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  complianceType!: string;

  @Default('Pending')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Default('Medium')
  @Column(DataType.ENUM('Low', 'Medium', 'High', 'Critical'))
  riskLevel!: string;

  @Column(DataType.STRING)
  caseId?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Column(DataType.DATE)
  dueDate?: Date;

  @Column(DataType.DATE)
  completionDate?: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  assignedTo!: string;

  @Column(DataType.JSONB)
  riskFactors?: object;

  @Column(DataType.JSONB)
  remediationPlan?: object;

  @Column(DataType.JSONB)
  auditTrail?: object;

  @Column(DataType.ARRAY(DataType.STRING))
  regulations?: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Add audit trail entry
  addAuditEntry(entry: any): void {
    const auditTrail = (this.auditTrail as any[]) || [];
    auditTrail.push({
      ...entry,
      timestamp: new Date()
    });
    this.auditTrail = auditTrail;
  }
}

export default ComplianceItem;
