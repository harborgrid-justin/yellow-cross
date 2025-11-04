/**
 * Expense Model - Sequelize Model for Expense Management
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
  tableName: 'expenses',
  timestamps: true
})
export class Expense extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  expenseNumber!: string;

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

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  date!: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  category!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  amount!: number;

  @Default('USD')
  @Column(DataType.STRING)
  currency!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  billable!: boolean;

  @Default('Pending')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  paymentMethod?: string;

  @Column(DataType.STRING)
  vendor?: string;

  @Column(DataType.STRING)
  receiptUrl?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  attachments?: string[];

  @Column(DataType.STRING)
  invoiceId?: string;

  @Column(DataType.DATE)
  invoicedDate?: Date;

  @Column(DataType.STRING)
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedDate?: Date;

  @Column(DataType.STRING)
  rejectedBy?: string;

  @Column(DataType.DATE)
  rejectedDate?: Date;

  @Column(DataType.TEXT)
  rejectionReason?: string;

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
}

export default Expense;
