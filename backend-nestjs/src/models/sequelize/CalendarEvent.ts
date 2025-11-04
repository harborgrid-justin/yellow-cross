/**
 * CalendarEvent Model - Sequelize Model for Calendar and Scheduling
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
  tableName: 'calendar_events',
  timestamps: true
})
export class CalendarEvent extends Model {
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
  @Column(DataType.STRING)
  eventType!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  startDate!: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  endDate!: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  allDay!: boolean;

  @Column(DataType.STRING)
  location?: string;

  @Column(DataType.STRING)
  meetingLink?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  participants?: string[];

  @Column(DataType.STRING)
  organizer?: string;

  @Default('Scheduled')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  caseId?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Column(DataType.STRING)
  relatedTo?: string;

  @Column(DataType.JSONB)
  reminders?: object;

  @Column(DataType.STRING)
  recurrenceRule?: string;

  @Column(DataType.STRING)
  recurrenceId?: string;

  @Column(DataType.STRING)
  color?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  attachments?: string[];

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

  // Virtual for duration in minutes
  get durationMinutes(): number {
    return Math.floor((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60));
  }

  // Check if event is in the past
  isPast(): boolean {
    return this.endDate.getTime() < Date.now();
  }

  // Check if event is upcoming
  isUpcoming(): boolean {
    return this.startDate.getTime() > Date.now();
  }
}

export default CalendarEvent;
