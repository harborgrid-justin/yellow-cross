/**
 * Energy and Utilities Matter Model - Sequelize Model for Energy and Utilities Management
 * Tracks energy sector legal matters and utility regulations
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
  tableName: 'energy_utilities_matters',
  timestamps: true
})
export class EnergyUtilitiesMatter extends Model {
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
  @Column(DataType.ENUM('regulatory-compliance', 'rate-case', 'environmental', 'licensing', 'contracts', 'litigation', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  utilityName!: string;

  @Column(DataType.STRING)
  regulatoryBody?: string;

  @Column(DataType.STRING)
  projectName?: string;

  @Column(DataType.DATE)
  complianceDeadline?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'pending', 'under-review', 'approved', 'denied', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  permits?: object[];

  @Column(DataType.JSONB)
  complianceRequirements?: object[];

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
