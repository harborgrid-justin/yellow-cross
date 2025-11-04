/**
 * TaskTemplate Model - Sequelize Model
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
  tableName: 'task_templates',
  timestamps: true
})
export class TaskTemplate extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  templateName!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Index
  @Column(DataType.STRING)
  category?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  taskType!: string;

  @Default('Medium')
  @Column(DataType.STRING)
  defaultPriority!: string;

  @Column(DataType.FLOAT)
  estimatedHours?: number;

  @Column(DataType.JSONB)
  checklist?: object;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @Column(DataType.STRING)
  practiceArea?: string;

  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  usageCount!: number;

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

export default TaskTemplate;
