/**
 * Municipal Law Matter Model - Sequelize Model for Municipal Law Management
 * Tracks municipal government legal matters
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
  tableName: 'municipal_law_matters',
  timestamps: true
})
export class MunicipalLawMatter extends Model {
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
  @Column(DataType.ENUM('zoning', 'land-use', 'public-contracts', 'ordinance', 'liability', 'bonds', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  municipalityName!: string;

  @Column(DataType.STRING)
  departmentName?: string;

  @Column(DataType.STRING)
  projectName?: string;

  @Column(DataType.DATE)
  applicationDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'review', 'hearing', 'council-approval', 'litigation', 'resolved', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  ordinances?: object[];

  @Column(DataType.JSONB)
  publicHearings?: object[];

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
