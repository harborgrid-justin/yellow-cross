/**
 * Veterans Affairs Matter Model - Sequelize Model for Veterans Affairs Management
 * Tracks veterans benefits and legal matters
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
  tableName: 'veterans_affairs_matters',
  timestamps: true
})
export class VeteransAffairsMatter extends Model {
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
  @Column(DataType.ENUM('disability-claim', 'pension-claim', 'healthcare', 'discharge-upgrade', 'appeal', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  veteranName!: string;

  @Column(DataType.STRING)
  serviceNumber?: string;

  @Column(DataType.STRING)
  branchOfService?: string;

  @Column(DataType.DATE)
  claimDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'filed', 'development', 'decision', 'appeal', 'remand', 'granted', 'denied', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  disabilities?: object[];

  @Column(DataType.JSONB)
  evidence?: object[];

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
