/**
 * Pro Bono Matter Model - Sequelize Model for Pro Bono Management
 * Tracks pro bono legal services and cases
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
  tableName: 'pro_bono_matters',
  timestamps: true
})
export class ProBonoMatter extends Model {
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
  @Column(DataType.ENUM('family-law', 'housing', 'immigration', 'benefits', 'expungement', 'civil-rights', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  clientName!: string;

  @Column(DataType.STRING)
  referralSource?: string;

  @Column(DataType.STRING)
  assignedAttorney?: string;

  @Column(DataType.DATE)
  intakeDate?: Date;

  @Column(DataType.DECIMAL(10, 2))
  estimatedHours?: number;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'intake', 'screening', 'accepted', 'in-progress', 'completed', 'declined', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  eligibilityCriteria?: object[];

  @Column(DataType.JSONB)
  serviceProvided?: object[];

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
