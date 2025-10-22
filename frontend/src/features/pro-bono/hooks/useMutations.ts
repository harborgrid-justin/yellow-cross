/**
 * ProBono Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { ProBono, CreateProBonoInput, UpdateProBonoInput } from './types';

export function useCreateProBono(options?: { onSuccess?: (data: ProBono) => void; onError?: (error: string) => void }) {
  return useMutation<ProBono, CreateProBonoInput>('/pro-bono/create', 'post', options);
}

export function useUpdateProBono(id: string, options?: { onSuccess?: (data: ProBono) => void; onError?: (error: string) => void }) {
  return useMutation<ProBono, UpdateProBonoInput>(`/pro-bono/${id}`, 'put', options);
}

export function useDeleteProBono(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/pro-bono/${id}`, 'delete', options);
}
