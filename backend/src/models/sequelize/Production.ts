/**
 * Production Model - Sequelize Model
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  Default,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'productions',
  timestamps: true
})
export class Production extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  productionName!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseId!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  productionType!: string;

  @Column(DataType.STRING)
  startBatesNumber?: string;

  @Column(DataType.STRING)
  endBatesNumber?: string;

  @Default(0)
  @Column(DataType.INTEGER)
  documentCount!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  totalPages!: number;

  @Default('PDF')
  @Column(DataType.STRING)
  format!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  loadFileGenerated!: boolean;

  @AllowNull(false)
  @Column(DataType.STRING)
  producedTo!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  productionDate!: Date;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  documents?: object;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default Production;
