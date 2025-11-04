/**
 * TaskComment Model - Sequelize Model
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
import { Task } from './Task';

@Table({
  tableName: 'task_comments',
  timestamps: true
})
export class TaskComment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Task)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  taskId!: string;

  @BelongsTo(() => Task)
  task?: Task;

  @AllowNull(false)
  @Column(DataType.TEXT)
  comment!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  author!: string;

  @Default('Team')
  @Column(DataType.STRING)
  visibility!: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}

export default TaskComment;
