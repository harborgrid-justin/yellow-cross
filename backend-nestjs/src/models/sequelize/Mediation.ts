/**
 * Mediation Model - Sequelize Model for Mediation & ADR
 * Tracks mediation sessions and alternative dispute resolution processes
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
  tableName: 'mediations',
  timestamps: true
})
export class Mediation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  mediationNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  caseId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('mediation', 'arbitration', 'negotiation'))
  mediationType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  mediatorName!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  scheduledDate!: Date;

  @Column(DataType.STRING)
  location?: string;

  @Default('scheduled')
  @Index
  @Column(DataType.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'))
  status!: string;

  @Column(DataType.TEXT)
  outcome?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  participants?: object[];

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
