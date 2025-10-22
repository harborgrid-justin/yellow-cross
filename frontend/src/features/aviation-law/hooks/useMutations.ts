/**
 * Aviation Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Aviation, CreateAviationInput, UpdateAviationInput } from './types';

export function useCreateAviation(options?: { onSuccess?: (data: Aviation) => void; onError?: (error: string) => void }) {
  return useMutation<Aviation, CreateAviationInput>('/aviation-law/create', 'post', options);
}

export function useUpdateAviation(id: string, options?: { onSuccess?: (data: Aviation) => void; onError?: (error: string) => void }) {
  return useMutation<Aviation, UpdateAviationInput>(`/aviation-law/${id}`, 'put', options);
}

export function useDeleteAviation(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/aviation-law/${id}`, 'delete', options);
}
