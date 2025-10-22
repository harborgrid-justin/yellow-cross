/**
 * Litigation Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Litigation, CreateLitigationInput, UpdateLitigationInput } from './types';

export function useCreateLitigation(options?: { onSuccess?: (data: Litigation) => void; onError?: (error: string) => void }) {
  return useMutation<Litigation, CreateLitigationInput>('/litigation-management/create', 'post', options);
}

export function useUpdateLitigation(id: string, options?: { onSuccess?: (data: Litigation) => void; onError?: (error: string) => void }) {
  return useMutation<Litigation, UpdateLitigationInput>(`/litigation/${id}`, 'put', options);
}

export function useDeleteLitigation(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/litigation/${id}`, 'delete', options);
}
