/**
 * Research Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Research, CreateResearchInput, UpdateResearchInput } from './types';

export function useCreateResearch(options?: { onSuccess?: (data: Research) => void; onError?: (error: string) => void }) {
  return useMutation<Research, CreateResearchInput>('/legal-research/create', 'post', options);
}

export function useUpdateResearch(id: string, options?: { onSuccess?: (data: Research) => void; onError?: (error: string) => void }) {
  return useMutation<Research, UpdateResearchInput>(`/research/${id}`, 'put', options);
}

export function useDeleteResearch(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/research/${id}`, 'delete', options);
}
