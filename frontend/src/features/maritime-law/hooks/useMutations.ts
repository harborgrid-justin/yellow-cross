/**
 * Maritime Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Maritime, CreateMaritimeInput, UpdateMaritimeInput } from './types';

export function useCreateMaritime(options?: { onSuccess?: (data: Maritime) => void; onError?: (error: string) => void }) {
  return useMutation<Maritime, CreateMaritimeInput>('/maritime/create', 'post', options);
}

export function useUpdateMaritime(id: string, options?: { onSuccess?: (data: Maritime) => void; onError?: (error: string) => void }) {
  return useMutation<Maritime, UpdateMaritimeInput>(`/maritime/${id}`, 'put', options);
}

export function useDeleteMaritime(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/maritime/${id}`, 'delete', options);
}
