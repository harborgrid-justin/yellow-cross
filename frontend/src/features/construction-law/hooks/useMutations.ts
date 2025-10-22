/**
 * Construction Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Construction, CreateConstructionInput, UpdateConstructionInput } from './types';

export function useCreateConstruction(options?: { onSuccess?: (data: Construction) => void; onError?: (error: string) => void }) {
  return useMutation<Construction, CreateConstructionInput>('/construction-law/create', 'post', options);
}

export function useUpdateConstruction(id: string, options?: { onSuccess?: (data: Construction) => void; onError?: (error: string) => void }) {
  return useMutation<Construction, UpdateConstructionInput>(`/construction-law/${id}`, 'put', options);
}

export function useDeleteConstruction(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/construction-law/${id}`, 'delete', options);
}
