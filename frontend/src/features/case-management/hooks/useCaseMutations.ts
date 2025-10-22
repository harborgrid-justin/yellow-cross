/**
 * Case Management Mutation Hooks
 * Hooks for creating, updating, and deleting cases
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Case, CreateCaseInput, UpdateCaseInput, CreateNoteInput, CaseNote } from './types';

/**
 * Create a new case
 */
export function useCreateCase(options?: {
  onSuccess?: (data: Case) => void;
  onError?: (error: string) => void;
}) {
  return useMutation<Case, CreateCaseInput>('/cases/create', 'post', options);
}

/**
 * Update an existing case
 */
export function useUpdateCase(
  id: string,
  options?: {
    onSuccess?: (data: Case) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<Case, UpdateCaseInput>(`/cases/${id}`, 'put', options);
}

/**
 * Update case status
 */
export function useUpdateCaseStatus(
  id: string,
  options?: {
    onSuccess?: (data: Case) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<Case, { status: string; reason?: string }>(`/cases/${id}/status`, 'patch', options);
}

/**
 * Assign case to attorney
 */
export function useAssignCase(
  id: string,
  options?: {
    onSuccess?: (data: Case) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<Case, { assignedTo: string; assignedBy: string }>(`/cases/${id}/assign`, 'post', options);
}

/**
 * Add tags to a case
 */
export function useTagCase(
  id: string,
  options?: {
    onSuccess?: (data: Case) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<Case, { tags: string[] }>(`/cases/${id}/tags`, 'post', options);
}

/**
 * Close a case
 */
export function useCloseCase(
  id: string,
  options?: {
    onSuccess?: (data: Case) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<Case, { reason?: string; closedBy: string }>(`/cases/${id}/close`, 'post', options);
}

/**
 * Delete a case
 */
export function useDeleteCase(
  id: string,
  options?: {
    onSuccess?: (data: { success: boolean }) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<{ success: boolean }, void>(`/cases/${id}`, 'delete', options);
}

/**
 * Create a case note
 */
export function useCreateCaseNote(options?: {
  onSuccess?: (data: CaseNote) => void;
  onError?: (error: string) => void;
}) {
  return useMutation<CaseNote, CreateNoteInput>('/cases/notes', 'post', options);
}
