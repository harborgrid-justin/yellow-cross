/**
 * Case Model - Sequelize Model for Case Management System
 * Comprehensive data model for legal case management
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
  HasMany,
  BeforeSave
} from 'sequelize-typescript';
import { CaseNote } from './CaseNote';
import { CaseTimelineEvent } from './CaseTimelineEvent';
import { Document } from './Document';
import { Task } from './Task';

@Table({
  tableName: 'cases',
  timestamps: true
})
export class Case extends Model {
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

  @Column(DataType.TEXT)
  description?: string;

  // Client Information
  @AllowNull(false)
  @Column(DataType.STRING)
  clientName!: string;

  @Column(DataType.STRING)
  clientId?: string;

  // Case Classification
  @AllowNull(false)
  @Column(DataType.STRING)
  matterType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  practiceArea!: string;

  @Column(DataType.STRING)
  caseType?: string;

  @Default('Medium')
  @Column(DataType.STRING)
  priority!: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  // Status & Progress
  @Default('Open')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.JSONB)
  statusHistory?: object;

  // Assignment & Distribution
  @Index
  @Column(DataType.STRING)
  assignedTo?: string;

  @Column(DataType.JSONB)
  assignmentHistory?: object;

  // Dates & Timeline
  @Column(DataType.DATE)
  filingDate?: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  openedDate!: Date;

  @Column(DataType.DATE)
  closedDate?: Date;

  @Column(DataType.DATE)
  dueDate?: Date;

  @Column(DataType.DATE)
  nextHearingDate?: Date;

  // Financial
  @Column(DataType.FLOAT)
  estimatedValue?: number;

  @Default('Not Started')
  @Column(DataType.STRING)
  billingStatus!: string;

  // Outcome & Resolution
  @Column(DataType.STRING)
  outcome?: string;

  @Column(DataType.TEXT)
  resolution?: string;

  // Archive & Closure
  @Default(false)
  @Index
  @Column(DataType.BOOLEAN)
  archived!: boolean;

  @Column(DataType.DATE)
  archivedDate?: Date;

  @Column(DataType.STRING)
  archivedBy?: string;

  @Column(DataType.DATE)
  retentionDate?: Date;

  @Default(true)
  @Column(DataType.BOOLEAN)
  canReopen!: boolean;

  // Metadata
  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @Column(DataType.JSONB)
  customFields?: object;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @HasMany(() => CaseNote, 'caseId')
  notes?: CaseNote[];

  @HasMany(() => CaseTimelineEvent, 'caseId')
  timelineEvents?: CaseTimelineEvent[];

  @HasMany(() => Document, 'caseId')
  documents?: Document[];

  @HasMany(() => Task, 'caseId')
  tasks?: Task[];

  // Hook to update status history
  @BeforeSave
  static async updateStatusHistory(instance: Case) {
    if (instance.changed('status') && !instance.isNewRecord) {
      const statusHistory = (instance.statusHistory as any[]) || [];
      statusHistory.push({
        status: instance.status,
        changedAt: new Date(),
        changedBy: instance.lastModifiedBy
      });
      instance.statusHistory = statusHistory;
    }
  }

  // Virtual for case duration
  get duration(): number {
    if (this.closedDate && this.openedDate) {
      return Math.floor((this.closedDate.getTime() - this.openedDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return Math.floor((Date.now() - this.openedDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Instance methods
  assignCase(assignedTo: string, assignedBy: string, reason?: string): void {
    const assignmentHistory = (this.assignmentHistory as any[]) || [];
    assignmentHistory.push({
      assignedTo,
      assignedBy,
      assignedAt: new Date(),
      reason
    });
    this.assignmentHistory = assignmentHistory;
    this.assignedTo = assignedTo;
    this.lastModifiedBy = assignedBy;
  }

  closeCase(closedBy: string, outcome: string, resolution: string): void {
    this.status = 'Closed';
    this.closedDate = new Date();
    this.outcome = outcome;
    this.resolution = resolution;
    this.lastModifiedBy = closedBy;
  }

  archiveCase(archivedBy: string, retentionDays: number = 2555): void {
    this.archived = true;
    this.archivedDate = new Date();
    this.archivedBy = archivedBy;
    this.retentionDate = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000);
  }

  // Static methods
  static async findByStatus(status: string): Promise<Case[]> {
    return await Case.findAll({
      where: { status, archived: false },
      order: [['priority', 'DESC'], ['openedDate', 'DESC']]
    });
  }

  static async findByAssignee(assignedTo: string): Promise<Case[]> {
    return await Case.findAll({
      where: { 
        assignedTo, 
        archived: false,
        status: { $ne: 'Closed' } as any
      },
      order: [['priority', 'DESC'], ['dueDate', 'ASC']]
    });
  }

  static async getAnalytics(filters: any = {}): Promise<any> {
    // Note: This would require raw SQL or more complex Sequelize queries
    // Simplified version for now
    const cases = await Case.findAll({ where: filters });
    
    const analytics = {
      totalCases: cases.length,
      openCases: cases.filter(c => c.status === 'Open').length,
      inProgressCases: cases.filter(c => c.status === 'In Progress').length,
      closedCases: cases.filter(c => c.status === 'Closed').length,
      avgDuration: 0
    };

    const closedWithDuration = cases.filter(c => c.closedDate && c.openedDate);
    if (closedWithDuration.length > 0) {
      const totalDuration = closedWithDuration.reduce((sum, c) => {
        return sum + (c.closedDate!.getTime() - c.openedDate.getTime()) / (1000 * 60 * 60 * 24);
      }, 0);
      analytics.avgDuration = totalDuration / closedWithDuration.length;
    }

    return analytics;
  }
}

export default Case;
