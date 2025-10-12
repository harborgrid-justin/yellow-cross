/**
 * Invoice Model - Sequelize Model for Billing and Invoicing
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
  tableName: 'invoices',
  timestamps: true
})
export class Invoice extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  invoiceNumber!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  clientId!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  clientName!: string;

  @Column(DataType.STRING)
  caseId?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  invoiceDate!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  dueDate!: Date;

  @Default('Draft')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.JSONB)
  lineItems?: object;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  subtotal!: number;

  @Default(0)
  @Column(DataType.FLOAT)
  taxAmount!: number;

  @Default(0)
  @Column(DataType.FLOAT)
  discountAmount!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  totalAmount!: number;

  @Default(0)
  @Column(DataType.FLOAT)
  amountPaid!: number;

  @Default(0)
  @Column(DataType.FLOAT)
  amountDue!: number;

  @Default('USD')
  @Column(DataType.STRING)
  currency!: string;

  @Column(DataType.STRING)
  paymentTerms?: string;

  @Column(DataType.DATE)
  sentDate?: Date;

  @Column(DataType.STRING)
  sentBy?: string;

  @Column(DataType.DATE)
  paidDate?: Date;

  @Column(DataType.STRING)
  paymentMethod?: string;

  @Column(DataType.STRING)
  transactionId?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.TEXT)
  terms?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  attachments?: string[];

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

  // Calculate if invoice is overdue
  isOverdue(): boolean {
    return this.status !== 'Paid' && this.dueDate.getTime() < Date.now();
  }

  // Calculate days overdue
  getDaysOverdue(): number {
    if (!this.isOverdue()) return 0;
    return Math.floor((Date.now() - this.dueDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export default Invoice;
