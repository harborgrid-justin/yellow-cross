/**
 * Docket Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Docket, CreateDocketInput, UpdateDocketInput } from './types';

export function useCreateDocket(options?: { onSuccess?: (data: Docket) => void; onError?: (error: string) => void }) {
  return useMutation<Docket, CreateDocketInput>('/court-docket/create', 'post', options);
}

export function useUpdateDocket(id: string, options?: { onSuccess?: (data: Docket) => void; onError?: (error: string) => void }) {
  return useMutation<Docket, UpdateDocketInput>(`/court/${id}`, 'put', options);
}

export function useDeleteDocket(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/court/${id}`, 'delete', options);
}
