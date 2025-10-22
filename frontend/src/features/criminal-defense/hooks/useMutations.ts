/**
 * Criminal Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Criminal, CreateCriminalInput, UpdateCriminalInput } from './types';

export function useCreateCriminal(options?: { onSuccess?: (data: Criminal) => void; onError?: (error: string) => void }) {
  return useMutation<Criminal, CreateCriminalInput>('/criminal/create', 'post', options);
}

export function useUpdateCriminal(id: string, options?: { onSuccess?: (data: Criminal) => void; onError?: (error: string) => void }) {
  return useMutation<Criminal, UpdateCriminalInput>(`/criminal/${id}`, 'put', options);
}

export function useDeleteCriminal(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/criminal/${id}`, 'delete', options);
}
