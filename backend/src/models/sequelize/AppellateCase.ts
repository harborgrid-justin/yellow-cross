/**
 * Appellate Case Model - Sequelize Model for Appellate Practice
 * Tracks appeals, briefs, and appellate proceedings
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
  tableName: 'appellate_cases',
  timestamps: true
})
export class AppellateCase extends Model {
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
  lowerCourtCase?: string;

  @Column(DataType.STRING)
  appellant?: string;

  @Column(DataType.STRING)
  appellee?: string;

  @Column(DataType.STRING)
  appellateCourt?: string;

  @Default('active')
  @Index
  @Column(DataType.ENUM('active', 'briefs', 'oral-argument', 'decision', 'closed'))
  status!: string;

  @Column(DataType.DATE)
  appealFiledDate?: Date;

  @Column(DataType.DATE)
  oralArgumentDate?: Date;

  @Column(DataType.DATE)
  decisionDate?: Date;

  @Column(DataType.JSONB)
  briefs?: object[];

  @Column(DataType.TEXT)
  issuesOnAppeal?: string;

  @Column(DataType.TEXT)
  decision?: string;

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
