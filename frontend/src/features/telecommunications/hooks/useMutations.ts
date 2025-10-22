/**
 * Telecommunications Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Telecommunications, CreateTelecommunicationsInput, UpdateTelecommunicationsInput } from './types';

export function useCreateTelecommunications(options?: { onSuccess?: (data: Telecommunications) => void; onError?: (error: string) => void }) {
  return useMutation<Telecommunications, CreateTelecommunicationsInput>('/telecom/create', 'post', options);
}

export function useUpdateTelecommunications(id: string, options?: { onSuccess?: (data: Telecommunications) => void; onError?: (error: string) => void }) {
  return useMutation<Telecommunications, UpdateTelecommunicationsInput>(`/telecom/${id}`, 'put', options);
}

export function useDeleteTelecommunications(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/telecom/${id}`, 'delete', options);
}
