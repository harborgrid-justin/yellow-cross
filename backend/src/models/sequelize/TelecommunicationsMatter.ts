/**
 * Telecommunications Matter Model - Sequelize Model for Telecommunications Management
 * Tracks telecom regulatory matters and compliance issues
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
  tableName: 'telecommunications_matters',
  timestamps: true
})
export class TelecommunicationsMatter extends Model {
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
  @Column(DataType.ENUM('licensing', 'spectrum-allocation', 'regulatory-compliance', 'interconnection', 'privacy', 'litigation', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  carrierName!: string;

  @Column(DataType.STRING)
  regulatoryAgency?: string;

  @Column(DataType.STRING)
  licenseType?: string;

  @Column(DataType.DATE)
  applicationDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'under-review', 'approved', 'denied', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  licenses?: object[];

  @Column(DataType.JSONB)
  complianceItems?: object[];

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
