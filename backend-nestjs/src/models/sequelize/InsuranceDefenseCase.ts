/**
 * Insurance Defense Case Model - Sequelize Model for Insurance Defense
 * Tracks insurance defense cases and coverage analysis
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
  tableName: 'insurance_defense_cases',
  timestamps: true
})
export class InsuranceDefenseCase extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Column(DataType.STRING)
  insuranceCompany?: string;

  @Column(DataType.STRING)
  insuredParty?: string;

  @Column(DataType.STRING)
  claimNumber?: string;

  @Column(DataType.STRING)
  claimantName?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'litigation', 'settlement', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Column(DataType.DATE)
  claimDate?: Date;

  @Column(DataType.DECIMAL(15, 2))
  claimAmount?: number;

  @Column(DataType.DECIMAL(15, 2))
  reserveAmount?: number;

  @Column(DataType.TEXT)
  coverageAnalysis?: string;

  @Column(DataType.TEXT)
  defenseStrategy?: string;

  @Column(DataType.TEXT)
  notes?: string;

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
