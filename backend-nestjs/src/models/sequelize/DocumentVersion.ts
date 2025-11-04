/**
 * DocumentVersion Model - Sequelize Model
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
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Document } from './Document';

@Table({
  tableName: 'document_versions',
  timestamps: true,
  updatedAt: false
})
export class DocumentVersion extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Document)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  documentId!: string;

  @BelongsTo(() => Document)
  document?: Document;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  versionNumber!: number;

  @Column(DataType.TEXT)
  changeDescription?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}

export default DocumentVersion;
