/**
 * Report Model - Sequelize Model for Reporting and Analytics
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
  tableName: 'reports',
  timestamps: true
})
export class Report extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  reportNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  reportType!: string;

  @Column(DataType.STRING)
  category?: string;

  @Default('Draft')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.JSONB)
  parameters?: object;

  @Column(DataType.JSONB)
  filters?: object;

  @Column(DataType.JSONB)
  data?: object;

  @Column(DataType.JSONB)
  visualizations?: object;

  @Column(DataType.STRING)
  format?: string;

  @Column(DataType.DATE)
  startDate?: Date;

  @Column(DataType.DATE)
  endDate?: Date;

  @Column(DataType.DATE)
  generatedDate?: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  generatedBy!: string;

  @Column(DataType.STRING)
  scheduleFrequency?: string;

  @Column(DataType.DATE)
  nextScheduledRun?: Date;

  @Column(DataType.ARRAY(DataType.STRING))
  recipients?: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.STRING)
  templateId?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isTemplate!: boolean;

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
}

export default Report;
