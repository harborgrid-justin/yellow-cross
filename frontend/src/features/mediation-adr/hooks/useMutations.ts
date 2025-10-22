/**
 * Mediation Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Mediation, CreateMediationInput, UpdateMediationInput } from './types';

export function useCreateMediation(options?: { onSuccess?: (data: Mediation) => void; onError?: (error: string) => void }) {
  return useMutation<Mediation, CreateMediationInput>('/mediation/create', 'post', options);
}

export function useUpdateMediation(id: string, options?: { onSuccess?: (data: Mediation) => void; onError?: (error: string) => void }) {
  return useMutation<Mediation, UpdateMediationInput>(`/mediation/${id}`, 'put', options);
}

export function useDeleteMediation(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/mediation/${id}`, 'delete', options);
}
