/**
 * WF-COMP-XXX | documentManagementApi.ts - Document Management API service module
 * Purpose: Document management API operations
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Exports: documentManagementApi instance, types | Key Features: Document CRUD, version control, templates
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { apiInstance } from '../config/apiConfig';
import {
  buildUrlParams,
  handleApiError,
  extractApiData,
  PaginatedResponse,
} from '../utils/apiUtils';
import { z } from 'zod';
import { auditService, AuditAction, AuditStatus } from '../audit';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface Document {
  id: string;
  documentNumber: string;
  title: string;
  description?: string;
  category: string;
  type: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Archived';
  caseId?: string;
  clientId?: string;
  version: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentData {
  title: string;
  description?: string;
  category: string;
  type: string;
  caseId?: string;
  clientId?: string;
  tags?: string[];
  file: File;
}

export interface UpdateDocumentData {
  title?: string;
  description?: string;
  category?: string;
  type?: string;
  status?: 'Draft' | 'Review' | 'Approved' | 'Archived';
  tags?: string[];
}

export interface DocumentFilters {
  category?: string;
  type?: string;
  status?: string;
  caseId?: string;
  clientId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  changes?: string;
}

export interface DocumentManagementApi {
  // Document operations
  getAll(filters?: DocumentFilters): Promise<PaginatedResponse<Document>>;
  getById(id: string): Promise<Document>;
  create(data: CreateDocumentData): Promise<Document>;
  update(id: string, data: UpdateDocumentData): Promise<Document>;
  delete(id: string): Promise<void>;
  download(id: string): Promise<Blob>;
  
  // Version control
  getVersions(documentId: string): Promise<DocumentVersion[]>;
  uploadNewVersion(documentId: string, file: File, changes?: string): Promise<DocumentVersion>;
  
  // Search and categorization
  search(query: string, filters?: DocumentFilters): Promise<Document[]>;
  getCategories(): Promise<string[]>;
  getTypes(): Promise<string[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const createDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().min(1).max(100),
  type: z.string().min(1).max(100),
  caseId: z.string().optional(),
  clientId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  category: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(100).optional(),
  status: z.enum(['Draft', 'Review', 'Approved', 'Archived']).optional(),
  tags: z.array(z.string()).optional(),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class DocumentManagementApiImpl implements DocumentManagementApi {
  private readonly baseEndpoint = '/api/documents';
  private readonly auditResource = 'DOCUMENT';

  async getAll(filters?: DocumentFilters): Promise<PaginatedResponse<Document>> {
    try {
      const params = buildUrlParams((filters || {}) as Record<string, unknown>);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiInstance.get(url);
      const data = extractApiData<PaginatedResponse<Document>>(response);
      
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.SUCCESS,
        details: { filters, count: data.data?.length || 0 }
      });
      
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: string): Promise<Document> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      return extractApiData<Document>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async create(data: CreateDocumentData): Promise<Document> {
    try {
      // Validate metadata
      createDocumentSchema.parse({
        title: data.title,
        description: data.description,
        category: data.category,
        type: data.type,
        caseId: data.caseId,
        clientId: data.clientId,
        tags: data.tags,
      });
      
      // Create form data
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('type', data.type);
      if (data.caseId) formData.append('caseId', data.caseId);
      if (data.clientId) formData.append('clientId', data.clientId);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));
      
      const response = await apiInstance.post(`${this.baseEndpoint}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const createdDocument = extractApiData<Document>(response);
      
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdDocument.documentNumber,
        status: AuditStatus.SUCCESS,
        details: { title: createdDocument.title }
      });
      
      return createdDocument;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: string, data: UpdateDocumentData): Promise<Document> {
    try {
      const validatedData = updateDocumentSchema.parse(data);
      
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedDocument = extractApiData<Document>(response);
      
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData }
      });
      
      return updatedDocument;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiInstance.delete(`${this.baseEndpoint}/${id}`);
      
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async download(id: string): Promise<Blob> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/${id}/download`, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getVersions(documentId: string): Promise<DocumentVersion[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/${documentId}/versions`);
      return extractApiData<DocumentVersion[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async uploadNewVersion(documentId: string, file: File, changes?: string): Promise<DocumentVersion> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (changes) formData.append('changes', changes);
      
      const response = await apiInstance.post(
        `${this.baseEndpoint}/${documentId}/versions`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return extractApiData<DocumentVersion>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async search(query: string, filters?: DocumentFilters): Promise<Document[]> {
    try {
      const params = buildUrlParams({ ...filters, q: query });
      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<Document[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/categories`);
      return extractApiData<string[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTypes(): Promise<string[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/types`);
      return extractApiData<string[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const documentManagementApi: DocumentManagementApi = new DocumentManagementApiImpl();
