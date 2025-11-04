/**
 * Evidence Model - Sequelize Model for eDiscovery
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
  tableName: 'evidence',
  timestamps: true
})
export class Evidence extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  evidenceNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseId!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  evidenceType!: string;

  @Column(DataType.STRING)
  custodian?: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  collectionDate!: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  collectionMethod!: string;

  @Column(DataType.STRING)
  sourceLocation?: string;

  @Column(DataType.JSONB)
  chainOfCustody?: object;

  @Default('Preserved')
  @Column(DataType.STRING)
  preservationStatus!: string;

  @Column(DataType.STRING)
  hashValue?: string;

  @Column(DataType.INTEGER)
  fileSize?: number;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @Column(DataType.JSONB)
  metadata?: object;

  @Default('Collected')
  @Column(DataType.STRING)
  status!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}

export default Evidence;
