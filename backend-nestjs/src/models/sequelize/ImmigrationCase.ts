/**
 * Immigration Case Model - Sequelize Model for Immigration Law
 * Tracks visa applications, petitions, and immigration cases
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
  tableName: 'immigration_cases',
  timestamps: true
})
export class ImmigrationCase extends Model {
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
  @Column(DataType.ENUM('visa', 'green-card', 'citizenship', 'asylum', 'deportation-defense', 'other'))
  caseType?: string;

  @Column(DataType.STRING)
  visaType?: string;

  @Column(DataType.STRING)
  applicantName?: string;

  @Column(DataType.STRING)
  beneficiaryName?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'approved', 'denied', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  filingDate?: Date;

  @Column(DataType.DATE)
  decisionDate?: Date;

  @Column(DataType.STRING)
  receiptNumber?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  documents?: object[];

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
