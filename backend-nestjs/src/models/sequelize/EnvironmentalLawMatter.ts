/**
 * Environmental Law Matter Model - Sequelize Model for Environmental Law
 * Tracks environmental compliance and EPA matters
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
  tableName: 'environmental_law_matters',
  timestamps: true
})
export class EnvironmentalLawMatter extends Model {
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
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Index
  @Column(DataType.ENUM('compliance', 'permit', 'enforcement', 'litigation', 'impact-assessment', 'other'))
  matterType?: string;

  @Column(DataType.STRING)
  facility?: string;

  @Column(DataType.STRING)
  regulatoryAgency?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'compliance', 'violation', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  complianceDeadline?: Date;

  @Column(DataType.STRING)
  permitNumber?: string;

  @Column(DataType.TEXT)
  requirements?: string;

  @Column(DataType.JSONB)
  inspections?: object[];

  @Column(DataType.TEXT)
  violations?: string;

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
