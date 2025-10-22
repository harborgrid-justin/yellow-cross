/**
 * Municipal Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Municipal, CreateMunicipalInput, UpdateMunicipalInput } from './types';

export function useCreateMunicipal(options?: { onSuccess?: (data: Municipal) => void; onError?: (error: string) => void }) {
  return useMutation<Municipal, CreateMunicipalInput>('/municipal-law/create', 'post', options);
}

export function useUpdateMunicipal(id: string, options?: { onSuccess?: (data: Municipal) => void; onError?: (error: string) => void }) {
  return useMutation<Municipal, UpdateMunicipalInput>(`/municipal/${id}`, 'put', options);
}

export function useDeleteMunicipal(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/municipal/${id}`, 'delete', options);
}
