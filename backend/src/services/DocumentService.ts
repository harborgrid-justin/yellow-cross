/**
 * Document Service
 * Business logic for Document Management
 */

import { BaseService } from './BaseService';
import { Document } from '../models/sequelize/Document';
import { DocumentVersion } from '../models/sequelize/DocumentVersion';
import { DocumentReview } from '../models/sequelize/DocumentReview';

export class DocumentService extends BaseService<Document> {
  constructor() {
    super(Document);
  }

  /**
   * Find documents by case
   */
  async findByCase(caseId: string): Promise<Document[]> {
    return await this.findAll({
      where: { caseId },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Find documents by client
   */
  async findByClient(clientId: string): Promise<Document[]> {
    return await this.findAll({
      where: { clientId },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Search documents
   */
  async search(query: string): Promise<Document[]> {
    return await this.findAll({
      where: {
        $or: [
          { title: { $iLike: `%${query}%` } },
          { description: { $iLike: `%${query}%` } },
          { content: { $iLike: `%${query}%` } }
        ] as any
      },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Add document version
   */
  async addVersion(
    documentId: string,
    versionNumber: number,
    uploadedBy: string,
    changes?: string
  ): Promise<DocumentVersion> {
    const document = await this.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    return await DocumentVersion.create({
      documentId: document.id,
      versionNumber,
      uploadedBy,
      changes,
      uploadDate: new Date()
    });
  }

  /**
   * Add document review
   */
  async addReview(
    documentId: string,
    reviewedBy: string,
    status: string,
    comments?: string
  ): Promise<DocumentReview> {
    const document = await this.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    return await DocumentReview.create({
      documentId: document.id,
      reviewedBy,
      reviewDate: new Date(),
      status,
      comments
    });
  }

  /**
   * Update document status
   */
  async updateStatus(documentId: string, status: string): Promise<Document | null> {
    return await this.update(documentId, { status } as any);
  }
}

export default DocumentService;
