/**
 * Sports Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Sports, CreateSportsInput, UpdateSportsInput } from './types';

export function useCreateSports(options?: { onSuccess?: (data: Sports) => void; onError?: (error: string) => void }) {
  return useMutation<Sports, CreateSportsInput>('/sports-entertainment/create', 'post', options);
}

export function useUpdateSports(id: string, options?: { onSuccess?: (data: Sports) => void; onError?: (error: string) => void }) {
  return useMutation<Sports, UpdateSportsInput>(`/sports-entertainment/${id}`, 'put', options);
}

export function useDeleteSports(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/sports-entertainment/${id}`, 'delete', options);
}
