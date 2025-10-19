/**
 * Antitrust and Competition Matter Model - Sequelize Model for Antitrust and Competition Management
 * Tracks antitrust investigations and competition law matters
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
  tableName: 'antitrust_competition_matters',
  timestamps: true
})
export class AntitrustCompetitionMatter extends Model {
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
  @Column(DataType.ENUM('merger-review', 'cartel-investigation', 'monopolization', 'price-fixing', 'compliance', 'litigation', 'other'))
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  companyName!: string;

  @Column(DataType.STRING)
  regulatoryAgency?: string;

  @Column(DataType.STRING)
  marketSector?: string;

  @Column(DataType.DATE)
  investigationDate?: Date;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'investigation', 'review', 'hearing', 'settlement', 'litigation', 'closed'))
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.JSONB)
  marketAnalysis?: object[];

  @Column(DataType.JSONB)
  remedies?: object[];

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
