/**
 * Workflow Model - Sequelize Model
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
  UpdatedAt,
  HasMany
} from 'sequelize-typescript';
import { Task } from './Task';

@Table({
  tableName: 'workflows',
  timestamps: true
})
export class Workflow extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  workflowName!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.STRING)
  category?: string;

  @Column(DataType.STRING)
  practiceArea?: string;

  @Default('Active')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.JSONB)
  stages?: object;

  @Default(false)
  @Index
  @Column(DataType.BOOLEAN)
  isTemplate!: boolean;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @HasMany(() => Task, 'workflowId')
  tasks?: Task[];
}

export default Workflow;
