/**
 * Evidence Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Evidence, CreateEvidenceInput, UpdateEvidenceInput } from './types';

export function useCreateEvidence(options?: { onSuccess?: (data: Evidence) => void; onError?: (error: string) => void }) {
  return useMutation<Evidence, CreateEvidenceInput>('/ediscovery/create', 'post', options);
}

export function useUpdateEvidence(id: string, options?: { onSuccess?: (data: Evidence) => void; onError?: (error: string) => void }) {
  return useMutation<Evidence, UpdateEvidenceInput>(`/ediscovery/${id}`, 'put', options);
}

export function useDeleteEvidence(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/ediscovery/${id}`, 'delete', options);
}
