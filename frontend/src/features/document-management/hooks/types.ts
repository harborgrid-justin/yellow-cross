/**
 * Document Management Types
 */

export interface Document {
  id: string;
  documentNumber: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  caseId?: string;
  clientId?: string;
  category?: string;
  tags?: string[];
  version: number;
  status: 'Draft' | 'Final' | 'Archived';
  uploadedBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  changes?: string;
}

export interface CreateDocumentInput {
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  caseId?: string;
  clientId?: string;
  category?: string;
  tags?: string[];
  uploadedBy: string;
}

export interface UpdateDocumentInput {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  status?: string;
}
