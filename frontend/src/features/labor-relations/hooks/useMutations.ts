/**
 * Labor Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Labor, CreateLaborInput, UpdateLaborInput } from './types';

export function useCreateLabor(options?: { onSuccess?: (data: Labor) => void; onError?: (error: string) => void }) {
  return useMutation<Labor, CreateLaborInput>('/labor-relations/create', 'post', options);
}

export function useUpdateLabor(id: string, options?: { onSuccess?: (data: Labor) => void; onError?: (error: string) => void }) {
  return useMutation<Labor, UpdateLaborInput>(`/labor-relations/${id}`, 'put', options);
}

export function useDeleteLabor(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/labor-relations/${id}`, 'delete', options);
}
