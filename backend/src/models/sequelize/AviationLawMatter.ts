/**
 * Aviation Law Matter Model - Sequelize Model for Aviation Law Management
 * Tracks aviation regulations and aerospace legal matters
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
  tableName: 'aviation_law_matters',
  timestamps: true
})
export class AviationLawMatter extends Model {
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
  @Column(DataType.ENUM('regulatory-compliance', 'accident-investigation', 'licensing', 'airspace', 'contracts', 'litigation', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  partyName!: string;

  @Column(DataType.STRING)
  aircraftType?: string;

  @Column(DataType.STRING)
  registrationNumber?: string;

  @Column(DataType.DATE)
  incidentDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'compliance', 'hearing', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  regulatoryActions?: object[];

  @Column(DataType.JSONB)
  investigationDetails?: object[];

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
