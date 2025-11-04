/**
 * CommunicationTemplate Model - Sequelize Model for Communication Templates
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
  tableName: 'communication_templates',
  timestamps: true
})
export class CommunicationTemplate extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  templateType!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  subject!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.JSONB)
  variables?: object;

  @Column(DataType.STRING)
  category?: string;

  @Default('Active')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Default(0)
  @Column(DataType.INTEGER)
  usageCount!: number;

  @Column(DataType.DATE)
  lastUsedDate?: Date;

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

  // Track template usage
  recordUsage(): void {
    this.usageCount = (this.usageCount || 0) + 1;
    this.lastUsedDate = new Date();
  }
}

export default CommunicationTemplate;
