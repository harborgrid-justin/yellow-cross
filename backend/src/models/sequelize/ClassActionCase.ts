/**
 * Class Action Case Model - Sequelize Model for Class Action
 * Tracks class action lawsuits and multi-plaintiff cases
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
  tableName: 'class_action_cases',
  timestamps: true
})
export class ClassActionCase extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Column(DataType.STRING)
  leadPlaintiff?: string;

  @Column(DataType.STRING)
  defendantName?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'certification-pending', 'certified', 'settlement', 'trial', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  filingDate?: Date;

  @Column(DataType.DATE)
  certificationDate?: Date;

  @Column(DataType.INTEGER)
  estimatedClassSize?: number;

  @Column(DataType.TEXT)
  classDefinition?: string;

  @Column(DataType.DECIMAL(15, 2))
  settlementAmount?: number;

  @Column(DataType.JSONB)
  classMemberList?: object[];

  @Column(DataType.TEXT)
  noticeDistribution?: string;

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
