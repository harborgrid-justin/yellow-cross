/**
 * Deadline Model - Sequelize Model for Deadline Tracking
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
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'deadlines',
  timestamps: true
})
export class Deadline extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  dueDate!: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  deadlineType!: string;

  @Default('Pending')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Default('High')
  @Column(DataType.ENUM('Low', 'Medium', 'High', 'Critical'))
  priority!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseId!: string;

  @Column(DataType.STRING)
  caseNumber?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  assignedTo!: string;

  @Column(DataType.STRING)
  court?: string;

  @Column(DataType.STRING)
  jurisdiction?: string;

  @Column(DataType.JSONB)
  reminders?: object;

  @Column(DataType.DATE)
  completionDate?: Date;

  @Column(DataType.STRING)
  completedBy?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Check if deadline is overdue
  isOverdue(): boolean {
    return this.status !== 'Completed' && this.dueDate.getTime() < Date.now();
  }

  // Get days until deadline
  getDaysUntilDue(): number {
    return Math.floor((this.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }
}

export default Deadline;
