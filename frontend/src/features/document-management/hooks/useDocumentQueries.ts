/**
 * Document Management Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Document, DocumentVersion } from './types';

export function useDocuments(params?: PaginationParams & { caseId?: string; category?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.caseId) queryParams.append('caseId', params.caseId);
  if (params?.category) queryParams.append('category', params.category);

  return useQuery<PaginatedResponse<Document>>(`/documents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useDocument(id: string, options?: { skip?: boolean }) {
  return useQuery<Document>(`/documents/${id}`, options);
}

export function useDocumentVersions(id: string) {
  return useQuery<DocumentVersion[]>(`/documents/${id}/versions`);
}

export function useDocumentSearch(query: string) {
  return useQuery<Document[]>(`/documents/search?q=${encodeURIComponent(query)}`, {
    skip: !query || query.length < 2,
  });
}
