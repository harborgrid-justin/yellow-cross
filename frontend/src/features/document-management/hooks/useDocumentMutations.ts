/**
 * Document Management Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Document, CreateDocumentInput, UpdateDocumentInput } from './types';

export function useCreateDocument(options?: { onSuccess?: (data: Document) => void; onError?: (error: string) => void }) {
  return useMutation<Document, CreateDocumentInput>('/documents/upload', 'post', options);
}

export function useUpdateDocument(id: string, options?: { onSuccess?: (data: Document) => void; onError?: (error: string) => void }) {
  return useMutation<Document, UpdateDocumentInput>(`/documents/${id}`, 'put', options);
}

export function useDeleteDocument(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/documents/${id}`, 'delete', options);
}

export function useCreateDocumentVersion(id: string, options?: { onSuccess?: (data: unknown) => void; onError?: (error: string) => void }) {
  return useMutation<unknown, { fileName: string; fileSize: number; changes?: string }>(`/documents/${id}/versions`, 'post', options);
}
