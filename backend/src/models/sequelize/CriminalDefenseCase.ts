/**
 * Criminal Defense Case Model - Sequelize Model for Criminal Defense
 * Tracks criminal cases, charges, and defense strategy
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
  tableName: 'criminal_defense_cases',
  timestamps: true
})
export class CriminalDefenseCase extends Model {
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
  defendantName?: string;

  @Index
  @Column(DataType.ENUM('misdemeanor', 'felony', 'infraction'))
  chargeLevel?: string;

  @Column(DataType.TEXT)
  charges?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'trial', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.STRING)
  court?: string;

  @Column(DataType.STRING)
  prosecutor?: string;

  @Column(DataType.DATE)
  arrestDate?: Date;

  @Column(DataType.DATE)
  arraignmentDate?: Date;

  @Column(DataType.DATE)
  trialDate?: Date;

  @Column(DataType.TEXT)
  defenseStrategy?: string;

  @Column(DataType.JSONB)
  evidence?: object[];

  @Column(DataType.TEXT)
  outcome?: string;

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
