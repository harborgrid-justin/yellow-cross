/**
 * Contract Model - Sequelize Model for Contract Management
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
  tableName: 'contracts',
  timestamps: true
})
export class Contract extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  contractNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  contractType!: string;

  @Default('Draft')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Column(DataType.STRING)
  clientName?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  parties?: string[];

  @Column(DataType.DATE)
  effectiveDate?: Date;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @Column(DataType.FLOAT)
  value?: number;

  @Column(DataType.STRING)
  currency?: string;

  @Column(DataType.STRING)
  templateId?: string;

  @Column(DataType.STRING)
  documentId?: string;

  @Column(DataType.JSONB)
  terms?: object;

  @Column(DataType.JSONB)
  clauses?: object;

  @Column(DataType.JSONB)
  obligations?: object;

  @Column(DataType.JSONB)
  milestones?: object;

  @Column(DataType.JSONB)
  renewalTerms?: object;

  @Default(false)
  @Column(DataType.BOOLEAN)
  autoRenew!: boolean;

  @Column(DataType.INTEGER)
  renewalNoticeDays?: number;

  @Column(DataType.JSONB)
  signatures?: object;

  @Column(DataType.JSONB)
  versions?: object;

  @Column(DataType.INTEGER)
  currentVersion?: number;

  @Column(DataType.STRING)
  assignedTo?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @Column(DataType.JSONB)
  customFields?: object;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Virtual for contract duration
  get durationDays(): number | null {
    if (this.effectiveDate && this.expirationDate) {
      return Math.floor((this.expirationDate.getTime() - this.effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return null;
  }

  // Check if contract is expiring soon
  isExpiringSoon(days: number = 30): boolean {
    if (!this.expirationDate) return false;
    const daysUntilExpiration = Math.floor((this.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= days && daysUntilExpiration > 0;
  }
}

export default Contract;
