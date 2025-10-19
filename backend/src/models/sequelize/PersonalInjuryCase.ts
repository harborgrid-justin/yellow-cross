/**
 * Personal Injury Case Model - Sequelize Model for Personal Injury
 * Tracks PI cases, medical records, and settlements
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
  tableName: 'personal_injury_cases',
  timestamps: true
})
export class PersonalInjuryCase extends Model {
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

  @Index
  @Column(DataType.ENUM('auto-accident', 'slip-fall', 'medical-malpractice', 'product-liability', 'workplace', 'other'))
  injuryType?: string;

  @Column(DataType.STRING)
  plaintiffName?: string;

  @Column(DataType.STRING)
  defendantName?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'litigation', 'settlement', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Column(DataType.STRING)
  location?: string;

  @Column(DataType.TEXT)
  injuryDescription?: string;

  @Column(DataType.JSONB)
  medicalRecords?: object[];

  @Column(DataType.DECIMAL(15, 2))
  medicalExpenses?: number;

  @Column(DataType.DECIMAL(15, 2))
  demandAmount?: number;

  @Column(DataType.DECIMAL(15, 2))
  settlementAmount?: number;

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
