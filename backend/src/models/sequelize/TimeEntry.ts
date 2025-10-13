/**
 * TimeEntry Model - Sequelize Model for Time Tracking
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
  tableName: 'time_entries',
  timestamps: true
})
export class TimeEntry extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  userId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  caseId!: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Column(DataType.STRING)
  taskId?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  date!: Date;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  hours!: number;

  @Column(DataType.TIME)
  startTime?: Date;

  @Column(DataType.TIME)
  endTime?: Date;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  activityType!: string;

  @Column(DataType.FLOAT)
  hourlyRate?: number;

  @Column(DataType.FLOAT)
  amount?: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  billable!: boolean;

  @Default('Pending')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  invoiceId?: string;

  @Column(DataType.DATE)
  invoicedDate?: Date;

  @Column(DataType.STRING)
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedDate?: Date;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Calculate amount based on hours and rate
  calculateAmount(): void {
    if (this.hourlyRate && this.hours) {
      this.amount = this.hours * this.hourlyRate;
    }
  }
}

export default TimeEntry;
