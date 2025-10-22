/**
 * ProBono Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { ProBono, CreateProBonoInput, UpdateProBonoInput } from './types';

export function useCreateProBono(options?: { onSuccess?: (data: ProBono) => void; onError?: (error: string) => void }) {
  return useMutation<ProBono, CreateProBonoInput>('/probono/create', 'post', options);
}

export function useUpdateProBono(id: string, options?: { onSuccess?: (data: ProBono) => void; onError?: (error: string) => void }) {
  return useMutation<ProBono, UpdateProBonoInput>(`/probono/${id}`, 'put', options);
}

export function useDeleteProBono(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/probono/${id}`, 'delete', options);
}
