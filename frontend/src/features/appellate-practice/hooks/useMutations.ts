/**
 * Appellate Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Appellate, CreateAppellateInput, UpdateAppellateInput } from './types';

export function useCreateAppellate(options?: { onSuccess?: (data: Appellate) => void; onError?: (error: string) => void }) {
  return useMutation<Appellate, CreateAppellateInput>('/appellate-practice/create', 'post', options);
}

export function useUpdateAppellate(id: string, options?: { onSuccess?: (data: Appellate) => void; onError?: (error: string) => void }) {
  return useMutation<Appellate, UpdateAppellateInput>(`/appellate-practice/${id}`, 'put', options);
}

export function useDeleteAppellate(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/appellate-practice/${id}`, 'delete', options);
}
