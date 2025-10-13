/**
 * Integration Model - Sequelize Model for Integration Management
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
  tableName: 'integrations',
  timestamps: true
})
export class Integration extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  type!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Default('Inactive')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  provider?: string;

  @Column(DataType.JSONB)
  configuration?: object;

  @Column(DataType.JSONB)
  credentials?: object;

  @Column(DataType.STRING)
  apiKey?: string;

  @Column(DataType.STRING)
  webhookUrl?: string;

  @Column(DataType.JSONB)
  endpoints?: object;

  @Column(DataType.JSONB)
  mappings?: object;

  @Column(DataType.DATE)
  lastSyncDate?: Date;

  @Column(DataType.STRING)
  syncFrequency?: string;

  @Column(DataType.DATE)
  nextSyncDate?: Date;

  @Column(DataType.JSONB)
  syncLog?: object;

  @Default(0)
  @Column(DataType.INTEGER)
  successfulSyncs!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  failedSyncs!: number;

  @Column(DataType.TEXT)
  lastError?: string;

  @Column(DataType.DATE)
  lastErrorDate?: Date;

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

  // Record sync result
  recordSync(success: boolean, error?: string): void {
    this.lastSyncDate = new Date();
    if (success) {
      this.successfulSyncs = (this.successfulSyncs || 0) + 1;
    } else {
      this.failedSyncs = (this.failedSyncs || 0) + 1;
      this.lastError = error;
      this.lastErrorDate = new Date();
    }
  }
}

export default Integration;
