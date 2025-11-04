/**
 * ResearchItem Model - Sequelize Model for Legal Research
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
  tableName: 'research_items',
  timestamps: true
})
export class ResearchItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  researchNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  researchType!: string;

  @Column(DataType.STRING)
  jurisdiction?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  practiceAreas?: string[];

  @AllowNull(false)
  @Column(DataType.STRING)
  query!: string;

  @Column(DataType.JSONB)
  results?: object;

  @Column(DataType.JSONB)
  caseReferences?: object;

  @Column(DataType.JSONB)
  statuteReferences?: object;

  @Column(DataType.JSONB)
  sources?: object;

  @Default('In Progress')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  caseId?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  researcherId!: string;

  @Column(DataType.DATE)
  startDate?: Date;

  @Column(DataType.DATE)
  completionDate?: Date;

  @Column(DataType.INTEGER)
  hoursSpent?: number;

  @Column(DataType.TEXT)
  summary?: string;

  @Column(DataType.TEXT)
  conclusion?: string;

  @Column(DataType.TEXT)
  recommendations?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  attachments?: string[];

  @Default(0)
  @Column(DataType.INTEGER)
  accessCount!: number;

  @Column(DataType.DATE)
  lastAccessedAt?: Date;

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

  // Track access to research item
  recordAccess(): void {
    this.accessCount = (this.accessCount || 0) + 1;
    this.lastAccessedAt = new Date();
  }
}

export default ResearchItem;
