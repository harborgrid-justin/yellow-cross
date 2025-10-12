/**
 * Task Model - Sequelize Model for Task & Workflow Management
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
  ForeignKey,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { Case } from './Case';
import { Workflow } from './Workflow';
import { TaskComment } from './TaskComment';

@Table({
  tableName: 'tasks',
  timestamps: true
})
export class Task extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  taskNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Default('Other')
  @Column(DataType.STRING)
  taskType!: string;

  @Column(DataType.STRING)
  category?: string;

  @Default('Medium')
  @Index
  @Column(DataType.STRING)
  priority!: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @Default('Not Started')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Default(0)
  @Column(DataType.INTEGER)
  completionPercentage!: number;

  @Column(DataType.JSONB)
  statusHistory?: object;

  @Index
  @Column(DataType.STRING)
  assignedTo?: string;

  @Column(DataType.STRING)
  assignedBy?: string;

  @Column(DataType.JSONB)
  team?: object;

  @Column(DataType.JSONB)
  assignmentHistory?: object;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  createdDate!: Date;

  @Index
  @Column(DataType.DATE)
  dueDate?: Date;

  @Column(DataType.DATE)
  startDate?: Date;

  @Column(DataType.DATE)
  completedDate?: Date;

  @Column(DataType.FLOAT)
  estimatedHours?: number;

  @Column(DataType.FLOAT)
  actualHours?: number;

  @Column(DataType.JSONB)
  dependsOn?: object;

  @Column(DataType.JSONB)
  blockedBy?: object;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isBlocking!: boolean;

  @ForeignKey(() => Case)
  @Index
  @Column(DataType.UUID)
  caseId?: string;

  @BelongsTo(() => Case)
  case?: Case;

  @Column(DataType.STRING)
  caseNumber?: string;

  @ForeignKey(() => Workflow)
  @Index
  @Column(DataType.UUID)
  workflowId?: string;

  @BelongsTo(() => Workflow)
  workflow?: Workflow;

  @Column(DataType.STRING)
  workflowName?: string;

  @Column(DataType.UUID)
  parentTaskId?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  subtasks?: string[];

  @Default(false)
  @Column(DataType.BOOLEAN)
  fromTemplate!: boolean;

  @Column(DataType.UUID)
  templateId?: string;

  @Column(DataType.STRING)
  templateName?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  slaEnabled!: boolean;

  @Column(DataType.DATE)
  slaDueDate?: Date;

  @Default('Not Applicable')
  @Column(DataType.STRING)
  slaStatus!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isUrgent!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  escalationLevel!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  commentCount!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  attachmentCount!: number;

  @Column(DataType.DATE)
  lastActivityDate?: Date;

  @Column(DataType.JSONB)
  checklist?: object;

  @Column(DataType.JSONB)
  reminders?: object;

  @Default(true)
  @Column(DataType.BOOLEAN)
  notifyOnCompletion!: boolean;

  @Column(DataType.ARRAY(DataType.STRING))
  notificationRecipients?: string[];

  @Default(false)
  @Column(DataType.BOOLEAN)
  isRecurring!: boolean;

  @Column(DataType.JSONB)
  recurrencePattern?: object;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @Column(DataType.DATE)
  lastModifiedAt?: Date;

  @Column(DataType.STRING)
  completedBy?: string;

  @Column(DataType.STRING)
  cancelledBy?: string;

  @Column(DataType.DATE)
  cancelledAt?: Date;

  @Column(DataType.TEXT)
  cancellationReason?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @HasMany(() => TaskComment, 'taskId')
  comments?: TaskComment[];
}

export default Task;
