/**
 * Aviation Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Aviation, CreateAviationInput, UpdateAviationInput } from './types';

export function useCreateAviation(options?: { onSuccess?: (data: Aviation) => void; onError?: (error: string) => void }) {
  return useMutation<Aviation, CreateAviationInput>('/aviation/create', 'post', options);
}

export function useUpdateAviation(id: string, options?: { onSuccess?: (data: Aviation) => void; onError?: (error: string) => void }) {
  return useMutation<Aviation, UpdateAviationInput>(`/aviation/${id}`, 'put', options);
}

export function useDeleteAviation(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/aviation/${id}`, 'delete', options);
}
