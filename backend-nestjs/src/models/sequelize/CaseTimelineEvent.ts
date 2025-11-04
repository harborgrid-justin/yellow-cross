/**
 * CaseTimelineEvent Model - Sequelize Model
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
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Case } from './Case';

@Table({
  tableName: 'case_timeline_events',
  timestamps: true,
  updatedAt: false
})
export class CaseTimelineEvent extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Case)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  caseId!: string;

  @BelongsTo(() => Case)
  case?: Case;

  @AllowNull(false)
  @Column(DataType.STRING)
  eventType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  eventDate!: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.JSONB)
  metadata?: object;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;
}

export default CaseTimelineEvent;
