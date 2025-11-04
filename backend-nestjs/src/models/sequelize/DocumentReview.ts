/**
 * DocumentReview Model - Sequelize Model
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
  UpdatedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Document } from './Document';

@Table({
  tableName: 'document_reviews',
  timestamps: true
})
export class DocumentReview extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Document)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  documentId!: string;

  @BelongsTo(() => Document)
  document?: Document;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  assignedTo!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  reviewType!: string;

  @Default('Pending')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Default('Medium')
  @Column(DataType.STRING)
  priority!: string;

  @Column(DataType.DATE)
  dueDate?: Date;

  @Column(DataType.DATE)
  completedDate?: Date;

  @Column(DataType.TEXT)
  reviewNotes?: string;

  @Column(DataType.STRING)
  reviewDecision?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}

export default DocumentReview;
