/**
 * CaseNote Model - Sequelize Model
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
  UpdatedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Case } from './Case';

@Table({
  tableName: 'case_notes',
  timestamps: true
})
export class CaseNote extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Case)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  caseId!: string;

  @BelongsTo(() => Case)
  case?: Case;

  @AllowNull(false)
  @Column(DataType.STRING)
  noteType!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  author!: string;

  @Default('Team Only')
  @Column(DataType.STRING)
  visibility!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isPinned!: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}

export default CaseNote;
