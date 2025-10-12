/**
 * Document Model - Sequelize Model for Document Management System
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
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeSave
} from 'sequelize-typescript';
import { Case } from './Case';
import { DocumentVersion } from './DocumentVersion';
import { DocumentReview } from './DocumentReview';

@Table({
  tableName: 'documents',
  timestamps: true
})
export class Document extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  documentNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  filename!: string;

  @Column(DataType.STRING)
  title?: string;

  @Column(DataType.TEXT)
  description?: string;

  // File Details
  @AllowNull(false)
  @Column(DataType.STRING)
  fileType!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  fileSize!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  mimeType!: string;

  // Storage Information
  @Column(DataType.STRING)
  storagePath?: string;

  @Column(DataType.STRING)
  cloudUrl?: string;

  @Column(DataType.STRING)
  checksum?: string;

  // Organization & Classification
  @Column(DataType.STRING)
  folderId?: string;

  @Default('/')
  @Column(DataType.STRING)
  folderPath!: string;

  @Default('Other')
  @Index
  @Column(DataType.STRING)
  category!: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  // Version Control
  @Default(1)
  @Column(DataType.INTEGER)
  version!: number;

  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  isLatestVersion!: boolean;

  @Column(DataType.UUID)
  parentVersionId?: string;

  @Column(DataType.JSONB)
  versionHistory?: object;

  // Metadata
  @Column(DataType.JSONB)
  customMetadata?: object;

  @Column(DataType.TEXT)
  extractedText?: string;

  @Column(DataType.INTEGER)
  pageCount?: number;

  // Relations
  @ForeignKey(() => Case)
  @Index
  @Column(DataType.UUID)
  caseId?: string;

  @BelongsTo(() => Case)
  case?: Case;

  @Column(DataType.STRING)
  caseNumber?: string;

  @Column(DataType.STRING)
  clientId?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  relatedDocuments?: string[];

  // Access Control & Security
  @Default('Team Only')
  @Column(DataType.STRING)
  visibility!: string;

  @Column(DataType.JSONB)
  permissions?: object;

  @Default(false)
  @Column(DataType.BOOLEAN)
  encrypted!: boolean;

  @Column(DataType.STRING)
  encryptionKey?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  watermarked!: boolean;

  @Column(DataType.JSONB)
  accessLog?: object;

  // Collaboration
  @Default(false)
  @Column(DataType.BOOLEAN)
  isLocked!: boolean;

  @Column(DataType.STRING)
  lockedBy?: string;

  @Column(DataType.DATE)
  lockedAt?: Date;

  @Column(DataType.STRING)
  checkoutBy?: string;

  @Column(DataType.DATE)
  checkoutAt?: Date;

  // Status & Flags
  @Default('Active')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isFavorite!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isPinned!: boolean;

  // Template Information
  @Default(false)
  @Index
  @Column(DataType.BOOLEAN)
  isTemplate!: boolean;

  @Column(DataType.STRING)
  templateCategory?: string;

  @Column(DataType.JSONB)
  templateVariables?: object;

  @Column(DataType.STRING)
  practiceArea?: string;

  // Audit Trail
  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @Column(DataType.DATE)
  lastModifiedAt?: Date;

  @Column(DataType.DATE)
  lastAccessedAt?: Date;

  @Column(DataType.STRING)
  archivedBy?: string;

  @Column(DataType.DATE)
  archivedAt?: Date;

  @Column(DataType.STRING)
  deletedBy?: string;

  @Column(DataType.DATE)
  deletedAt?: Date;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Associations
  @HasMany(() => DocumentVersion, 'documentId')
  versions?: DocumentVersion[];

  @HasMany(() => DocumentReview, 'documentId')
  reviews?: DocumentReview[];

  // Hook to update lastModifiedAt
  @BeforeSave
  static async updateModified(instance: Document) {
    if (!instance.isNewRecord && instance.changed()) {
      instance.lastModifiedAt = new Date();
    }
  }

  // Virtual for file size formatted
  get fileSizeFormatted(): string {
    const bytes = this.fileSize;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Instance methods
  async logAccess(userId: string, username: string, action: string, ipAddress: string): Promise<Document> {
    const accessLog = (this.accessLog as any[]) || [];
    accessLog.push({
      userId,
      username,
      action,
      timestamp: new Date(),
      ipAddress
    });
    this.accessLog = accessLog;
    this.lastAccessedAt = new Date();
    return await this.save();
  }

  async archiveDocument(archivedBy: string): Promise<Document> {
    this.status = 'Archived';
    this.archivedBy = archivedBy;
    this.archivedAt = new Date();
    this.lastModifiedBy = archivedBy;
    this.lastModifiedAt = new Date();
    return await this.save();
  }

  // Static methods
  static async findByCase(caseId: string): Promise<Document[]> {
    return await Document.findAll({
      where: { caseId, status: { $ne: 'Deleted' } as any },
      order: [['createdAt', 'DESC']]
    });
  }

  static async findByCategory(category: string): Promise<Document[]> {
    return await Document.findAll({
      where: { category, status: 'Active', isLatestVersion: true },
      order: [['createdAt', 'DESC']]
    });
  }

  static async findTemplates(filters: any = {}): Promise<Document[]> {
    const where: any = { isTemplate: true, status: 'Active', isLatestVersion: true };
    if (filters.templateCategory) {
      where.templateCategory = filters.templateCategory;
    }
    if (filters.practiceArea) {
      where.practiceArea = filters.practiceArea;
    }
    return await Document.findAll({ where, order: [['title', 'ASC']] });
  }
}

export default Document;
